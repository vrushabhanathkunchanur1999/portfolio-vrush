// Typed JSON-LD builders. Every page emits one @graph; entities link by @id instead of being
// repeated, so the Person defined here is the only Person on the site.
import type { CollectionEntry } from 'astro:content';
import type { Crumb } from '@/lib/seo';
import { education, experience, skills } from '@/lib/profile';
import { absoluteUrl, site } from '@/lib/site';

export type JsonLdNode = Record<string, unknown> & { '@type': string };

export const ids = {
  person: `${site.url}/#person`,
  website: `${site.url}/#website`,
  page: (path: string) => `${absoluteUrl(path)}#webpage`,
  breadcrumb: (path: string) => `${absoluteUrl(path)}#breadcrumb`,
  faq: (path: string) => `${absoluteUrl(path)}#faq`,
};

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export function person(): JsonLdNode {
  const current = experience.find((r) => r.end === null);
  return {
    '@type': 'Person',
    '@id': ids.person,
    name: site.name,
    jobTitle: site.jobTitle,
    description: site.description,
    url: site.url,
    email: `mailto:${site.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.location.locality,
      addressRegion: site.location.region,
      addressCountry: site.location.countryCode,
    },
    knowsAbout: skills.flatMap((g) => g.items),
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: education.institution,
      address: { '@type': 'PostalAddress', addressLocality: 'Hubballi', addressCountry: 'IN' },
    },
    ...(current ? { worksFor: { '@type': 'Organization', name: current.org } } : {}),
    sameAs: [site.socials.linkedin, site.socials.github],
    // TODO: add `image` once a headshot exists (public/ + absolute URL).
  };
}

export function website(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: site.locale,
    publisher: { '@id': ids.person },
  };
}

export function webPage(
  path: string,
  name: string,
  description: string,
  type: 'WebPage' | 'ProfilePage' | 'CollectionPage' | 'ContactPage' = 'WebPage',
  extra: Record<string, unknown> = {},
): JsonLdNode {
  return {
    '@type': type,
    '@id': ids.page(path),
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: site.locale,
    isPartOf: { '@id': ids.website },
    ...(type === 'ProfilePage' ? { mainEntity: { '@id': ids.person } } : {}),
    ...extra,
  };
}

export function breadcrumbList(path: string, items: Crumb[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': ids.breadcrumb(path),
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href),
    })),
  };
}

export function faqPage(path: string, faqs: { q: string; a: string }[]): JsonLdNode {
  return {
    '@type': 'FAQPage',
    '@id': ids.faq(path),
    isPartOf: { '@id': ids.page(path) },
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function blogPosting(
  post: CollectionEntry<'posts'>,
  wordCount: number,
  image: string,
): JsonLdNode {
  const path = `/blog/${post.id}`;
  const d = post.data;
  return {
    '@type': 'BlogPosting',
    '@id': `${absoluteUrl(path)}#article`,
    headline: d.title,
    description: d.description,
    author: { '@id': ids.person },
    publisher: { '@id': ids.person },
    datePublished: isoDate(d.publishedAt),
    dateModified: isoDate(d.updatedAt ?? d.publishedAt),
    wordCount,
    keywords: d.tags.join(', '),
    articleSection: 'Blog',
    inLanguage: site.locale,
    image: absoluteUrl(image),
    mainEntityOfPage: { '@id': ids.page(path) },
  };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "Jan 2025 – present" -> "2025-01"; undefined when the period has no leading month and year.
function periodStart(period: string): string | undefined {
  const m = /^([A-Z][a-z]{2}) (\d{4})/.exec(period);
  if (!m?.[1] || !m[2]) return undefined;
  const month = MONTHS.indexOf(m[1]) + 1;
  return month > 0 ? `${m[2]}-${String(month).padStart(2, '0')}` : undefined;
}

export function projectWork(project: CollectionEntry<'projects'>, image: string): JsonLdNode {
  const path = `/projects/${project.id}`;
  const d = project.data;
  const created = periodStart(d.period);
  return {
    '@type': d.demo ? 'SoftwareApplication' : 'CreativeWork',
    '@id': `${absoluteUrl(path)}#work`,
    name: d.title,
    description: d.oneLiner,
    abstract: d.problem,
    about: [{ '@type': 'Thing', name: 'Computer vision' }, ...(d.hardware ?? []).map((h) => ({ '@type': 'Thing', name: h }))],
    keywords: d.stack.join(', '),
    creator: { '@id': ids.person },
    ...(created ? { dateCreated: created } : {}),
    datePublished: isoDate(d.publishedAt),
    dateModified: isoDate(d.updatedAt ?? d.publishedAt),
    inLanguage: site.locale,
    image: absoluteUrl(image),
    mainEntityOfPage: { '@id': ids.page(path) },
    ...(d.demo ? { url: d.demo, applicationCategory: 'MultimediaApplication' } : {}),
  };
}

export function graph(nodes: JsonLdNode[]): string {
  // `<` is escaped so no string in the data can close the script element early.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(
    /</g,
    '\\u003c',
  );
}
