import { NextRequest, NextResponse } from "next/server";
import { action } from "@convex/_generated/server";
import { v } from "convex/values";

const registerAction = action({
  args: {
    fullName: v.string(),
    fatherName: v.optional(v.string()),
    motherName: v.optional(v.string()),
    dateOfBirth: v.string(),
    gender: v.union(
      v.literal("Male"),
      v.literal("Female"),
      v.literal("Other"),
      v.literal("Prefer not to say")
    ),
    mobileNumber: v.string(),
    email: v.string(),
    ssdRank: v.optional(v.string()),
    arrivingDate: v.optional(v.string()),
    aadhaarCardNumber: v.string(),
    aadhaarFileId: v.optional(v.id("_storage")),
    passportPhotoFileId: v.optional(v.id("_storage")),
    village: v.string(),
    tehsil: v.string(),
    district: v.string(),
    state: v.string(),
    fullAddress: v.string(),
    pincode: v.string(),
    panCardNumber: v.optional(v.string()),
    panFileId: v.optional(v.id("_storage")),
    voterIdNumber: v.optional(v.string()),
    voterIdFileId: v.optional(v.id("_storage")),
    isSsdMember: v.boolean(),
    ssdMembershipId: v.optional(v.string()),
    hearAboutEvent: v.string(),
    roleInEvent: v.string(),
    specialSkills: v.string(),
    dietaryPreferences: v.union(
      v.literal("Vegetarian"),
      v.literal("Non-veg"),
      v.literal("Jain"),
      v.literal("None")
    ),
    accessibilityNeeds: v.optional(v.string()),
    emergencyContactName: v.string(),
    emergencyContactNumber: v.string(),
    consentGiven: v.boolean(),
    stateCode: v.string(),
  },
  handler: async (ctx, args) => {
    const registrationYear = 2026;
    
    const existing = await ctx.db
      .query("ssdIdSequences")
      .withIndex("by_state_year", (q) => q.eq("stateCode", args.stateCode).eq("year", registrationYear))
      .unique();

    let sequence: number;
    if (existing) {
      sequence = existing.currentSequence + 1;
      await ctx.db.patch(existing._id, {
        currentSequence: sequence,
        lastUpdatedAt: Date.now(),
      });
    } else {
      sequence = 1;
      await ctx.db.insert("ssdIdSequences", {
        stateCode: args.stateCode,
        year: registrationYear,
        currentSequence: 1,
        lastUpdatedAt: Date.now(),
      });
    }

    const paddedSequence = String(sequence).padStart(6, '0');
    const ssdId = `SSD-${args.stateCode.toUpperCase()}-${registrationYear}-${paddedSequence}`;

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = [
      "fullName",
      "dateOfBirth",
      "gender",
      "mobileNumber",
      "email",
      "aadhaarCardNumber",
      "village",
      "tehsil",
      "district",
      "state",
      "fullAddress",
      "pincode",
      "isSsdMember",
      "hearAboutEvent",
      "roleInEvent",
      "specialSkills",
      "dietaryPreferences",
      "emergencyContactName",
      "emergencyContactNumber",
      "consentGiven",
      "stateCode",
    ];

    const missingFields = requiredFields.filter((field) => !(field in body));
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await registerForAmbedkarJayanti({
      fullName: body.fullName,
      fatherName: body.fatherName,
      motherName: body.motherName,
      dateOfBirth: body.dateOfBirth,
      gender: body.gender,
      mobileNumber: body.mobileNumber,
      email: body.email,
      ssdRank: body.ssdRank,
      arrivingDate: body.arrivingDate,
      aadhaarCardNumber: body.aadhaarCardNumber,
      aadhaarFileId: body.aadhaarFileId,
      passportPhotoFileId: body.passportPhotoFileId,
      village: body.village,
      tehsil: body.tehsil,
      district: body.district,
      state: body.state,
      fullAddress: body.fullAddress,
      pincode: body.pincode,
      panCardNumber: body.panCardNumber,
      panFileId: body.panFileId,
      voterIdNumber: body.voterIdNumber,
      voterIdFileId: body.voterIdFileId,
      isSsdMember: body.isSsdMember,
      ssdMembershipId: body.ssdMembershipId,
      hearAboutEvent: body.hearAboutEvent,
      roleInEvent: body.roleInEvent,
      specialSkills: body.specialSkills,
      dietaryPreferences: body.dietaryPreferences,
      accessibilityNeeds: body.accessibilityNeeds,
      emergencyContactName: body.emergencyContactName,
      emergencyContactNumber: body.emergencyContactNumber,
      consentGiven: body.consentGiven,
      stateCode: body.stateCode,
    });

    return NextResponse.json({
      success: true,
      ssdId: result.ssdId,
      sequence: result.sequence,
      registrationId: result.registrationId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed", details: String(error) },
      { status: 500 }
    );
  }
}
