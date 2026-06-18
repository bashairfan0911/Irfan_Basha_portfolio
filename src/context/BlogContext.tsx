import React, { createContext, useContext, useState, useEffect } from "react";

const API_URL = "/api/posts.mjs";

// A content block is either a text (HTML) block or an image block
export type ContentBlock =
  | { type: "text"; value: string }
  | { type: "image"; url: string; caption?: string; naturalWidth?: number; naturalHeight?: number };

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  /** JSON-stringified ContentBlock[] */
  content: string;
  author: string;
  category: string;
  tags: string[];
  readTime: number;
  featuredImage?: string;
  createdAt: string;
  hidden?: boolean;
  pdfUrl?: string;
}

// Raw shape returned from MongoDB
interface MongoPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  readTime: number;
  featuredImage?: string;
  createdAt: string;
  hidden?: boolean;
  pdfUrl?: string;
}

interface BlogContextType {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  refreshPosts: () => Promise<void>;
  getPost: (id: string) => BlogPost | undefined;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

function transformPost(p: MongoPost): BlogPost {
  return {
    id: p._id,
    title: p.title || "",
    excerpt: p.excerpt || "",
    content: p.content || "",
    author: p.author || "",
    category: p.category || "",
    tags: p.tags || [],
    readTime: p.readTime || 5,
    featuredImage: p.featuredImage || undefined,
    createdAt: p.createdAt || p._id, // fallback
    hidden: p.hidden || false,
    pdfUrl: p.pdfUrl || undefined,
  };
}

/** Parse content string into blocks (supports legacy plain-HTML strings too) */
export function parseContent(content: string): ContentBlock[] {
  if (!content) return [{ type: "text", value: "" }];
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed as ContentBlock[];
  } catch {
    // legacy: raw HTML string → treat as single text block
  }
  return [{ type: "text", value: content }];
}

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Failed to load posts (${res.status})`);
      const data = await res.json();
      setPosts((data.posts || []).map(transformPost));
    } catch (err) {
      console.error("BlogContext fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  const getPost = (id: string) => posts.find((p) => p.id === id);

  return (
    <BlogContext.Provider value={{ posts, loading, error, refreshPosts, getPost }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error("useBlog must be used within a BlogProvider");
  return context;
};
