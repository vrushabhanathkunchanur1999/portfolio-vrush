import type { APIRoute } from 'astro';
import { absoluteUrl } from '@/lib/site';

// Every crawler, including AI answer engines, is allowed everywhere. The named agents are
// listed explicitly so the intent is unambiguous; being quotable by them is the point of the site.
const AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Googlebot',
  'Bingbot',
  'Applebot',
  'Applebot-Extended',
  'DuckAssistBot',
  'Amazonbot',
  'meta-externalagent',
  'CCBot',
  'cohere-ai',
  'YouBot',
];

export const GET: APIRoute = () => {
  const text = [
    '# robots.txt for this site. Generated from src/pages/robots.txt.ts; edit that file, not the output.',
    '#',
    '# Policy: everything is public and every crawler is welcome, including AI search and',
    '# answer engines. The named agents below are allowed explicitly so that the intent is',
    '# unambiguous. Do not add a Disallow line without deciding to leave those engines out.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    ...AGENTS.flatMap((a) => [`User-agent: ${a}`, 'Allow: /', '']),
    `Sitemap: ${absoluteUrl('/sitemap-index.xml')}`,
    '',
    '# Machine-readable summary of the site for LLMs: https://llmstxt.org',
    `# ${absoluteUrl('/llms.txt')}`,
    '',
  ].join('\n');

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
