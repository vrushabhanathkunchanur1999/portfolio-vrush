# Content guide

Rules for every project write-up and post, so pages stay consistent and each section can be
quoted on its own by a reader or an answer engine. `scripts/check-site.mjs` enforces the
mechanical ones; the rest are on you.

## Structure of a post

1. H1 is the title. There is one H1 per page, and the layout renders it.
2. The `answer` field comes first: 40-60 words that answer the post's question on their own.
3. "In this article" appears automatically when there are 4 or more `##` sections.
4. Body sections use `##` and `###` only, with no skipped levels.
5. Key takeaways (`takeaways`): 3-5 bullets, one sentence each.
6. FAQ (`faqs`): questions a reader would actually type. The same array renders the visible FAQ
   and the FAQPage JSON-LD.
7. Sources (`sources`): real outbound links for anything cited.

## Every section stands alone

- [ ] Phrase each `##` heading as the question a reader would search for.
- [ ] Follow each `##` heading immediately with a 2-3 sentence direct answer, before any
      elaboration, list, table or code.
- [ ] Do not open a section with "it", "this" or "as mentioned above". Name the subject.
- [ ] Define acronyms on first use on each page: NCNN, mAP, RTSP, ROI, NMS, ONNX, KPI, FP16.
- [ ] Keep paragraphs under 80 words.

## Numbers

- [ ] Every number carries its unit and its baseline in the same sentence: "cut inference latency
      35% on Raspberry Pi 5, from the ONNX Runtime FP32 baseline", not "35%".
- [ ] Say when a figure combines several changes and does not isolate one of them.
- [ ] Wrap first-hand measurements in `<FirstHand>` so they are marked as measured, not general.
- [ ] Never invent a figure. Leave a visible `TODO` and fill it in before publishing.

## Tables and definitions

- [ ] Use a Markdown table for metrics and for any A-vs-B comparison.
- [ ] Use a definition list (`<dl>`) for glossaries.

## Copy

- [ ] Sentence case for headings, active voice, plain verbs.
- [ ] No self-praise adjectives ("passionate", "results-driven", "innovative").
- [ ] No emoji and no exclamation marks.
- [ ] Let the numbers carry the persuasion.

## Metadata

- [ ] `metaTitle` (posts and projects): max 60 characters, written for the search result.
- [ ] `description` / `metaDescription`: 140-160 characters, a real answer rather than a teaser.
- [ ] Tags: lowercase and hyphenated, reused where possible so archives reach two posts.
- [ ] Link the post to at least one project or post (`relatedProjects`, or a link in the body).
- [ ] Set `updatedAt` when you change a published page. It drives "Last updated", the JSON-LD
      `dateModified` and the sitemap `lastmod`.
- [ ] Never change a published slug. If you must, add a 301 to `public/_redirects`.
