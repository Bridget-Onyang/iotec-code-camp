import { useId, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { useMutation } from 'convex/react'
import { ConvexError } from 'convex/values'
import { useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Underline } from '@tiptap/extension-underline'
import { Link, RichTextEditor } from '@editorcn/editor'
import '@editorcn/editor/style.css'
import { Loader2, Upload, X } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/components/ui/toaster'
import { blogsApi, type CreateBlogArgs } from '@/data/convexApi'
import type { BlogCategory } from '@/data/mockBlogs'
import { PROFILE } from '@/data/profile'
import { cn } from '@/lib/utils'
import { useNavigate } from '@/navigation/RouterContext'
import { PATHS } from '@/navigation/paths'

const CATEGORY_VALUES = ['Learning', 'Frontend', 'Career'] as const
const STATUS_VALUES = ['draft', 'published', 'archived'] as const
const ACCESS_VALUES = ['free', 'paid'] as const

type BlogStatus = (typeof STATUS_VALUES)[number]
type SubscriptionMode = (typeof ACCESS_VALUES)[number]

interface FormFields {
  title: string
  slug: string
  subtitle: string
  excerpt: string
  category: BlogCategory
  status: BlogStatus
  subscriptionMode: SubscriptionMode
  priceCurrency: string
  priceAmount: string
  tags: string
  coverAlt: string
  coverCaption: string
  coverUrl: string
}

type FieldErrors = Partial<Record<keyof FormFields | 'bodyHtml', string>>

const EMPTY_FIELDS: FormFields = {
  title: '',
  slug: '',
  subtitle: '',
  excerpt: '',
  category: 'Learning',
  status: 'draft',
  subscriptionMode: 'free',
  priceCurrency: 'UGX',
  priceAmount: '',
  tags: '',
  coverAlt: '',
  coverCaption: '',
  coverUrl: '',
}

const blogFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, 'Give the essay a title of at least 5 characters.')
      .max(140, 'Keep the title under 140 characters.'),
    slug: z
      .string()
      .trim()
      .min(3, 'The URL slug needs at least 3 characters.')
      .max(90, 'Keep the slug under 90 characters.')
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Use lowercase letters, numbers, and single hyphens only.',
      ),
    subtitle: z
      .string()
      .trim()
      .min(10, 'Write a subtitle of at least 10 characters.')
      .max(220, 'Keep the subtitle under 220 characters.'),
    excerpt: z
      .string()
      .trim()
      .min(20, 'Write a short excerpt (20 characters or more) for the card.')
      .max(400, 'Keep the excerpt under 400 characters.'),
    category: z.enum(CATEGORY_VALUES),
    status: z.enum(STATUS_VALUES),
    subscriptionMode: z.enum(ACCESS_VALUES),
    priceCurrency: z
      .string()
      .trim()
      .regex(/^[A-Za-z]{3}$/, 'Use a 3-letter currency code, e.g. UGX.'),
    priceAmount: z.string().trim(),
    tags: z.string().trim().max(240, 'Keep tags under 240 characters.'),
    coverAlt: z.string().trim().max(160, 'Keep the alt text under 160 characters.'),
    coverCaption: z
      .string()
      .trim()
      .max(200, 'Keep the caption under 200 characters.'),
    coverUrl: z.string().trim(),
    bodyHtml: z.string(),
    hasCoverFile: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (htmlToPlainText(value.bodyHtml).length < 160) {
      ctx.addIssue({
        code: 'custom',
        path: ['bodyHtml'],
        message: 'Write at least a short paragraph (160 characters or more).',
      })
    }

    if (value.subscriptionMode === 'paid') {
      const amount = Number(value.priceAmount)
      if (!value.priceAmount) {
        ctx.addIssue({
          code: 'custom',
          path: ['priceAmount'],
          message: 'Paid essays need a price.',
        })
      } else if (!Number.isFinite(amount) || amount <= 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['priceAmount'],
          message: 'Enter a price greater than zero.',
        })
      }
    }

    const hasCover = value.hasCoverFile || value.coverUrl.length > 0
    if (value.coverUrl && !value.hasCoverFile && !isValidUrl(value.coverUrl)) {
      ctx.addIssue({
        code: 'custom',
        path: ['coverUrl'],
        message: 'Enter a full image URL, e.g. https://example.com/cover.jpg',
      })
    }

    if (hasCover && value.coverAlt.length < 3) {
      ctx.addIssue({
        code: 'custom',
        path: ['coverAlt'],
        message: 'Describe the cover image for screen readers.',
      })
    }
  })

