import { ArrowLeft } from 'lucide-react'
import { CreateBlogForm } from '@/components/admin/CreateBlogForm'
import { isConvexConfigured } from '@/lib/convex'
import { Link } from '@/navigation/RouterContext'
import { PATHS } from '@/navigation/paths'

function ConvexSetupNotice() {
  return (
    <div className="mt-8 rounded-xl border border-amber-200/80 bg-amber-50/70 px-5 py-4 text-sm text-amber-900">
      <p className="font-medium">Connect Convex before writing.</p>
      <p className="mt-1 text-xs leading-relaxed text-amber-800">
        Run <code className="rounded bg-white/70 px-1 py-0.5">npx convex dev</code> in
        <code className="ml-1 rounded bg-white/70 px-1 py-0.5">iotec-code-camp-blog-main</code>
        to create a deployment. That writes a real{' '}
        <code className="rounded bg-white/70 px-1 py-0.5">VITE_CONVEX_URL</code>, and this form
        will save essays to the <code className="rounded bg-white/70 px-1 py-0.5">blogs</code>{' '}
        table.
      </p>
    </div>
  )
}

export function AdminCreateBlogPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Link
        to={PATHS.ADMIN_BLOGS}
        className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        <span>Back to articles</span>
      </Link>

      <div className="mt-4">
        <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
          Create New Blog
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Draft an essay, choose who can read it, and publish it straight to the landing page.
        </p>
      </div>

      {isConvexConfigured ? <CreateBlogForm /> : <ConvexSetupNotice />}
    </div>
  )
}
