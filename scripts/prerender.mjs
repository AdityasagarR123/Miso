// Runs after the website build. Gives each public page its own HTML file, with
// its own title, description, share tags and readable content, so that search
// engines and link previews can read it without running the app. The app then
// replaces that content as soon as it loads.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { LEVEL_PLAN } from '../src/course/levels.ts';
import { PHRASEBOOK } from '../src/course/phrasebook.ts';
import {
  ABOUT_META,
  CAREER_ROLES,
  CAREERS_COMPENSATION,
  CAREERS_META,
  CONTACT_META,
  HOME_META,
  LANGUAGE_PAGES,
  LANGUAGES_META,
  languageFaq,
  languageMeta,
  LEGAL_PAGES,
  SITE,
} from '../src/site/content.ts';
import {
  buildPublicPages,
  buildSitemap,
  renderNotFoundHtml,
  renderPageHtml,
} from '../src/site/pages.ts';

const OUTPUT = process.argv[2] ?? 'dist';
// app.html is the untouched copy made below, so this script can safely run twice.
const source = join(OUTPUT, existsSync(join(OUTPUT, 'app.html')) ? 'app.html' : 'index.html');
const template = readFileSync(source, 'utf8');

if (!/<div id="root">\s*<\/div>/.test(template)) {
  console.error('The built index.html has no empty root element to fill.');
  process.exit(1);
}

const pages = buildPublicPages({
  site: SITE,
  home: HOME_META,
  languagesIndex: LANGUAGES_META,
  about: ABOUT_META,
  contact: CONTACT_META,
  careers: CAREERS_META,
  roles: CAREER_ROLES,
  compensation: CAREERS_COMPENSATION,
  legal: Object.values(LEGAL_PAGES),
  languages: LANGUAGE_PAGES,
  languageMeta,
  languageFaq,
  phrases: PHRASEBOOK,
  levels: LEVEL_PLAN,
});

// App screens keep a plain copy of the HTML, because the home page is about to change.
writeFileSync(join(OUTPUT, 'app.html'), template);
writeFileSync(join(OUTPUT, '404.html'), renderNotFoundHtml(template));

for (const page of pages) {
  const file =
    page.path === '/'
      ? join(OUTPUT, 'index.html')
      : join(OUTPUT, page.path.slice(1), 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, renderPageHtml(template, page, SITE));
}

writeFileSync(
  join(OUTPUT, 'sitemap.xml'),
  buildSitemap(pages, SITE.url, SITE.legalUpdatedIso),
);

console.log(`Prerendered ${pages.length} public pages and the sitemap.`);
