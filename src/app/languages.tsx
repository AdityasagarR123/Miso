import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import Svg from 'react-native-svg';

import { InstallButton } from '@/components/landing/InstallButton';
import { themeForCourse } from '@/components/map/mapThemes';
import { PageDoodles } from '@/components/map/PageDoodles';
import { COURSES } from '@/course/courses';
import { LEVEL_PLAN } from '@/course/levels';
import type { Course } from '@/course/types';
import { useProgress } from '@/progress/ProgressContext';
import { colors, radius, spacing } from '@/theme';

const LOGO_HEAD = require('../../assets/brand/viso-head.png');
const LOGO_FULL = require('../../assets/brand/viso-full.png');
const CONTENT_WIDTH = 1040;

// A CSS transition makes hovering smooth on the web and does nothing on phones.
const LIFT = {
  transitionDuration: '160ms',
  transitionProperty: 'transform',
} as ViewStyle;

function CardArt({ course }: { course: Course }) {
  const [First, Second] = themeForCourse(course.id).cardArt;

  return (
    <View pointerEvents="none" style={styles.art}>
      <Svg width="100%" height="100%" viewBox="0 0 150 100">
        <First x={42} y={62} scale={0.55} />
        <Second x={108} y={52} scale={0.72} />
      </Svg>
    </View>
  );
}

function LanguageCard({
  course,
  isWide,
  chosen,
  onPlay,
  onPreview,
}: {
  course: Course;
  isWide: boolean;
  chosen: boolean;
  onPlay: () => void;
  onPreview: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const ready = course.units.length;
  const available = ready > 0;
  const status = available
    ? `${ready} of ${LEVEL_PLAN.length} levels ready`
    : 'Coming soon';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        available
          ? `${course.title}, ${status}${chosen ? ', current language' : ''}, play`
          : `${course.title}, ${status}, preview its map`
      }
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={available ? onPlay : onPreview}
      style={[
        styles.card,
        LIFT,
        available ? styles.cardReady : styles.cardSoon,
        isWide
          ? available
            ? styles.cardFeatured
            : styles.cardRegular
          : styles.cardFull,
        { transform: [{ translateY: hovered ? -5 : 0 }] },
      ]}
    >
      {available ? (
        <>
          <View style={styles.readyEdge} />
          <View style={styles.text}>
            <Text style={styles.title}>{course.title}</Text>
            <Text style={styles.status}>{status}</Text>
            <View style={styles.play}>
              <Text style={styles.playText}>{chosen ? 'Continue' : 'Play'}</Text>
            </View>
          </View>
          <View style={styles.side}>
            <Text style={styles.greeting}>{course.greeting}</Text>
            <Image
              accessibilityLabel="Viso the red panda, waving"
              source={LOGO_FULL}
              resizeMode="contain"
              style={styles.mascot}
            />
          </View>
        </>
      ) : (
        <View style={styles.soonBody}>
          <View style={styles.soonTop}>
            <Text style={styles.titleSoon}>{course.title}</Text>
            <Text style={styles.greetingSoon}>{course.greeting}</Text>
          </View>
          <Text style={styles.statusSoon}>{status}</Text>
          <CardArt course={course} />
        </View>
      )}
    </Pressable>
  );
}

export default function LanguagesScreen() {
  const router = useRouter();
  const { course: chosen, selectCourse } = useProgress();
  const { width } = useWindowDimensions();
  const isWide = width >= 800;

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.pageContent}
    >
      <PageDoodles contentWidth={CONTENT_WIDTH} />

      <View style={styles.topLine} />
      <View style={styles.tabs}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={chosen ? 'Back to your lessons' : 'Go to the Viso home page'}
          onPress={() => router.replace(chosen ? '/learn' : '/')}
          style={[styles.tab, styles.tabLeft]}
        >
          <Image source={LOGO_HEAD} resizeMode="contain" style={styles.logo} />
          <Text style={styles.brand}>Viso</Text>
        </Pressable>
        <View style={[styles.tab, styles.tabRight]}>
          <InstallButton />
        </View>
      </View>

      <View style={styles.content}>
        <Text
          accessibilityRole="header"
          style={[styles.heading, !isWide && styles.headingSmall]}
        >
          Choose a language
        </Text>
        <Text style={styles.subheading}>
          Your XP, hearts and streak stay with you when you switch.
        </Text>

        <View style={styles.grid}>
          {COURSES.map((course) => (
            <LanguageCard
              key={course.id}
              course={course}
              isWide={isWide}
              chosen={chosen?.id === course.id}
              onPlay={() => {
                selectCourse(course.id);
                router.replace('/learn');
              }}
              onPreview={() =>
                router.push({
                  pathname: '/world/[courseId]',
                  params: { courseId: course.id },
                })
              }
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.cream,
    flex: 1,
  },
  pageContent: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
  topLine: {
    backgroundColor: colors.ink,
    height: 12,
    width: '100%',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 10,
  },
  tab: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 58,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  tabLeft: {
    borderBottomRightRadius: radius.lg,
  },
  tabRight: {
    borderBottomLeftRadius: radius.lg,
  },
  logo: {
    height: 40,
    width: 40,
  },
  brand: {
    color: colors.sand,
    fontSize: 22,
    fontWeight: '800',
  },
  content: {
    alignItems: 'center',
    gap: spacing.sm,
    maxWidth: CONTENT_WIDTH,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    width: '100%',
  },
  heading: {
    color: colors.brown,
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: -1,
    textAlign: 'center',
  },
  headingSmall: {
    fontSize: 36,
  },
  subheading: {
    color: colors.brown,
    fontSize: 18,
    lineHeight: 26,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    width: '100%',
  },
  card: {
    borderRadius: radius.md,
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
    minHeight: 128,
    overflow: 'hidden',
    padding: spacing.md,
  },
  cardFeatured: {
    flexBasis: '47%',
    minHeight: 176,
  },
  cardRegular: {
    flexBasis: '22%',
    minWidth: 220,
  },
  cardFull: {
    flexBasis: '100%',
  },
  cardReady: {
    backgroundColor: colors.white,
    paddingLeft: spacing.lg,
    // A soft shadow lifts the playable card above the others.
    boxShadow: '0 8px 22px rgba(59, 35, 24, 0.22)',
  } as ViewStyle,
  cardSoon: {
    backgroundColor: '#F3EADB',
    borderColor: '#CDBFA9',
    borderWidth: 2,
  },
  readyEdge: {
    backgroundColor: colors.rustDark,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 10,
  },
  text: {
    flexShrink: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.brown,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 34,
  },
  soonBody: {
    flex: 1,
    gap: spacing.xs,
  },
  soonTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  titleSoon: {
    color: colors.brown,
    flexShrink: 0,
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 26,
  },
  status: {
    color: colors.brown,
    fontSize: 16,
  },
  statusSoon: {
    color: colors.brown,
    fontSize: 14,
  },
  play: {
    alignSelf: 'flex-start',
    backgroundColor: colors.rustDark,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  playText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  side: {
    alignItems: 'flex-end',
    flexShrink: 0,
    gap: spacing.xs,
    marginLeft: spacing.sm,
  },
  greeting: {
    color: colors.brown,
    fontSize: 24,
    fontWeight: '800',
  },
  greetingSoon: {
    color: colors.brown,
    flexShrink: 0,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 26,
  },
  mascot: {
    height: 120,
    marginBottom: -28,
    width: 128,
  },
  art: {
    bottom: -6,
    height: 72,
    position: 'absolute',
    right: -6,
    width: 108,
  },
});
