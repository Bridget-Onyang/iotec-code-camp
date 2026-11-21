const rawUrl = import.meta.env.VITE_CONVEX_URL as string | undefined

export const convexUrl =
  rawUrl && !rawUrl.includes('placeholder.convex.cloud') ? rawUrl : null

export const isConvexConfigured = convexUrl !== null
