import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, ArrowLeft, Loader2, Rss } from "lucide-react";
import { useBlog } from "@/context/BlogContext";

export default function Blog() {
  const { posts, loading, error } = useBlog();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(posts.map((post) => post.category).filter(Boolean)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-border/50 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <Link to="/" className="flex-shrink-0">
              <Button variant="ghost" className="gap-2 text-sm">
                <ArrowLeft className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-gradient">Blog</h1>
                <Rss className="h-6 w-6 text-primary opacity-70" />
              </div>
              <p className="text-sm sm:text-lg text-muted-foreground">
                Insights on DevOps, Cloud Infrastructure, and Modern Development
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <Input
              placeholder="Search posts by title or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border/50 text-sm sm:text-base"
            />
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                size="sm"
                className="text-xs sm:text-sm"
              >
                All ({posts.length})
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredPosts.length > 0 ? (
          <>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
              {selectedCategory ? ` in "${selectedCategory}"` : ""}
              {searchTerm ? ` matching "${searchTerm}"` : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-xl transition-all duration-300 bg-card border-border/50 overflow-hidden flex flex-col group"
                >
                  {/* Featured Image */}
                  <div className="w-full aspect-video overflow-hidden flex-shrink-0 relative bg-gradient-to-br from-primary/20 via-accent/15 to-muted">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><div class="text-center"><div class="text-3xl mb-1">📝</div><span class="text-muted-foreground text-xs">${post.category || "Blog"}</span></div></div>`;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl sm:text-4xl mb-1">📝</div>
                          <span className="text-muted-foreground text-xs sm:text-sm">{post.category || "Blog"}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <CardHeader className="flex-1 pb-2 pt-4 px-4 sm:px-5">
                    {post.category && (
                      <Badge className="w-fit mb-2 bg-primary/10 text-primary border-primary/20 text-xs">
                        {post.category}
                      </Badge>
                    )}
                    <Link to={`/blog/${post.id}`}>
                      <CardTitle className="hover:text-primary transition-colors cursor-pointer text-base sm:text-lg leading-snug line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </Link>
                    <CardDescription className="mt-2 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0 px-4 sm:px-5 pb-4 sm:pb-5">
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                            #{tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span>{post.readTime} min read</span>
                    </div>
                    <Link to={`/blog/${post.id}`} className="block">
                      <Button variant="outline" size="sm" className="w-full gap-2 text-xs sm:text-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                        Read More
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-muted-foreground text-sm sm:text-base">
              {searchTerm || selectedCategory ? "No posts match your filters." : "No posts yet."}
            </p>
            {(searchTerm || selectedCategory) && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
