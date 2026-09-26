import type { APIRoute } from 'astro';
import { getPublishedPosts, getSortedProjects } from '@/lib/content';
import { absoluteUrl, site } from '@/lib/site';

// llms.txt format: H1 name, blockquote summary, then linked sections. See https://llmstxt.org
export const GET: APIRoute = async () => {
  const projects = await getSortedProjects();
  const posts = await getPublishedPosts();
  const link = (title: string, path: string, desc: string) =>
    `- [${title}](${absoluteUrl(path)}): ${desc}`;

  const text = [
    `# ${site.name}`,
    `> ${site.name}, ${site.jobTitle} in ${site.location.locality}, ${site.location.country}. ${site.positioning}`,
    `Full text of every project and article: ${absoluteUrl('/llms-full.txt')}`,
    '## Projects',
    projects.map((p) => link(p.data.title, `/projects/${p.id}`, p.data.oneLiner)).join('\n'),
    '## Writing',
    posts.map((p) => link(p.data.title, `/blog/${p.id}`, p.data.description)).join('\n'),
    '## About',
    [
      link('About', '/about', `Background, experience, skills, education and awards of ${site.name}.`),
      link('Résumé', '/resume', 'Full résumé as HTML, with a PDF download.'),
      link('Contact', '/contact', site.availability),
    ].join('\n'),
  ].join('\n\n');

  return new Response(`${text}\n`, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
