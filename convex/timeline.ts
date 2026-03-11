import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// List timeline events
export const list = query({
  args: {
    era: v.optional(v.string()),
    startYear: v.optional(v.number()),
    endYear: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let events = await ctx.db.query("timelineEvents").collect();

    if (args.era) {
      events = events.filter((e) => e.era === args.era);
    }
    if (args.startYear) {
      events = events.filter((e) => e.year >= args.startYear!);
    }
    if (args.endYear) {
      events = events.filter((e) => e.year <= args.endYear!);
    }

    // Sort by year
    events.sort((a, b) => a.year - b.year);

    return events;
  },
});

// Get timeline event by ID
export const getById = query({
  args: { id: v.id("timelineEvents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create timeline event
export const create = mutation({
  args: {
    year: v.number(),
    title: v.string(),
    description: v.string(),
    significance: v.string(),
    era: v.string(),
    month: v.optional(v.number()),
    day: v.optional(v.number()),
    sources: v.array(v.object({
      title: v.string(),
      url: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const eventId = await ctx.db.insert("timelineEvents", {
      ...args,
      images: [],
      relatedArticles: [],
    });

    return eventId;
  },
});

// Update timeline event
export const update = mutation({
  args: {
    id: v.id("timelineEvents"),
    year: v.optional(v.number()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    significance: v.optional(v.string()),
    era: v.optional(v.string()),
    month: v.optional(v.number()),
    day: v.optional(v.number()),
    sources: v.optional(v.array(v.object({
      title: v.string(),
      url: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete timeline event
export const remove = mutation({
  args: { id: v.id("timelineEvents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Get events by era
export const getByEra = query({
  args: { era: v.string() },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("timelineEvents")
      .withIndex("by_era", (q) => q.eq("era", args.era))
      .collect();

    return events.sort((a, b) => a.year - b.year);
  },
});

// Get all eras
export const getEras = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("timelineEvents").collect();
    const eras = [...new Set(events.map((e) => e.era))];
    return eras.sort();
  },
});
