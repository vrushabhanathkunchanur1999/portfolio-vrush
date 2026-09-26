# Vrushabh Kunchanur, portfolio and blog

Static site built with Astro 7, TypeScript, Tailwind CSS v4 and MDX. Every page is pre-rendered
HTML, so crawlers and answer engines that never run JavaScript see the full content.

## Run it

Requires Node 22.12+ and pnpm 10.

```bash
pnpm install
pnpm dev            # http://localhost:4321
pnpm build          # astro check, astro build, then scripts/postbuild.mjs writes dist/_headers
pnpm check:site     # link, heading, metadata, JSON-LD and copy checks over dist/
pnpm preview
```

### On this Windows machine

Smart App Control blocks the native binaries that Rollup, Tailwind, lightningcss and sharp use,
so the build cannot run on Windows directly. Install on Windows (it fetches Linux binaries too,
see `pnpm.supportedArchitectures` in `package.json`), then build inside WSL:

```bash
wsl
cd "/mnt/c/Users/vrush/Desktop/GIT project"
node node_modules/astro/bin/astro.mjs dev --host      # or: check, build
node scripts/postbuild.mjs && node scripts/check-site.mjs
```

Any new dependency with a native module needs its `linux-x64` build installed from the Windows side.

## Where things live

| Path | What it holds |
| --- | --- |
| `src/lib/site.ts` | Name, job title, URL, email, location, social links. The single source for identity. |
| `src/lib/profile.ts` | Career facts: readouts, skills, experience, education, awards. Keep in step with `public/resume.pdf`. |
| `src/content/projects/*.mdx` | One file per project. |
| `src/content/posts/*.mdx` | One file per blog post. |
| `src/content.config.ts` | Zod schemas. A schema violation fails the build. |
| `src/lib/schema.ts` | JSON-LD builders. One `@graph` per page, linked by `@id`. |
| `src/lib/seo.ts` | Title and description limits, enforced at build time. |
| `src/lib/og.ts`, `src/pages/og/` | Open Graph cards, rendered at build time with satori and sharp. |
| `src/pages/llms.txt.ts`, `llms-full.txt.ts`, `robots.txt.ts`, `rss.xml.ts` | Generated from content at build time. |
| `scripts/postbuild.mjs` | Writes `dist/_headers`: caching, security headers and a hash-based CSP. |
| `scripts/check-site.mjs` | Post-build checks run in CI. |

## Add a project

Create one file, `src/content/projects/<slug>.mdx`. The slug becomes `/projects/<slug>` and must
never change after publishing. Copy the frontmatter of an existing project; the schema lists
every field. Required fields that are easy to miss:

- `metaTitle` (max 60 characters) and `metaDescription` (140-160 characters), written for search results.
- `category`: `production`, `personal` or `in-progress`. Filter buttons on `/projects` appear
  automatically once two categories have projects.
- `outcomes`: the first three appear on the landing page card, so order them by importance.
- `confidential: true` hides code links and shows the client-ownership line.

The body holds Context, Constraints, What I built and Hard problems as `##` sections. Results,
What I'd do differently (`lessons`) and FAQ come from frontmatter. Nothing else needs editing.

## Add a post

Create `src/content/posts/<slug>.mdx`. Write it to `CONTENT-GUIDE.md`. The schema enforces a
140-160 character `description`, a 40-60 word `answer`, 3-5 `takeaways`, lowercase-hyphenated
`tags` and a `firstHandBasis` line for the author box. Set `draft: true` to keep a post out of
production builds, the sitemap and the feed while still seeing it in `pnpm dev`.

Wrap first-hand measurements in the `FirstHand` component:

```mdx
import FirstHand from '@/components/FirstHand.astro';

<FirstHand>

Measured on the device: ...

</FirstHand>
```

A tag gets an archive page at `/blog/tag/<tag>` once two published posts carry it.

## Deploy: Cloudflare Pages

1. In the Cloudflare dashboard, go to Workers & Pages, choose Create, then Pages, and connect
   the GitHub repository.
2. Framework preset: Astro. Build command: `pnpm build`. Output directory: `dist`.
3. Environment variables: `NODE_VERSION=22`. Optionally `PUBLIC_CF_BEACON_TOKEN` (see Analytics).
4. Production branch: `main`. Pushes to `main` deploy; pull requests get preview URLs.

The free plan covers unlimited bandwidth, 500 builds a month, SSL and the global CDN. The site
works on `*.pages.dev` until a custom domain is added.

### Custom domain

1. Buy the domain (a `.dev` or `.com` is roughly ₹800-1,200 a year).
2. In the Pages project, open Custom domains and add it. If the domain's DNS is on Cloudflare,
   the record is created for you; otherwise add the CNAME it shows at your registrar.
3. Change `url` in `src/lib/site.ts` to the new domain and redeploy, so canonical URLs, the
   sitemap, JSON-LD, OG tags and `llms.txt` all move together.

### Other free hosts

| Host | The one setting it needs |
| --- | --- |
| Netlify | Build `pnpm build`, publish `dist`. Netlify reads `_headers` but not the Cloudflare-only `! Cache-Control` lines, so move the cache rules into `netlify.toml`. |
| Vercel (Hobby) | Framework preset Astro, output `dist`. Headers go in `vercel.json`; `_headers` is ignored. |
| GitHub Pages | Set `base: '/<repo>'` in `astro.config.mjs` unless using a custom domain, and deploy `dist` with the Pages action. `_headers` is ignored, so the CSP and cache rules do not apply. |

### After the first deploy

- Verify the site in Google Search Console and Bing Webmaster Tools, and submit
  `/sitemap-index.xml` to both. Bing matters here: ChatGPT Search and Copilot lean on its index.
- Run `/`, `/about`, a project and a post through Google's Rich Results Test.
- Validate `/rss.xml` at the W3C Feed Validation Service.

## Analytics

Cloudflare Web Analytics: cookieless, no consent banner needed. Create a site in the Cloudflare
dashboard, copy its token, and set `PUBLIC_CF_BEACON_TOKEN` in the Pages environment. The beacon
is only rendered in production builds with the token set; the CSP already allows its origins.

## Before publishing anything

- [ ] `pnpm build` and `pnpm check:site` pass.
- [ ] No `TODO` left in the page text (`grep -r TODO src/content`).
- [ ] Every number has its unit and its baseline in the same sentence.
- [ ] New pages have an authored title (max 60) and description (140-160).
- [ ] Every FAQ answer reads correctly on its own.
- [ ] The post links to at least one project or post, and is linked from one.
- [ ] Name, job title, location and links match `src/lib/site.ts` and the résumé PDF.
