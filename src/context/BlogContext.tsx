import React, { createContext, useContext, useState, useEffect } from "react";

const API_URL = import.meta.env.PROD ? "/api/posts" : "http://localhost:3000/api/posts";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readTime: number;
  featuredImage?: string;
}

interface MongoPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readTime: number;
  featuredImage?: string;
}

interface BlogContextType {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  refreshPosts: () => Promise<void>;
  getPost: (id: string) => BlogPost | undefined;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const transformMongoPost = (post: MongoPost): BlogPost => {
  return {
    id: post._id,
    title: post.title || "",
    excerpt: post.excerpt || "",
    content: post.content || "",
    date: post.date || "",
    author: post.author || "",
    category: post.category || "",
    tags: post.tags || [],
    readTime: post.readTime || 5,
    featuredImage: post.featuredImage || undefined,
  };
};

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      const transformedPosts = (data.posts || []).map(transformMongoPost);
      setPosts(transformedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const refreshPosts = async () => {
    await fetchPosts();
  };

  const getPost = (id: string) => {
    return posts.find((post) => post.id === id);
  };

  return (
    <BlogContext.Provider value={{ posts, loading, error, refreshPosts, getPost }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};
