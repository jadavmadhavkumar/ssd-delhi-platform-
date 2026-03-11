import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// List articles with pagination and enrichment
export const list = query({
  args: {
    category: v.optional(v.string()),
    status: v.optional(v.string()),
    language: v.optional(v.string()),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    sortBy: v.optional(v.union(v.literal("newest"), v.literal("oldest"), v.literal("popular"), v.literal("featured"))),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const page = args.page ?? 1;
    const limit = args.limit ?? 12;
    const sortBy = args.sortBy ?? "newest";

    let query;
    if (args.status) {
      query = ctx.db.query("articles").withIndex("by_status", (q) => q.eq("status", args.status as any));
    } else {
      query = ctx.db.query("articles").withIndex("by_status", (q) => q.eq("status", "published"));
    }

    let articles = await query.collect();

    // Secondary filters (if needed)
    if (args.category) {
      articles = articles.filter((a) => a.category === args.category);
    }
    if (args.language) {
      articles = articles.filter((a) => a.language === args.language);
    }
    if (args.featured !== undefined) {
      articles = articles.filter((a) => a.featured === args.featured);
    }

    // Sort
    if (sortBy === "newest") {
      articles.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
    } else if (sortBy === "oldest") {
      articles.sort((a, b) => (a.publishedAt || 0) - (b.publishedAt || 0));
    } else if (sortBy === "popular") {
      articles.sort((a, b) => b.viewCount - a.viewCount);
    }

    // Enrich ... (rest remains similar but faster due to indexed start)

    // Enrich with author data
    const enrichedArticles = await Promise.all(
      articles.map(async (article) => {
        const author = await ctx.db.get(article.author);
        return {
          ...article,
          authorName: author?.name ?? "Unknown",
          authorPhoto: author?.profilePhoto,
        };
      })
    );

    // Paginate
    const total = enrichedArticles.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = enrichedArticles.slice(startIndex, endIndex);

    return {
      articles: paginatedArticles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
});

// Get article by slug with enrichment
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const article = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!article) return null;

    const author = await ctx.db.get(article.author);
    return {
      ...article,
      authorName: author?.name ?? "Unknown",
      authorPhoto: author?.profilePhoto,
      authorBio: author?.bio,
    };
  },
});

// Get article by ID (with view count increment)
export const getById = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    const article = await ctx.db.get(args.id);
    if (!article) return null;

    // Increment view count
    await ctx.db.patch(args.id, { viewCount: article.viewCount + 1 });

    const author = await ctx.db.get(article.author);
    return {
      ...article,
      viewCount: article.viewCount + 1,
      authorName: author?.name ?? "Unknown",
      authorPhoto: author?.profilePhoto,
    };
  },
});

// Get article categories with counts
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").collect();
    const publishedArticles = articles.filter((a) => a.status === "published");
    const categories = [...new Set(publishedArticles.map((a) => a.category))];
    return categories.sort().map((category) => ({
      name: category,
      count: publishedArticles.filter((a) => a.category === category).length,
    }));
  },
});

// Get featured articles
export const getFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 6;
    const featuredArticles = await ctx.db
      .query("articles")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .filter((q) => q.eq(q.field("featured"), true))
      .order("desc")
      .take(limit);

    return await Promise.all(
      featuredArticles.map(async (article) => {
        const author = await ctx.db.get(article.author);
        return {
          ...article,
          authorName: author?.name ?? "Unknown",
          authorPhoto: author?.profilePhoto,
        };
      })
    );
  },
});

// Create new article
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    excerpt: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    language: v.union(v.literal("en"), v.literal("hi")),
    featuredImage: v.optional(v.id("_storage")),
    sources: v.array(v.object({
      title: v.string(),
      url: v.string(),
      accessedDate: v.string(),
    })),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const slug = generateSlug(args.title);

    const articleId = await ctx.db.insert("articles", {
      ...args,
      slug,
      author: identity.subject as any,
      status: "draft",
      publishedAt: undefined,
      viewCount: 0,
      translationOf: undefined,
    });

    return articleId;
  },
});

// Update article
export const update = mutation({
  args: {
    id: v.id("articles"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    featuredImage: v.optional(v.id("_storage")),
    sources: v.optional(v.array(v.object({
      title: v.string(),
      url: v.string(),
      accessedDate: v.string(),
    }))),
    featured: v.optional(v.boolean()),
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

// Publish article
export const publish = mutation({
  args: {
    id: v.id("articles"),
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

// Archive article
export const archive = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "archived" });
    return args.id;
  },
});

// Delete article
export const remove = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Search articles using Convex Search Index
export const search = query({
  args: {
    query: v.string(),
    language: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let searchBuilder = ctx.db
      .query("articles")
      .withSearchIndex("search_body", (q) => {
        let searchQ = q.search("content", args.query);
        if (args.status) searchQ = searchQ.eq("status", args.status as any);
        if (args.language) searchQ = searchQ.eq("language", args.language as any);
        if (args.category) searchQ = searchQ.eq("category", args.category);
        return searchQ;
      });

    const results = await searchBuilder.collect();

    return results;
  },
});

// Get related articles
export const getRelated = query({
  args: {
    articleId: v.id("articles"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 4;
    const currentArticle = await ctx.db.get(args.articleId);
    if (!currentArticle) return [];

    const articles = await ctx.db.query("articles").collect();

    const related = articles
      .filter(
        (a) =>
          a._id !== args.articleId &&
          a.status === "published" &&
          (a.category === currentArticle.category ||
            a.tags.some((tag) => currentArticle.tags.includes(tag)))
      )
      .sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0))
      .slice(0, limit);

    return await Promise.all(
      related.map(async (article) => {
        const author = await ctx.db.get(article.author);
        return {
          ...article,
          authorName: author?.name ?? "Unknown",
        };
      })
    );
  },
});

// Increment view count
export const incrementViewCount = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    const article = await ctx.db.get(args.id);
    if (article) {
      await ctx.db.patch(args.id, { viewCount: article.viewCount + 1 });
    }
    return args.id;
  },
});
