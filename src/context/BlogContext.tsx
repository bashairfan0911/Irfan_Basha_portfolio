import React, { createContext, useContext, useState, useEffect } from "react";

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

interface BlogContextType {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, "id">) => void;
  deletePost: (id: string) => void;
  updatePost: (id: string, post: Omit<BlogPost, "id">) => void;
  getPost: (id: string) => BlogPost | undefined;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const STORAGE_KEY = "blog_posts";

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load posts from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem(STORAGE_KEY);
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (error) {
        console.error("Failed to load posts from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save posts to localStorage whenever they change (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }
  }, [posts, isLoaded]);

  const addPost = (post: Omit<BlogPost, "id">) => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
    };
    setPosts([newPost, ...posts]);
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const updatePost = (id: string, post: Omit<BlogPost, "id">) => {
    setPosts(posts.map((p) => (p.id === id ? { ...post, id } : p)));
  };

  const getPost = (id: string) => {
    return posts.find((post) => post.id === id);
  };

  return (
    <BlogContext.Provider value={{ posts, addPost, deletePost, updatePost, getPost }}>
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
