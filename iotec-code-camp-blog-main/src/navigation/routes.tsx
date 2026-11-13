import { useEffect, type ComponentType } from 'react'
import { PublicLayout } from '../layouts/PublicLayout'
import { AdminLayout } from '../layouts/AdminLayout'
import { LandingPage } from '../pages/LandingPage'
import { BlogDetailsPage } from '../pages/BlogDetailsPage'
import { AdminBlogsPage } from '../pages/admin/AdminBlogsPage'
import { AdminTransactionsPage } from '../pages/admin/AdminTransactionsPage'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage'
import { getPostBySlug } from '../data/posts'
import { useLocation, useNavigate } from './RouterContext'
import { PATHS, type RoutePath } from './paths'

export type RouteLayout = 'public' | 'admin'

export type RouteParams = Record<string, string>

export interface RouteProps {
  params: RouteParams
}

export interface RouteConfig {
  pattern: string
  title: string | ((params: RouteParams) => string)
  layout: RouteLayout
  component?: ComponentType<RouteProps>
  redirectTo?: RoutePath
}

function matchRoute(pattern: string, pathname: string): RouteParams | null {
  const patternSegments = pattern.split('/').filter(Boolean)
  const pathSegments = pathname.split('/').filter(Boolean)

  if (patternSegments.length !== pathSegments.length) return null

  const params: RouteParams = {}

  for (let index = 0; index < patternSegments.length; index += 1) {
    const segment = patternSegments[index]

    if (segment.startsWith(':')) {
      params[segment.slice(1)] = decodeURIComponent(pathSegments[index])
    } else if (segment !== pathSegments[index]) {
      return null
    }
  }

  return params
}

function findRoute(pathname: string) {
  for (const route of ROUTES) {
    const params = matchRoute(route.pattern, pathname)
    if (params) return { route, params }
  }
  return null
}

export const ROUTES: readonly RouteConfig[] = [
  {
    pattern: PATHS.LANDING,
    title: 'The Tech Report — Writing by Onyang Bridget',
    layout: 'public',
    component: LandingPage,
  },
  {
    pattern: '/blog/:slug',
    title: ({ slug }) => {
      const post = getPostBySlug(slug)
      return post ? `${post.title} — Onyang Bridget` : 'Article not found — The Tech Report'
    },
    layout: 'public',
    component: BlogDetailsPage,
  },
  {
    pattern: PATHS.ADMIN,
    title: 'Articles & Essays | Admin Dashboard — The Tech Report',
    layout: 'admin',
    redirectTo: PATHS.ADMIN_BLOGS,
  },
  {
    pattern: PATHS.ADMIN_BLOGS,
    title: 'Articles & Essays | Admin Dashboard — The Tech Report',
    layout: 'admin',
    component: AdminBlogsPage,
  },
  {
    pattern: PATHS.ADMIN_TRANSACTIONS,
    title: 'Transactions | Admin Dashboard — The Tech Report',
    layout: 'admin',
    component: AdminTransactionsPage,
  },
  {
    pattern: PATHS.ADMIN_USERS,
    title: 'Users | Admin Dashboard — The Tech Report',
    layout: 'admin',
    component: AdminUsersPage,
  },
] as const

const DEFAULT_ROUTE = ROUTES[0]

export function AppRouter() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const match = findRoute(pathname)
  const matchedRoute = match?.route ?? DEFAULT_ROUTE
  const params = match?.params ?? {}

  const pageTitle =
    typeof matchedRoute.title === 'function'
      ? matchedRoute.title(params)
      : matchedRoute.title

  useEffect(() => {
    if (matchedRoute.redirectTo) {
      navigate(matchedRoute.redirectTo, { replace: true })
      return
    }

    document.title = pageTitle
  }, [matchedRoute.redirectTo, pageTitle, navigate])

  const redirectMatch = matchedRoute.redirectTo
    ? findRoute(matchedRoute.redirectTo)
    : null
  const resolvedRoute = redirectMatch?.route ?? matchedRoute
  const PageComponent = resolvedRoute.component ?? LandingPage
  const pageParams = redirectMatch?.params ?? params

  if (resolvedRoute.layout === 'admin') {
    return (
      <AdminLayout>
        <PageComponent params={pageParams} />
      </AdminLayout>
    )
  }

  return (
    <PublicLayout>
      <PageComponent params={pageParams} />
    </PublicLayout>
  )
}
