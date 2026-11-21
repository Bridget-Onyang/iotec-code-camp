import { useQuery } from 'convex/react'
import { HeroSection } from '@/components/HeroSection'
import { RecentBlogsSection } from '@/components/RecentBlogsSection'
import { mapRemoteBlog } from '@/data/blogMapper'
import { blogsApi } from '@/data/convexApi'
import { MOCK_BLOGS } from '@/data/mockBlogs'
import { isConvexConfigured } from '@/lib/convex'

function RemoteRecentBlogs() {
  const docs = useQuery(blogsApi.listPublished)

  if (docs === undefined) {
    return (
      <section className="border-t border-border py-12 sm:py-16">
        <p className="text-sm text-muted-foreground">Loading essays…</p>
      </section>
    )
  }

  return <RecentBlogsSection blogs={docs.map(mapRemoteBlog)} />
}

export function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <HeroSection />
      {isConvexConfigured ? (
        <RemoteRecentBlogs />
      ) : (
        <RecentBlogsSection blogs={MOCK_BLOGS} />
      )}
    </div>
  )
}
