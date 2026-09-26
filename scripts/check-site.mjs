// Checks the built site in dist/ and exits non-zero on any failure. Run after `pnpm build`.
//
//   - every internal link and asset resolves to a built file
//   - every page has one <h1>, no skipped heading levels, a canonical URL and an OG image that exists
//   - every page has exactly one JSON-LD @graph whose @id references all resolve
//   - no words are glued to an adjacent inline tag (Astro drops whitespace at line breaks)
//   - copy rules from CONTENT-GUIDE.md: no banned self-description, exclamation marks or emoji
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const BANNED_WORDS = ['passionate', 'results-driven', 'innovative', 'rockstar', 'ninja', 'guru'];
const failures = [];
const fail = (file, msg) => failures.push(`${file}: ${msg}`);

function files(dir, ext) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    if (e.isDirectory()) return files(path, ext);
    return e.name.endsWith(ext) ? [path] : [];
  });
}

// Cloudflare Pages serves /about from about.html and / from index.html.
function resolves(href) {
  const path = decodeURI(href.split(/[?#]/)[0] ?? '');
  if (path === '/' || path === '') return true;
  return [path, `${path}.html`, join(path, 'index.html')].some((p) => existsSync(join(DIST, p)));
}

const stripCode = (html) => html.replace(/<(script|style|pre|code)[^>]*>[\s\S]*?<\/\1>/g, '');
const text = (html) => stripCode(html).replace(/<[^>]+>/g, ' ');

function collectRefs(node, out) {
  if (Array.isArray(node)) node.forEach((n) => collectRefs(n, out));
  else if (node && typeof node === 'object') {
    const keys = Object.keys(node);
    if (keys.length === 1 && keys[0] === '@id') out.add(node['@id']);
    Object.values(node).forEach((v) => collectRefs(v, out));
  }
}

for (const file of files(DIST, '.html')) {
  const rel = relative(DIST, file);
  const html = readFileSync(file, 'utf8');

  for (const [, href] of html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
    if (!resolves(href)) fail(rel, `broken internal link ${href}`);
  }

  const levels = [...stripCode(html).matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  if (levels.filter((l) => l === 1).length !== 1) fail(rel, 'expected exactly one <h1>');
  levels.forEach((l, i) => {
    if (i > 0 && l > (levels[i - 1] ?? 0) + 1) fail(rel, `heading jumps from h${levels[i - 1]} to h${l}`);
  });

  if (!/<link rel="canonical" href="https:\/\//.test(html)) fail(rel, 'missing absolute canonical');
  const og = /<meta property="og:image" content="https?:\/\/[^/]+(\/[^"]+)"/.exec(html)?.[1];
  if (!og || !resolves(og)) fail(rel, `og:image missing or not built (${og})`);

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length !== 1) fail(rel, `expected one JSON-LD block, found ${blocks.length}`);
  for (const [, json] of blocks) {
    try {
      const graph = JSON.parse(json)['@graph'] ?? [];
      const ids = new Set(graph.map((n) => n['@id']).filter(Boolean));
      const refs = new Set();
      collectRefs(graph, refs);
      for (const ref of refs) if (!ids.has(ref)) fail(rel, `JSON-LD reference ${ref} does not resolve`);
    } catch (e) {
      fail(rel, `JSON-LD does not parse: ${e.message}`);
    }
  }

  const body = stripCode(html.replace(/<head>[\s\S]*?<\/head>/, ''));
  const glued =
    /[A-Za-z0-9,:;.)+]<(?:a|time|span|strong|em|code)\b|<\/(?:a|time|span|strong|em|code)>[A-Za-z0-9(]/.exec(body);
  if (glued) fail(rel, `text glued to a tag near "${body.slice(glued.index - 30, glued.index + 30)}"`);

  const words = text(html);
  for (const w of BANNED_WORDS) if (new RegExp(`\\b${w}\\b`, 'i').test(words)) fail(rel, `banned word "${w}"`);
  if (/\w!(\s|$)/.test(words)) fail(rel, 'exclamation mark in copy');
  if (/\p{Extended_Pictographic}/u.test(words)) fail(rel, 'emoji in copy');
}

for (const required of ['robots.txt', 'llms.txt', 'llms-full.txt', 'rss.xml', 'sitemap-index.xml', '_headers']) {
  if (!existsSync(join(DIST, required))) fail(required, 'not generated');
}

if (failures.length) {
  console.error(`check-site: ${failures.length} problem(s)\n${failures.map((f) => `  ${f}`).join('\n')}`);
  process.exit(1);
}
console.log(`check-site: ${files(DIST, '.html').length} pages passed`);
