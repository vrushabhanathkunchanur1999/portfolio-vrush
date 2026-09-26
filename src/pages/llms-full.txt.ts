import type { APIRoute } from 'astro';
import { getPublishedPosts, getSortedProjects } from '@/lib/content';
import { postMarkdown, projectMarkdown } from '@/lib/llms';
import { site } from '@/lib/site';

// Roughly 200 KB cap. Over it, the file keeps every project and only the ten newest posts.
const MAX_BYTES = 200_000;
const RECENT_POSTS_WHEN_CAPPED = 10;

export const GET: APIRoute = async () => {
  const projects = (await getSortedProjects()).map(projectMarkdown);
  const posts = (await getPublishedPosts()).map(postMarkdown);
  const header = `# ${site.name}, ${site.jobTitle}\n\n> ${site.positioning}`;

  const join = (parts: string[]) => `${[header, ...parts].join('\n\n---\n\n')}\n`;
  let text = join([...projects, ...posts]);
  if (Buffer.byteLength(text) > MAX_BYTES) {
    text = join([...projects, ...posts.slice(0, RECENT_POSTS_WHEN_CAPPED)]);
  }

  return new Response(text, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
