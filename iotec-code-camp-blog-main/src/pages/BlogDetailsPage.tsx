import { useMemo, useState } from 'react'
import { ArrowLeft, Lock } from 'lucide-react'
import { BlogArticleHeader } from '@/components/blog/BlogArticleHeader'
import { BlogContent } from '@/components/blog/BlogContent'
import { BlogPaywallDialog } from '@/components/blog/BlogPaywallDialog'
import { Button } from '@/components/ui/button'
import { getAuthorizedBlogHtml, getBlogById, MOCK_BLOGS } from '@/data/mockBlogs'
import { useLocation, useNavigate } from '@/navigation/RouterContext'
import { PATHS } from '@/navigation/paths'

export function BlogDetailsPage() {
  const navigate = useNavigate()
  const { search } = useLocation()

  const [unlockedBlogIds, setUnlockedBlogIds] = useState<Record<string, boolean>>({})

  const activeBlog = useMemo(() => {
    const requestedId = new URLSearchParams(search).get('id')
    return requestedId ? getBlogById(requestedId) : MOCK_BLOGS[0]
  }, [search])

  if (!activeBlog) {
    return (
      <article className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-8 sm:py-12">
        <div className="mb-8">
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

  const isUnlocked = !activeBlog.isPaid || Boolean(unlockedBlogIds[activeBlog.id])

  const handleUnlock = () => {
    setUnlockedBlogIds((previous) => ({ ...previous, [activeBlog.id]: true }))
  }

  const handleRelockCurrentBlog = () => {
    setUnlockedBlogIds((previous) => ({ ...previous, [activeBlog.id]: false }))
  }

  return (
    <article className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-8 sm:py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
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

        {activeBlog.isPaid && isUnlocked && (
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

      <BlogArticleHeader blog={activeBlog} isUnlocked={isUnlocked} />

      <BlogContent
        html={getAuthorizedBlogHtml(activeBlog, isUnlocked)}
        isLocked={!isUnlocked}
      />

      {!isUnlocked && (
        <BlogPaywallDialog priceAmount={activeBlog.priceAmount} onUnlock={handleUnlock} />
      )}
    </article>
  )
}
