import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function generateSlug(headline: string): string {
  return headline
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// List news
export const list = query({
  args: {
    category: v.optional(v.string()),
    urgent: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let news = await ctx.db.query("news").collect();

    // Filter out expired news
    const now = Date.now();
    news = news.filter((n) => !n.expiresAt || n.expiresAt > now);

    if (args.category) {
      news = news.filter((n) => n.category === args.category);
    }
    if (args.urgent !== undefined) {
      news = news.filter((n) => n.urgent === args.urgent);
    }

    news.sort((a, b) => b.publishedAt - a.publishedAt);

    if (args.limit) {
      news = news.slice(0, args.limit);
    }

    return news;
  },
});

// Get news by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const allNews = await ctx.db.query("news").collect();
    return allNews.find((n) => n.slug === args.slug);
  },
});

// Create news
export const create = mutation({
  args: {
    headline: v.string(),
    content: v.string(),
    category: v.string(),
    urgent: v.boolean(),
    sources: v.array(v.object({ title: v.string(), url: v.string() })),
    featuredImage: v.optional(v.id("_storage")),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const slug = generateSlug(args.headline);

    const newsId = await ctx.db.insert("news", {
      ...args,
      slug,
      author: identity.subject as any,
      publishedAt: Date.now(),
    });

    return newsId;
  },
});

// Update news
export const update = mutation({
  args: {
    id: v.id("news"),
    headline: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    urgent: v.optional(v.boolean()),
    featuredImage: v.optional(v.id("_storage")),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    if (updates.headline) {
      const newUpdates = updates as any;
      newUpdates.slug = generateSlug(updates.headline);
      await ctx.db.patch(id, newUpdates);
    } else {
      await ctx.db.patch(id, updates);
    }
    return id;
  },
});

// Delete news
export const remove = mutation({
  args: { id: v.id("news") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Get urgent news
export const getUrgent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const news = await ctx.db.query("news").collect();
    const urgentNews = news.filter((n) => n.urgent);
    
    urgentNews.sort((a, b) => b.publishedAt - a.publishedAt);

    if (args.limit) {
      return urgentNews.slice(0, args.limit);
    }

    return urgentNews;
  },
});
