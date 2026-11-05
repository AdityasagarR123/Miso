import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { spanishCourse } from '@/course/spanish';
import { colors, spacing } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Miso</Text>
        <Text style={styles.tagline}>
          Learn a language in a few minutes a day, completely free.
        </Text>
      </View>

      <Text style={styles.courseTitle}>{spanishCourse.title}</Text>

      {spanishCourse.units.map((unit) => (
        <View key={unit.id} style={styles.unit}>
          <Text style={styles.unitTitle}>{unit.title}</Text>
          {unit.lessons.map((lesson) => (
            <Card
              key={lesson.id}
              title={lesson.title}
              subtitle={`${lesson.exercises.length} exercises`}
              onPress={() =>
                router.push({
                  pathname: '/lesson/[lessonId]',
                  params: { lessonId: lesson.id },
                })
              }
            />
          ))}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.rustDark,
    fontSize: 40,
    fontWeight: '800',
  },
  tagline: {
    color: colors.brown,
    fontSize: 16,
    lineHeight: 24,
  },
  courseTitle: {
    color: colors.brown,
    fontSize: 24,
    fontWeight: '800',
  },
  unit: {
    gap: spacing.sm,
  },
  unitTitle: {
    color: colors.brown,
    fontSize: 16,
    fontWeight: '700',
  },
});
