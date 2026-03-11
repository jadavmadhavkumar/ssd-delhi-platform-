import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Articles - Repository with source citations
  articles: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    featuredImage: v.optional(v.id("_storage")),
    category: v.string(),
    tags: v.array(v.string()),
    language: v.union(v.literal("en"), v.literal("hi")),
    translationOf: v.optional(v.id("articles")),
    author: v.id("users"),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
    publishedAt: v.optional(v.number()),
    sources: v.array(v.object({
      title: v.string(),
      url: v.string(),
      accessedDate: v.string(),
    })),
    viewCount: v.number(),
    featured: v.boolean(),
    searchVector: v.optional(v.array(v.float64())),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category", "publishedAt"])
    .index("by_author", ["author"])
    .index("by_status", ["status", "publishedAt"])
    .searchIndex("search_body", {
      searchField: "content",
      filterFields: ["category", "status", "language"],
    }),

  // Timeline Events - Historical timeline from 1924 to present
  timelineEvents: defineTable({
    year: v.number(),
    month: v.optional(v.number()),
    day: v.optional(v.number()),
    title: v.string(),
    description: v.string(),
    significance: v.string(),
    images: v.array(v.id("_storage")),
    sources: v.array(v.object({
      title: v.string(),
      url: v.string(),
    })),
    relatedArticles: v.array(v.id("articles")),
    era: v.string(),
  })
    .index("by_year", ["year"])
    .index("by_era", ["era", "year"]),

  // Blogs - Community stories and reflections
  blogs: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    featuredImage: v.optional(v.id("_storage")),
    author: v.id("users"),
    category: v.string(),
    tags: v.array(v.string()),
    language: v.union(v.literal("en"), v.literal("hi")),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
    viewCount: v.number(),
    allowComments: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status", "publishedAt"])
    .searchIndex("search_body", {
      searchField: "content",
      filterFields: ["category", "status", "language"],
    }),

  // News - Latest announcements and updates
  news: defineTable({
    headline: v.string(),
    slug: v.string(),
    content: v.string(),
    featuredImage: v.optional(v.id("_storage")),
    urgent: v.boolean(),
    category: v.string(),
    publishedAt: v.number(),
    expiresAt: v.optional(v.number()),
    author: v.id("users"),
    sources: v.array(v.object({ title: v.string(), url: v.string() })),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["publishedAt"])
    .index("by_urgent", ["urgent", "publishedAt"])
    .searchIndex("search_headline", {
      searchField: "headline",
      filterFields: ["category", "urgent"],
    }),

  // Users - Members and volunteers
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    profilePhoto: v.optional(v.id("_storage")),
    role: v.union(
      v.literal("visitor"),
      v.literal("volunteer"),
      v.literal("editor"),
      v.literal("admin"),
      v.literal("superadmin")
    ),
    membershipStatus: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("suspended"),
      v.literal("inactive")
    ),
    memberSince: v.optional(v.number()),
    membershipNumber: v.optional(v.string()),
    bio: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    preferredLanguage: v.union(v.literal("en"), v.literal("hi")),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_membership_status", ["membershipStatus"])
    .index("by_role", ["role"]),

  // Events - Upcoming and past events
  events: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    venue: v.string(),
    address: v.string(),
    city: v.string(),
    maxAttendees: v.optional(v.number()),
    registrationDeadline: v.optional(v.number()),
    featuredImage: v.optional(v.id("_storage")),
    organizer: v.id("users"),
    category: v.string(),
    status: v.union(v.literal("upcoming"), v.literal("ongoing"), v.literal("completed"), v.literal("cancelled")),
    isPublic: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_start_date", ["startDate"])
    .index("by_status", ["status", "startDate"]),

  // Event Registrations
  eventRegistrations: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),
    registeredAt: v.number(),
    attended: v.boolean(),
    attendedAt: v.optional(v.number()),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"]),

  // Media Gallery
  mediaGallery: defineTable({
    fileId: v.id("_storage"),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("image"), v.literal("video"), v.literal("document")),
    category: v.string(),
    tags: v.array(v.string()),
    uploadedBy: v.id("users"),
    uploadedAt: v.number(),
    year: v.optional(v.number()),
    featured: v.boolean(),
  })
    .index("by_type", ["type", "uploadedAt"])
    .index("by_category", ["category"]),

  // AI Conversations - Chatbot history
  aiConversations: defineTable({
    sessionId: v.string(),
    userId: v.optional(v.id("users")),
    messages: v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
      timestamp: v.number(),
    })),
    startedAt: v.number(),
    lastMessageAt: v.number(),
    language: v.union(v.literal("en"), v.literal("hi")),
  })
    .index("by_session", ["sessionId"]),

  // Comments - For articles and blogs
  comments: defineTable({
    contentType: v.union(v.literal("article"), v.literal("blog")),
    contentId: v.id("articles"),
    userId: v.id("users"),
    parentCommentId: v.optional(v.id("comments")),
    content: v.string(),
    createdAt: v.number(),
    edited: v.boolean(),
    editedAt: v.optional(v.number()),
    approved: v.boolean(),
    likes: v.number(),
  })
    .index("by_content", ["contentType", "contentId", "createdAt"])
    .index("by_parent", ["parentCommentId"]),

  // Donations - Contribution tracking
  donations: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    currency: v.string(),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed")),
    paymentMethod: v.optional(v.string()),
    transactionId: v.optional(v.string()),
    createdAt: v.number(),
    message: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status", "createdAt"]),

  // Ambedkar Jayanti 2026 Registrations
  ambedkarJayantiRegistrations: defineTable({
    // Personal Details
    fullName: v.string(),
    fatherName: v.optional(v.string()),
    dateOfBirth: v.string(),
    gender: v.union(v.literal("Male"), v.literal("Female"), v.literal("Other"), v.literal("Prefer not to say")),
    mobileNumber: v.string(),
    email: v.string(),
    ssdRank: v.optional(v.string()),
    arrivingDate: v.optional(v.string()),
    aadhaarCardNumber: v.string(),
    aadhaarFileId: v.optional(v.id("_storage")),
    
    // Address & ID Proof
    fullAddress: v.string(),
    pincode: v.string(),
    panCardNumber: v.optional(v.string()),
    panFileId: v.optional(v.id("_storage")),
    voterIdNumber: v.optional(v.string()),
    voterIdFileId: v.optional(v.id("_storage")),
    
    // SSD & Event Info
    isSsdMember: v.boolean(),
    ssdMembershipId: v.optional(v.string()),
    hearAboutEvent: v.string(),
    roleInEvent: v.string(),
    specialSkills: v.string(),
    dietaryPreferences: v.union(v.literal("Vegetarian"), v.literal("Non-veg"), v.literal("Jain"), v.literal("None")),
    accessibilityNeeds: v.optional(v.string()),
    
    // Emergency & Consent
    emergencyContactName: v.string(),
    emergencyContactNumber: v.string(),
    consentGiven: v.boolean(),
    
    // Metadata
    registeredAt: v.number(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("cancelled")),
  })
    .index("by_email", ["email"])
    .index("by_mobile", ["mobileNumber"])
    .index("by_status", ["status"])
    .index("by_registered_at", ["registeredAt"]),
});
