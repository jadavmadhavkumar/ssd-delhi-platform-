import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// List media with pagination and enrichment
export const list = query({
  args: {
    type: v.optional(v.union(v.literal("image"), v.literal("video"), v.literal("document"))),
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    sortBy: v.optional(v.union(v.literal("newest"), v.literal("oldest"), v.literal("popular"))),
  },
  handler: async (ctx, args) => {
    const page = args.page ?? 1;
    const limit = args.limit ?? 12;
    const sortBy = args.sortBy ?? "newest";

    let media = await ctx.db.query("mediaGallery").collect();

    // Apply filters
    if (args.type) {
      media = media.filter((m) => m.type === args.type);
    }
    if (args.category) {
      media = media.filter((m) => m.category === args.category);
    }
    if (args.featured !== undefined) {
      media = media.filter((m) => m.featured === args.featured);
    }

    // Sort
    if (sortBy === "newest") {
      media.sort((a, b) => b.uploadedAt - a.uploadedAt);
    } else if (sortBy === "oldest") {
      media.sort((a, b) => a.uploadedAt - b.uploadedAt);
    }

    // Enrich with uploader data and storage URL
    const enrichedMedia = await Promise.all(
      media.map(async (item) => {
        const uploader = await ctx.db.get(item.uploadedBy);
        const url = await ctx.storage.getUrl(item.fileId);
        return {
          ...item,
          uploaderName: uploader?.name ?? "Unknown",
          uploaderPhoto: uploader?.profilePhoto,
          url,
        };
      })
    );

    // Paginate
    const total = enrichedMedia.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMedia = enrichedMedia.slice(startIndex, endIndex);

    return {
      media: paginatedMedia,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
});

// Get media by ID with enrichment
export const getById = query({
  args: { id: v.id("mediaGallery") },
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.id);
    if (!media) return null;

    const uploader = await ctx.db.get(media.uploadedBy);
    const url = await ctx.storage.getUrl(media.fileId);

    return {
      ...media,
      uploaderName: uploader?.name ?? "Unknown",
      uploaderPhoto: uploader?.profilePhoto,
      url,
    };
  },
});

// Get featured media
export const getFeatured = query({
  args: { limit: v.optional(v.number()), type: v.optional(v.union(v.literal("image"), v.literal("video"), v.literal("document"))) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 6;
    let media = await ctx.db.query("mediaGallery").collect();

    media = media.filter((m) => m.featured);
    if (args.type) {
      media = media.filter((m) => m.type === args.type);
    }

    media = media
      .sort((a, b) => b.uploadedAt - a.uploadedAt)
      .slice(0, limit);

    return await Promise.all(
      media.map(async (item) => {
        const uploader = await ctx.db.get(item.uploadedBy);
        const url = await ctx.storage.getUrl(item.fileId);
        return {
          ...item,
          uploaderName: uploader?.name ?? "Unknown",
          url,
        };
      })
    );
  },
});

// Upload media (called after file is stored in Convex storage)
export const upload = mutation({
  args: {
    fileId: v.id("_storage"),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("image"), v.literal("video"), v.literal("document")),
    category: v.string(),
    tags: v.array(v.string()),
    year: v.optional(v.number()),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const mediaId = await ctx.db.insert("mediaGallery", {
      ...args,
      uploadedBy: identity.subject as any,
      uploadedAt: Date.now(),
    });

    return mediaId;
  },
});

// Update media
export const update = mutation({
  args: {
    id: v.id("mediaGallery"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete media
export const remove = mutation({
  args: { id: v.id("mediaGallery") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Get media categories with counts
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const media = await ctx.db.query("mediaGallery").collect();
    const categories = [...new Set(media.map((m) => m.category))];
    return categories.sort().map((category) => ({
      name: category,
      count: media.filter((m) => m.category === category).length,
    }));
  },
});

// Get media types with counts
export const getTypes = query({
  args: {},
  handler: async (ctx) => {
    const media = await ctx.db.query("mediaGallery").collect();
    const types = ["image", "video", "document"] as const;
    return types.map((type) => ({
      type,
      count: media.filter((m) => m.type === type).length,
    }));
  },
});

// Search media
export const search = query({
  args: {
    query: v.string(),
    type: v.optional(v.union(v.literal("image"), v.literal("video"), v.literal("document"))),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const page = args.page ?? 1;
    const limit = args.limit ?? 20;
    let media = await ctx.db.query("mediaGallery").collect();
    const searchLower = args.query.toLowerCase();

    if (args.type) {
      media = media.filter((m) => m.type === args.type);
    }

    const results = media.filter((m) =>
      m.title.toLowerCase().includes(searchLower) ||
      m.description?.toLowerCase().includes(searchLower) ||
      m.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );

    results.sort((a, b) => b.uploadedAt - a.uploadedAt);

    // Paginate
    const total = results.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);

    // Enrich with URLs
    const enrichedResults = await Promise.all(
      paginatedResults.map(async (item) => {
        const uploader = await ctx.db.get(item.uploadedBy);
        const url = await ctx.storage.getUrl(item.fileId);
        return {
          ...item,
          uploaderName: uploader?.name ?? "Unknown",
          url,
        };
      })
    );

    return {
      media: enrichedResults,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
});

// Get recent media
export const getRecent = query({
  args: { limit: v.optional(v.number()), type: v.optional(v.union(v.literal("image"), v.literal("video"), v.literal("document"))) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 6;
    let media = await ctx.db.query("mediaGallery").collect();

    if (args.type) {
      media = media.filter((m) => m.type === args.type);
    }

    media = media
      .sort((a, b) => b.uploadedAt - a.uploadedAt)
      .slice(0, limit);

    return await Promise.all(
      media.map(async (item) => {
        const uploader = await ctx.db.get(item.uploadedBy);
        const url = await ctx.storage.getUrl(item.fileId);
        return {
          ...item,
          uploaderName: uploader?.name ?? "Unknown",
          url,
        };
      })
    );
  },
});
