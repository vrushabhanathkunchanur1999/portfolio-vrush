// One Open Graph card per page: name, page title and one metric. Every page's og:image points at
// /og/<key>.png, and the endpoint in src/pages/og renders exactly this list.
import { getPublishedPosts, getSortedProjects } from '@/lib/content';
import { yearsOfExperience } from '@/lib/profile';
import { readingTime } from '@/lib/reading';
import { getTagArchives } from '@/lib/tags';

export interface OgCard {
  key: string;
  title: string;
  metric: string;
}

export const ogPath = (key: string) => `/og/${key}.png`;

export async function getOgCards(): Promise<OgCard[]> {
  const projects = await getSortedProjects();
  const posts = await getPublishedPosts();
  const tags = await getTagArchives();

  return [
    { key: 'home', title: 'AI Engineer', metric: 'Models in production in 400+ retail stores and 4 factory stations' },
    { key: 'about', title: 'About', metric: `${yearsOfExperience} years of engineering on real hardware` },
    { key: 'contact', title: 'Contact', metric: 'Open to full-time roles and consulting' },
    { key: 'resume', title: 'Résumé', metric: '400+ stores, 4 inspection stations, 1,400+ units a day' },
    { key: 'projects', title: 'Projects', metric: `${projects.filter((p) => p.data.category === 'production').length} systems in production` },
    { key: 'blog', title: 'Blog', metric: 'Notes from production computer vision deployments' },
    ...projects.map((p) => {
      const top = p.data.outcomes[0];
      return {
        key: `project-${p.id}`,
        title: p.data.title,
        metric: top ? `${top.metric}: ${top.value}` : (p.data.scale ?? p.data.oneLiner),
      };
    }),
    ...posts.map((p) => ({
      key: `post-${p.id}`,
      title: p.data.title,
      metric: `${readingTime(p.body ?? '')} minute read`,
    })),
    ...[...tags].map(([tag, n]) => ({
      key: `tag-${tag}`,
      title: `Articles tagged ${tag}`,
      metric: `${n} articles`,
    })),
  ];
}
