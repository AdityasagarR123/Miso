import type { Level } from '../course/levels';
import type { Phrase, Scripted } from '../course/phrasebook';
import type { CareerRole, LanguagePage, LegalPage } from './content';

/** Everything about the site's words that the build needs, passed in by the script. */
export type SiteContent = {
  site: { name: string; url: string; contactEmail: string; legalUpdatedIso: string; shareImage: string };
  home: PageMeta;
  languagesIndex: PageMeta;
  about: PageMeta;
  contact: PageMeta;
  careers: PageMeta;
  roles: CareerRole[];
  compensation: string;
  legal: LegalPage[];
  languages: LanguagePage[];
  languageMeta: (page: LanguagePage) => PageMeta;
  languageFaq: (page: LanguagePage) => { question: string; answer: string }[];
  phrases: readonly Phrase[];
  levels: readonly Level[];
};

export type PageMeta = { path: string; title: string; description: string };

export type BuiltPage = PageMeta & {
  jsonLd: object[];
  /** Plain HTML shown until the app loads, and readable with no JavaScript. */
  body: string;
};

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Sample phrases for a language page, with a pronunciation guide when needed. */
export function samplePhrases(
  phrases: readonly Phrase[],
  key: LanguagePage['key'],
  count = 6,
): { english: string; target: string; say?: string }[] {
  return phrases.slice(0, count).map((phrase) => {
    const value = phrase[key];
    return typeof value === 'string'
      ? { english: phrase.en, target: value }
      : { english: phrase.en, target: (value as Scripted)[0], say: (value as Scripted)[1] };
  });
}

function list(items: string[]): string {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function footer(content: SiteContent): string {
  const links = [
    ...content.languages.map((page) => [`/languages/${page.slug}`, `Learn ${page.name}`]),
    ['/about', 'About'],
    ['/contact', 'Contact'],
    ['/careers', 'Careers'],
    ...content.legal.map((page) => [page.path, page.name]),
  ];
  return `<nav aria-label="Site links">${list(
    links.map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`),
  )}</nav>`;
}

function organization(content: SiteContent) {
  const { site } = content;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site.url}/#organization`,
    name: site.name,
    url: `${site.url}/`,
    logo: `${site.url}/icon-512.png`,
    email: site.contactEmail,
  };
}

function breadcrumbs(content: SiteContent, trail: [string, string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: `${content.site.url}${path === '/' ? '/' : path}`,
    })),
  };
}

function homePage(content: SiteContent): BuiltPage {
  const { site, home } = content;
  return {
    ...home,
    jsonLd: [
      organization(content),
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        name: site.name,
        url: `${site.url}/`,
        inLanguage: 'en',
        publisher: { '@id': `${site.url}/#organization` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: site.name,
        url: `${site.url}/`,
        description: home.description,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Any web browser',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    ],
    body: `<h1>Biso, your free way to learn a language</h1>
<p>Short, playful language lessons with a red panda who cheers you on. Choose from ${content.languages.length} languages, with ${content.levels.length} levels in each.</p>
<p><a href="/languages">Start learning for free</a></p>
<h2>It feels like a game</h2>
${list([
  '<strong>Hearts:</strong> mistakes cost a heart, and practice earns them back for free.',
  '<strong>XP:</strong> every right answer and finished lesson moves you forward.',
  '<strong>Streaks:</strong> show up each day and watch your streak grow.',
  '<strong>Practice:</strong> the words you get wrong come back until they stick.',
])}
<h2>Free means free</h2>
<p>No subscriptions, no premium tier, no paywalled lessons and no paying after mistakes. All you need is a free account.</p>
${footer(content)}`,
  };
}

function languagesIndexPage(content: SiteContent): BuiltPage {
  return {
    ...content.languagesIndex,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: content.languages.map((page, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: `Learn ${page.name}`,
          url: `${content.site.url}/languages/${page.slug}`,
        })),
      },
    ],
    body: `<h1>Choose a language to learn for free</h1>
<p>Every course has ${content.levels.length} levels and 40+ free lessons.</p>
${footer(content)}`,
  };
}

function languagePage(content: SiteContent, page: LanguagePage): BuiltPage {
  const meta = content.languageMeta(page);
  const faq = content.languageFaq(page);
  const { site } = content;
  const samples = samplePhrases(content.phrases, page.key);

  return {
    ...meta,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: `Learn ${page.name}`,
        description: meta.description,
        url: `${site.url}${meta.path}`,
        inLanguage: 'en',
        teaches: page.name,
        educationalLevel: 'Beginner',
        isAccessibleForFree: true,
        provider: { '@type': 'Organization', name: site.name, url: `${site.url}/` },
        offers: { '@type': 'Offer', category: 'Free', price: '0', priceCurrency: 'USD' },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: 'PT5M',
        },
      },
      breadcrumbs(content, [
        ['Home', '/'],
        ['Languages', '/languages'],
        [page.name, meta.path],
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
    body: `<h1>Learn ${escapeHtml(page.name)} for free</h1>
<p>${escapeHtml(page.about)}</p>
<p><a href="/languages">Start learning ${escapeHtml(page.name)} for free</a></p>
<h2>Your first ${escapeHtml(page.name)} words</h2>
${list(
  samples.map(({ english, target, say }) =>
    `${escapeHtml(english)}: <span lang="${page.key}">${escapeHtml(target)}</span>${say ? ` (${escapeHtml(say)})` : ''}`,
  ),
)}
<h2>What you will learn</h2>
${list(content.levels.map((level) => `Level ${level.number}: ${escapeHtml(level.title)}`))}
<p>${escapeHtml(page.scriptNote)}</p>
<h2>Questions about learning ${escapeHtml(page.name)}</h2>
${faq.map(({ question, answer }) => `<h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p>`).join('')}
${footer(content)}`,
  };
}

