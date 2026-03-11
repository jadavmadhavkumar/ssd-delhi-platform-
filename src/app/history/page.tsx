import { Suspense } from "react";
import { HistoryClient } from "./history-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Server Component with SSR for better SEO and initial load
export default function HistoryPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Server Rendered */}
      <section className="relative pt-24 pb-32 bg-[#003285] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF7F3E]/20 blur-[120px] rounded-full" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl space-y-6">
            <Badge 
              variant="outline" 
              className="border-[#FF7F3E] text-[#FFDA78] bg-[#FF7F3E]/10 px-4 py-1 text-xs font-bold tracking-widest uppercase rounded-full"
            >
              📜 Historical Archive
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
              A Century of <span className="text-[#FFDA78]">Struggle</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100/90 font-medium leading-relaxed max-w-2xl">
              SSD Delhi: Soldiers for Equality since 1924. Building a casteless society through discipline, education, and non-violent resistance.
            </p>
          </div>
        </div>
      </section>

      {/* Client Component with Suspense for Lazy Loading */}
      <Suspense fallback={<HistorySkeleton />}>
        <HistoryClient />
      </Suspense>
    </div>
  );
}

// Skeleton Loading State for Lazy Loading
function HistorySkeleton() {
  return (
    <>
      {/* Filters Skeleton */}
      <section className="py-8 bg-white dark:bg-slate-950 border-b relative z-40 -mt-12 rounded-t-[20px] md:rounded-t-[40px]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-20 rounded-full" />
          </div>
        </div>
      </section>

      {/* Timeline Skeleton */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="space-y-8">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-12 w-24 md:w-32" />
                <Card className="flex-1 p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historical Note Skeleton */}
      <section className="py-12 md:py-16 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        </div>
      </section>
    </>
  );
}
