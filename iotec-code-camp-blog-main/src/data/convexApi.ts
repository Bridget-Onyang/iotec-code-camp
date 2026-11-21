import { makeFunctionReference } from 'convex/server'
import type { BlogCategory } from '@/data/mockBlogs'

export interface RemoteBlogCoverData {
  alt: string
  caption: string
  fileName?: string
  fileSize?: number
  dimensions?: string
}

export interface RemoteBlogDoc {
  _id: string
  slug: string
  title: string
  subtitle: string
  excerpt: string
  previewContentHtml: string
  fullContentHtml: string
  category: BlogCategory
  tags?: string[]
  readTime: string
  wordCount: number
  status: 'draft' | 'published' | 'archived'
  subscriptionMode: 'free' | 'paid'
  price: { amount: number; currency: string }
  coverImageStorageId?: string
  coverImageUrl?: string | null
  coverImageData: RemoteBlogCoverData
  author?: { id: string; name: string; role: string }
  updatedAt: number
}

export type CreateBlogArgs = {
  slug: string
  title: string
  subtitle: string
  excerpt: string
  previewContentHtml: string
  fullContentHtml: string
  category: BlogCategory
  tags?: string[]
  readTime: string
  wordCount: number
  status: 'draft' | 'published' | 'archived'
  subscriptionMode: 'free' | 'paid'
  price: { amount: number; currency: string }
  coverImageStorageId?: string
  coverImageUrl?: string
  coverImageData: RemoteBlogCoverData
  author?: { id: string; name: string; role: string }
}

export const blogsApi = {
  listPublished: makeFunctionReference<'query', Record<string, never>, RemoteBlogDoc[]>(
    'blogs:listPublished',
  ),
  getBySlug: makeFunctionReference<'query', { slug: string }, RemoteBlogDoc | null>(
    'blogs:getBySlug',
  ),
  listAll: makeFunctionReference<'query', Record<string, never>, RemoteBlogDoc[]>('blogs:listAll'),
  create: makeFunctionReference<'mutation', CreateBlogArgs, { id: string; slug: string }>(
    'blogs:create',
  ),
  generateCoverUploadUrl: makeFunctionReference<'mutation', Record<string, never>, string>(
    'blogs:generateCoverUploadUrl',
  ),
}
