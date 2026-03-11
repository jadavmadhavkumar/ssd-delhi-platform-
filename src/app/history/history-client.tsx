"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function HistoryClient() {
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<number>(5);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const timelineEvents = useQuery(api.timeline?.list as any, {
    era: selectedEra || undefined,
  }) || [];

  const eras = useQuery(api.timeline?.getEras as any) || [];

  // Get unique years for filtering
  const years = timelineEvents 
    ? ([...new Set(timelineEvents.map((e: any) => e.year))] as number[]).sort((a, b) => a - b) 
    : [];

  // Lazy load animation on scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // Intersection Observer for lazy loading timeline items
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in", "fade-in", "slide-in-from-bottom");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const timeline = timelineRef.current;
    if (timeline) {
      const items = timeline.querySelectorAll(".timeline-item");
      items.forEach((item) => observerRef.current?.observe(item));
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [timelineEvents, selectedEra]);

  // Load more items for infinite scroll effect
  const loadMore = () => {
    setVisibleItems((prev) => prev + 5);
  };

  return (
    <>
      {/* Filters Section */}
      <section className="py-6 md:py-8 bg-white dark:bg-slate-950 border-b relative z-40 -mt-8 md:-mt-12 rounded-t-[20px] md:rounded-t-[40px] shadow-lg">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-4">
            {/* Era Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedEra ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedEra(null)}
                className={cn(
                  "rounded-full px-4 md:px-5 font-bold uppercase tracking-tight text-xs md:text-sm transition-all",
                  !selectedEra 
                    ? "bg-[#003285] hover:bg-[#002561] shadow-md" 
                    : "border-slate-200 text-slate-600 hover:bg-slate-100"
                )}
              >
                All Eras
              </Button>
              {eras?.map((era: any) => (
                <Button
                  key={era}
                  variant={selectedEra === era ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedEra(era)}
                  className={cn(
                    "rounded-full px-4 md:px-5 font-bold uppercase tracking-tight text-xs md:text-sm transition-all",
                    selectedEra === era 
                      ? "bg-[#003285] hover:bg-[#002561] shadow-md" 
                      : "border-slate-200 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {era}
                </Button>
              ))}
            </div>

            {/* Year Filters - Scrollable on mobile */}
            {years.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible">
                <Button
                  variant={selectedYear === null ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedYear(null)}
                  className="rounded-full px-4 font-bold text-xs md:text-sm flex-shrink-0"
                >
                  All Years
                </Button>
                {years.map((year: number) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedYear(year)}
                    className="rounded-full px-4 font-bold text-xs md:text-sm flex-shrink-0"
                  >
                    {year}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 md:py-16" ref={timelineRef}>
        <div className="container px-4 md:px-6">
          {!timelineEvents ? (
            <div className="space-y-8">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-24 md:w-32 flex-shrink-0" />
                  <Skeleton className="flex-1 h-32 md:h-40" />
                </div>
              ))}
            </div>
          ) : timelineEvents.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <Calendar className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Try selecting a different era or check back later
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline Line - Hidden on mobile, visible on md+ */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 md:w-px bg-border hidden sm:block" />

              <div className="space-y-6 md:space-y-8">
                {timelineEvents
                  .filter((event: any) => !selectedYear || event.year === selectedYear)
                  .slice(0, visibleItems)
                  .map((event: any, index: number) => (
                    <div
                      key={event._id}
                      className={cn(
                        "timeline-item relative flex flex-col sm:flex-row gap-6 md:gap-8 opacity-0",
                        "transition-all duration-500 ease-out",
                        index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                      )}
                    >
                      {/* Year Badge - Mobile (left side) */}
                      <div className="flex sm:hidden items-center gap-3 mb-2 pl-4">
                        <div className="flex-shrink-0 w-14 text-center">
                          <div className="text-2xl font-bold text-[#003285]">{event.year}</div>
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className={cn(
                        "flex-1 px-4 sm:px-0",
                        index % 2 === 0 ? "sm:pr-8 md:pr-12 lg:pr-16" : "sm:pl-8 md:pl-12 lg:pl-16"
                      )}>
                        <Card className={cn(
                          "hover:shadow-xl transition-all duration-300 border-none shadow-lg shadow-slate-100/50 dark:shadow-slate-900/50",
                          "rounded-[20px] md:rounded-[30px] lg:rounded-[40px] overflow-hidden",
                          "transform hover:scale-[1.02] active:scale-[0.98]"
                        )}>
                          <CardHeader className="p-6 md:p-8 lg:p-10">
                            <div className={cn(
                              "flex items-center gap-3 md:gap-4 mb-4 flex-wrap",
                              index % 2 === 0 ? "sm:flex-row-reverse" : "sm:flex-row"
                            )}>
                              <Badge className="bg-[#FF7F3E]/10 text-[#FF7F3E] border-[#FF7F3E]/20 font-black uppercase tracking-tighter text-[9px] md:text-[10px] px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                                {event.era}
                              </Badge>
                              {/* Year - Desktop (in card header) */}
                              <div className="text-2xl md:text-3xl font-black text-[#003285]">
                                {event.year}
                              </div>
                            </div>
                            <CardTitle className="text-xl md:text-2xl lg:text-3xl font-black text-[#003285] dark:text-white leading-tight mb-3 md:mb-4">
                              {event.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-6 md:px-8 lg:px-10 pb-6 md:pb-8 lg:pb-10 space-y-4 md:space-y-6">
                            <CardDescription className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                              {event.description}
                            </CardDescription>

                            {event.significance && (
                              <div className={cn(
                                "p-4 md:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[20px] md:rounded-[24px] lg:rounded-[32px] border-l-4 border-[#FF7F3E]",
                                index % 2 === 0 ? "sm:text-right" : "sm:text-left"
                              )}>
                                <div className={cn(
                                  "flex items-center gap-2 mb-3 flex-wrap",
                                  index % 2 === 0 ? "sm:flex-row-reverse" : "sm:flex-row"
                                )}>
                                  <BookOpen className="h-3 w-3 md:h-4 md:w-4 text-[#FF7F3E] flex-shrink-0" />
                                  <span className="font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-[#2A629A] dark:text-[#FFDA78]">
                                    Significance
                                  </span>
                                </div>
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
                                  {event.significance}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      {/* Timeline Dot - Center aligned */}
                      <div className="absolute left-8 sm:left-1/2 transform sm:-translate-x-1/2 flex items-center justify-center top-6 md:top-8">
                        <div className="w-4 h-4 md:w-5 md:h-5 bg-[#FF7F3E] rounded-full border-4 border-white dark:border-slate-950 shadow-lg shadow-[#FF7F3E]/40" />
                      </div>

                      {/* Spacer for alternating layout */}
                      <div className="hidden sm:block flex-1" />
                    </div>
                  ))}
              </div>

              {/* Load More Button */}
              {visibleItems < timelineEvents.filter((e: any) => !selectedYear || e.year === selectedYear).length && (
                <div className="text-center mt-12 md:mt-16">
                  <Button
                    onClick={loadMore}
                    className="bg-[#003285] hover:bg-[#002561] text-white font-bold px-8 md:px-12 py-6 md:py-7 rounded-full text-sm md:text-base shadow-lg hover:shadow-xl transition-all"
                  >
                    Load More Events
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Historical Note */}
      <section className="py-12 md:py-16 bg-muted/40 dark:bg-slate-900/40">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-[#003285] dark:text-white">Historical Note</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              The roots of Samta Sainik Dal trace back to the Mahad movement. While some sources record
              September 24, 1924, as the formation date during a Mahad conference, others highlight March 1927
              when Dr. Ambedkar formally announced the &quot;Social Equality Army&quot; during the Chavdar Lake struggle.
              SSD has since evolved from protective bodies like Bhim Sevak Dal and Dr. Ambedkar Seva Dal
              into a national volunteer force.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
