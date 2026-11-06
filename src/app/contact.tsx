import { Link, type Href } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Body, Bullets, Heading, SitePage } from '@/components/site/SitePage';
import { CONTACT_META, SITE } from '@/site/content';
import { colors } from '@/theme';

export default function ContactScreen() {
  return (
    <SitePage meta={CONTACT_META}>
      <Heading level={1}>Contact Biso</Heading>
      <Body>Email us and we will get back to you as soon as we can.</Body>
      <Link href={`mailto:${SITE.contactEmail}` as Href} style={styles.email}>
        {SITE.contactEmail}
      </Link>

      <Heading>What to write to us about</Heading>
      <Bullets
        items={[
          'A mistake in a lesson. Please tell us the language and the lesson.',
          'Trouble signing in or using your account.',
          'A privacy request, such as a question about your data.',
          'Ideas for making Biso better.',
        ]}
      />

      <Heading>Want to delete your account?</Heading>
      <Body>
        You can do it yourself at any time. Sign in, then open the Account page from your
        levels page.
      </Body>
    </SitePage>
  );
}

const styles = StyleSheet.create({
  email: {
    color: colors.tealDark,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 44,
    minHeight: 44,
    textDecorationLine: 'underline',
  },
});
