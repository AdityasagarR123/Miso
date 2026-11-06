import { Link, Stack, type Href } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { LANGUAGE_PAGES, LEGAL_PAGES, SITE } from '@/site/content';
import { colors, radius, spacing } from '@/theme';

const LOGO_HEAD = require('../../../assets/brand/biso-head.png');

type Meta = { path: string; title: string; description: string };

function setTag(selector: string, attribute: string, value: string, create: () => HTMLElement) {
  const tag = document.head.querySelector(selector) ?? document.head.appendChild(create());
  tag.setAttribute(attribute, value);
}

function metaTag(name: string, value: string, key: 'name' | 'property' = 'name') {
  setTag(`meta[${key}="${name}"]`, 'content', value, () => {
    const tag = document.createElement('meta');
    tag.setAttribute(key, name);
    return tag;
  });
}

/** Keeps the page's search details right when moving around inside the app. */
export function usePageMeta({ path, title, description }: Meta) {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const url = `${SITE.url}${path === '/' ? '/' : path}`;
    metaTag('description', description);
    metaTag('og:title', title, 'property');
    metaTag('og:description', description, 'property');
    metaTag('og:url', url, 'property');
    metaTag('twitter:title', title);
    metaTag('twitter:description', description);
    setTag('link[rel="canonical"]', 'href', url, () => {
      const tag = document.createElement('link');
      tag.setAttribute('rel', 'canonical');
      return tag;
    });
  }, [path, title, description]);
}

const FOOTER_LINKS: [string, string][] = [
  ['/languages', 'Languages'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
  ['/careers', 'Careers'],
  ...Object.values(LEGAL_PAGES).map(
    (page): [string, string] => [page.path, page.name],
  ),
];

/** The links every public page ends with. */
export function SiteFooterLinks({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const color = tone === 'dark' ? colors.sand : colors.brown;

  return (
    <View accessibilityRole="navigation" style={styles.footerLinks}>
      {FOOTER_LINKS.map(([href, label]) => (
        <Link key={href} href={href as Href} style={[styles.footerLink, { color }]}>
          {label}
        </Link>
      ))}
    </View>
  );
}

export function Heading({ level = 2, children }: { level?: 1 | 2 | 3; children: ReactNode }) {
  return (
    <Text
      accessibilityRole="header"
      aria-level={level}
      style={level === 1 ? styles.h1 : level === 2 ? styles.h2 : styles.h3}
    >
      {children}
    </Text>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return <Text style={styles.body}>{children}</Text>;
}

export function Bullets({ items }: { items: readonly string[] }) {
  return (
    <View accessibilityRole="list" style={styles.bullets}>
      {items.map((item) => (
        <View key={item} accessibilityRole="listitem" style={styles.bullet}>
          <Text style={styles.bulletMark}>•</Text>
          <Text style={[styles.body, styles.bulletText]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

/** A primary link that looks like a button. */
export function ActionLink({ href, label, onPress }: { href: string; label: string; onPress?: () => void }) {
  return (
    <Link href={href as Href} onPress={onPress} style={styles.action}>
      {label}
    </Link>
  );
}

export function SitePage({ meta, children }: { meta: Meta; children: ReactNode }) {
  const { width } = useWindowDimensions();
  usePageMeta(meta);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <Stack.Screen options={{ headerShown: false, title: meta.title }} />

      <View style={[styles.bar, width < 480 && styles.barNarrow]}>
        <Link href="/" accessibilityLabel="Biso home" style={styles.brandLink}>
          <View style={styles.brand}>
            <Image accessibilityLabel="Biso logo" source={LOGO_HEAD} resizeMode="contain" style={styles.logo} />
            <Text style={styles.brandName}>Biso</Text>
          </View>
        </Link>
        <ActionLink href="/languages" label="Start for free" />
      </View>

      <View accessibilityRole="main" style={styles.main}>
        {children}
      </View>

      <View style={styles.footer}>
        <SiteFooterLinks />
        <Text style={styles.footerNote}>
          {SITE.name}. Free language learning.
        </Text>
      </View>
    </ScrollView>
  );
}

/** Links to every language's page, for people and for search engines. */
export function LanguageLinks({ exclude }: { exclude?: string }) {
  return (
    <View style={styles.languageLinks}>
      {LANGUAGE_PAGES.filter((page) => page.slug !== exclude).map((page) => (
        <Link
          key={page.slug}
          href={`/languages/${page.slug}` as Href}
          style={styles.languageLink}
        >
          Learn {page.name}
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.cream,
    flex: 1,
  },
  pageContent: {
    alignItems: 'center',
    flexGrow: 1,
  },
  bar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 800,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    width: '100%',
  },
  barNarrow: {
    paddingHorizontal: spacing.md,
  },
  brandLink: {
    minHeight: 44,
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  logo: {
    height: 44,
    width: 44,
  },
  brandName: {
    color: colors.brown,
    fontSize: 24,
    fontWeight: '800',
  },
  main: {
    flexGrow: 1,
    gap: spacing.md,
    maxWidth: 800,
    paddingBottom: 48,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    width: '100%',
  },
  h1: {
    color: colors.brown,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 46,
  },
  h2: {
    color: colors.brown,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginTop: spacing.md,
  },
  h3: {
    color: colors.brown,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginTop: spacing.xs,
  },
  body: {
    color: colors.brown,
    fontSize: 17,
    lineHeight: 26,
  },
  bullets: {
    gap: spacing.sm,
  },
  bullet: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  bulletMark: {
    color: colors.rustDark,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 26,
  },
  bulletText: {
    flex: 1,
  },
  action: {
    backgroundColor: colors.rust,
    borderRadius: radius.pill,
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 44,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
    width: '100%',
  },
  footerLinks: {
    columnGap: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 44,
    minHeight: 44,
    textDecorationLine: 'underline',
  },
  footerNote: {
    color: colors.brown,
    fontSize: 14,
  },
  languageLinks: {
    columnGap: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageLink: {
    color: colors.tealDark,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 44,
    minHeight: 44,
    textDecorationLine: 'underline',
  },
});
