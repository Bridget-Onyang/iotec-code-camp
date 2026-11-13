import { useMemo, useState } from 'react'
import { BlogCard } from '@/components/BlogCard'
import { Button } from '@/components/ui/button'
import { HeroSection } from '@/components/HeroSection'
import { BLOG_CATEGORIES, BLOG_POSTS } from '@/data/posts'

const ALL_CATEGORIES = 'All'

export function LandingPage() {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES)

  const visiblePosts = useMemo(
    () =>
      activeCategory === ALL_CATEGORIES
        ? BLOG_POSTS
        : BLOG_POSTS.filter((post) => post.category === activeCategory),
    [activeCategory],
  )

  return (
    <>
      <HeroSection />

      <section aria-labelledby="recent-blogs-heading" className="py-12 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
              The Tech Report Archive
            </p>
            <h2
              id="recent-blogs-heading"
              className="mt-2 font-serif text-3xl font-normal tracking-tight text-foreground"
            >
              Recent Blogs
            </h2>
          </div>

          <div
            role="group"
            aria-label="Filter articles by category"
            className="flex flex-wrap gap-1.5"
          >
            {[ALL_CATEGORIES, ...BLOG_CATEGORIES].map((category) => (
              <Button
                key={category}
                type="button"
                size="xs"
                variant={activeCategory === category ? 'default' : 'outline'}
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                className="h-7 rounded-full px-3 text-[11px] font-medium"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </>
  )
}
