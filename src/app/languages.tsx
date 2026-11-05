import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { COURSES } from '@/course/courses';
import { LEVEL_PLAN } from '@/course/levels';
import { useProgress } from '@/progress/ProgressContext';
import { colors, radius, spacing } from '@/theme';

export default function LanguagesScreen() {
  const router = useRouter();
  const { course: chosen, selectCourse } = useProgress();

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: chosen !== null }} />
      <Text style={styles.title}>Choose a language</Text>
      <Text style={styles.body}>
        Your XP, hearts and streak stay with you when you switch.
      </Text>

      {COURSES.map((course) => {
        const ready = course.units.length;
        const available = ready > 0;
        const isChosen = chosen?.id === course.id;
        const status = available
          ? `${ready} of ${LEVEL_PLAN.length} levels ready`
          : 'Coming soon';

        return (
          <Pressable
            key={course.id}
            accessibilityRole="button"
            accessibilityLabel={`${course.title}, ${status}${isChosen ? ', current language' : ''}`}
            accessibilityState={{ disabled: !available, selected: isChosen }}
            disabled={!available}
            onPress={() => {
              selectCourse(course.id);
              router.replace('/');
            }}
            style={({ pressed }) => [
              styles.card,
              isChosen && styles.chosen,
              !available && styles.unavailable,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.text}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.body}>{status}</Text>
            </View>
            <Text style={styles.greeting}>{course.greeting}</Text>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.brown,
    fontSize: 32,
    fontWeight: '800',
  },
  body: {
    color: colors.brown,
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 2,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  chosen: {
    backgroundColor: colors.tealLight,
    borderColor: colors.tealDark,
  },
  unavailable: {
    backgroundColor: colors.cream,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    flexShrink: 1,
    gap: spacing.xs,
  },
  courseTitle: {
    color: colors.brown,
    fontSize: 20,
    fontWeight: '800',
  },
  greeting: {
    color: colors.brown,
    fontSize: 18,
    fontWeight: '700',
  },
});
