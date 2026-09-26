import type { APIRoute } from 'astro';
import { render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer } from '@astrojs/mdx/container-renderer';
import { getPublishedPosts } from '@/lib/content';
import { absoluteUrl, site } from '@/lib/site';

// Hand-written RSS 2.0 with full post HTML, so the feed needs no extra dependency.

const escapeXml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Feed readers resolve relative URLs inconsistently, so root-relative links become absolute.
const absolutise = (html: string) => html.replace(/(href|src)="\//g, `$1="${site.url}/`);

// ']]>' would end the CDATA section early; split it across two sections.
const cdata = (html: string) => `<![CDATA[${html.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const container = await AstroContainer.create({
    renderers: await loadRenderers([getContainerRenderer()]),
  });

  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const body = await container.renderToString(Content);
      const url = absoluteUrl(`/blog/${post.id}`);
      const content = `<p>${escapeXml(post.data.answer)}</p>${absolutise(body)}`;
      return [
        '<item>',
        `<title>${escapeXml(post.data.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<pubDate>${post.data.publishedAt.toUTCString()}</pubDate>`,
        `<description>${escapeXml(post.data.description)}</description>`,
        ...post.data.tags.map((t) => `<category>${escapeXml(t)}</category>`),
        `<content:encoded>${cdata(content)}</content:encoded>`,
        '</item>',
      ].join('');
    }),
  );

  const latest = posts[0]?.data;
  const lastBuild = latest ? (latest.updatedAt ?? latest.publishedAt) : new Date(0);

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${escapeXml(site.name)}</title>`,
    `<link>${site.url}/blog</link>`,
    `<atom:link href="${absoluteUrl('/rss.xml')}" rel="self" type="application/rss+xml"/>`,
    `<description>${escapeXml(site.description)}</description>`,
    `<language>${site.locale}</language>`,
    `<lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>`,
    ...items,
    '</channel>',
    '</rss>',
  ].join('\n');

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
