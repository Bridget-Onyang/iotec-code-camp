import { ArrowLeft, ArrowRight, CalendarDays, Clock } from 'lucide-react'
import profilePhoto from '@/assets/onyang-bridget.jpg'
import { BlogCard } from '@/components/BlogCard'
import { buttonVariants } from '@/components/ui/button'
import { PROFILE } from '@/data/profile'
import { BLOG_POSTS, getPostBySlug } from '@/data/posts'
import { cn } from '@/lib/utils'
import { Link } from '@/navigation/RouterContext'
import { PATHS } from '@/navigation/paths'
import type { RouteProps } from '@/navigation/routes'

function BackToJournalLink() {
  return (
    <Link
      to={PATHS.LANDING}
      className={cn(
        buttonVariants({ variant: 'outline', size: 'sm' }),
        'px-3.5 text-xs font-medium shadow-2xs',
      )}
    >
      <ArrowLeft aria-hidden="true" className="size-3.5 text-muted-foreground" />
      <span>Back to journal</span>
    </Link>
  )
}

export function BlogDetailsPage({ params }: RouteProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return (
      <div className="flex flex-1 flex-col items-start py-12">
        <BackToJournalLink />
        <div className="my-auto py-16">
          <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
            Article not found
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            The essay you are looking for may have moved. Head back to the journal to keep
            reading.
          </p>
        </div>
      </div>
    )
  }

  const relatedPosts = BLOG_POSTS.filter((entry) => entry.slug !== post.slug).slice(0, 2)

  return (
    <article className="py-10 lg:py-12">
      <BackToJournalLink />

      <header className="mx-auto mt-10 max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
          Issue {post.issue} &middot; {post.category}
        </p>
        <h1 className="mt-4 font-serif text-3xl leading-[1.12] font-normal tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" className="size-3.5" />
            <time dateTime={post.dateTime}>{post.date}</time>
          </span>
          <span aria-hidden="true">&middot;</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden="true" className="size-3.5" />
            {post.readingTime}
          </span>
          <span aria-hidden="true">&middot;</span>
          <span>By {PROFILE.name}</span>
        </div>
      </header>

      <figure className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-border/60 bg-muted">
        <img
          src={post.coverImage}
          alt={post.coverAlt}
          className="aspect-[16/7] w-full object-cover"
        />
      </figure>

      <div className="mx-auto mt-10 max-w-2xl space-y-5 text-[15px] leading-7 text-foreground/85">
        {post.content.map((paragraph, index) => (
          <p
            key={paragraph}
            className={
              index === 0
                ? 'first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-5xl first-letter:leading-none first-letter:text-foreground'
                : undefined
            }
          >
            {paragraph}
          </p>
        ))}
      </div>

      <aside className="mx-auto mt-14 flex max-w-2xl flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:gap-5">
        <img
          src={profilePhoto}
          alt={PROFILE.photoAlt}
          className="size-16 shrink-0 rounded-full border border-border object-cover object-[center_22%]"
        />
        <div>
          <p className="font-serif text-lg leading-tight font-medium tracking-tight text-foreground">
            {PROFILE.name}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{PROFILE.role}</p>
          <Link
            to={PATHS.LANDING}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            More about me
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </aside>

      {relatedPosts.length > 0 && (
        <section aria-labelledby="keep-reading-heading" className="mt-16 border-t border-border pt-10">
          <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
            The Tech Report Archive
          </p>
          <h2
            id="keep-reading-heading"
            className="mt-2 font-serif text-2xl font-normal tracking-tight text-foreground"
          >
            Keep reading
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {relatedPosts.map((entry) => (
              <BlogCard key={entry.slug} post={entry} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
