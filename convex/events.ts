import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// List events
export const list = query({
  args: {
    status: v.optional(v.string()),
    category: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
    city: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let events = await ctx.db.query("events").collect();

    if (args.status) {
      events = events.filter((e) => e.status === args.status);
    }
    if (args.category) {
      events = events.filter((e) => e.category === args.category);
    }
    if (args.isPublic !== undefined) {
      events = events.filter((e) => e.isPublic === args.isPublic);
    }
    if (args.city) {
      events = events.filter((e) => e.city === args.city);
    }

    events.sort((a, b) => a.startDate - b.startDate);

    if (args.limit) {
      events = events.slice(0, args.limit);
    }

    return events;
  },
});

// Get event by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const allEvents = await ctx.db.query("events").collect();
    return allEvents.find((e) => e.slug === args.slug);
  },
});

// Get event by ID
export const getById = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create event
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    venue: v.string(),
    address: v.string(),
    city: v.string(),
    category: v.string(),
    isPublic: v.boolean(),
    maxAttendees: v.optional(v.number()),
    registrationDeadline: v.optional(v.number()),
    featuredImage: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const slug = generateSlug(args.title);

    // Determine status based on dates
    const now = Date.now();
    let status: "upcoming" | "ongoing" | "completed" | "cancelled" = "upcoming";
    if (args.startDate > now) {
      status = "upcoming";
    } else if (args.endDate < now) {
      status = "completed";
    } else {
      status = "ongoing";
    }

    const eventId = await ctx.db.insert("events", {
      ...args,
      slug,
      organizer: identity.subject as any,
      status,
    });

    return eventId;
  },
});

// Update event
export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    venue: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    category: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
    maxAttendees: v.optional(v.number()),
    registrationDeadline: v.optional(v.number()),
    featuredImage: v.optional(v.id("_storage")),
    status: v.optional(v.union(
      v.literal("upcoming"),
      v.literal("ongoing"),
      v.literal("completed"),
      v.literal("cancelled")
    )),
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

// Register for event
export const register = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if already registered
    const existingRegistration = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect()
      .then((regs) => regs.find((r) => r.userId.toString() === user._id.toString()));

    if (existingRegistration) {
      throw new Error("Already registered");
    }

    // Check capacity
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    if (event.maxAttendees) {
      const registrationCount = await ctx.db
        .query("eventRegistrations")
        .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
        .collect()
        .then((regs) => regs.length);

      if (registrationCount >= event.maxAttendees) {
        throw new Error("Event is full");
      }
    }

    // Create registration
    const registrationId = await ctx.db.insert("eventRegistrations", {
      eventId: args.eventId,
      userId: user._id,
      registeredAt: Date.now(),
      attended: false,
    });

    return registrationId;
  },
});

// Mark attendance (for organizers)
export const markAttendance = mutation({
  args: {
    registrationId: v.id("eventRegistrations"),
    attended: v.boolean(),
  },
  handler: async (ctx, args) => {
    const registration = await ctx.db.get(args.registrationId);
    if (!registration) {
      throw new Error("Registration not found");
    }

    await ctx.db.patch(args.registrationId, {
      attended: args.attended,
      attendedAt: args.attended ? Date.now() : undefined,
    });

    return args.registrationId;
  },
});

// Get user's registered events
export const getUserRegistrations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const registrations = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const events = await Promise.all(
      registrations.map((r) => ctx.db.get(r.eventId))
    );

    return events.filter(Boolean).map((event, index) => ({
      ...event!,
      registration: registrations[index],
    }));
  },
});

// Delete event
export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
