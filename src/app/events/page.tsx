"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function EventsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const events = useQuery(api.events.list, {
    status: selectedStatus || undefined,
    category: selectedCategory || undefined,
  }) || [];

  const statuses = ["upcoming", "ongoing", "completed"];
  const categories = events ? [...new Set(events.map((e: any) => e.category))] as string[] : [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      upcoming: "default",
      ongoing: "secondary",
      completed: "outline",
      cancelled: "destructive",
    };
    return variants[status] || "outline";
  };

  const formatDateRange = (start: number, end: number) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate.toDateString() === endDate.toDateString()) {
      return format(startDate, "MMMM dd, yyyy");
    }

    return `${format(startDate, "MMM dd")} - ${format(endDate, "dd, yyyy")}`;
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 bg-[#003285] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF7F3E]/20 blur-[120px] rounded-full" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl space-y-6">
            <Badge variant="outline" className="border-[#FF7F3E] text-[#FFDA78] bg-[#FF7F3E]/10 px-4 py-1 text-xs font-bold tracking-widest uppercase rounded-full">
              📅 Events & Programs
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
              Action for <span className="text-[#FFDA78]">Equality</span>
            </h1>
            <p className="text-xl text-blue-100/90 font-medium leading-relaxed max-w-2xl">
              Participate in SSD Delhi&apos;s events and activities. Join meetings, training sessions, and community service programs.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white dark:bg-slate-950 border-b relative z-40 -mt-12 rounded-t-[40px] md:rounded-t-[80px]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedStatus ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(null)}
                className={cn("rounded-full px-5 font-bold uppercase tracking-tight", !selectedStatus ? "bg-[#003285] hover:bg-[#002561]" : "border-slate-200 text-slate-600")}
              >
                All Events
              </Button>
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={cn("rounded-full px-5 font-bold uppercase tracking-tight", selectedStatus === status ? "bg-[#003285] hover:bg-[#002561]" : "border-slate-200 text-slate-600")}
                >
                  {status}
                </Button>
              ))}
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={cn("rounded-full px-5 font-bold uppercase tracking-tight", selectedCategory === category ? "bg-[#003285] hover:bg-[#002561]" : "border-slate-200 text-slate-600")}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          {!events ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event: any) => (
                <Link key={event._id} href={`/events/${event.slug}`} className="group">
                  <Card className="h-full border-none shadow-xl shadow-slate-100/60 rounded-[40px] overflow-hidden group-hover:-translate-y-2 transition-all duration-300">
                    <div className="aspect-video bg-gradient-to-br from-[#003285] to-[#2A629A] relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                      <Badge className="absolute top-6 left-6 bg-[#FF7F3E] text-white border-none font-bold uppercase tracking-tighter text-[10px] px-3 py-1 rounded-full">
                        {event.status}
                      </Badge>
                      <Badge className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white border-white/10 font-bold text-[10px] px-3 py-1 rounded-full">
                        {event.isPublic ? "Public" : "Members Only"}
                      </Badge>
                    </div>
                    <CardHeader className="p-8">
                      <CardTitle className="text-2xl font-black text-[#003285] group-hover:text-[#FF7F3E] transition-colors leading-tight mb-6 line-clamp-2">
                        {event.title}
                      </CardTitle>
                      <div className="space-y-3 text-sm font-bold text-slate-500">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 text-[#2A629A]">
                            <Calendar className="h-4 w-4" />
                          </div>
                          {formatDateRange(event.startDate, event.endDate)}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 text-[#2A629A]">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <span className="line-clamp-1">{event.venue}, {event.city}</span>
                        </div>
                        {event.maxAttendees && (
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 text-[#2A629A]">
                              <Users className="h-4 w-4" />
                            </div>
                            Max {event.maxAttendees} attendees
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    {event.registrationDeadline && (
                      <CardContent className="px-8 pb-8 pt-0">
                        <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#FFDA78]/10 text-[#FF7F3E] text-xs font-black uppercase tracking-widest">
                          <Clock className="h-4 w-4" />
                          Deadline: {format(event.registrationDeadline, "MMM dd")}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
