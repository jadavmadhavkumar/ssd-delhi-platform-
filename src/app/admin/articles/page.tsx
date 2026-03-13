"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const articles = useQuery(api.articles?.list as any, { status: undefined });
  const publishArticle = useMutation(api.articles?.publish as any);
  const archiveArticle = useMutation(api.articles?.archive as any);
  const deleteArticle = useMutation(api.articles?.remove as any);

  const filteredArticles = articles?.filter((article: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.excerpt?.toLowerCase().includes(query)
    );
  });

  const handlePublish = async (id: string) => {
    try {
      await publishArticle({ id });
      toast.success("Article published!");
    } catch (error) {
      toast.error("Failed to publish article");
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveArticle({ id });
      toast.success("Article archived!");
    } catch (error) {
      toast.error("Failed to archive article");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await deleteArticle({ id });
      toast.success("Article deleted!");
    } catch (error) {
      toast.error("Failed to delete article");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800",
      published: "bg-green-100 text-green-800",
      archived: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Articles Management</h1>
              <p className="text-muted-foreground">
                Create, edit, and manage articles
              </p>
            </div>
            <Link href="/admin/articles/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Articles List */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Articles</CardTitle>
                  <CardDescription>
                    Manage your article repository
                  </CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!articles ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : !filteredArticles || filteredArticles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No articles found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredArticles.map((article: any) => (
                        <TableRow key={article._id}>
                          <TableCell className="font-medium max-w-xs">
                            <div className="truncate">{article.title}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{article.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {article.language === "en" ? "English" : "हिंदी"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                              {article.status}
                            </span>
                          </TableCell>
                          <TableCell>{article.viewCount || 0}</TableCell>
                          <TableCell>
                            {article.publishedAt
                              ? new Date(article.publishedAt).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Link href={`/articles/${article.slug}`}>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/admin/articles/${article._id}`}>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              {article.status === "draft" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handlePublish(article._id)}
                                >
                                  <EyeOff className="h-4 w-4" />
                                </Button>
                              )}
                              {article.status === "published" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleArchive(article._id)}
                                >
                                  <EyeOff className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(article._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
