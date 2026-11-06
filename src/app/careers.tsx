import { StyleSheet, View } from 'react-native';

import { ActionLink, Body, Bullets, Heading, SitePage } from '@/components/site/SitePage';
import {
  CAREER_ROLES,
  CAREERS_COMPENSATION,
  CAREERS_META,
  roleApplyLink,
} from '@/site/content';
import { colors, radius, spacing } from '@/theme';

export default function CareersScreen() {
  return (
    <SitePage meta={CAREERS_META}>
      <Heading level={1}>Careers at Biso</Heading>
      <Body>
        Biso is a free language-learning website with 10 languages and a red panda who cheers
        learners on. It's early, and there's a lot to build. Come help us make learning a
        language free and fun.
      </Body>

      <Heading>Open roles</Heading>
      {CAREER_ROLES.map((role) => (
        <View key={role.title} style={styles.card}>
          <Heading level={3}>{role.title}</Heading>
          <Body>{role.summary}</Body>
          <Heading level={3}>What you'll work on</Heading>
          <Bullets items={role.work} />
          <Heading level={3}>What we're looking for</Heading>
          <Bullets items={role.looking} />
          <Heading level={3}>Compensation</Heading>
          <Body>{CAREERS_COMPENSATION}</Body>
          <View style={styles.apply}>
            <ActionLink href={roleApplyLink(role)} label={`Apply for ${role.title}`} />
          </View>
        </View>
      ))}

      <Heading>How to apply</Heading>
      <Body>
        Use the button on a role to email us. Tell us a little about yourself and share your
        work, such as a portfolio or GitHub. We'll go over the details of the role, including
        location and time commitment, when we talk.
      </Body>
    </SitePage>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderBottomWidth: 6,
    borderColor: colors.brown,
    borderRadius: radius.lg,
    borderWidth: 2,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  apply: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
});
