import { query } from "./_generated/server";
import { v } from "convex/values";

// Get dashboard overview metrics
export const getOverviewMetrics = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Total Revenue (from completed donations)
    const donations = await ctx.db.query("donations").collect();
    const totalRevenue = donations
      .filter((d) => d.status === "completed")
      .reduce((sum, d) => sum + d.amount, 0);

    // Active Clients (approved members)
    const users = await ctx.db.query("users").collect();
    const activeClients = users.filter(
      (u) => u.membershipStatus === "approved" || u.membershipStatus === "pending"
    ).length;

    // Upcoming Events
    const events = await ctx.db.query("events").collect();
    const upcomingEvents = events.filter(
      (e) => e.status === "upcoming" && e.startDate > now
    ).length;

    // Total Articles Published
    const articles = await ctx.db.query("articles").collect();
    const publishedArticles = articles.filter((a) => a.status === "published").length;

    return {
      totalRevenue,
      activeClients,
      upcomingEvents,
      publishedArticles,
    };
  },
});

// Get revenue data for the last 30 days
export const getRevenueOverTime = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days = args.days ?? 30;
    const now = Date.now();
    const startTime = now - days * 24 * 60 * 60 * 1000;

    const donations = await ctx.db.query("donations").collect();
    const completedDonations = donations.filter(
      (d) => d.status === "completed" && d.createdAt >= startTime
    );

    // Group by day
    const revenueByDay: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const key = date.toISOString().split("T")[0];
      revenueByDay[key] = 0;
    }

    for (const donation of completedDonations) {
      const date = new Date(donation.createdAt);
      const key = date.toISOString().split("T")[0];
      if (revenueByDay[key] !== undefined) {
        revenueByDay[key] += donation.amount;
      }
    }

    return Object.entries(revenueByDay).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  },
});

// Get recent activity data
export const getRecentActivity = query({
  args: {
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    sortBy: v.optional(v.string()),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, args) => {
    const page = args.page ?? 1;
    const limit = args.limit ?? 10;
    const sortBy = args.sortBy ?? "createdAt";
    const sortOrder = args.sortOrder ?? "desc";

    const activities: Array<{
      id: string;
      type: string;
      title: string;
      status: "completed" | "pending";
      createdAt: number;
      amount?: number;
      userName?: string;
    }> = [];

    // Get recent donations
    const donations = await ctx.db.query("donations").collect();
    for (const donation of donations) {
      const user = await ctx.db.get(donation.userId);
      activities.push({
        id: donation._id,
        type: "Donation",
        title: `Donation of ₹${donation.amount}`,
        status: donation.status === "completed" ? "completed" : "pending",
        createdAt: donation.createdAt,
        amount: donation.amount,
        userName: user?.name ?? "Unknown",
      });
    }

    // Get recent event registrations
    const registrations = await ctx.db.query("eventRegistrations").collect();
    for (const reg of registrations) {
      const user = await ctx.db.get(reg.userId);
      const event = await ctx.db.get(reg.eventId);
      if (event) {
        activities.push({
          id: reg._id,
          type: "Event Registration",
          title: `Registered for ${event.title}`,
          status: reg.attended ? "completed" : "pending",
          createdAt: reg.registeredAt,
          userName: user?.name ?? "Unknown",
        });
      }
    }

    // Get recent articles
    const articles = await ctx.db.query("articles").collect();
    for (const article of articles) {
      const user = await ctx.db.get(article.author);
      activities.push({
        id: article._id,
        type: "Article",
        title: article.title,
        status: article.status === "published" ? "completed" : "pending",
        createdAt: article.publishedAt ?? article._creationTime,
        userName: user?.name ?? "Unknown",
      });
    }

    // Sort activities
    activities.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "createdAt") {
        comparison = a.createdAt - b.createdAt;
      } else if (sortBy === "type") {
        comparison = a.type.localeCompare(b.type);
      } else if (sortBy === "status") {
        comparison = a.status.localeCompare(b.status);
      } else if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    // Paginate
    const total = activities.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedActivities = activities.slice(startIndex, endIndex);

    return {
      activities: paginatedActivities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
});
