"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, BookOpen, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function HomePage() {
  // articles.list returns a paginated object — use getFeatured which returns a plain array
  const featuredArticles = useQuery(api.articles.getFeatured, { limit: 3 }) || [];
  const upcomingEvents = useQuery(api.events.list, { status: "upcoming", limit: 3 }) || [];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-48 bg-[#003285] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF7F3E]/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2A629A]/30 blur-[120px] rounded-full" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-12">
            <div className="space-y-6 max-w-4xl">
              <Badge variant="outline" className="border-[#FF7F3E] text-[#FFDA78] bg-[#FF7F3E]/10 px-4 py-1 text-xs font-bold tracking-widest uppercase rounded-full animate-in fade-in slide-in-from-top-4 duration-1000">
                🎉 Centenary Celebrations 1924-2024
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700">
                Samta Sainik Dal <span className="text-[#FFDA78]">Delhi</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100/80 font-medium tracking-wide animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
                Soldiers for Equality — Building a Casteless Society based on Liberty, Equality, and Fraternity
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <Link href="/join">
                <Button size="lg" className="bg-[#FF7F3E] hover:bg-[#ff6a1a] text-white text-lg font-bold px-10 py-7 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,127,62,0.5)]">
                  Join the Movement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/history">
                <Button variant="outline" size="lg" className="border-white/30 text-white bg-white/5 hover:bg-white/10 text-lg font-bold px-10 py-7 rounded-full backdrop-blur-sm transition-all duration-300">
                  Explore 100 Years
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-slate-950 relative z-20 -mt-16 rounded-t-[40px] md:rounded-t-[80px]">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-[#003285]/5 text-[#FF7F3E] group-hover:bg-[#FF7F3E] group-hover:text-white transition-all duration-300">
                <Clock className="h-8 w-8" />
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-black text-[#003285]">100+</div>
                <div className="text-sm text-[#2A629A] font-bold tracking-widest uppercase mt-1">Years of Legacy</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-[#2A629A]/5 text-[#2A629A] group-hover:bg-[#2A629A] group-hover:text-white transition-all duration-300">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-black text-[#003285]">10K+</div>
                <div className="text-sm text-[#2A629A] font-bold tracking-widest uppercase mt-1">Active Soldiers</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-[#FFDA78]/10 text-[#FFDA78] group-hover:bg-[#FFDA78] group-hover:text-[#003285] transition-all duration-300">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-black text-[#003285]">500+</div>
                <div className="text-sm text-[#2A629A] font-bold tracking-widest uppercase mt-1">Historical Records</div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-[#FF7F3E]/5 text-[#FF7F3E] group-hover:bg-[#FF7F3E] group-hover:text-white transition-all duration-300">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-black text-[#003285]">Pan India</div>
                <div className="text-sm text-[#2A629A] font-bold tracking-widest uppercase mt-1">Global Impact</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#003285] mb-4">
                Knowledge for <span className="text-[#FF7F3E]">Liberation</span>
              </h2>
              <p className="text-lg text-[#2A629A] font-medium">Learn about SSD&apos;s history, ideology, and the fight for social justice.</p>
            </div>
            <Link href="/articles">
              <Button variant="outline" className="border-[#003285] text-[#003285] hover:bg-[#003285] hover:text-white font-bold rounded-full px-6">
                View Library
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {!featuredArticles || featuredArticles.length === 0 ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="rounded-3xl border-none shadow-xl shadow-slate-200/50">
                  <CardHeader>
                    <Skeleton className="h-64 w-full mb-4 rounded-2xl" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                </Card>
              ))
            ) : (
              featuredArticles.map((article: any) => (
                <Link key={article._id} href={`/articles/${article.slug}`} className="group">
                  <Card className="h-full border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden group-hover:-translate-y-2 transition-all duration-300">
                    <div className="aspect-[4/3] bg-gradient-to-br from-[#003285] to-[#2A629A] relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                      <Badge className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white border-white/20 font-bold uppercase tracking-tighter text-xs">
                        {article.category}
                      </Badge>
                    </div>
                    <CardHeader className="p-8">
                      <CardTitle className="text-2xl font-bold group-hover:text-[#FF7F3E] transition-colors leading-tight mb-4">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-slate-600 line-clamp-3 text-base leading-relaxed">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#003285] mb-4">
                Upcoming <span className="text-[#2A629A]">Programs</span>
              </h2>
              <p className="text-lg text-[#2A629A] font-medium text-slate-600">Join us at our upcoming programs and contribute to the movement.</p>
            </div>
            <Link href="/events">
              <Button variant="ghost" className="text-[#003285] font-bold hover:bg-[#003285]/5 rounded-full px-6">
                Full Calendar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {!upcomingEvents || upcomingEvents.length === 0 ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="rounded-3xl border-slate-100 shadow-lg shadow-slate-100/50">
                  <CardHeader>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                </Card>
              ))
            ) : (
              upcomingEvents.map((event: any) => (
                <Link key={event._id} href={`/events/${event.slug}`} className="group">
                  <Card className="h-full border-2 border-slate-50 hover:border-[#2A629A]/20 shadow-lg shadow-slate-100/50 rounded-3xl transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#2A629A]/10">
                    <CardHeader className="p-8">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#FF7F3E] mb-4 uppercase tracking-widest">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.startDate).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <CardTitle className="text-2xl font-bold group-hover:text-[#003285] transition-colors line-clamp-2 leading-tight mb-4">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="text-slate-500 line-clamp-2 text-base leading-relaxed mb-6">
                        {event.venue}, {event.city}
                      </CardDescription>
                      <Badge variant="secondary" className={cn(
                        "w-fit font-bold uppercase tracking-tighter text-[10px] px-3 py-1 rounded-full",
                        event.isPublic ? "bg-[#FFDA78] text-[#003285]" : "bg-[#2A629A] text-white"
                      )}>
                        {event.isPublic ? "Open to All" : "Members Only"}
                      </Badge>
                    </CardHeader>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Timeline Preview */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-100">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#003285] mb-6">
              A Century of <span className="text-[#FF7F3E]">Struggle</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              From 1924 to 2024, explore the rich history of Samta Sainik Dal and its role in India&apos;s social justice movement.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { year: "1924", title: "The Beginning", description: "Dr. B.R. Ambedkar established Samta Sainik Dal to protect the rights of the marginalized.", color: "#003285" },
              { year: "1927", title: "Social Revolution", description: "The Mahad Satyagraha marked a turning point in the struggle for human dignity and equality.", color: "#2A629A" },
              { year: "2024", title: "Centenary Year", description: "Celebrating 100 years of unwavering service to society and the mission of Babasaheb.", color: "#FF7F3E" },
            ].map((era) => (
              <div key={era.year} className="relative group p-10 bg-white dark:bg-slate-950 rounded-[40px] shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500">
                <div className="absolute top-0 right-10 -translate-y-1/2 text-6xl font-black opacity-10 group-hover:opacity-20 transition-opacity" style={{ color: era.color }}>
                  {era.year}
                </div>
                <div className="text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: era.color }}>
                  Significant Milestone
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{era.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {era.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link href="/history">
              <Button size="lg" className="bg-[#003285] hover:bg-[#002561] text-white font-bold rounded-full px-10 py-7">
                Explore Full Timeline
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#003285] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-50%] left-[-20%] w-[60%] h-[100%] bg-[#FFDA78]/10 blur-[150px] rounded-full rotate-45" />
        </div>

        <div className="container px-4 md:px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              Ready to <span className="text-[#FFDA78]">Lead</span> the Change?
            </h2>
            <p className="text-xl text-blue-100/80 font-medium">
              Join India&apos;s premier social equality organization. Stand for justice, equality, and human dignity for all.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Link href="/join">
                <Button size="lg" className="bg-[#FFDA78] hover:bg-[#ffe29a] text-[#003285] text-lg font-black px-12 py-8 rounded-full shadow-2xl transition-all duration-300 hover:scale-105">
                  Become a Soldier
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/5 hover:bg-white/10 text-lg font-bold px-12 py-8 rounded-full backdrop-blur-sm transition-all duration-300">
                  Get in Touch
                </Button>
              </Link>
            </div>
            <div className="pt-12 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="text-white font-black text-2xl tracking-tighter">LIBERTY</div>
              <div className="text-white font-black text-2xl tracking-tighter">EQUALITY</div>
              <div className="text-white font-black text-2xl tracking-tighter">FRATERNITY</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
