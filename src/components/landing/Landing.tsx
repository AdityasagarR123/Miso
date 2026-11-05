import { useRouter } from 'expo-router';
import {
  useEffect,
  useRef,
  useState,
  type ComponentRef,
  type ReactNode,
} from 'react';
import {
  AccessibilityInfo,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  type TextStyle,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { GameCard, type CardPose } from './GameCard';
import {
  HeartIcon,
  PracticeIcon,
  StreakIcon,
  XpIcon,
} from '@/components/GameIcons';
import { COURSES } from '@/course/courses';
import { LEVEL_PLAN } from '@/course/levels';
import { useProgress } from '@/progress/ProgressContext';
import { colors, radius, spacing } from '@/theme';

import { HeroArt } from './HeroArt';
import { InstallButton } from './InstallButton';
import { TrailMap } from './TrailMap';
import { TryIt } from './TryIt';

const LOGO_HEAD = require('../../../assets/brand/viso-head.png');
const LOGO_FULL = require('../../../assets/brand/viso-full.png');

const ROTATE_MS = 2400;
const FADE_MS = 220;
// A CSS fade keeps the greeting visible even if animation frames are paused.
const WEB_FADE = {
  transitionDuration: `${FADE_MS}ms`,
  transitionProperty: 'opacity',
} as TextStyle;
const NAV_OFFSET = 96;

const GAME_FEATURES = [
  {
    Icon: HeartIcon,
    title: 'Hearts',
    text: 'Mistakes cost a heart. Practice earns them back, always for free.',
    color: '#FBE0D3',
    tilt: '-1.5deg',
    pose: 'hug' as CardPose,
    hoverLine: 'Viso is keeping this one safe for you.',
  },
  {
    Icon: XpIcon,
    title: 'XP',
    text: 'Every right answer and finished lesson moves you forward.',
    color: '#FCEBB6',
    tilt: '1.2deg',
    pose: 'peek-center' as CardPose,
    hoverLine: 'Viso is counting your points. Twice.',
  },
  {
    Icon: StreakIcon,
    title: 'Streaks',
    text: 'Show up each day and watch your streak grow.',
    color: '#FAD9B8',
    tilt: '-1deg',
    pose: 'peek-left' as CardPose,
    hoverLine: 'Careful, Viso says this is getting hot.',
  },
  {
    Icon: PracticeIcon,
    title: 'Practice',
    text: 'The words you get wrong come back until they stick.',
    color: '#D2F1EE',
    tilt: '1.5deg',
    pose: 'peek-right' as CardPose,
    hoverLine: 'Viso never forgets a tricky word.',
  },
];

const FREE_PROMISES = [
  'No subscriptions',
  'No premium tier',
  'No paywalled lessons',
  'No paying to keep learning after mistakes',
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduced,
    );
    return () => subscription.remove();
  }, []);

  return reduced;
}

function RotatingGreeting({ size }: { size: number }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (reduced) return;

    let swap: ReturnType<typeof setTimeout>;
    const timer = setInterval(() => {
      setShown(false);
      swap = setTimeout(() => {
        setIndex((current) => (current + 1) % COURSES.length);
        setShown(true);
      }, FADE_MS);
    }, ROTATE_MS);

    return () => {
      clearInterval(timer);
      clearTimeout(swap);
    };
  }, [reduced]);

  return (
    <View style={{ minHeight: size * 1.35, justifyContent: 'center' }}>
      <Text
        style={[
          styles.rotating,
          WEB_FADE,
          { fontSize: size, lineHeight: size * 1.25, opacity: shown ? 1 : 0 },
        ]}
      >
        {COURSES[index].greeting}
      </Text>
    </View>
  );
}

type PillProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'quiet';
  compact?: boolean;
};

