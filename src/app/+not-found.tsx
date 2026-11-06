import { ActionLink, Body, Heading, SitePage } from '@/components/site/SitePage';

const META = {
  path: '/404',
  title: 'Page not found | Biso',
  description: "This page doesn't exist. Head back to Biso and keep learning.",
};

export default function NotFoundScreen() {
  return (
    <SitePage meta={META}>
      <Heading level={1}>Biso can't find that page</Heading>
      <Body>The address may be wrong, or the page may have moved.</Body>
      <ActionLink href="/" label="Back to the home page" />
    </SitePage>
  );
}
