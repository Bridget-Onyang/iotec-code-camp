import { ArrowRight, CalendarDays, Clock } from 'lucide-react'
import { Link } from '@/navigation/RouterContext'
import { blogPostPath } from '@/navigation/paths'
import type { BlogPost } from '@/data/posts'

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={blogPostPath(post.slug)}
      aria-label={`Read article: ${post.title}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_24px_45px_-30px_rgba(28,25,23,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={post.coverImage}
          alt={post.coverAlt}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute top-3 right-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] text-foreground uppercase backdrop-blur-sm">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
          <CalendarDays aria-hidden="true" className="size-3.5" />
          <time dateTime={post.dateTime}>{post.date}</time>
          <span aria-hidden="true">&middot;</span>
          <Clock aria-hidden="true" className="size-3.5" />
          <span>{post.readingTime}</span>
        </div>

        <h3 className="mt-3 font-serif text-xl leading-snug font-medium tracking-tight text-foreground">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-medium text-primary">
          Read article
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  )
}