function legalPage(content: SiteContent, page: LegalPage): BuiltPage {
  return {
    path: page.path,
    title: page.title,
    description: page.description,
    jsonLd: [],
    body: `<h1>${escapeHtml(page.name)}</h1>
<p>${escapeHtml(page.intro)}</p>
${page.sections
  .map(
    (section) =>
      `<h2>${escapeHtml(section.heading)}</h2>${(section.paragraphs ?? [])
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join('')}${section.bullets ? list(section.bullets.map(escapeHtml)) : ''}`,
  )
  .join('')}
${footer(content)}`,
  };
}

/** Every public page, in the order the sitemap lists them. */
export function buildPublicPages(content: SiteContent): BuiltPage[] {
  return [
    homePage(content),
    languagesIndexPage(content),
    ...content.languages.map((page) => languagePage(content, page)),
    {
      ...content.about,
      jsonLd: [organization(content)],
      body: `<h1>About Biso</h1><p>Biso is a free, playful way to learn a language, with short lessons and a red panda who cheers you on.</p>${footer(content)}`,
    },
    {
      ...content.contact,
      jsonLd: [],
      body: `<h1>Contact Biso</h1><p>Email <a href="mailto:${content.site.contactEmail}">${content.site.contactEmail}</a>.</p>${footer(content)}`,
    },
    {
      ...content.careers,
      jsonLd: [],
      body: `<h1>Careers at Biso</h1>${content.roles
        .map(
          (role) =>
            `<h2>${escapeHtml(role.title)}</h2><p>${escapeHtml(role.summary)}</p><h3>What you'll work on</h3>${list(role.work.map(escapeHtml))}<h3>What we're looking for</h3>${list(role.looking.map(escapeHtml))}<h3>Compensation</h3><p>${escapeHtml(content.compensation)}</p>`,
        )
        .join('')}<p>To apply, email <a href="mailto:${content.site.contactEmail}">${content.site.contactEmail}</a>.</p>${footer(content)}`,
    },
    ...content.legal.map((page) => legalPage(content, page)),
  ];
}

export function buildSitemap(pages: BuiltPage[], siteUrl: string, lastModified: string): string {
  const urls = pages
    .map(
      (page) =>
        `  <url><loc>${siteUrl}${page.path === '/' ? '/' : page.path}</loc><lastmod>${lastModified}</lastmod></url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/** Adds a page's title, description, share tags and readable content to the app's HTML. */
export function renderPageHtml(
  template: string,
  page: BuiltPage,
  site: SiteContent['site'],
): string {
  const url = `${site.url}${page.path === '/' ? '/' : page.path}`;
  const image = `${site.url}${site.shareImage}`;
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const head = `<meta name="description" content="${description}" />
<link rel="canonical" href="${url}" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<meta name="theme-color" content="#1C1411" />
<link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/icon-192.png" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${escapeHtml(site.name)}" />
<meta property="og:locale" content="en_US" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Biso the red panda and the words: Learn a language for free" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${image}" />
${page.jsonLd
  .map(
    (data) =>
      // "<" is escaped so that no text can ever close this script tag early.
      `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`,
  )
  .join('\n')}
<style>#biso-static{box-sizing:border-box;color:#3B2318;font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;margin:0 auto;max-width:720px;padding:24px;width:100%}#biso-static a{color:#0B7A72}</style>
<noscript><style>body{overflow:auto}#root{display:block;height:auto}</style></noscript>
`;
  return withTitle(template, page.title)
    .replace('</head>', () => `${head}</head>`)
    // This page works without JavaScript, so the app's warning no longer applies.
    .replace(/<noscript>\s*You need to enable JavaScript[^<]*<\/noscript>/, '')
    .replace(
      /<div id="root">\s*<\/div>/,
      () => `<div id="root"><main id="biso-static">${page.body}</main></div>`,
    );
}

/** The page shown for addresses that don't exist. Search engines must not list it. */
export function renderNotFoundHtml(template: string): string {
  return withTitle(template, 'Page not found | Biso').replace(
    '</head>',
    () => '<meta name="robots" content="noindex" />\n</head>',
  );
}

function withTitle(template: string, title: string): string {
  const tag = `<title>${escapeHtml(title)}</title>`;
  return /<title>[\s\S]*?<\/title>/.test(template)
    ? template.replace(/<title>[\s\S]*?<\/title>/, () => tag)
    : template.replace('</head>', () => `${tag}</head>`);
}
