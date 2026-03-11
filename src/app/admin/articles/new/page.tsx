"use client";

import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const articleFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  language: z.union([z.literal("en"), z.literal("hi")]),
  featured: z.boolean().default(false),
  sources: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    accessedDate: z.string(),
  })).optional(),
});

export default function AdminNewArticlePage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createArticle = useMutation(api.articles?.create as any);
  const publishArticle = useMutation(api.articles?.publish as any);
  // AI Generate temporarily disabled
  // const generateContent = useAction(api.articles?.generateContent as any);

  const form = useForm<z.infer<typeof articleFormSchema>>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "",
      tags: "",
      language: "en",
      featured: false,
      sources: [],
    },
  });

  const handleAIGenerate = async () => {
    toast.info("AI features disabled", {
      description: "Run 'npx convex dev' to enable AI features",
    });
    return;
    
    // AI Generate temporarily disabled - enable after running: npx convex dev
    /*
    const title = form.getValues("title");
    const language = form.getValues("language");

    if (!title) {
      toast.error("Please enter a title first");
      return;
    }

    setIsGenerating(true);
    try {
      const generatedContent = await generateContent({
        prompt: `Write a detailed article about: ${title}. Include historical context, significance, and relevance to Samta Sainik Dal's mission.`,
        type: "article",
        language,
      });

      form.setValue("content", generatedContent);
      
      // Generate excerpt from first paragraph
      const excerpt = generatedContent.split("\n")[0]?.substring(0, 200) + "...";
      form.setValue("excerpt", excerpt);

      toast.success("Content generated successfully!");
    } catch (error) {
      toast.error("Failed to generate content. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
    */
  };

  async function onSubmit(values: z.infer<typeof articleFormSchema>) {
    setIsSubmitting(true);
    try {
      const tagsArray = values.tags
        ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const articleId = await createArticle({
        title: values.title,
        content: values.content,
        excerpt: values.excerpt,
        category: values.category,
        tags: tagsArray,
        language: values.language,
        featured: values.featured,
        sources: values.sources || [],
      });

      // Optionally publish immediately
      if (values.featured) {
        await publishArticle({ id: articleId });
      }

      toast.success("Article created successfully!");
      router.push("/admin/articles");
    } catch (error) {
      toast.error("Failed to create article");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/articles">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Create New Article</h1>
              <p className="text-muted-foreground">
                Add a new article to the repository
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Article Form */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Article Details</CardTitle>
                    <CardDescription>
                      Fill in the article information below
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAIGenerate}
                    disabled={true}
                    title="AI features disabled - run 'npx convex dev' to enable"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Generate (Disabled)
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter article title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="History">History</SelectItem>
                                <SelectItem value="Ideology">Ideology</SelectItem>
                                <SelectItem value="Events">Events</SelectItem>
                                <SelectItem value="News">News</SelectItem>
                                <SelectItem value="Biography">Biography</SelectItem>
                                <SelectItem value="Analysis">Analysis</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <Input placeholder="Ambedkar, SSD, Equality (comma separated)" {...field} />
                            </FormControl>
                            <FormDescription>
                              Separate tags with commas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <textarea
                              className="w-full min-h-[100px] px-3 py-2 border rounded-md bg-background"
                              placeholder="Short summary (150-200 characters)"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Brief summary that appears in listings
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <textarea
                              className="w-full min-h-[400px] px-3 py-2 border rounded-md bg-background font-mono text-sm"
                              placeholder="Write your article content here (Markdown supported)"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Full article content in Markdown format
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Featured Article</FormLabel>
                            <FormDescription>
                              Show this article on the homepage
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSubmitting}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Creating..." : "Create Article"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
