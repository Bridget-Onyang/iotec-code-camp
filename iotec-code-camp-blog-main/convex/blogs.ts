import { ConvexError, v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import {
  blogCategoryValidator,
  blogStatusValidator,
  subscriptionModeValidator,
} from "./schema";

const MAX_PUBLIC_BLOGS = 50;
const MAX_ADMIN_BLOGS = 100;

async function resolveCoverUrl<T extends { coverImageStorageId?: string; coverImageUrl?: string }>(
  ctx: QueryCtx | MutationCtx,
  blog: T,
) {
  if (blog.coverImageUrl || !blog.coverImageStorageId) {
    return { ...blog, coverImageUrl: blog.coverImageUrl ?? null };
  }

  const url = await ctx.storage.getUrl(blog.coverImageStorageId as never);
  return { ...blog, coverImageUrl: url };
}

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_status_and_updatedAt", (q) => q.eq("status", "published"))
      .order("desc")
      .take(MAX_PUBLIC_BLOGS);

    return await Promise.all(blogs.map((blog) => resolveCoverUrl(ctx, blog)));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const blog = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!blog || blog.status !== "published") {
      return null;
    }

    return await resolveCoverUrl(ctx, blog);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const blogs = await ctx.db
      .query("blogs")
      .order("desc")
      .take(MAX_ADMIN_BLOGS);

    return await Promise.all(blogs.map((blog) => resolveCoverUrl(ctx, blog)));
  },
});

export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    subtitle: v.string(),
    excerpt: v.string(),
    previewContentHtml: v.string(),
    fullContentHtml: v.string(),
    category: blogCategoryValidator,
    tags: v.optional(v.array(v.string())),
    readTime: v.string(),
    wordCount: v.number(),
    status: blogStatusValidator,
    subscriptionMode: subscriptionModeValidator,
    price: v.object({
      amount: v.number(),
      currency: v.string(),
    }),
    coverImageStorageId: v.optional(v.id("_storage")),
    coverImageUrl: v.optional(v.string()),
    coverImageData: v.object({
      alt: v.string(),
      caption: v.string(),
      fileName: v.optional(v.string()),
      fileSize: v.optional(v.number()),
      dimensions: v.optional(v.string()),
    }),
    author: v.optional(
      v.object({
        id: v.string(),
        name: v.string(),
        role: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const slug = args.slug.trim().toLowerCase();

    const existing = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (existing) {
      throw new ConvexError("A blog with this slug already exists. Choose a different one.");
    }

    const id = await ctx.db.insert("blogs", {
      ...args,
      slug,
      updatedAt: Date.now(),
    });

    return { id, slug };
  },
});

export const generateCoverUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
