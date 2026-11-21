import fallbackCover from '@/assets/covers/learning-in-public.jpg'
import type { BlogPost } from '@/data/mockBlogs'
import type { RemoteBlogDoc } from '@/data/convexApi'
import { PROFILE } from '@/data/profile'

const BADGE_BY_CATEGORY: Record<RemoteBlogDoc['category'], string> = {
  Learning: 'LEARNING & CRAFT',
  Frontend: 'FRONTEND & DESIGN',
  Career: 'CAREER & GROWTH',
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

export function mapRemoteBlog(doc: RemoteBlogDoc): BlogPost {
  const isPaid = doc.subscriptionMode === 'paid'

  return {
    id: doc.slug,
    title: doc.title,
    subtitle: doc.subtitle,
    excerpt: doc.excerpt,
    category: doc.category,
    badgeLabel: BADGE_BY_CATEGORY[doc.category],
    date: formatDate(doc.updatedAt),
    readTime: doc.readTime,
    isPaid,
    priceLabel: isPaid ? 'Supporter essay' : 'Free read',
    priceAmount: isPaid
      ? `${doc.price.currency} ${doc.price.amount.toLocaleString('en-US')}`
      : '',
    imageUrl: doc.coverImageUrl || fallbackCover,
    imageAlt: doc.coverImageData.alt || doc.title,
    imageCaption: doc.coverImageData.caption,
    author: doc.author
      ? { name: doc.author.name, role: doc.author.role }
      : { name: PROFILE.name, role: PROFILE.role },
    previewContentHtml: doc.previewContentHtml,
    fullContentHtml: doc.fullContentHtml,
  }
}
