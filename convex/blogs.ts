import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// List blogs with pagination and enrichment
export const list = query({
  args: {
    category: v.optional(v.string()),
    status: v.optional(v.string()),
    language: v.optional(v.string()),
    author: v.optional(v.string()),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    sortBy: v.optional(v.union(v.literal("newest"), v.literal("oldest"), v.literal("popular"))),
  },
  handler: async (ctx, args) => {
    const page = args.page ?? 1;
    const limit = args.limit ?? 12;
    const sortBy = args.sortBy ?? "newest";

    let query;
    if (args.status) {
      query = ctx.db.query("blogs").withIndex("by_status", (q) => q.eq("status", args.status as any));
    } else {
      // Default to published for listing
      query = ctx.db.query("blogs").withIndex("by_status", (q) => q.eq("status", "published"));
    }

    let blogs = await query.collect();

    // Apply filters
    if (args.status) {
      blogs = blogs.filter((b) => b.status === args.status);
    }
    if (args.category) {
      blogs = blogs.filter((b) => b.category === args.category);
    }
    if (args.language) {
      blogs = blogs.filter((b) => b.language === args.language);
    }
    if (args.author) {
      blogs = blogs.filter((b) => b.author.toString() === args.author);
    }

    // Only show published blogs for public listing
    if (!args.status || args.status !== "draft") {
      blogs = blogs.filter((b) => b.status === "published");
    }

    // Sort
    if (sortBy === "newest") {
      blogs.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
    } else if (sortBy === "oldest") {
      blogs.sort((a, b) => (a.publishedAt || 0) - (b.publishedAt || 0));
    } else if (sortBy === "popular") {
      blogs.sort((a, b) => b.viewCount - a.viewCount);
    }

    // Enrich with author data
    const enrichedBlogs = await Promise.all(
      blogs.map(async (blog) => {
        const author = await ctx.db.get(blog.author);
        return {
          ...blog,
          authorName: author?.name ?? "Unknown",
          authorPhoto: author?.profilePhoto,
        };
      })
    );

    // Paginate
    const total = enrichedBlogs.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBlogs = enrichedBlogs.slice(startIndex, endIndex);

    return {
      blogs: paginatedBlogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
});

// Get blog by slug with enrichment
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const blog = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!blog) return null;

    const author = await ctx.db.get(blog.author);
    return {
      ...blog,
      authorName: author?.name ?? "Unknown",
      authorPhoto: author?.profilePhoto,
      authorBio: author?.bio,
    };
  },
});

// Get blog categories
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const blogs = await ctx.db.query("blogs").collect();
    const publishedBlogs = blogs.filter((b) => b.status === "published");
    const categories = [...new Set(publishedBlogs.map((b) => b.category))];
    return categories.sort().map((category) => ({
      name: category,
      count: publishedBlogs.filter((b) => b.category === category).length,
    }));
  },
});

// Get featured blogs
export const getFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 3;
    const publishedBlogs = await ctx.db
      .query("blogs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit);

    return await Promise.all(
      publishedBlogs.map(async (blog) => {
        const author = await ctx.db.get(blog.author);
        return {
          ...blog,
          authorName: author?.name ?? "Unknown",
          authorPhoto: author?.profilePhoto,
        };
      })
    );
  },
});

// Create blog
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    language: v.union(v.literal("en"), v.literal("hi")),
    featuredImage: v.optional(v.id("_storage")),
    allowComments: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const slug = generateSlug(args.title);

    const blogId = await ctx.db.insert("blogs", {
      ...args,
      slug,
      author: identity.subject as any,
      status: "draft",
      publishedAt: undefined,
      viewCount: 0,
    });

    return blogId;
  },
});

// Update blog
export const update = mutation({
  args: {
    id: v.id("blogs"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    featuredImage: v.optional(v.id("_storage")),
    allowComments: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    if (updates.title) {
      const newUpdates = updates as any;
      newUpdates.slug = generateSlug(updates.title);
      await ctx.db.patch(id, newUpdates);
    } else {
      await ctx.db.patch(id, updates);
    }
    return id;
  },
});

// Publish blog
export const publish = mutation({
  args: {
    id: v.id("blogs"),
    publishedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "published",
      publishedAt: args.publishedAt || Date.now(),
    });
    return args.id;
  },
});

// Delete blog
export const remove = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Increment view count
export const incrementViewCount = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.id);
    if (blog) {
      await ctx.db.patch(args.id, { viewCount: blog.viewCount + 1 });
    }
    return args.id;
  },
});

// Get related blogs
export const getRelated = query({
  args: {
    blogId: v.id("blogs"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 4;
    const currentBlog = await ctx.db.get(args.blogId);
    if (!currentBlog) return [];

    const blogs = await ctx.db.query("blogs").collect();

    const related = blogs
      .filter(
        (b) =>
          b._id !== args.blogId &&
          b.status === "published" &&
          (b.category === currentBlog.category ||
            b.tags.some((tag) => currentBlog.tags.includes(tag)))
      )
      .sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0))
      .slice(0, limit);

    return await Promise.all(
      related.map(async (blog) => {
        const author = await ctx.db.get(blog.author);
        return {
          ...blog,
          authorName: author?.name ?? "Unknown",
        };
      })
    );
  },
});
