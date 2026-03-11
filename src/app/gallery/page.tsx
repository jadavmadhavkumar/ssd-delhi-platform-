"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Image, Video, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const media = useQuery(api.media?.list as any, {
    type: selectedType as any || undefined,
    category: selectedCategory || undefined,
    limit: 50,
  }) || [];

  const categories = [...new Set(media.map((m: any) => m.category))];
  const types = ["image", "video", "document"];

  const filteredMedia = media.filter((item: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.tags.some((tag: string) => tag.toLowerCase().includes(query))
    );
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image": return <Image className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      case "document": return <FileText className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 bg-[#003285] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FF7F3E]/20 blur-[120px] rounded-full" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl space-y-6">
            <Badge variant="outline" className="border-[#FF7F3E] text-[#FFDA78] bg-[#FF7F3E]/10 px-4 py-1 text-xs font-bold tracking-widest uppercase rounded-full">
              📸 Media Gallery
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
              A Century in <span className="text-[#FFDA78]">Pictures</span>
            </h1>
            <p className="text-xl text-blue-100/90 font-medium leading-relaxed max-w-2xl">
              Photos, videos, and documents from SSD Delhi activities. Explore our legacy and the movement&apos;s journey.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white dark:bg-slate-950 border-b relative z-40 -mt-12 rounded-t-[40px] md:rounded-t-[80px]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="relative flex-1 w-full lg:max-w-md group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#003285] transition-colors" />
              <Input
                placeholder="Search gallery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 rounded-2xl border-slate-200 focus:ring-[#003285] focus:border-[#003285] transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedType ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(null)}
                className={cn("rounded-full px-5 font-bold uppercase tracking-tight", !selectedType ? "bg-[#003285] hover:bg-[#002561]" : "border-slate-200 text-slate-600")}
              >
                All Media
              </Button>
              {types.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className={cn("rounded-full px-5 capitalize font-bold tracking-tight", selectedType === type ? "bg-[#003285] hover:bg-[#002561]" : "border-slate-200 text-slate-600")}
                >
                  {type}
                </Button>
              ))}
              {categories.map((category: string) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={cn("rounded-full px-5 font-bold tracking-tight", selectedCategory === category ? "bg-[#003285] hover:bg-[#002561]" : "border-slate-200 text-slate-600")}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          {!media || media.length === 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-48 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No media found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredMedia.map((item: any) => (
                  <Card key={item._id} className="border-none shadow-xl shadow-slate-100/60 rounded-[40px] overflow-hidden group hover:-translate-y-2 transition-all duration-300">
                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden group">
                      {item.type === "image" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#003285] to-[#2A629A]">
                          <Image className="h-16 w-16 text-white/20" />
                        </div>
                      )}
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#003285] to-[#2A629A]">
                          <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                            <Video className="h-10 w-10 text-white" />
                          </div>
                        </div>
                      )}
                      {item.type === "document" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                          <FileText className="h-16 w-16 text-[#003285]/20" />
                        </div>
                      )}
                      <Badge className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white border-white/10 font-bold uppercase tracking-tighter text-[10px] px-3 py-1 rounded-full">
                        {getTypeIcon(item.type)}
                        <span className="ml-1 capitalize font-black">{item.type}</span>
                      </Badge>
                    </div>
                    <CardContent className="p-10">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-[#2A629A]/10 text-[#2A629A] border-none font-black uppercase tracking-tighter text-[10px] px-3 py-1 rounded-full">
                          {item.category}
                        </Badge>
                        {item.year && (
                          <span className="text-xs font-black text-slate-400">{item.year}</span>
                        )}
                      </div>
                      <CardTitle className="text-2xl font-black text-[#003285] mb-4 group-hover:text-[#FF7F3E] transition-colors">{item.title}</CardTitle>
                      {item.description && (
                        <CardDescription className="text-slate-500 font-medium line-clamp-2 text-base leading-relaxed mb-6">
                          {item.description}
                        </CardDescription>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-50">
                          {item.tags.slice(0, 3).map((tag: string, i: number) => (
                            <Badge key={i} className="bg-slate-50 text-slate-400 border-none text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
