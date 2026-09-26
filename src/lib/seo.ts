import { absoluteUrl } from '@/lib/site';

export interface Crumb {
  label: string;
  href: string;
}

export const TITLE_MAX = 60;
export const DESCRIPTION_MIN = 140;
export const DESCRIPTION_MAX = 160;

// Fails the build when a page's authored metadata is out of range, so the limits in the
// content guide are enforced rather than remembered.
export function assertMeta(path: string, title: string, description: string): void {
  const problems: string[] = [];
  if (title.length > TITLE_MAX) problems.push(`title is ${title.length} chars (max ${TITLE_MAX})`);
  if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) {
    problems.push(
      `description is ${description.length} chars (want ${DESCRIPTION_MIN}-${DESCRIPTION_MAX})`,
    );
  }
  if (problems.length > 0) throw new Error(`SEO metadata for ${path}: ${problems.join('; ')}`);
}

export function canonicalUrl(pathname: string): string {
  return absoluteUrl(pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/');
}
