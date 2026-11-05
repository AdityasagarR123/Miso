import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageDoodles } from '@/components/map/PageDoodles';
import { colors, spacing } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  /** Adds hand-drawn art to the empty sides on wide screens. */
  decorated?: boolean;
};

export function Screen({ children, decorated = false }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {decorated ? <PageDoodles contentWidth={640} /> : null}
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    alignSelf: 'center',
    flexGrow: 1,
    gap: spacing.md,
    maxWidth: 640,
    padding: spacing.lg,
    width: '100%',
  },
});
