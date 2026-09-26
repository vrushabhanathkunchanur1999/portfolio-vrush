import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { getOgCards, type OgCard } from '@/lib/og';
import { site } from '@/lib/site';

// Rendered at build time: satori lays out the card as SVG, sharp rasterises it to PNG.
// Satori reads woff but not woff2, so the OG fonts are static woff files kept in src/assets.

const WIDTH = 1200;
const HEIGHT = 630;
const PAPER = '#eef0f0';
const INK = '#15191c';
const GRAPHITE = '#4a545b';
const TAPE = '#f5c400';
// Resolved from the project root: the bundled endpoint no longer sits next to src/assets.
const FONT_DIR = resolve(process.cwd(), 'src/assets/og');

export const getStaticPaths = (async () => {
  const cards = await getOgCards();
  return cards.map((card) => ({ params: { key: card.key }, props: { card } }));
}) satisfies GetStaticPaths;

let fonts: Promise<{ name: string; data: Buffer; weight: 500 | 800; style: 'normal' }[]> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all([
    readFile(resolve(FONT_DIR, 'archivo-latin-500-normal.woff')),
    readFile(resolve(FONT_DIR, 'archivo-latin-800-normal.woff')),
  ]).then(([regular, heavy]) => [
    { name: 'Archivo', data: regular, weight: 500 as const, style: 'normal' as const },
    { name: 'Archivo', data: heavy, weight: 800 as const, style: 'normal' as const },
  ]));

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

// The same measuring scale as the hero: a baseline with minor ticks every 12px, major every 60px.
function scale(): Node {
  const ticks = Array.from({ length: Math.floor((WIDTH - 160) / 12) + 1 }, (_, i) =>
    el('div', { width: 2, height: i % 5 === 0 ? 28 : 12, background: i % 5 === 0 ? INK : GRAPHITE }),
  );
  return el('div', { display: 'flex', flexDirection: 'column' }, [
    el('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }, ticks),
    el('div', { height: 2, background: INK }),
    el('div', { width: 320, height: 10, marginTop: 4, background: TAPE }),
  ]);
}

function card({ title, metric }: OgCard): Node {
  const titleSize = title.length > 60 ? 56 : title.length > 30 ? 68 : 88;
  return el(
    'div',
    {
      width: WIDTH,
      height: HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px 80px 64px',
      background: PAPER,
      color: INK,
      fontFamily: 'Archivo',
    },
    [
      el('div', { display: 'flex', fontSize: 34, fontWeight: 800 }, `${site.name}, ${site.jobTitle}`),
      el('div', { display: 'flex', flexDirection: 'column', gap: 24 }, [
        el('div', { display: 'flex', fontSize: titleSize, fontWeight: 800, lineHeight: 1.05 }, title),
        el('div', { display: 'flex', fontSize: 34, fontWeight: 500, color: GRAPHITE }, metric),
      ]),
      scale(),
    ],
  );
}

export const GET: APIRoute = async ({ props }) => {
  const svg = await satori(card((props as { card: OgCard }).card) as never, {
    width: WIDTH,
    height: HEIGHT,
    fonts: await loadFonts(),
  });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
