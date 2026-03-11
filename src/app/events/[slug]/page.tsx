"use client";

import { use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Ticket,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const event = useQuery(api.events.getBySlug, { slug });
  const registerForEvent = useMutation(api.events.register);

  if (!event) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const handleRegister = async () => {
    try {
      await registerForEvent({ eventId: event._id as Id<"events"> });
      toast.success("Registration successful!", {
        description: "You have been registered for this event.",
      });
    } catch (error: any) {
      toast.error("Registration failed", {
        description: error.message || "Please try again",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      upcoming: "text-green-600 bg-green-100",
      ongoing: "text-blue-600 bg-blue-100",
      completed: "text-gray-600 bg-gray-100",
      cancelled: "text-red-600 bg-red-100",
    };
    return colors[status] || "text-gray-600 bg-gray-100";
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-48 bg-[#003285] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF7F3E]/20 blur-[120px] rounded-full" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className={cn("px-4 py-1 text-xs font-black uppercase tracking-widest rounded-full border-none",
                event.status === 'upcoming' ? "bg-green-500 text-white shadow-lg shadow-green-500/20" :
                  event.status === 'ongoing' ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" :
                    "bg-slate-500 text-white"
              )}>
                {event.status}
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white/80 bg-white/5 px-4 py-1 text-xs font-bold tracking-widest uppercase rounded-full">
                {event.isPublic ? "Public Event" : "Members Only"}
              </Badge>
              <Badge variant="outline" className="border-[#FF7F3E] text-[#FFDA78] bg-[#FF7F3E]/10 px-4 py-1 text-xs font-bold tracking-widest uppercase rounded-full">
                {event.category}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              {event.title}
            </h1>

            <div className="flex items-center gap-8 text-sm font-bold text-white/60 flex-wrap uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#FFDA78]" />
                <span>
                  {format(event.startDate, "MMMM dd, yyyy")}
                  {event.endDate !== event.startDate && (
                    <> - {format(event.endDate, "MMMM dd, yyyy")}</>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#FF7F3E]" />
                <span>
                  {format(event.startDate, "h:mm a")} - {format(event.endDate, "h:mm a")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#2A629A]" />
                <span>{event.venue}, {event.city}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="pb-24 -mt-24 relative z-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[40px] md:rounded-[64px] overflow-hidden bg-white p-8 md:p-16">
                <div className="mb-12">
                  <h2 className="text-3xl font-black text-[#003285] mb-6 uppercase tracking-tight">About This Event</h2>
                  <div className="h-1 w-20 bg-[#FF7F3E] rounded-full" />
                </div>
                <div className="space-y-6 text-slate-600 font-medium text-lg leading-relaxed whitespace-pre-line">
                  {event.description}
                </div>
              </Card>

              {/* Organizer Info */}
              <Card className="border-none shadow-xl shadow-slate-100/60 rounded-[40px] overflow-hidden bg-white p-10">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-3xl bg-[#003285]/10 flex items-center justify-center text-[#003285]">
                    <Users className="h-10 w-10" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#FF7F3E] uppercase tracking-[0.2em] mb-1">Organizer</div>
                    <div className="text-2xl font-black text-[#003285]">SSD Delhi Central Unit</div>
                    <div className="text-slate-500 font-medium tracking-tight">
                      Samta Sainik Dal Headquarters, Delhi Precinct
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <Card className="border-none shadow-xl shadow-slate-100/50 rounded-[40px] overflow-hidden bg-[#003285] text-white p-10">
                <h3 className="text-xl font-black mb-8 uppercase tracking-widest text-[#FFDA78]">Logistics</h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FFDA78]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Venue</div>
                      <div className="font-bold text-lg leading-tight">
                        {event.venue}
                      </div>
                      <div className="text-white/60 text-sm mt-1">
                        {event.address}, {event.city}
                      </div>
                    </div>
                  </div>

                  {event.maxAttendees && (
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FFDA78]">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Capacity</div>
                        <div className="font-bold text-lg leading-tight">
                          {event.maxAttendees} <span className="text-sm font-medium text-white/40">Participants Max</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {event.registrationDeadline && (
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-[#FF7F3E]/20 flex items-center justify-center text-[#FFDA78]">
                        <Ticket className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#FF7F3E]/80 mb-1">Register By</div>
                        <div className="font-bold text-lg leading-tight text-[#FFDA78]">
                          {format(event.registrationDeadline, "MMMM dd, yyyy")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Registration Card */}
              <Card className="border-none shadow-2xl shadow-orange-100/50 rounded-[40px] overflow-hidden bg-white p-10 group">
                {event.status === "upcoming" ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-green-600 pt-2">
                      <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-black uppercase tracking-widest text-xs">Registration Open</span>
                    </div>
                    <Button className="w-full h-16 bg-[#FF7F3E] hover:bg-[#ff6a1a] text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-orange-500/30 group-hover:scale-[1.02] transition-all" size="lg" onClick={handleRegister}>
                      Confirm Presence
                    </Button>
                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tight">
                      Confirmation will be sent to your registered email
                    </p>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-8 w-8 text-slate-300" />
                    </div>
                    <span className="font-black text-[#003285] uppercase tracking-widest text-xs">
                      Event {event.status}
                    </span>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
