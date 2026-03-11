import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const registerForAmbedkarJayanti = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const registrationId = await ctx.db.insert("ambedkarJayantiRegistrations", {
      ...args,
      registeredAt: Date.now(),
      status: "pending",
    });
    
    return registrationId;
  },
});