function Pill({ label, onPress, variant = 'primary', compact }: PillProps) {
  const primary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        primary ? styles.pillPrimary : styles.pillQuiet,
        compact && styles.pillCompact,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          primary ? styles.pillPrimaryText : styles.pillQuietText,
          compact && styles.pillCompactText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Section({
  title,
  subtitle,
  children,
  onLayoutY,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onLayoutY?: (y: number) => void;
}) {
  return (
    <View
      onLayout={(event) => onLayoutY?.(event.nativeEvent.layout.y)}
      style={styles.section}
    >
      <Text accessibilityRole="header" style={styles.sectionTitle}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

export function Landing() {
  const router = useRouter();
  const { course } = useProgress();
  const { width, height } = useWindowDimensions();
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const sectionY = useRef<Record<string, number>>({});
  const creamY = useRef(0);

  const isWide = width >= 800;
  const showNavLinks = width >= 900;
  const headlineSize = isWide ? 68 : Math.max(38, width * 0.105);
  const headSize = headlineSize * 1.05;
  const headlineStyle = [
    styles.headlineText,
    { fontSize: headlineSize, lineHeight: headlineSize * 1.15 },
  ];
  const startLabel = course ? 'Continue learning' : 'Start learning for free';
  const start = () => router.push('/learn');
  const goTo = (section: string) =>
    scrollRef.current?.scrollTo({
      y: Math.max(
        creamY.current +
          (sectionY.current[section] ?? 0) -
          (section === 'map' ? 0 : NAV_OFFSET),
        0,
      ),
      animated: true,
    });
  const remember = (section: string) => (y: number) => {
    sectionY.current[section] = y;
  };

  return (
    <View style={styles.page}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll}>
        <View style={[styles.hero, { minHeight: Math.max(height, 640) }]}>
          <HeroArt width={width} />

          <View style={styles.heroContent}>
            <View style={styles.headline}>
              <Text accessibilityRole="header" style={headlineStyle}>
                Viso
              </Text>
              <Image
                source={LOGO_HEAD}
                resizeMode="contain"
                style={{ height: headSize, marginHorizontal: 6, width: headSize }}
              />
              <Text style={headlineStyle}>,{' '}</Text>
              <Text style={headlineStyle}>your free way to say</Text>
            </View>

            <RotatingGreeting size={headlineSize} />

            <Text style={styles.heroText}>
              Short, playful language lessons with a red panda who cheers you on.
            </Text>

            <View style={styles.heroButtons}>
              <Pill label={startLabel} onPress={start} />
            </View>

            <Pill
              label="Learn more ↓"
              variant="quiet"
              onPress={() => goTo('map')}
            />
          </View>
        </View>

        <Svg
          width="100%"
          height={70}
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          style={styles.wave}
        >
          <Path
            d="M0 0 H1440 V28 C1200 76 960 -14 720 28 C480 70 240 -10 0 34 Z"
            fill={colors.ink}
          />
        </Svg>

        <View
          onLayout={(event) => {
            creamY.current = event.nativeEvent.layout.y;
          }}
          style={styles.cream}
        >
          <View
            onLayout={(event) => remember('map')(event.nativeEvent.layout.y)}
            style={styles.mapWrap}
          >
            <TrailMap logo={LOGO_FULL} startLabel={startLabel} onStart={start} />
          </View>

          <Section
            title="Try it right now"
            subtitle="No sign-up. One tap and you've started."
            onLayoutY={remember('try')}
          >
            <TryIt />
          </Section>

          <Section
            title="It feels like a game"
            subtitle="Because learning sticks when you want to come back."
          >
            <View style={styles.grid}>
              {GAME_FEATURES.map((feature) => (
                <GameCard key={feature.title} {...feature} />
              ))}
            </View>
          </Section>

          <Section
            title="Five languages. One path."
            subtitle={`Every language follows the same ${LEVEL_PLAN.length} levels.`}
            onLayoutY={remember('languages')}
          >
            <View style={styles.grid}>
              {COURSES.map((item) => (
                <View key={item.id} style={styles.languageCard}>
                  <Text style={styles.cardGreeting}>{item.greeting}</Text>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardText}>
                    {item.units.length > 0
                      ? `${item.units.length} of ${LEVEL_PLAN.length} levels ready`
                      : 'Coming soon'}
                  </Text>
                </View>
              ))}
            </View>
          </Section>

          <Section title="Free means free">
            <View style={styles.promises}>
              {FREE_PROMISES.map((promise) => (
                <View key={promise} style={styles.promise}>
                  <Text style={styles.promiseMark}>✓</Text>
                  <Text style={styles.promiseText}>{promise}</Text>
                </View>
              ))}
            </View>
          </Section>
        </View>

        <View style={styles.final}>
          <Image
            source={LOGO_FULL}
            resizeMode="contain"
            accessibilityLabel="Viso the red panda, waving"
            style={styles.finalLogo}
          />
          <Text accessibilityRole="header" style={styles.finalTitle}>
            Your first lesson is a few minutes away.
          </Text>
          <Pill label={startLabel} onPress={start} />
          <Text style={styles.footer}>Viso. Free language learning.</Text>
        </View>
      </ScrollView>

      <View pointerEvents="box-none" style={styles.navWrap}>
        <View style={styles.nav}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to the top"
            onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
            style={styles.brand}
          >
            <Image
              accessibilityLabel="Viso logo"
              source={LOGO_HEAD}
              resizeMode="contain"
              style={styles.brandLogo}
            />
            <Text style={styles.brandName}>Viso</Text>
          </Pressable>

          {showNavLinks ? (
            <View style={styles.navLinks}>
              {[
                ['Map', 'map'],
                ['Try it', 'try'],
                ['Languages', 'languages'],
              ].map(([label, section]) => (
                <Pressable
                  key={section}
                  accessibilityRole="button"
                  onPress={() => goTo(section)}
                  style={styles.navLink}
                >
                  <Text style={styles.navLinkText}>{label}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          <View style={styles.navActions}>
            <InstallButton />
            {showNavLinks ? (
              <Pill label="Start" onPress={start} compact />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.ink,
    flex: 1,
  },
  navWrap: {
    alignItems: 'center',
    left: 0,
    paddingHorizontal: spacing.sm,
    position: 'absolute',
    right: 0,
    top: 12,
    zIndex: 10,
  },
  nav: {
    alignItems: 'center',
    backgroundColor: colors.inkRaised,
    borderColor: colors.inkBorder,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 1040,
    minHeight: 64,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    width: '100%',
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  brandLogo: {
    height: 42,
    width: 42,
  },
  brandName: {
    color: colors.sand,
    fontSize: 24,
    fontWeight: '800',
  },
  navLinks: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  navLink: {
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  navLinkText: {
    color: colors.sand,
    fontSize: 16,
    fontWeight: '600',
  },
  navActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  scroll: {
    alignItems: 'center',
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    paddingTop: 96,
    width: '100%',
  },
  heroContent: {
    alignItems: 'center',
    gap: spacing.md,
    maxWidth: 820,
    width: '100%',
  },
  headline: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  headlineText: {
    color: colors.sand,
    fontWeight: '800',
    letterSpacing: -1,
    textAlign: 'center',
  },
  rotating: {
    color: colors.rustBright,
    fontWeight: '800',
    letterSpacing: -1,
    textAlign: 'center',
  },
  heroText: {
    color: colors.sandMuted,
    fontSize: 20,
    lineHeight: 30,
    maxWidth: 560,
    textAlign: 'center',
  },
  heroButtons: {
    marginVertical: spacing.sm,
  },
  wave: {
    backgroundColor: colors.cream,
  },
  cream: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    width: '100%',
  },
  mapWrap: {
    alignItems: 'center',
    width: '100%',
  },
  pill: {
    alignItems: 'center',
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  pillPrimary: {
    backgroundColor: colors.rustBright,
    minWidth: 260,
  },
  pillQuiet: {
    backgroundColor: colors.inkRaised,
    minHeight: 44,
  },
  pillCompact: {
    minHeight: 44,
    minWidth: 0,
  },
  pillPrimaryText: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
  },
  pillQuietText: {
    color: colors.sand,
    fontSize: 15,
    fontWeight: '700',
  },
  pillCompactText: {
    fontSize: 15,
  },
  pressed: {
    opacity: 0.8,
  },
  section: {
    gap: spacing.md,
    maxWidth: 1040,
    paddingHorizontal: spacing.md,
    paddingVertical: 48,
    width: '100%',
  },
  sectionTitle: {
    color: colors.brown,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 46,
    textAlign: 'center',
  },
  sectionSubtitle: {
    color: colors.brown,
    fontSize: 18,
    lineHeight: 26,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
  },
  gameCard: {
    borderBottomWidth: 8,
    borderColor: colors.brown,
    borderRadius: radius.lg,
    borderWidth: 3,
    flexBasis: 220,
    flexGrow: 1,
    gap: spacing.sm,
    maxWidth: 480,
    padding: spacing.lg,
  },
  languageCard: {
    backgroundColor: colors.white,
    borderBottomWidth: 6,
    borderColor: colors.brown,
    borderRadius: radius.lg,
    borderWidth: 2,
    flexBasis: 170,
    flexGrow: 1,
    gap: spacing.xs,
    maxWidth: 320,
    padding: spacing.md,
  },
  cardGreeting: {
    color: colors.rustDark,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    color: colors.brown,
    fontSize: 22,
    fontWeight: '800',
  },
  cardText: {
    color: colors.brown,
    fontSize: 15,
    lineHeight: 22,
  },
  promises: {
    alignSelf: 'center',
    gap: spacing.md,
    maxWidth: 560,
    width: '100%',
  },
  promise: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  promiseMark: {
    color: colors.tealDark,
    fontSize: 26,
    fontWeight: '800',
  },
  promiseText: {
    color: colors.brown,
    flex: 1,
    fontSize: 21,
    fontWeight: '700',
  },
  final: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 64,
    width: '100%',
  },
  finalLogo: {
    height: 189,
    width: 200,
  },
  finalTitle: {
    color: colors.sand,
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 50,
    maxWidth: 760,
    textAlign: 'center',
  },
  footer: {
    color: colors.sandMuted,
    fontSize: 14,
    paddingTop: spacing.md,
  },
});
