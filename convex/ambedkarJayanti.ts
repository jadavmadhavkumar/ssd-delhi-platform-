import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * SSD ID Generator - Government Standard Format
 * Format: SSD-DL-YYYY-XXXXXX
 * - SSD: Organization prefix
 * - DL: State code (DL=Delhi, MH=Maharashtra, etc.)
 * - YYYY: Registration year
 * - XXXXXX: 6-digit unique sequential number
 */
function generateSSDID(stateCode: string, year: number, sequence: number): string {
  const paddedSequence = String(sequence).padStart(6, '0');
  return `SSD-${stateCode.toUpperCase()}-${year}-${paddedSequence}`;
}

/**
 * Get or create sequence for state/year combination
 * Ensures unique sequential IDs per state per year
 */
async function getNextSequence(ctx: any, stateCode: string, year: number): Promise<number> {
  // Try to find existing sequence tracker
  const existing = await ctx.db
    .query("ssdIdSequences")
    .withIndex("by_state_year", (q: any) => q.eq("stateCode", stateCode).eq("year", year))
    .unique();

  if (existing) {
    // Increment existing sequence
    const newSequence = existing.currentSequence + 1;
    await ctx.db.patch(existing._id, {
      currentSequence: newSequence,
      lastUpdatedAt: Date.now(),
    });
    return newSequence;
  } else {
    // Create new sequence tracker starting at 1
    const newId = await ctx.db.insert("ssdIdSequences", {
      stateCode,
      year,
      currentSequence: 1,
      lastUpdatedAt: Date.now(),
    });
    return 1;
  }
}

/**
 * Register for Ambedkar Jayanti 2026 with SSD_ID generation
 */
export const registerForAmbedkarJayanti = mutation({
  args: {
    // Personal Details
    fullName: v.string(),
    fatherName: v.string(),
    motherName: v.string(),
    dateOfBirth: v.string(),
    gender: v.union(
      v.literal("Male"),
      v.literal("Female"),
      v.literal("Other")
    ),
    mobileNumber: v.string(),
    email: v.string(),
    
    // Address
    address: v.string(),
    village: v.string(),
    tehsil: v.optional(v.string()),
    district: v.string(),
    state: v.string(),
    pincode: v.string(),
    
    // SSD Details
    isSsdMember: v.boolean(),
    rank: v.optional(v.string()),
    
    // Documents
    aadhaarCardNumber: v.string(),
    aadhaarFileId: v.optional(v.id("_storage")),
    passportPhotoFileId: v.optional(v.id("_storage")),

    // State Code for SSD_ID
    stateCode: v.string(),
  },
  handler: async (ctx, args) => {
    // Generate SSD_ID
    const registrationYear = 2026;
    const sequence = await getNextSequence(ctx, args.stateCode, registrationYear);
    const ssdId = generateSSDID(args.stateCode, registrationYear, sequence);

    // Create registration with SSD_ID
    const registrationId = await ctx.db.insert("ambedkarJayantiRegistrations", {
      ...args,
      ssdId,
      registrationYear,
      sequenceNumber: sequence,
      registeredAt: Date.now(),
      status: "confirmed",
    });

    return { registrationId, ssdId, sequence };
  },
});

/**
 * Get registration by SSD_ID
 */
export const getRegistrationBySSDID = query({
  args: {
    ssdId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.ssdId) {
      return null;
    }
    
    const registration = await ctx.db
      .query("ambedkarJayantiRegistrations")
      .withIndex("by_ssd_id", (q) => q.eq("ssdId", args.ssdId!))
      .unique();

    return registration;
  },
});

/**
 * Get all registrations for a state/year
 */
export const getRegistrationsByStateYear = query({
  args: {
    stateCode: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const registrations = await ctx.db
      .query("ambedkarJayantiRegistrations")
      .withIndex("by_state_year", (q) => q.eq("stateCode", args.stateCode).eq("registrationYear", args.year))
      .collect();

    return registrations;
  },
});

/**
 * Get current sequence count for a state/year
 */
export const getCurrentSequence = query({
  args: {
    stateCode: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const sequence = await ctx.db
      .query("ssdIdSequences")
      .withIndex("by_state_year", (q) => q.eq("stateCode", args.stateCode).eq("year", args.year))
      .unique();

    return sequence?.currentSequence || 0;
  },
});

/**
 * Get registration statistics
 */
export const getRegistrationStats = query({
  args: {},
  handler: async (ctx) => {
    const allRegistrations = await ctx.db
      .query("ambedkarJayantiRegistrations")
      .withIndex("by_status", (q) => q.eq("status", "confirmed"))
      .collect();

    // Group by state
    const byState: Record<string, number> = {};
    allRegistrations.forEach((reg: any) => {
      byState[reg.stateCode] = (byState[reg.stateCode] || 0) + 1;
    });

    return {
      total: allRegistrations.length,
      byState,
      year: 2026,
    };
  },
});
