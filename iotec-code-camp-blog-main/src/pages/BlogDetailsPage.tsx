import { useMemo, useState } from 'react'
import { useQuery } from 'convex/react'
import { ArrowLeft, Lock } from 'lucide-react'
import { BlogArticleHeader } from '@/components/blog/BlogArticleHeader'
import { BlogContent } from '@/components/blog/BlogContent'
import { BlogPaywallDialog } from '@/components/blog/BlogPaywallDialog'
import { Button } from '@/components/ui/button'
import { mapRemoteBlog } from '@/data/blogMapper'
import { blogsApi } from '@/data/convexApi'
import {
  getAuthorizedBlogHtml,
  getBlogById,
  MOCK_BLOGS,
  type BlogPost,
} from '@/data/mockBlogs'
import { isConvexConfigured } from '@/lib/convex'
import { useLocation, useNavigate } from '@/navigation/RouterContext'
import { PATHS } from '@/navigation/paths'

function BackToLandingButton() {
  const navigate = useNavigate()

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => navigate(PATHS.LANDING)}
      className="bg-white px-3.5 py-1.5 text-xs font-medium shadow-2xs"
    >
      <ArrowLeft aria-hidden="true" className="size-3.5 text-muted-foreground" />
      <span>Back to Landing</span>
    </Button>
  )
}

function ArticleNotFound() {
  return (
    <article className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-8 sm:py-12">
      <div className="mb-8">
        <BackToLandingButton />
      </div>

      <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
        Article not found
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        The essay you are looking for may have moved. Head back to the journal to keep
        reading.
      </p>
    </article>
  )
}

function ArticleLoading() {
  return (
    <article className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-8 sm:py-12">
      <div className="mb-8">
        <BackToLandingButton />
      </div>
      <p className="text-sm text-muted-foreground">Loading essay…</p>
    </article>
  )
}

function BlogArticleScreen({ blog }: { blog: BlogPost }) {
  const [unlockedBlogIds, setUnlockedBlogIds] = useState<Record<string, boolean>>({})

  const isUnlocked = !blog.isPaid || Boolean(unlockedBlogIds[blog.id])

  const handleUnlock = () => {
    setUnlockedBlogIds((previous) => ({ ...previous, [blog.id]: true }))
  }

  const handleRelockCurrentBlog = () => {
    setUnlockedBlogIds((previous) => ({ ...previous, [blog.id]: false }))
  }

  return (
    <article className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-8 sm:py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <BackToLandingButton />

        {blog.isPaid && isUnlocked && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleRelockCurrentBlog}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Lock aria-hidden="true" className="size-3" />
            <span>Lock Paywall Preview</span>
          </Button>
        )}
      </div>

      <BlogArticleHeader blog={blog} isUnlocked={isUnlocked} />

      <BlogContent
        html={getAuthorizedBlogHtml(blog, isUnlocked)}
        isLocked={!isUnlocked}
      />

      {!isUnlocked && (
        <BlogPaywallDialog priceAmount={blog.priceAmount} onUnlock={handleUnlock} />
      )}
    </article>
  )
}

function LocalBlogArticle({ slug }: { slug: string | null }) {
  const blog = useMemo(
    () => (slug ? getBlogById(slug) : MOCK_BLOGS[0]),
    [slug],
  )

  if (!blog) return <ArticleNotFound />
  return <BlogArticleScreen blog={blog} />
}

function RemoteBlogArticle({ slug }: { slug: string | null }) {
  const doc = useQuery(blogsApi.getBySlug, slug ? { slug } : 'skip')

  if (!slug) return <ArticleNotFound />
  if (doc === undefined) return <ArticleLoading />
  if (doc === null) return <ArticleNotFound />

  return <BlogArticleScreen blog={mapRemoteBlog(doc)} />
}

export function BlogDetailsPage() {
  const { search } = useLocation()
  const slug = new URLSearchParams(search).get('id')

  if (isConvexConfigured) {
    return <RemoteBlogArticle slug={slug} />
  }

  return <LocalBlogArticle slug={slug} />
}
