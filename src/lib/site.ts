// Single source of truth for identity. Every page, JSON-LD block, OG tag, llms.txt and
// feed reads from here so the entity stays byte-identical across the site.

export const site = {
  // TODO_DOMAIN: replace with the real domain once bought. The github.io URL works until then.
  url: 'https://vrushabhkunchanur.github.io',
  name: 'Vrushabh Kunchanur',
  jobTitle: 'AI Engineer',
  title: 'Vrushabh Kunchanur, AI Engineer',
  description:
    'AI engineer who trains detection, classification and anomaly models and ships them to production on edge devices and factory floors.',
  positioning:
    'Trains detection, classification and anomaly models and ships them into production on real hardware: edge devices and factory floors, not notebooks.',
  email: 'vrushabhkunchanur@gmail.com',
  location: {
    locality: 'Bengaluru',
    region: 'Karnataka',
    country: 'India',
    countryCode: 'IN',
  },
  availability: 'Open to full-time roles and consulting on computer vision and edge ML deployment.',
  socials: {
    linkedin: 'https://www.linkedin.com/in/vrushabhanath-kunchanur-216379146/',
    github: 'https://github.com/vrushabhkunchanur',
  },
  locale: 'en',
} as const;

export const nav = [
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}
