import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { Button } from '@/components/Button';
import { themeForCourse } from '@/components/map/mapThemes';
import { RoadMap, type RoadStop } from '@/components/map/RoadMap';
import { Screen } from '@/components/Screen';
import { courseById } from '@/course/courses';
import { LEVEL_PLAN } from '@/course/levels';
import { colors, spacing } from '@/theme';

const HEADER_HEIGHT = 64;

/** A preview of a language's map, before its lessons are ready. */
export default function WorldScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { height } = useWindowDimensions();
  const course = courseById(courseId ?? null);

  if (!course) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Language not found' }} />
        <Text style={styles.body}>We couldn't find that language.</Text>
        <Button label="All languages" onPress={() => router.replace('/languages')} />
      </Screen>
    );
  }

  const theme = themeForCourse(course.id);
  const stops: RoadStop[] = LEVEL_PLAN.map((level) => ({
    key: level.id,
    number: level.number,
    caption: level.title,
    tooltipTitle: `Level ${level.number}: ${level.title}`,
    tooltipStatus: 'Coming soon',
    status: 'locked',
  }));

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[styles.page, { minHeight: height - HEADER_HEIGHT }]}
    >
      <Stack.Screen
        options={{
          contentStyle: { backgroundColor: theme.background },
          headerStyle: { backgroundColor: theme.background },
          title: `${course.title} world`,
        }}
      />
      {/* Separate pieces, so a right-to-left greeting can't reorder the sentence. */}
      <View style={styles.noteRow}>
        <Text style={[styles.note, { color: theme.accent }]}>{course.greeting}</Text>
        <Text style={[styles.note, { color: theme.accent }]}>
          Lessons are coming soon. Here's the road you'll follow.
        </Text>
      </View>
      <RoadMap
        theme={theme}
        stops={stops}
        markerIndex={0}
        reservedHeight={HEADER_HEIGHT + 72}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: 12,
    paddingTop: spacing.sm,
  },
  noteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  note: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  body: {
    color: colors.brown,
    fontSize: 16,
    lineHeight: 24,
  },
});
