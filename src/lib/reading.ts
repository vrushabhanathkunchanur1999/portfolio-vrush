// Word count and reading time are computed from the raw MDX body, never authored.

const WORDS_PER_MINUTE = 225;

export function countWords(body: string): number {
  const text = body
    .replace(/^import .*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_`>|[\]()-]/g, ' ');
  return text.split(/\s+/).filter(Boolean).length;
}

export function readingTime(body: string): number {
  return Math.max(1, Math.round(countWords(body) / WORDS_PER_MINUTE));
}
