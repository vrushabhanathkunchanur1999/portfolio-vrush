import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const faq = z.object({ q: z.string().min(1), a: z.string().min(1) });

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        oneLiner: z.string().min(1).max(120),
        category: z.enum(['production', 'personal', 'in-progress']),
        role: z.string().min(1),
        org: z.string().optional(),
        period: z.string().min(1),
        status: z.enum(['live', 'shipped', 'building', 'archived']),
        scale: z.string().optional(),
        problem: z.string().min(1),
        outcomes: z
          .array(z.object({ metric: z.string(), value: z.string(), note: z.string().optional() }))
          .min(1),
        stack: z.array(z.string()).min(1),
        hardware: z.array(z.string()).optional(),
        cover: z.object({ src: image(), alt: z.string().min(1) }).optional(),
        repo: z.url().optional(),
        demo: z.url().optional(),
        confidential: z.boolean(),
        featured: z.boolean(),
        order: z.number().int(),
        faqs: z.array(faq).optional(),
        relatedPosts: z.array(z.string()).optional(),
        publishedAt: z.coerce.date(),
        updatedAt: z.coerce.date().optional(),
      })
      .refine((p) => !(p.confidential && (p.repo || p.demo)), {
        message: 'Confidential projects must not carry repo or demo links.',
      }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  // readingTime is computed at render time from the body, so it is not authored here.
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(140).max(160),
    question: z.string().optional(),
    answer: z
      .string()
      .refine((s) => {
        const words = s.trim().split(/\s+/).length;
        return words >= 40 && words <= 60;
      }, 'answer must be 40-60 words'),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).min(1),
    draft: z.boolean().default(false),
    faqs: z.array(faq).optional(),
    sources: z.array(z.object({ title: z.string(), url: z.url() })).optional(),
    relatedProjects: z.array(z.string()).optional(),
  }),
});

export const collections = { projects, posts };
