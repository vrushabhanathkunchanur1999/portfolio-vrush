import { getPublishedPosts } from '@/lib/content';

// A tag gets an archive page only once at least this many published posts carry it.
export const MIN_POSTS_PER_TAG_PAGE = 2;

export async function getTagArchives(): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  for (const post of await getPublishedPosts()) {
    for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return new Map([...counts].filter(([, n]) => n >= MIN_POSTS_PER_TAG_PAGE));
}

// Returns null when the tag has no archive page, so callers render it as plain text.
export async function tagHref(tag: string): Promise<string | null> {
  return (await getTagArchives()).has(tag) ? `/blog/tag/${tag}` : null;
}
