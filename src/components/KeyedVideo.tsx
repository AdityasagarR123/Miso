import { createElement, useEffect, useRef } from 'react';
import { AccessibilityInfo, Image, Platform, StyleSheet, View } from 'react-native';

const VIDEO_SRC = '/video/viso-moves.mp4';
const LOGO_FULL = require('../../assets/brand/viso-full.png');

// Drawn at a modest size, because removing the green touches every pixel.
const CANVAS_WIDTH = 560;
const CANVAS_HEIGHT = 315;

function removeGreen(pixels: Uint8ClampedArray) {
  for (let i = 0; i < pixels.length; i += 4) {
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];
    const excess = green - Math.max(red, blue);

    if (excess > 70) {
      pixels[i + 3] = 0;
    } else if (excess > 28) {
      // Softens the edge, and removes the green glow from Viso's outline.
      pixels[i + 3] = (255 * (70 - excess)) / 42;
      pixels[i + 1] = Math.max(red, blue);
    }
  }
}

/**
 * Viso's looping animation with the green screen removed, so that Viso stands
 * directly on the page. Only redraws while it's on screen.
 */
export function KeyedVideo({ label }: { label: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !context) return;

    const video = document.createElement('video');
    video.src = VIDEO_SRC;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    let frame = 0;
    let visible = true;
    let stopped = false;

    const draw = () => {
      if (video.readyState < 2) return;
      context.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      // The generator's small mark sits in this corner, away from Viso.
      context.clearRect(
        CANVAS_WIDTH * 0.84,
        CANVAS_HEIGHT * 0.76,
        CANVAS_WIDTH * 0.16,
        CANVAS_HEIGHT * 0.24,
      );
      const image = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      removeGreen(image.data);
      context.putImageData(image, 0, 0);
    };

    const loop = () => {
      if (stopped) return;
      if (visible) draw();
      frame = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(canvas);

    video.addEventListener('loadeddata', draw, { once: true });
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (stopped || reduced) return;
      video.play().catch(() => {});
      frame = requestAnimationFrame(loop);
    });

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, []);

  if (Platform.OS !== 'web') {
    return <Image source={LOGO_FULL} resizeMode="contain" style={styles.fill} />;
  }

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={label} style={styles.fill}>
      {createElement('canvas', {
        ref: canvasRef,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        style: { height: '100%', objectFit: 'contain', width: '100%' },
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    height: '100%',
    width: '100%',
  },
});
