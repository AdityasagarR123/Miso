import { ActionLink, Body, Bullets, Heading, LanguageLinks, SitePage } from '@/components/site/SitePage';
import { ABOUT_META } from '@/site/content';

export default function AboutScreen() {
  return (
    <SitePage meta={ABOUT_META}>
      <Heading level={1}>About Biso</Heading>
      <Body>
        Biso is a free, playful way to learn a language. You follow a road of short
        lessons, with a red panda cheering you on, and every lesson is free.
      </Body>

      <Heading>How it works</Heading>
      <Bullets
        items={[
          'Pick one of 10 languages. Each one has 10 levels, from basics to real conversations.',
          'Every level has word lessons, a grammar lesson and a writing lesson.',
          'Mistakes cost a heart, and free practice earns hearts back.',
          'XP and streaks help you keep coming back.',
        ]}
      />

      <Heading>Free means free</Heading>
      <Body>
        There is no subscription, no premium tier and no paywall on lessons. Biso also has
        no ads, and it never sells your data.
      </Body>

      <Heading>Still growing</Heading>
      <Body>
        Biso is new, and its courses are still being reviewed. If you spot a mistake in a
        lesson, please tell us, because it really helps. A phone app is coming soon.
      </Body>

      <Heading>Start learning</Heading>
      <LanguageLinks />
      <ActionLink href="/languages" label="Choose a language" />
    </SitePage>
  );
}
