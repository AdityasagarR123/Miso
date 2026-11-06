import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import {
  ActionLink,
  Body,
  Heading,
  LanguageLinks,
  SitePage,
} from '@/components/site/SitePage';
import { LEVEL_PLAN } from '@/course/levels';
import { PHRASEBOOK } from '@/course/phrasebook';
import { useProgress } from '@/progress/ProgressContext';
import { LANGUAGE_PAGES, languageFaq, languageMeta } from '@/site/content';
import { samplePhrases } from '@/site/pages';
import { colors, radius, spacing } from '@/theme';

import NotFoundScreen from '../+not-found';

export default function LanguageScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { selectCourse } = useProgress();
  const page = LANGUAGE_PAGES.find((item) => item.slug === slug);

  if (!page) return <NotFoundScreen />;

  return (
    <SitePage meta={languageMeta(page)}>
      <Heading level={1}>Learn {page.name} for free</Heading>
      <Body>{page.about}</Body>
      <View style={styles.action}>
        <ActionLink
          href="/learn"
          label={`Start learning ${page.name}`}
          onPress={() => selectCourse(page.courseId)}
        />
      </View>

      <Heading>Your first {page.name} words</Heading>
      <View style={styles.card}>
        {samplePhrases(PHRASEBOOK, page.key).map(({ english, target, say }) => (
          <View key={english} style={styles.phrase}>
            <Text style={styles.english}>{english}</Text>
            <View style={styles.translation}>
              <Text {...({ lang: page.key } as object)} style={styles.target}>{target}</Text>
              {say ? <Text style={styles.say}>{say}</Text> : null}
            </View>
          </View>
        ))}
      </View>

      <Heading>What you will learn</Heading>
      <Body>
        Ten levels and 40+ short lessons take you from your first hello to real conversations.
        Every level has word lessons, a grammar lesson and a writing lesson.
      </Body>
      <View style={styles.levels}>
        {LEVEL_PLAN.map((level) => (
          <View key={level.id} style={styles.level}>
            <Text style={styles.levelNumber}>{level.number}</Text>
            <Text style={styles.levelTitle}>{level.title}</Text>
          </View>
        ))}
      </View>
      <Body>{page.scriptNote}</Body>

      <Heading>Questions about learning {page.name}</Heading>
      {languageFaq(page).map(({ question, answer }) => (
        <View key={question} style={styles.faq}>
          <Heading level={3}>{question}</Heading>
          <Body>{answer}</Body>
        </View>
      ))}

      <Heading>Other languages on Biso</Heading>
      <LanguageLinks exclude={page.slug} />
    </SitePage>
  );
}

const styles = StyleSheet.create({
  action: {
    alignSelf: 'flex-start',
  },
  card: {
    backgroundColor: colors.white,
    borderBottomWidth: 6,
    borderColor: colors.brown,
    borderRadius: radius.lg,
    borderWidth: 2,
    padding: spacing.md,
  },
  phrase: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  english: {
    color: colors.brown,
    flexShrink: 1,
    fontSize: 16,
  },
  translation: {
    alignItems: 'flex-end',
    flexShrink: 1,
  },
  target: {
    color: colors.rustDark,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'right',
  },
  say: {
    color: colors.brown,
    fontSize: 14,
    textAlign: 'right',
  },
  levels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  level: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    flexBasis: '45%',
    flexDirection: 'row',
    flexGrow: 1,
    gap: spacing.sm,
    minWidth: 220,
    padding: spacing.sm,
  },
  levelNumber: {
    backgroundColor: colors.tealDark,
    borderRadius: radius.pill,
    color: colors.white,
    fontWeight: '800',
    height: 30,
    lineHeight: 30,
    textAlign: 'center',
    width: 30,
  },
  levelTitle: {
    color: colors.brown,
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  faq: {
    gap: spacing.xs,
  },
});
