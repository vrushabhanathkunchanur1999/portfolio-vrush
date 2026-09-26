// Plain-Markdown renderings of content for /llms.txt and /llms-full.txt. Both are generated
// from the content collections at build time, so they cannot drift from the pages.
import type { CollectionEntry } from 'astro:content';
import { absoluteUrl } from '@/lib/site';

// MDX bodies contain imports and a few JSX components; reduce them to plain Markdown.
export function mdxToMarkdown(body: string): string {
  return body
    .replace(/^import .*$/gm, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/<FirstHand>\s*/g, '**From my deployment:** ')
    .replace(/\s*<\/FirstHand>/g, '')
    .replace(/\]\(\//g, `](${absoluteUrl('/')}`)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const faqs = (items?: { q: string; a: string }[]) =>
  items?.length ? ['## Frequently asked questions', ...items.flatMap((f) => [`### ${f.q}`, f.a])] : [];

export function projectMarkdown(p: CollectionEntry<'projects'>): string {
  const d = p.data;
  return [
    `# [${d.title}](${absoluteUrl(`/projects/${p.id}`)})`,
    d.oneLiner,
    [
      `- Role: ${d.role}`,
      d.org && `- Organisation: ${d.org}`,
      `- Period: ${d.period}`,
      d.scale && `- Scale: ${d.scale}`,
      `- Stack: ${d.stack.join(', ')}`,
      d.hardware && `- Hardware: ${d.hardware.join(', ')}`,
    ]
      .filter(Boolean)
      .join('\n'),
    mdxToMarkdown(p.body ?? ''),
    '## Results',
    d.outcomes.map((o) => `- ${o.metric}: ${o.value}${o.note ? `, ${o.note}` : ''}`).join('\n'),
    ...faqs(d.faqs),
  ].join('\n\n');
}

export function postMarkdown(p: CollectionEntry<'posts'>): string {
  const d = p.data;
  return [
    `# [${d.title}](${absoluteUrl(`/blog/${p.id}`)})`,
    `Published ${d.publishedAt.toISOString().slice(0, 10)}. ${d.answer}`,
    mdxToMarkdown(p.body ?? ''),
    '## Key takeaways',
    d.takeaways.map((t) => `- ${t}`).join('\n'),
    ...faqs(d.faqs),
    ...(d.sources?.length
      ? ['## Sources', d.sources.map((s) => `- [${s.title}](${s.url})`).join('\n')]
      : []),
  ].join('\n\n');
}
