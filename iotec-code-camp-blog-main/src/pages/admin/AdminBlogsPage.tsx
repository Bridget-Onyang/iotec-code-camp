import { useQuery } from 'convex/react'
import { Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { blogsApi } from '@/data/convexApi'
import { isConvexConfigured } from '@/lib/convex'
import { cn } from '@/lib/utils'
import { Link } from '@/navigation/RouterContext'
import { PATHS } from '@/navigation/paths'

function formatUpdatedAt(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

function ConvexSetupNotice() {
  return (
    <div className="mt-8 rounded-xl border border-amber-200/80 bg-amber-50/70 px-5 py-4 text-sm text-amber-900">
      <p className="font-medium">Convex is not configured yet.</p>
      <p className="mt-1 text-xs leading-relaxed text-amber-800">
        Run <code className="rounded bg-white/70 px-1 py-0.5">npx convex dev</code> in
        <code className="ml-1 rounded bg-white/70 px-1 py-0.5">iotec-code-camp-blog-main</code>
        to create a deployment. That writes a real{' '}
        <code className="rounded bg-white/70 px-1 py-0.5">VITE_CONVEX_URL</code> and unlocks this
        page.
      </p>
    </div>
  )
}

function BlogsTable() {
  const blogs = useQuery(blogsApi.listAll)

  if (blogs === undefined) {
    return <p className="mt-8 text-sm text-muted-foreground">Loading blogs…</p>
  }

  if (blogs.length === 0) {
    return (
      <div className="my-auto py-16">
        <p className="text-sm text-muted-foreground">
          No blogs yet. Click <span className="font-medium text-foreground">Create New Blog</span>{' '}
          to write your first essay.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-border bg-white">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-card/70 text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Access</th>
            <th className="px-4 py-3 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id} className="border-t border-border/70">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{blog.title}</p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  /blog?id={blog.slug}
                </p>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{blog.category}</td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full border border-border bg-card px-2.5 py-0.5 text-[10px] font-medium capitalize text-muted-foreground">
                  {blog.status}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {blog.subscriptionMode === 'paid'
                  ? `${blog.price.currency} ${blog.price.amount.toLocaleString('en-US')}`
                  : 'Free'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatUpdatedAt(blog.updatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function AdminBlogsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
            Articles &amp; Essays
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Draft, publish, and manage everything that appears in the journal.
          </p>
        </div>

        <Link
          to={PATHS.ADMIN_BLOG_CREATE}
          className={cn(
            buttonVariants(),
            'self-start px-4 py-2 text-xs font-medium shadow-2xs sm:self-auto',
          )}
        >
          <Plus aria-hidden="true" className="size-3.5" />
          <span>Create New Blog</span>
        </Link>
      </div>

      {isConvexConfigured ? <BlogsTable /> : <ConvexSetupNotice />}
    </div>
  )
}
