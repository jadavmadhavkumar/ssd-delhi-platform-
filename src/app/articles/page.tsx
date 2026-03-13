"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, BookOpen, Eye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hi" | null>(null);

  const articlesResult = useQuery(api.articles?.list as any, {
    status: "published",
    category: selectedCategory || undefined,
    language: selectedLanguage || undefined,
  });

  const articles = articlesResult?.articles ?? [];
  const categories = [...new Set(articles.map((a: any) => a.category))] as string[];

  const filteredArticles = articles?.filter((article: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.tags.some((tag: string) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 bg-[#003285] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2A629A]/30 blur-[120px] rounded-full" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl space-y-6">
            <Badge variant="outline" className="border-[#FF7F3E] text-[#FFDA78] bg-[#FF7F3E]/10 px-4 py-1 text-xs font-bold tracking-widest uppercase rounded-full">
              📚 Knowledge Repository
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
              Articles & <span className="text-[#FFDA78]">Resources</span>
            </h1>
            <p className="text-xl text-blue-100/90 font-medium leading-relaxed max-w-2xl">
              In-depth articles on SSD history, ideology, and social justice. Well-researched pieces with proper source citations and references.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white dark:bg-slate-950 border-b relative z-40 -mt-12 rounded-t-[40px] md:rounded-t-[80px]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="relative flex-1 w-full lg:max-w-md group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#003285] transition-colors" />
              <Input
                placeholder="Search knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 rounded-2xl border-slate-200 focus:ring-[#003285] focus:border-[#003285] transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={cn("rounded-full px-5 font-bold uppercase tracking-tight", !selectedCategory ? "bg-[#003285] hover:bg-[#002561]" : "border-slate-200 text-slate-600")}
              >
                All Categories
              </Button>
              {categories.map((category: string) => (
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
              <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block" />
              <Button
                variant={selectedLanguage === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLanguage(selectedLanguage === "en" ? null : "en")}
                className={cn("rounded-full px-5 font-bold", selectedLanguage === "en" ? "bg-[#2A629A] hover:bg-[#1a4d7c]" : "border-slate-200 text-slate-600")}
              >
                English
              </Button>
              <Button
                variant={selectedLanguage === "hi" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLanguage(selectedLanguage === "hi" ? null : "hi")}
                className={cn("rounded-full px-5 font-bold", selectedLanguage === "hi" ? "bg-[#2A629A] hover:bg-[#1a4d7c]" : "border-slate-200 text-slate-600")}
              >
                हिंदी
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          {!filteredArticles ? (
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
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article: any) => (
                <Link key={article._id} href={`/articles/${article.slug}`} className="group">
                  <Card className="h-full border-none shadow-xl shadow-slate-100/60 rounded-[40px] overflow-hidden group-hover:-translate-y-2 transition-all duration-300">
                    <div className="aspect-[4/3] bg-gradient-to-br from-[#003285] to-[#2A629A] relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                      <Badge className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white border-white/10 font-bold uppercase tracking-tighter text-[10px] px-3 py-1 rounded-full">
                        {article.category}
                      </Badge>
                      <Badge className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-sm text-white border-white/5 font-bold text-[10px] px-3 py-1 rounded-full">
                        {article.language === "en" ? "English" : "हिंदी"}
                      </Badge>
                    </div>
                    <CardHeader className="p-10">
                      <CardTitle className="text-2xl font-black text-[#003285] group-hover:text-[#FF7F3E] transition-colors leading-tight mb-4 line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-slate-500 line-clamp-3 text-base font-medium leading-relaxed mb-8">
                        {article.excerpt}
                      </CardDescription>
                      <div className="flex items-center justify-between text-xs font-black text-slate-400 border-t border-slate-50 pt-6">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-[#2A629A]" />
                          {article.viewCount.toLocaleString()} VIEWS
                        </div>
                        <div className="uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                          {article.publishedAt && new Date(article.publishedAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </CardHeader>
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
