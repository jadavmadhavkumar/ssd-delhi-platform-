import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get or create user based on Clerk authentication
export const getOrCreateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    preferredLanguage: v.union(v.literal("en"), v.literal("hi")),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    // Create new user with default role as visitor
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      phone: args.phone,
      role: "visitor",
      membershipStatus: "inactive",
      city: "",
      state: "",
      preferredLanguage: args.preferredLanguage,
    });

    return userId;
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});

// Update user profile
export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    bio: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    preferredLanguage: v.optional(v.union(v.literal("en"), v.literal("hi"))),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    await ctx.db.patch(userId, updates);
    return userId;
  },
});

// Update user role (admin only)
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(
      v.literal("visitor"),
      v.literal("volunteer"),
      v.literal("editor"),
      v.literal("admin"),
      v.literal("superadmin")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { role: args.role });
    return args.userId;
  },
});

// Update membership status
export const updateMembershipStatus = mutation({
  args: {
    userId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("suspended"),
      v.literal("inactive")
    ),
    membershipNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: { membershipStatus: "pending" | "approved" | "suspended" | "inactive"; memberSince?: number; membershipNumber?: string } = {
      membershipStatus: args.status,
    };

    if (args.status === "approved" && !args.membershipNumber) {
      // Generate membership number if not provided
      const count = await ctx.db.query("users").collect();
      const memberCount = count.filter((u) => u.membershipStatus === "approved").length + 1;
      const year = new Date().getFullYear();
      updates.membershipNumber = `SSD-DL-${year}-${String(memberCount).padStart(3, "0")}`;
      updates.memberSince = Date.now();
    }

    if (args.membershipNumber) {
      updates.membershipNumber = args.membershipNumber;
    }

    await ctx.db.patch(args.userId, updates);
    return args.userId;
  },
});

// List all users (admin only)
export const listUsers = query({
  args: {
    limit: v.optional(v.number()),
    role: v.optional(v.union(
      v.literal("visitor"),
      v.literal("volunteer"),
      v.literal("editor"),
      v.literal("admin"),
      v.literal("superadmin")
    )),
    membershipStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("suspended"),
      v.literal("inactive")
    )),
  },
  handler: async (ctx, args) => {
    let users = await ctx.db.query("users").collect();

    // Apply filters
    if (args.role) {
      users = users.filter((u) => u.role === args.role);
    }
    if (args.membershipStatus) {
      users = users.filter((u) => u.membershipStatus === args.membershipStatus);
    }

    // Apply limit
    if (args.limit) {
      users = users.slice(0, args.limit);
    }

    return users;
  },
});

// Get current user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    return user;
  },
});

// Submit a membership application (no auth required - for walk-in applicants)
export const submitMembershipApplication = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    pincode: v.string(),
    occupation: v.string(),
    reason: v.string(),
    volunteeringPath: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Update existing record with new application data
      await ctx.db.patch(existing._id, {
        name: args.name,
        phone: args.phone,
        address: args.address,
        city: args.city,
        state: args.state,
        bio: args.reason,
        membershipStatus: "pending",
      });
      return { success: true, userId: existing._id, isNew: false };
    }

    // Create new pending applicant
    const userId = await ctx.db.insert("users", {
      clerkId: `applicant-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      email: args.email,
      name: args.name,
      phone: args.phone,
      address: args.address,
      city: args.city,
      state: args.state,
      bio: `Occupation: ${args.occupation}. Reason: ${args.reason}${args.volunteeringPath ? `. Preferred path: ${args.volunteeringPath}` : ""
        }`,
      role: "visitor",
      membershipStatus: "pending",
      preferredLanguage: "en",
    });

    return { success: true, userId, isNew: true };
  },
});
