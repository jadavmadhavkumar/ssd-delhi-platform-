"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function NewsPage() {
  const news = useQuery(api.news?.list as any, { limit: 50 }) || [];

  const urgentNews = news.filter((n: any) => n.urgent);
  const regularNews = news.filter((n: any) => !n.urgent);

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
              📢 Latest Updates
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
              News & <span className="text-[#FFDA78]">Notices</span>
            </h1>
            <p className="text-xl text-blue-100/90 font-medium leading-relaxed max-w-2xl">
              Stay updated with SSD Delhi activities and announcements. Latest news, press releases, and important updates.
            </p>
          </div>
        </div>
      </section>

      {/* News Content */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Urgent News */}
            {urgentNews.length > 0 && (
              <div className="lg:col-span-3">
                <h2 className="text-3xl font-black text-[#003285] mb-8 flex items-center gap-3">
                  <Megaphone className="h-8 w-8 text-[#FF7F3E]" />
                  Urgent Announcements
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {urgentNews.map((item: any) => (
                    <Link key={item._id} href={`/news/${item.slug}`} className="group">
                      <Card className="h-full border-none shadow-xl shadow-orange-100/50 rounded-[40px] overflow-hidden bg-white group-hover:-translate-y-2 transition-all duration-300">
                        <div className="p-10 border-t-8 border-[#FF7F3E]">
                          <Badge className="bg-[#FF7F3E] text-white border-none font-bold uppercase tracking-tighter text-[10px] px-3 py-1 rounded-full mb-6">
                            URGENT NOTICE
                          </Badge>
                          <CardTitle className="text-2xl font-black text-[#003285] group-hover:text-[#FF7F3E] transition-colors leading-tight line-clamp-2 mb-4">
                            {item.headline}
                          </CardTitle>
                          <CardDescription className="text-slate-500 font-medium line-clamp-3 text-base mb-8">
                            {item.content.substring(0, 150)}...
                          </CardDescription>
                          <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pt-6 border-t border-slate-50">
                            <Calendar className="h-4 w-4 text-[#FF7F3E]" />
                            {format(item.publishedAt, "MMM dd, yyyy")}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Regular News */}
            <div className="lg:col-span-3 mt-16">
              <h2 className="text-3xl font-black text-[#003285] mb-8">Latest News</h2>
              {!news || news.length === 0 ? (
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
              ) : regularNews.length === 0 ? (
                <div className="text-center py-12">
                  <Megaphone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No news available</h3>
                  <p className="text-muted-foreground">Check back later for updates</p>
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {regularNews.map((item: any) => (
                    <Link key={item._id} href={`/news/${item.slug}`} className="group">
                      <Card className="h-full border-none shadow-xl shadow-slate-100/60 rounded-[40px] overflow-hidden group-hover:-translate-y-2 transition-all duration-300">
                        <div className="p-10">
                          <Badge className="bg-[#003285]/10 text-[#003285] border-none font-black uppercase tracking-tighter text-[10px] px-3 py-1 rounded-full mb-6">
                            {item.category}
                          </Badge>
                          <CardTitle className="text-2xl font-black text-[#003285] group-hover:text-[#FF7F3E] transition-colors leading-tight line-clamp-2 mb-4">
                            {item.headline}
                          </CardTitle>
                          <CardDescription className="text-slate-500 font-medium line-clamp-3 text-base mb-8">
                            {item.content.substring(0, 150)}...
                          </CardDescription>
                          <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-widest pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-[#2A629A]" />
                              {format(item.publishedAt, "MMM dd")}
                            </div>
                            {item.expiresAt && (
                              <div className="flex items-center gap-2 text-[#FF7F3E]">
                                <Clock className="h-4 w-4" />
                                Expires {format(item.expiresAt, "MMM dd")}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
