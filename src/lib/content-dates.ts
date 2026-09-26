// Sitemap lastmod values, read from content frontmatter. astro.config cannot use the content
// collection API, so this reads the MDX files directly. Only real dates are returned: a page
// with no content date (about, contact, resume) gets no lastmod rather than an invented one.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

interface Entry {
  path: string;
  date: Date;
  tags: string[];
}

function field(frontmatter: string, name: string): string | undefined {
  return new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(frontmatter)?.[1]?.trim();
}

function tagsOf(frontmatter: string): string[] {
  const block = /^tags:\n((?:\s+- .+\n?)+)/m.exec(frontmatter)?.[1] ?? '';
  return [...block.matchAll(/- (.+)/g)].map((m) => (m[1] ?? '').trim());
}

function read(dir: string, base: string): Entry[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .flatMap((f) => {
      const frontmatter = readFileSync(join(dir, f), 'utf8').split('---')[1] ?? '';
      if (field(frontmatter, 'draft') === 'true') return [];
      const raw = field(frontmatter, 'updatedAt') ?? field(frontmatter, 'publishedAt');
      if (!raw) return [];
      return [{ path: `${base}/${f.replace(/\.mdx$/, '')}`, date: new Date(raw), tags: tagsOf(frontmatter) }];
    });
}

const newest = (entries: Entry[]) =>
  entries.length ? new Date(Math.max(...entries.map((e) => e.date.valueOf()))) : undefined;

export function contentLastmod(root: string): Map<string, Date> {
  const projects = read(join(root, 'src/content/projects'), '/projects');
  const posts = read(join(root, 'src/content/posts'), '/blog');
  const map = new Map<string, Date>();
  for (const e of [...projects, ...posts]) map.set(e.path, e.date);

  const set = (path: string, d: Date | undefined) => d && map.set(path, d);
  set('/projects', newest(projects));
  set('/blog', newest(posts));
  set('/', newest([...projects, ...posts]));
  for (const tag of new Set(posts.flatMap((p) => p.tags))) {
    set(`/blog/tag/${tag}`, newest(posts.filter((p) => p.tags.includes(tag))));
  }
  return map;
}