function htmlToPlainText(html: string): string {
  if (!html) return ''
  const document = new DOMParser().parseFromString(html, 'text/html')
  return (document.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}

function countWords(html: string): number {
  const text = htmlToPlainText(html)
  return text ? text.split(' ').filter(Boolean).length : 0
}

function formatReadTime(words: number): string {
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

function buildPreviewHtml(html: string): string {
  const container = document.createElement('div')
  container.innerHTML = html

  const selected: string[] = []
  let length = 0

  for (const block of Array.from(container.children)) {
    selected.push(block.outerHTML)
    length += block.textContent?.trim().length ?? 0
    if (length >= 280 || selected.length >= 2) break
  }

  return selected.join('') || `<p>${htmlToPlainText(html)}</p>`
}

function parseTags(value: string): string[] | undefined {
  const tags = value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 10)
  return tags.length > 0 ? tags : undefined
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const inputClassName =
  'mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground shadow-2xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30'

function fieldInputClass(hasError: boolean): string {
  return cn(inputClassName, hasError && 'border-red-300 ring-1 ring-red-200')
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-1.5 text-[11px] text-red-700">
      {message}
    </p>
  )
}

export function CreateBlogForm() {
  const navigate = useNavigate()
  const createBlog = useMutation(blogsApi.create)
  const generateCoverUploadUrl = useMutation(blogsApi.generateCoverUploadUrl)

  const slugId = useId()
  const priceAmountId = useId()
  const coverAltId = useId()

  const [fields, setFields] = useState<FormFields>(EMPTY_FIELDS)
  const [bodyHtml, setBodyHtml] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const wordCount = useMemo(() => countWords(bodyHtml), [bodyHtml])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      Link,
      Underline,
      Placeholder.configure({ placeholder: 'Write the essay here…' }),
    ],
    content: '<p></p>',
    onUpdate: ({ editor: instance }) => {
      setBodyHtml(instance.getHTML())
      setErrors((previous) =>
        previous.bodyHtml ? { ...previous, bodyHtml: undefined } : previous,
      )
    },
  })

  const updateField = <K extends keyof FormFields>(field: K, value: FormFields[K]) => {
    setFields((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => (previous[field] ? { ...previous, [field]: undefined } : previous))
  }

  const handleTitleChange = (value: string) => {
    setFields((previous) => ({
      ...previous,
      title: value,
      slug: slugTouched ? previous.slug : slugify(value),
    }))
    setErrors((previous) =>
      previous.title || previous.slug
        ? { ...previous, title: undefined, slug: undefined }
        : previous,
    )
  }

  const handleSlugChange = (value: string) => {
    setSlugTouched(true)
    updateField('slug', value)
  }

  const handleCoverFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setCoverFile(file)
    setErrors((previous) =>
      previous.coverAlt ? { ...previous, coverAlt: undefined } : previous,
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = blogFormSchema.safeParse({
      ...fields,
      bodyHtml,
      hasCoverFile: coverFile !== null,
    })

    if (!result.success) {
      const nextErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0]
        if (typeof key === 'string' && !nextErrors[key as keyof FieldErrors]) {
          nextErrors[key as keyof FieldErrors] = issue.message
        }
      }
      setErrors(nextErrors)
      toast.error('Check the highlighted fields', 'Some details still need attention before this essay can be saved.')
      return
    }

    const data = result.data
    setIsSubmitting(true)

    try {
      let coverImageStorageId: string | undefined

      if (coverFile) {
        const uploadUrl = await generateCoverUploadUrl({})
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': coverFile.type || 'application/octet-stream' },
          body: coverFile,
        })

        if (!response.ok) {
          throw new Error('The cover image upload failed. Please try again.')
        }

        const upload = (await response.json()) as { storageId?: string }
        if (!upload.storageId) {
          throw new Error('The cover image upload did not return a storage id.')
        }
        coverImageStorageId = upload.storageId
      }

      const author = { id: 'onyang-bridget', name: PROFILE.name, role: PROFILE.role }
      const currency = data.priceCurrency.toUpperCase()

      const args: CreateBlogArgs = {
        slug: data.slug,
        title: data.title,
        subtitle: data.subtitle,
        excerpt: data.excerpt,
        previewContentHtml: buildPreviewHtml(bodyHtml),
        fullContentHtml: bodyHtml,
        category: data.category,
        tags: parseTags(data.tags),
        readTime: formatReadTime(wordCount),
        wordCount,
        status: data.status,
        subscriptionMode: data.subscriptionMode,
        price:
          data.subscriptionMode === 'paid'
            ? { amount: Number(data.priceAmount), currency }
            : { amount: 0, currency },
        coverImageStorageId,
        coverImageUrl: !coverFile && data.coverUrl ? data.coverUrl : undefined,
        coverImageData: {
          alt: data.coverAlt || data.title,
          caption: data.coverCaption,
          fileName: coverFile?.name,
          fileSize: coverFile?.size,
        },
        author,
      }

      await createBlog(args)

      toast.success(
        data.status === 'published' ? 'Essay published' : 'Essay saved',
        data.status === 'published'
          ? `“${data.title}” is now live on the landing page.`
          : `“${data.title}” was saved as ${data.status}.`,
      )

      navigate(PATHS.ADMIN_BLOGS)
    } catch (error) {
      const message =
        error instanceof ConvexError
          ? String(error.data)
          : error instanceof Error
            ? error.message
            : 'Something went wrong while saving this essay.'
      toast.error('Could not save essay', message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
    >
      <div className="flex flex-col gap-6">
        <Card className="gap-0 rounded-xl border-border bg-white p-6">
          <h2 className="font-serif text-lg font-semibold tracking-tight text-foreground">
            Essay details
          </h2>

          <div className="mt-5 flex flex-col gap-4">
            <div>
              <label htmlFor="blog-title" className="text-xs font-medium text-foreground">
                Title
              </label>
              <input
                id="blog-title"
                type="text"
                value={fields.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="Learning in Public at Code Camp"
                aria-invalid={Boolean(errors.title)}
                className={fieldInputClass(Boolean(errors.title))}
              />
              <FieldError id="blog-title-error" message={errors.title} />
            </div>

            <div>
              <label htmlFor="blog-slug" className="text-xs font-medium text-foreground">
                URL slug
              </label>
              <input
                id="blog-slug"
                type="text"
                value={fields.slug}
                onChange={(event) => handleSlugChange(event.target.value)}
                placeholder="learning-in-public-at-code-camp"
                aria-invalid={Boolean(errors.slug)}
                aria-describedby={slugId}
                className={cn(fieldInputClass(Boolean(errors.slug)), 'font-mono text-xs')}
              />
              <p id={slugId} className="mt-1.5 text-[11px] text-muted-foreground">
                Appears as <span className="font-mono">/blog?id={fields.slug || 'your-slug'}</span>
              </p>
              <FieldError id="blog-slug-error" message={errors.slug} />
            </div>

            <div>
              <label htmlFor="blog-subtitle" className="text-xs font-medium text-foreground">
                Subtitle
              </label>
              <input
                id="blog-subtitle"
                type="text"
                value={fields.subtitle}
                onChange={(event) => updateField('subtitle', event.target.value)}
                placeholder="A one-line promise for what the reader will take away."
                aria-invalid={Boolean(errors.subtitle)}
                className={fieldInputClass(Boolean(errors.subtitle))}
              />
              <FieldError id="blog-subtitle-error" message={errors.subtitle} />
            </div>

            <div>
              <label htmlFor="blog-excerpt" className="text-xs font-medium text-foreground">
                Excerpt
              </label>
              <textarea
                id="blog-excerpt"
                value={fields.excerpt}
                onChange={(event) => updateField('excerpt', event.target.value)}
                rows={3}
                placeholder="The short summary shown on the landing page card."
                aria-invalid={Boolean(errors.excerpt)}
                className={cn(fieldInputClass(Boolean(errors.excerpt)), 'resize-y')}
              />
              <FieldError id="blog-excerpt-error" message={errors.excerpt} />
            </div>
          </div>
        </Card>

        <Card className="gap-0 rounded-xl border-border bg-white p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-serif text-lg font-semibold tracking-tight text-foreground">
              Essay body
            </h2>
            <span className="text-[11px] text-muted-foreground">
              {wordCount} {wordCount === 1 ? 'word' : 'words'} · {formatReadTime(wordCount)}
            </span>
          </div>

          <div className="mt-4">
            <RichTextEditor editor={editor}>
              <RichTextEditor.Toolbar sticky>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.Strikethrough />
                </RichTextEditor.ControlsGroup>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                  <RichTextEditor.BulletList />
                  <RichTextEditor.OrderedList />
                  <RichTextEditor.Blockquote />
                </RichTextEditor.ControlsGroup>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Link />
                  <RichTextEditor.Unlink />
                  <RichTextEditor.Hr />
                </RichTextEditor.ControlsGroup>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Undo />
                  <RichTextEditor.Redo />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>
              <RichTextEditor.Content className="min-h-[320px] px-4 py-3" />
            </RichTextEditor>
          </div>

          <FieldError id="blog-body-error" message={errors.bodyHtml} />
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="gap-0 rounded-xl border-border bg-white p-6">
          <h2 className="font-serif text-lg font-semibold tracking-tight text-foreground">
            Publishing
          </h2>

          <div className="mt-5 flex flex-col gap-4">
            <div>
              <label htmlFor="blog-category" className="text-xs font-medium text-foreground">
                Category
              </label>
              <select
                id="blog-category"
                value={fields.category}
                onChange={(event) => updateField('category', event.target.value as BlogCategory)}
                className={inputClassName}
              >
                {CATEGORY_VALUES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="blog-tags" className="text-xs font-medium text-foreground">
                Tags
              </label>
              <input
                id="blog-tags"
                type="text"
                value={fields.tags}
                onChange={(event) => updateField('tags', event.target.value)}
                placeholder="react, convex, code-camp"
                aria-invalid={Boolean(errors.tags)}
                className={fieldInputClass(Boolean(errors.tags))}
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">Separate tags with commas.</p>
              <FieldError id="blog-tags-error" message={errors.tags} />
            </div>

            <div>
              <label htmlFor="blog-status" className="text-xs font-medium text-foreground">
                Status
              </label>
              <select
                id="blog-status"
                value={fields.status}
                onChange={(event) => updateField('status', event.target.value as BlogStatus)}
                className={inputClassName}
              >
                {STATUS_VALUES.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Only published essays appear on the landing page.
              </p>
            </div>

            <fieldset>
              <legend className="text-xs font-medium text-foreground">Access</legend>
              <div className="mt-1.5 flex items-center gap-1 rounded-lg border border-border bg-card p-1">
                {ACCESS_VALUES.map((mode) => (
                  <Button
                    key={mode}
                    type="button"
                    variant={fields.subscriptionMode === mode ? 'default' : 'ghost'}
                    size="xs"
                    onClick={() => updateField('subscriptionMode', mode)}
                    aria-pressed={fields.subscriptionMode === mode}
                    className="h-7 flex-1 rounded-md text-xs font-medium capitalize"
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </fieldset>

            {fields.subscriptionMode === 'paid' && (
              <div className="grid grid-cols-[90px_minmax(0,1fr)] gap-3">
                <div>
                  <label htmlFor="blog-currency" className="text-xs font-medium text-foreground">
                    Currency
                  </label>
                  <input
                    id="blog-currency"
                    type="text"
                    value={fields.priceCurrency}
                    onChange={(event) => updateField('priceCurrency', event.target.value)}
                    aria-invalid={Boolean(errors.priceCurrency)}
                    className={cn(fieldInputClass(Boolean(errors.priceCurrency)), 'uppercase')}
                  />
                  <FieldError id="blog-currency-error" message={errors.priceCurrency} />
                </div>
                <div>
                  <label htmlFor="blog-price" className="text-xs font-medium text-foreground">
                    Price
                  </label>
                  <input
                    id="blog-price"
                    type="number"
                    min="1"
                    step="1"
                    value={fields.priceAmount}
                    onChange={(event) => updateField('priceAmount', event.target.value)}
                    placeholder="9500"
                    aria-invalid={Boolean(errors.priceAmount)}
                    aria-describedby={priceAmountId}
                    className={fieldInputClass(Boolean(errors.priceAmount))}
                  />
                  <p id={priceAmountId} className="mt-1.5 text-[11px] text-muted-foreground">
                    Shown on the card and in the paywall dialog.
                  </p>
                  <FieldError id="blog-price-error" message={errors.priceAmount} />
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="gap-0 rounded-xl border-border bg-white p-6">
          <h2 className="font-serif text-lg font-semibold tracking-tight text-foreground">
            Cover image
          </h2>

          <div className="mt-5 flex flex-col gap-4">
            <div>
              <label htmlFor="blog-cover-file" className="text-xs font-medium text-foreground">
                Upload
              </label>
              <label
                htmlFor="blog-cover-file"
                className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card px-3 py-4 text-xs text-muted-foreground transition hover:border-ring hover:text-foreground"
              >
                <Upload aria-hidden="true" className="size-3.5" />
                <span>Choose an image (JPG, PNG, WebP)</span>
              </label>
              <input
                id="blog-cover-file"
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="sr-only"
              />

              {coverFile && (
                <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-[11px]">
                  <span className="min-w-0 truncate text-foreground">{coverFile.name}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {formatFileSize(coverFile.size)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setCoverFile(null)}
                    aria-label="Remove selected cover image"
                  >
                    <X aria-hidden="true" className="size-3.5" />
                  </Button>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="blog-cover-url" className="text-xs font-medium text-foreground">
                …or paste an image URL
              </label>
              <input
                id="blog-cover-url"
                type="url"
                value={fields.coverUrl}
                onChange={(event) => updateField('coverUrl', event.target.value)}
                placeholder="https://example.com/cover.jpg"
                disabled={coverFile !== null}
                aria-invalid={Boolean(errors.coverUrl)}
                className={cn(
                  fieldInputClass(Boolean(errors.coverUrl)),
                  coverFile !== null && 'cursor-not-allowed opacity-60',
                )}
              />
              <FieldError id="blog-cover-url-error" message={errors.coverUrl} />
            </div>

            <div>
              <label htmlFor="blog-cover-alt" className="text-xs font-medium text-foreground">
                Alt text
              </label>
              <input
                id="blog-cover-alt"
                type="text"
                value={fields.coverAlt}
                onChange={(event) => updateField('coverAlt', event.target.value)}
                placeholder="Describe the image for screen readers"
                aria-invalid={Boolean(errors.coverAlt)}
                aria-describedby={coverAltId}
                className={fieldInputClass(Boolean(errors.coverAlt))}
              />
              <p id={coverAltId} className="mt-1.5 text-[11px] text-muted-foreground">
                Required when a cover is added. Falls back to the title if left blank.
              </p>
              <FieldError id="blog-cover-alt-error" message={errors.coverAlt} />
            </div>

            <div>
              <label htmlFor="blog-cover-caption" className="text-xs font-medium text-foreground">
                Caption
              </label>
              <input
                id="blog-cover-caption"
                type="text"
                value={fields.coverCaption}
                onChange={(event) => updateField('coverCaption', event.target.value)}
                placeholder="Code Camp workshop, Kampala — 2026"
                aria-invalid={Boolean(errors.coverCaption)}
                className={fieldInputClass(Boolean(errors.coverCaption))}
              />
              <FieldError id="blog-cover-caption-error" message={errors.coverCaption} />
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-9 w-full gap-2 text-xs font-medium"
          >
            {isSubmitting && <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />}
            <span>
              {isSubmitting
                ? 'Saving…'
                : fields.status === 'published'
                  ? 'Publish Essay'
                  : 'Save Essay'}
            </span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isSubmitting}
            onClick={() => navigate(PATHS.ADMIN_BLOGS)}
            className="h-8 text-xs font-medium"
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
