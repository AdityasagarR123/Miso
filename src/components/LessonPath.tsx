import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Lesson } from '@/course/types';
import { colors, radius, spacing } from '@/theme';

// Sideways offsets that make the lessons wind like a path.
const OFFSETS = [0, 56, 0, -56];

type LessonPathProps = {
  lessons: Lesson[];
  onSelect: (lesson: Lesson) => void;
};

export function LessonPath({ lessons, onSelect }: LessonPathProps) {
  return (
    <View style={styles.path}>
      {lessons.map((lesson, index) => (
        <Pressable
          key={lesson.id}
          accessibilityRole="button"
          accessibilityLabel={`Lesson ${index + 1}: ${lesson.title}`}
          onPress={() => onSelect(lesson)}
          style={({ pressed }) => [
            styles.stop,
            { transform: [{ translateX: OFFSETS[index % OFFSETS.length] }] },
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.circle}>
            <Text style={styles.number}>{index + 1}</Text>
          </View>
          <Text style={styles.title}>{lesson.title}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  path: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  stop: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.8,
  },
  circle: {
    alignItems: 'center',
    backgroundColor: colors.rustDark,
    borderRadius: radius.pill,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  number: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  title: {
    color: colors.brown,
    fontSize: 16,
    fontWeight: '700',
  },
});
