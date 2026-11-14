import learningCover from '@/assets/covers/learning-in-public.jpg'
import frontendCover from '@/assets/covers/interfaces-that-get-out-of-the-way.jpg'
import careerCover from '@/assets/covers/the-first-year-in-tech.jpg'

export type BlogCategory = 'Learning' | 'Frontend' | 'Career'

export interface BlogPost {
  id: string
  title: string
  subtitle: string
  excerpt: string
  category: BlogCategory
  badgeLabel: string
  date: string
  readTime: string
  isPaid: boolean
  priceLabel: string
  priceAmount: string
  imageUrl: string
  imageAlt: string
  imageCaption: string
  author: {
    name: string
    role: string
  }
  previewContentHtml: string
  fullContentHtml: string
}

const SHARED_AUTHOR = {
  name: 'Onyang Bridget',
  role: 'Software Developer & Writer · Founder of The Tech Report',
} as const

export const MOCK_BLOGS: readonly BlogPost[] = [
  {
    id: 'learning-in-public-at-code-camp',
    title: 'Learning in Public at Code Camp',
    subtitle:
      'What a room full of first commits taught me about asking better questions, shipping small, and growing in the open.',
    excerpt:
      'What a room full of first commits taught me about asking better questions, shipping small, and growing in the open.',
    category: 'Learning',
    badgeLabel: 'LEARNING & CRAFT',
    date: 'Nov 08, 2026',
    readTime: '5 min read',
    isPaid: false,
    priceLabel: 'Free read',
    priceAmount: '',
    imageUrl: learningCover,
    imageAlt: 'Students collaborating around a laptop at a community code camp workshop',
    imageCaption: 'Code Camp workshop, Kampala — 2026',
    author: SHARED_AUTHOR,
    previewContentHtml: `
      <p class="drop-cap">For a long time, I thought learning meant waiting until I had something finished and impressive to show. Code Camp quietly broke that habit. There is something clarifying about sitting in a room where everyone is mid-build, mid-bug, and mid-question at the same time.</p>
      <p>The first thing I learned was to ask smaller questions. Not “how do I become a great developer?” but “why is this component re-rendering?” Small questions have answers you can test before lunch.</p>
    `,
    fullContentHtml: `
      <p class="drop-cap">For a long time, I thought learning meant waiting until I had something finished and impressive to show. Code Camp quietly broke that habit. There is something clarifying about sitting in a room where everyone is mid-build, mid-bug, and mid-question at the same time.</p>
      <h2>Ask smaller questions</h2>
      <p>The first thing I learned was to ask smaller questions. Not “how do I become a great developer?” but “why is this component re-rendering?” Small questions have answers you can test before lunch. They compound faster than grand plans.</p>
      <blockquote>
        <p>“Small questions have answers you can test before lunch. They compound faster than grand plans.”</p>
        <cite>— NOTES FROM CODE CAMP, 2026</cite>
      </blockquote>
      <h2>Ship before you feel ready</h2>
      <p>The second was to ship before I felt ready. A deployed page with rough edges teaches more than a perfect folder that never leaves my laptop. Feedback is the real compiler: it tells you where the ideas fail, not just the syntax.</p>
      <ul>
        <li><strong>Deploy early:</strong> a live URL invites the kind of feedback a local build never will.</li>
        <li><strong>Keep the diff small:</strong> one idea per commit makes review and recovery calmer.</li>
        <li><strong>Ask in public:</strong> a half-formed question often unlocks someone else’s stuck moment too.</li>
      </ul>
      <h2>Company for the journey</h2>
      <p>Most of all, learning in public made the process less lonely. Sharing a broken build, a half-finished feature, or a note that says “I finally understand this” invites other people into the work. That is what Code Camp gave me — not just skills, but company for the journey.</p>
    `,
  },
  {
    id: 'interfaces-that-get-out-of-the-way',
    title: 'Interfaces That Get Out of the Way',
    subtitle:
      'Notes on restraint, typography, and building web experiences that feel calm instead of crowded.',
    excerpt:
      'Notes on restraint, typography, and building web experiences that feel calm instead of crowded.',
    category: 'Frontend',
    badgeLabel: 'FRONTEND & DESIGN',
    date: 'Oct 24, 2026',
    readTime: '6 min read',
    isPaid: false,
    priceLabel: 'Free read',
    priceAmount: '',
    imageUrl: frontendCover,
    imageAlt: 'A calm desk with a laptop showing a minimal web interface beside a window',
    imageCaption: 'A quiet workspace, and a page that does not compete for attention.',
    author: SHARED_AUTHOR,
    previewContentHtml: `
      <p class="drop-cap">The best interfaces I use rarely announce themselves. They give me a clear place to start, enough room to think, and a quiet way to undo my mistakes. Nothing competes for attention that has not earned it.</p>
      <p>I have started asking three questions before adding anything to a screen: does this help the person finish their task, does it explain something they already know, or does it solve a problem I imagined?</p>
    `,
    fullContentHtml: `
      <p class="drop-cap">The best interfaces I use rarely announce themselves. They give me a clear place to start, enough room to think, and a quiet way to undo my mistakes. Nothing competes for attention that has not earned it.</p>
      <h2>Three questions before adding anything</h2>
      <p>I have started asking three questions before adding anything to a screen:</p>
      <ol>
        <li>Does this help the person finish their task?</li>
        <li>Does it explain something they already know?</li>
        <li>Does it solve a problem I imagined rather than one they have?</li>
      </ol>
      <p>Most new elements fail at least one of those questions.</p>
      <blockquote>
        <p>“Restraint is not the absence of design; it is design doing fewer things with more intention.”</p>
        <cite>— ON QUIET INTERFACES</cite>
      </blockquote>
      <h2>Typography carries the experience</h2>
      <p>Typography carries more of the experience than decoration does. Generous line height, a restrained palette, and one confident serif for headings can make a plain page feel considered.</p>
      <h2>Calm interfaces, calm code</h2>
      <p>The same idea applies to code. A small component with obvious props is kinder to future me than a clever abstraction that saves six lines and costs an afternoon. Calm interfaces are usually built on calm code.</p>
    `,
  },
  {
    id: 'the-first-year-in-tech-honestly',
    title: 'The First Year in Tech, Honestly',
    subtitle:
      'On comparisons, slow progress, and the small wins that do not fit on a résumé.',
    excerpt:
      'On comparisons, slow progress, and the small wins that do not fit on a résumé.',
    category: 'Career',
    badgeLabel: 'CAREER & GROWTH',
    date: 'Oct 02, 2026',
    readTime: '4 min read',
    isPaid: false,
    priceLabel: 'Free read',
    priceAmount: '',
    imageUrl: careerCover,
    imageAlt: 'A young developer working at her laptop in warm late-afternoon light',
    imageCaption: 'Late-afternoon focus — the part of the work that never makes the highlight reel.',
    author: SHARED_AUTHOR,
    previewContentHtml: `
      <p class="drop-cap">My first year in tech has been less of a straight line and more of a series of small, stubborn loops: learn something, break something, fix it, explain it to someone else, repeat.</p>
      <p>Comparison was the loudest distraction. Someone always seems to be further along — shipping faster, writing cleaner, speaking with more certainty.</p>
    `,
    fullContentHtml: `
      <p class="drop-cap">My first year in tech has been less of a straight line and more of a series of small, stubborn loops: learn something, break something, fix it, explain it to someone else, repeat.</p>
      <h2>Comparison is the loudest distraction</h2>
      <p>Someone always seems to be further along — shipping faster, writing cleaner, speaking with more certainty. What helped was measuring against my own last month instead of someone else’s highlight reel.</p>
      <h2>Progress rarely looks dramatic from the inside</h2>
      <p>It looks like:</p>
      <ul>
        <li>reading an error message without panicking,</li>
        <li>naming a variable well the first time,</li>
        <li>finally understanding why an effect runs twice.</li>
      </ul>
      <p>None of that fits neatly on a résumé, but all of it changes how I work.</p>
      <blockquote>
        <p>“The work is slow because it is real.”</p>
        <cite>— NOTES TO MYSELF, YEAR ONE</cite>
      </blockquote>
      <h2>Keep a list</h2>
      <p>If you are in your first year too: keep a note of the things that used to confuse you. On the hard days, that list is better evidence of growth than any timeline.</p>
    `,
  },
]

export type BlogPostPreview = BlogPost

export const BLOG_CATEGORIES: readonly BlogCategory[] = Array.from(
  new Set(MOCK_BLOGS.map((blog) => blog.category)),
)

export function getBlogById(id: string | undefined): BlogPost | undefined {
  if (!id) return undefined
  return MOCK_BLOGS.find((blog) => blog.id === id)
}

export function getAuthorizedBlogHtml(blog: BlogPost, isUnlocked: boolean): string {
  if (blog.isPaid && !isUnlocked) {
    return blog.previewContentHtml
  }
  return blog.fullContentHtml
}
