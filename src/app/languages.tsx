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

import { KeyedVideo } from '@/components/KeyedVideo';
import { InstallButton } from '@/components/landing/InstallButton';
import { themeForCourse } from '@/components/map/mapThemes';
import { PageDoodles } from '@/components/map/PageDoodles';
import { LanguageLinks, SiteFooterLinks, usePageMeta } from '@/components/site/SitePage';
import { LANGUAGES_META } from '@/site/content';
import { COURSES } from '@/course/courses';
import { LEVEL_PLAN } from '@/course/levels';
import type { Course } from '@/course/types';
import { courseProgress, levelStatus } from '@/progress/progress';
import { lessonsOf } from '@/course/levels';
import { useProgress } from '@/progress/ProgressContext';
import { colors, radius, spacing } from '@/theme';

const LOGO_HEAD = require('../../assets/brand/biso-head.png');
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
  featured,
  levelsDone,
  onPlay,
}: {
  course: Course;
  isWide: boolean;
  featured: boolean;
  levelsDone: number;
  onPlay: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const theme = themeForCourse(course.id);
  const status =
    levelsDone > 0
      ? `${levelsDone} of ${LEVEL_PLAN.length} levels done`
      : `${course.units.length} levels ready`;

  const cardStyle = [
    styles.card,
    LIFT,
    isWide
      ? featured
        ? styles.cardFeatured
        : styles.cardRegular
      : styles.cardFull,
    { transform: [{ translateY: hovered ? -5 : 0 }] },
  ];
  const shared = {
    accessibilityRole: 'button' as const,
    accessibilityLabel: `${course.title}, ${status}, play`,
    onHoverIn: () => setHovered(true),
    onHoverOut: () => setHovered(false),
    onPress: onPlay,
  };

  if (featured) {
    return (
      <Pressable {...shared} style={[cardStyle, styles.cardReady]}>
        <View style={[styles.readyEdge, { backgroundColor: theme.accent }]} />
        <View style={styles.text}>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.status}>{status}</Text>
          <View style={[styles.play, { backgroundColor: theme.accent }]}>
            <Text style={styles.playText}>
              {levelsDone > 0 ? 'Continue' : 'Play'}
            </Text>
          </View>
        </View>
        <View style={styles.side}>
          <Text style={styles.greeting}>{course.greeting}</Text>
          <View pointerEvents="none" style={styles.mascot}>
            <KeyedVideo label="Biso the red panda studying at a desk" />
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      {...shared}
      style={[cardStyle, styles.cardOther, { backgroundColor: theme.background }]}
    >
      <View style={styles.otherBody}>
        <View style={styles.otherTop}>
          <Text style={styles.titleOther}>{course.title}</Text>
          <Text style={[styles.greetingOther, { color: theme.accent }]}>
            {course.greeting}
          </Text>
        </View>
        <Text style={styles.statusOther}>{status}</Text>
        <CardArt course={course} />
      </View>
    </Pressable>
  );
}

export default function LanguagesScreen() {
  usePageMeta(LANGUAGES_META);
  const router = useRouter();
  const { course: chosen, progress, selectCourse } = useProgress();
  const { width } = useWindowDimensions();
  const isWide = width >= 800;
  const featuredId = chosen?.id ?? COURSES[0].id;

  const levelsDone = (course: Course) => {
    const { completedLessons } = courseProgress(progress, course.id);
    const lessons = lessonsOf(course);
    return course.units.filter(
      (unit) => levelStatus(unit.lessons, lessons, completedLessons) === 'done',
    ).length;
  };

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.pageContent}
    >
      <PageDoodles contentWidth={CONTENT_WIDTH} world />

      <View style={styles.topLine} />
      <View style={styles.tabs}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go to the Biso home page"
          onPress={() => router.push('/')}
          style={[styles.tab, styles.tabLeft]}
        >
          <Image source={LOGO_HEAD} resizeMode="contain" style={styles.logo} />
          <Text style={styles.brand}>Biso</Text>
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
              featured={course.id === featuredId}
              levelsDone={levelsDone(course)}
              onPlay={() => {
                selectCourse(course.id);
                router.replace('/learn');
              }}
            />
          ))}
        </View>

        <View style={styles.moreAbout}>
          <Text accessibilityRole="header" aria-level={2} style={styles.moreAboutTitle}>
            Read about each course
          </Text>
          <LanguageLinks />
          <SiteFooterLinks />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  moreAbout: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  moreAboutTitle: {
    color: colors.brown,
    fontSize: 22,
    fontWeight: '800',
  },
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
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
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
    minHeight: 190,
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
    boxShadow: '0 8px 22px rgba(59, 35, 24, 0.22)',
    paddingLeft: spacing.lg,
  } as ViewStyle,
  cardOther: {
    borderBottomColor: colors.brown,
    borderBottomWidth: 4,
    borderColor: colors.brown,
    borderWidth: 2,
  },
  readyEdge: {
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
  status: {
    color: colors.brown,
    fontSize: 16,
  },
  play: {
    alignSelf: 'flex-start',
    borderRadius: radius.md,
    justifyContent: 'center',
    marginTop: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
  },
  playText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  side: {
    alignItems: 'flex-end',
    flex: 1,
    gap: spacing.xs,
    marginLeft: spacing.sm,
  },
  greeting: {
    color: colors.brown,
    fontSize: 24,
    fontWeight: '800',
  },
  mascot: {
    bottom: -14,
    height: 150,
    position: 'absolute',
    right: -10,
    width: 240,
  },
  otherBody: {
    flex: 1,
    gap: spacing.xs,
  },
  otherTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  titleOther: {
    color: colors.brown,
    flexShrink: 0,
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 26,
  },
  statusOther: {
    color: colors.brown,
    fontSize: 14,
  },
  greetingOther: {
    flexShrink: 0,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 26,
  },
  art: {
    bottom: -6,
    height: 72,
    position: 'absolute',
    right: -6,
    width: 108,
  },
});
