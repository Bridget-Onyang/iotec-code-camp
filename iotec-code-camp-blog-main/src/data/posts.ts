import learningCover from '@/assets/covers/learning-in-public.jpg'
import frontendCover from '@/assets/covers/interfaces-that-get-out-of-the-way.jpg'
import careerCover from '@/assets/covers/the-first-year-in-tech.jpg'

export interface BlogPost {
  slug: string
  issue: string
  category: string
  title: string
  excerpt: string
  date: string
  dateTime: string
  readingTime: string
  coverImage: string
  coverAlt: string
  content: readonly string[]
}

// Placeholder essays — replace the copy with Onyang's own articles.
export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: 'learning-in-public-at-code-camp',
    issue: '01',
    category: 'Learning',
    title: 'Learning in Public at Code Camp',
    excerpt:
      'What a room full of first commits taught me about asking better questions, shipping small, and growing in the open.',
    date: 'Nov 08, 2026',
    dateTime: '2026-11-08',
    readingTime: '5 min read',
    coverImage: learningCover,
    coverAlt:
      'Students collaborating around a laptop at a community code camp workshop',
    content: [
      'For a long time, I thought learning meant waiting until I had something finished and impressive to show. Code Camp quietly broke that habit. There is something clarifying about sitting in a room where everyone is mid-build, mid-bug, and mid-question at the same time.',
      'The first thing I learned was to ask smaller questions. Not “how do I become a great developer?” but “why is this component re-rendering?” Small questions have answers you can test before lunch. They compound faster than grand plans.',
      'The second was to ship before I felt ready. A deployed page with rough edges teaches more than a perfect folder that never leaves my laptop. Feedback is the real compiler: it tells you where the ideas fail, not just the syntax.',
      'Most of all, learning in public made the process less lonely. Sharing a broken build, a half-finished feature, or a note that says “I finally understand this” invites other people into the work. That is what Code Camp gave me — not just skills, but company for the journey.',
    ],
  },
  {
    slug: 'interfaces-that-get-out-of-the-way',
    issue: '02',
    category: 'Frontend',
    title: 'Interfaces That Get Out of the Way',
    excerpt:
      'Notes on restraint, typography, and building web experiences that feel calm instead of crowded.',
    date: 'Oct 24, 2026',
    dateTime: '2026-10-24',
    readingTime: '6 min read',
    coverImage: frontendCover,
    coverAlt:
      'A calm desk with a laptop showing a minimal web interface beside a window',
    content: [
      'The best interfaces I use rarely announce themselves. They give me a clear place to start, enough room to think, and a quiet way to undo my mistakes. Nothing competes for attention that has not earned it.',
      'I have started asking three questions before adding anything to a screen: does this help the person finish their task, does it explain something they already know, or does it solve a problem I imagined? Most new elements fail at least one of those questions.',
      'Typography carries more of the experience than decoration does. Generous line height, a restrained palette, and one confident serif for headings can make a plain page feel considered. Restraint is not the absence of design; it is design doing fewer things with more intention.',
      'The same idea applies to code. A small component with obvious props is kinder to future me than a clever abstraction that saves six lines and costs an afternoon. Calm interfaces are usually built on calm code.',
    ],
  },
  {
    slug: 'the-first-year-in-tech-honestly',
    issue: '03',
    category: 'Career',
    title: 'The First Year in Tech, Honestly',
    excerpt:
      'On comparisons, slow progress, and the small wins that do not fit on a résumé.',
    date: 'Oct 02, 2026',
    dateTime: '2026-10-02',
    readingTime: '4 min read',
    coverImage: careerCover,
    coverAlt:
      'A young developer working at her laptop in warm late-afternoon light',
    content: [
      'My first year in tech has been less of a straight line and more of a series of small, stubborn loops: learn something, break something, fix it, explain it to someone else, repeat.',
      'Comparison was the loudest distraction. Someone always seems to be further along — shipping faster, writing cleaner, speaking with more certainty. What helped was measuring against my own last month instead of someone else’s highlight reel.',
      'Progress rarely looks dramatic from the inside. It looks like reading an error message without panicking, naming a variable well the first time, or finally understanding why an effect runs twice. None of that fits neatly on a résumé, but all of it changes how I work.',
      'If you are in your first year too: keep a note of the things that used to confuse you. On the hard days, that list is better evidence of growth than any timeline. The work is slow because it is real.',
    ],
  },
]

export const BLOG_CATEGORIES: readonly string[] = Array.from(
  new Set(BLOG_POSTS.map((post) => post.category)),
)

export function getPostBySlug(slug: string | undefined): BlogPost | undefined {
  if (!slug) return undefined
  return BLOG_POSTS.find((post) => post.slug === slug)
}
