import assert from 'node:assert/strict';
import { test } from 'node:test';

import { LEVEL_PLAN } from '../course/levels.ts';
import { PHRASEBOOK } from '../course/phrasebook.ts';
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
  roleApplyLink,
  SITE,
} from './content.ts';
import {
  buildPublicPages,
  buildSitemap,
  renderNotFoundHtml,
  renderPageHtml,
} from './pages.ts';

const content = {
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
};
const pages = buildPublicPages(content);
const template =
  '<!DOCTYPE html><html lang="en"><head><title>Biso</title></head><body><div id="root"></div></body></html>';

test('every public page has a unique address, title and description', () => {
  assert.equal(pages.length, 18);
  for (const field of ['path', 'title', 'description']) {
    const values = pages.map((page) => page[field]);
    assert.equal(new Set(values).size, pages.length, `repeated ${field}`);
  }
});

test('titles and descriptions fit in search results', () => {
  for (const page of pages) {
    assert.ok(page.title.length <= 65, `${page.path} title: ${page.title.length}`);
    assert.ok(
      page.description.length >= 70 && page.description.length <= 170,
      `${page.path} description: ${page.description.length}`,
    );
  }
});

test('every language has its own page with sample words', () => {
  assert.equal(LANGUAGE_PAGES.length, 10);
  assert.equal(new Set(LANGUAGE_PAGES.map((page) => page.slug)).size, 10);
  for (const page of LANGUAGE_PAGES) {
    assert.equal(page.courseId, `${page.key}-from-en`);
  }
  const japanese = pages.find((page) => page.path === '/languages/japanese');
  assert.match(japanese.body, /こんにちは/);
  assert.match(japanese.body, /konnichiwa/);
});

test('rendered pages carry their own metadata and readable content', () => {
  const page = pages.find((item) => item.path === '/languages/spanish');
  const html = renderPageHtml(template, page, SITE);
  assert.match(html, /<title>Learn Spanish Free/);
  assert.equal(html.match(/<title>/g).length, 1);
  assert.match(html, /rel="canonical" href="https:\/\/www\.thebiso\.xyz\/languages\/spanish"/);
  assert.match(html, /property="og:image" content="https:\/\/www\.thebiso\.xyz\/og-image\.png"/);
  assert.match(html, /<div id="root"><main id="biso-static"><h1>Learn Spanish for free<\/h1>/);
  for (const [, json] of html.matchAll(/ld\+json">(.*?)<\/script>/g)) {
    assert.equal(JSON.parse(json)['@context'], 'https://schema.org');
  }
});

test('the careers page lists every role', () => {
  const page = pages.find((item) => item.path === '/careers');
  assert.match(page.body, /ML Engineer/);
  assert.ok(page.body.includes('UI/UX Designer'));
  assert.equal(page.body.split(CAREERS_COMPENSATION).length - 1, CAREER_ROLES.length);
  assert.equal(
    roleApplyLink(CAREER_ROLES[1]),
    'mailto:adityagreatmusician@gmail.com?subject=Application%3A%20UI%2FUX%20Designer',
  );
});

test('text with special characters cannot break the HTML', () => {
  const html = renderPageHtml(
    template,
    { path: '/x', title: 'A "<b>" & C', description: 'D', jsonLd: [{ a: '</script>' }], body: '' },
    SITE,
  );
  assert.match(html, /<title>A &quot;&lt;b&gt;&quot; &amp; C<\/title>/);
  assert.ok(!html.includes('</script>"'));
  assert.ok(html.includes('\\u003c/script>'));
});

test('the sitemap lists every page and the 404 page stays out of search', () => {
  const sitemap = buildSitemap(pages, SITE.url, SITE.legalUpdatedIso);
  assert.equal(sitemap.match(/<loc>/g).length, pages.length);
  assert.match(sitemap, /<loc>https:\/\/www\.thebiso\.xyz\/<\/loc>/);
  assert.ok(!sitemap.includes('/learn<'));
  assert.match(renderNotFoundHtml(template), /name="robots" content="noindex"/);
});
