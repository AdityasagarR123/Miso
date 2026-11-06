import { Body, Bullets, Heading, SitePage } from '@/components/site/SitePage';
import { SITE, type LegalPage } from '@/site/content';

export function LegalScreen({ page }: { page: LegalPage }) {
  return (
    <SitePage meta={page}>
      <Heading level={1}>{page.name}</Heading>
      <Body>Last updated: {SITE.legalUpdated}</Body>
      <Body>{page.intro}</Body>
      {page.sections.map((section) => (
        <SectionBlock key={section.heading} section={section} />
      ))}
    </SitePage>
  );
}

function SectionBlock({ section }: { section: LegalPage['sections'][number] }) {
  return (
    <>
      <Heading>{section.heading}</Heading>
      {section.paragraphs?.map((paragraph) => <Body key={paragraph}>{paragraph}</Body>)}
      {section.bullets ? <Bullets items={section.bullets} /> : null}
    </>
  );
}
