import { FileText, ReceiptText, Users, type LucideIcon } from 'lucide-react'

export const PATHS = {
  LANDING: '/',
  ADMIN: '/admin',
  ADMIN_BLOGS: '/admin/blogs',
  ADMIN_TRANSACTIONS: '/admin/transactions',
  ADMIN_USERS: '/admin/users',
} as const

export type AppPath = (typeof PATHS)[keyof typeof PATHS]

export type BlogPostPath = `/blog/${string}`

export type RoutePath = AppPath | BlogPostPath

export function blogPostPath(slug: string): BlogPostPath {
  return `/blog/${encodeURIComponent(slug)}`
}

export interface AdminNavItem {
  label: string
  path: AppPath
  icon: LucideIcon
}

export const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  {
    label: 'Blogs',
    path: PATHS.ADMIN_BLOGS,
    icon: FileText,
  },
  {
    label: 'Transactions',
    path: PATHS.ADMIN_TRANSACTIONS,
    icon: ReceiptText,
  },
  {
    label: 'Users',
    path: PATHS.ADMIN_USERS,
    icon: Users,
  },
] as const
