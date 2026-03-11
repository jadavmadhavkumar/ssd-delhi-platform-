"use client";

import { use, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Eye, User, BookOpen, ExternalLink, Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const article = useQuery(api.articles?.getBySlug as any, { slug });
  const incrementView = useMutation(api.articles?.getById as any);

  const [hasIncremented, setHasIncremented] = useState(false);

  if (!article) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-64 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    notFound();
  }

  // Increment view count once per session
  if (!hasIncremented && article.status === "published") {
    incrementView({ id: article._id as Id<"articles"> });
    setHasIncremented(true);
  }

  return (
    <article className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-48 bg-[#003285] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF7F3E]/20 blur-[120px] rounded-full" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="border-[#FF7F3E] text-[#FFDA78] bg-[#FF7F3E]/10 px-4 py-1 text-xs font-bold tracking-widest uppercase rounded-full">
                {article.category}
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white/80 bg-white/5 px-4 py-1 text-xs font-bold tracking-widest uppercase rounded-full">
                {article.language === "en" ? "English" : "हिंदी"}
              </Badge>
              {article.featured && (
                <Badge className="bg-[#FFDA78] text-[#003285] border-none px-4 py-1 text-xs font-bold tracking-widest uppercase rounded-full">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-blue-100/90 font-medium leading-relaxed max-w-3xl">
              {article.excerpt}
            </p>

            <div className="flex items-center gap-8 text-sm font-bold text-white/60 flex-wrap uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-[#FFDA78]">
                  <User className="h-5 w-5" />
                </div>
                <span>SSD Editorial</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#FF7F3E]" />
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  : "Draft"}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-[#2A629A]" />
                {article.viewCount} views
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-24 -mt-24 relative z-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[40px] md:rounded-[80px] p-8 md:p-20 border border-slate-100 dark:border-slate-800">
              {article.featuredImage && (
                <div className="aspect-video bg-[#003285]/5 rounded-[40px] mb-12 flex items-center justify-center overflow-hidden">
                  <div className="h-20 w-20 rounded-full bg-[#003285]/10 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-[#003285]" />
                  </div>
                </div>
              )}

              <div
                className="prose prose-lg md:prose-xl dark:prose-invert max-w-none prose-headings:text-[#003285] prose-headings:font-black prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-[#FF7F3E] prose-strong:text-[#003285] dark:prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="mt-16 pt-12 border-t border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#2A629A]">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-black text-[#003285] uppercase tracking-widest">Topic Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag: string) => (
                      <Badge key={tag} className="bg-slate-50 text-slate-500 border-none px-4 py-2 rounded-full font-bold hover:bg-[#FF7F3E]/10 hover:text-[#FF7F3E] transition-colors">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources */}
              {article.sources && article.sources.length > 0 && (
                <div className="mt-16 p-10 bg-[#003285]/5 rounded-[40px] border border-[#003285]/10">
                  <h3 className="text-xl font-black text-[#003285] mb-8 flex items-center gap-3 uppercase tracking-tight">
                    <ExternalLink className="h-6 w-6 text-[#FF7F3E]" />
                    Sources & References
                  </h3>
                  <ul className="space-y-6">
                    {article.sources.map((source: { title: string; url: string; accessedDate: string }, index: number) => (
                      <li key={index} className="flex gap-4 group">
                        <span className="font-black text-2xl text-[#003285]/20">{index + 1}</span>
                        <div>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#003285] font-bold hover:text-[#FF7F3E] flex items-center gap-2 group-hover:translate-x-1 transition-all"
                          >
                            {source.title}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">
                            Verified on {source.accessedDate}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <RelatedArticles articleId={article._id} />
    </article>
  );
}

function RelatedArticles({ articleId }: { articleId: any }) {
  const relatedArticles = useQuery(api.articles?.getRelated as any, {
    articleId,
    limit: 3,
  });

  if (!relatedArticles || relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 border-t">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-black text-[#003285] mb-12 uppercase tracking-tight">Recommended for You</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {relatedArticles.map((article: any) => (
            <Link key={article._id} href={`/articles/${article.slug}`} className="group">
              <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border-none shadow-xl shadow-slate-200/50 dark:shadow-none group-hover:-translate-y-2 transition-all duration-300">
                <Badge className="mb-6 bg-[#2A629A]/10 text-[#2A629A] border-none font-black uppercase tracking-tighter text-[10px] px-3 py-1 rounded-full">
                  {article.category}
                </Badge>
                <h3 className="text-xl font-black text-[#003285] group-hover:text-[#FF7F3E] transition-colors leading-tight mb-4 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
