// @ts-nocheck – legacy component, not currently used in any page
"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// Types
interface Blog {
  _id: Id<"blogs">;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: Id<"_storage">;
  category: string;
  tags: string[];
  language: "en" | "hi";
  status: "draft" | "published";
  publishedAt?: number;
  viewCount: number;
  authorName: string;
  authorPhoto?: Id<"_storage">;
  url?: string | null;
}

interface Article {
  _id: Id<"articles">;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: Id<"_storage">;
  category: string;
  tags: string[];
  language: "en" | "hi";
  status: "draft" | "published" | "archived";
  publishedAt?: number;
  viewCount: number;
  featured: boolean;
  authorName: string;
  authorPhoto?: Id<"_storage">;
  url?: string | null;
}

interface Media {
  _id: Id<"mediaGallery">;
  fileId: Id<"_storage">;
  title: string;
  description?: string;
  type: "image" | "video" | "document";
  category: string;
  tags: string[];
  uploadedAt: number;
  year?: number;
  featured: boolean;
  uploaderName: string;
  url?: string | null;
}

// Icons
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const VideoIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

// Tab Button Component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 ${active
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
      : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
      }`}
  >
    {children}
  </button>
);

// Blog Card Component
interface BlogCardProps {
  blog: Blog;
  viewMode: "grid" | "list";
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, viewMode }) => {
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (viewMode === "list") {
    return (
      <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex">
        {blog.featuredImage && blog.url && (
          <div className="w-48 h-full bg-gray-100 flex-shrink-0">
            <img
              src={blog.url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
              {blog.category}
            </span>
            <span className="text-xs text-gray-500 uppercase">{blog.language}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
            <a href={`/blogs/${blog.slug}`}>{blog.title}</a>
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {blog.excerpt || blog.content.substring(0, 150)}...
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <UserIcon />
                {blog.authorName}
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon />
                {formatDate(blog.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <EyeIcon />
                {blog.viewCount}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {blog.featuredImage && blog.url ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={blog.url}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-indigo-700 rounded-full text-xs font-medium">
              {blog.category}
            </span>
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <DocumentIcon />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500 uppercase">{blog.language}</span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <EyeIcon />
            {blog.viewCount}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          <a href={`/blogs/${blog.slug}`}>{blog.title}</a>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {blog.excerpt || blog.content.substring(0, 100)}...
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {blog.authorPhoto ? (
              <img
                src={blog.authorPhoto}
                alt={blog.authorName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                {blog.authorName.charAt(0)}
              </div>
            )}
            <span className="text-sm text-gray-700 font-medium">{blog.authorName}</span>
          </div>
          <span className="text-xs text-gray-500">{formatDate(blog.publishedAt)}</span>
        </div>
      </div>
    </article>
  );
};

// Article Card Component
interface ArticleCardProps {
  article: Article;
  viewMode: "grid" | "list";
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, viewMode }) => {
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (viewMode === "list") {
    return (
      <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex">
        {article.featuredImage && article.url && (
          <div className="w-48 h-full bg-gray-100 flex-shrink-0">
            <img
              src={article.url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
              {article.category}
            </span>
            {article.featured && (
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                Featured
              </span>
            )}
            <span className="text-xs text-gray-500 uppercase">{article.language}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
            <a href={`/articles/${article.slug}`}>{article.title}</a>
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {article.excerpt}...
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <UserIcon />
              {article.authorName}
            </span>
            <span className="flex items-center gap-1">
              <CalendarIcon />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <EyeIcon />
              {article.viewCount}
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {article.featuredImage && article.url ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-emerald-700 rounded-full text-xs font-medium">
              {article.category}
            </span>
            {article.featured && (
              <span className="px-2.5 py-1 bg-amber-500 text-white rounded-full text-xs font-medium">
                ★ Featured
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
          <DocumentIcon />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500 uppercase">{article.language}</span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <EyeIcon />
            {article.viewCount}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          <a href={`/articles/${article.slug}`}>{article.title}</a>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {article.authorPhoto ? (
              <img
                src={article.authorPhoto}
                alt={article.authorName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold text-sm">
                {article.authorName.charAt(0)}
              </div>
            )}
            <span className="text-sm text-gray-700 font-medium">{article.authorName}</span>
          </div>
          <span className="text-xs text-gray-500">{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </article>
  );
};

// Media Card Component
interface MediaCardProps {
  media: Media;
  viewMode: "grid" | "list";
}

const MediaCard: React.FC<MediaCardProps> = ({ media, viewMode }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getIcon = () => {
    switch (media.type) {
      case "image":
        return <ImageIcon />;
      case "video":
        return <VideoIcon />;
      case "document":
        return <DocumentIcon />;
    }
  };

  const getTypeColor = () => {
    switch (media.type) {
      case "image":
        return "from-purple-500 to-pink-500";
      case "video":
        return "from-red-500 to-orange-500";
      case "document":
        return "from-blue-500 to-cyan-500";
    }
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex items-center p-4">
        <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${getTypeColor()} flex items-center justify-center text-white flex-shrink-0`}>
          {getIcon()}
        </div>
        <div className="flex-1 ml-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium uppercase">
              {media.type}
            </span>
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
              {media.category}
            </span>
            {media.featured && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                Featured
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900">{media.title}</h3>
          <p className="text-sm text-gray-500">
            {formatDate(media.uploadedAt)} • {media.uploaderName}
          </p>
        </div>
        {media.url && (
          <a
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <DownloadIcon />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {media.type === "image" && media.url ? (
          <img
            src={media.url}
            alt={media.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getTypeColor()} flex items-center justify-center text-white`}>
            {media.type === "video" && (
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <PlayIcon />
              </div>
            )}
            {media.type !== "video" && getIcon()}
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full text-xs font-medium uppercase">
            {media.type}
          </span>
          {media.featured && (
            <span className="px-2.5 py-1 bg-amber-500 text-white rounded-full text-xs font-medium">
              ★
            </span>
          )}
        </div>
        {media.url && media.type !== "image" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <a
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white/90 backdrop-blur-sm rounded-full text-indigo-600 hover:bg-white transition-colors shadow-lg"
            >
              <DownloadIcon />
            </a>
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
          {media.category}
        </span>
        <h3 className="font-semibold text-gray-900 mt-2 line-clamp-1">{media.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{formatDate(media.uploadedAt)}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">{media.uploaderName}</span>
          {media.url && media.type === "image" && (
            <a
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeftIcon />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page
            ? "bg-indigo-600 text-white"
            : "border border-gray-200 hover:bg-gray-50"
            }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

// Main ContentDisplay Component
export default function ContentDisplay() {
  const [activeTab, setActiveTab] = useState<"blogs" | "articles" | "media">("blogs");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 12;

  // Fetch data
  const blogsData = useQuery(api.blogs.list, {
    page: currentPage,
    limit: itemsPerPage,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    language: selectedLanguage !== "all" ? selectedLanguage : undefined,
    sortBy,
  });

  const articlesData = useQuery(api.articles.list, {
    page: currentPage,
    limit: itemsPerPage,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    language: selectedLanguage !== "all" ? selectedLanguage : undefined,
    sortBy,
  });

  const mediaData = useQuery(api.media.list, {
    page: currentPage,
    limit: itemsPerPage,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    sortBy,
  });

  // Fetch categories
  const blogCategories = useQuery(api.blogs.getCategories);
  const articleCategories = useQuery(api.articles.getCategories);
  const mediaCategories = useQuery(api.media.getCategories);

  const getData = () => {
    switch (activeTab) {
      case "blogs":
        return blogsData;
      case "articles":
        return articlesData;
      case "media":
        return mediaData;
    }
  };

  const getCategories = () => {
    switch (activeTab) {
      case "blogs":
        return blogCategories;
      case "articles":
        return articleCategories;
      case "media":
        return mediaCategories;
    }
  };

  const data = getData();
  const categories = getCategories();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Content Library</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                <ListIcon />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <TabButton active={activeTab === "blogs"} onClick={() => setActiveTab("blogs")}>
            📝 Blogs
          </TabButton>
          <TabButton active={activeTab === "articles"} onClick={() => setActiveTab("articles")}>
            📄 Articles
          </TabButton>
          <TabButton active={activeTab === "media"} onClick={() => setActiveTab("media")}>
            🖼️ Media
          </TabButton>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <FilterIcon />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories?.map((cat: { name: string; count: number }) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            {activeTab !== "media" && (
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Languages</option>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            )}

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Content Grid/List */}
        {data ? (
          <>
            {activeTab === "blogs" && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {data.blogs.map((blog: Blog) => (
                  <BlogCard key={blog._id} blog={blog} viewMode={viewMode} />
                ))}
              </div>
            )}

            {activeTab === "articles" && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {data.articles.map((article: Article) => (
                  <ArticleCard key={article._id} article={article} viewMode={viewMode} />
                ))}
              </div>
            )}

            {activeTab === "media" && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {data.media.map((mediaItem: Media) => (
                  <MediaCard key={mediaItem._id} media={mediaItem} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {data.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {/* Empty State */}
            {((activeTab === "blogs" && data.blogs.length === 0) ||
              (activeTab === "articles" && data.articles.length === 0) ||
              (activeTab === "media" && data.media.length === 0)) && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    {activeTab === "blogs" && <DocumentIcon />}
                    {activeTab === "articles" && <DocumentIcon />}
                    {activeTab === "media" && <ImageIcon />}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No content found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search query</p>
                </div>
              )}
          </>
        ) : (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </main>
    </div>
  );
}
