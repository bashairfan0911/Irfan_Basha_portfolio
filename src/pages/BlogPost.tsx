import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Clock, Loader2 } from "lucide-react";
import { useBlog } from "@/context/BlogContext";

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPost, loading } = useBlog();
  const post = id ? getPost(id) : undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Button variant="ghost" onClick={() => navigate("/blog")} className="gap-2 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <Link to="/blog">
              <Button>Return to Blog</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Navigation Buttons */}
        <div className="flex gap-2 mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => navigate("/blog")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </div>

        {/* Article Header */}
        <article className="bg-card border border-border/50 rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
          <div className="w-full h-96 overflow-hidden">
            {post.featuredImage ? (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <span className="text-muted-foreground text-lg">{post.category || "Blog Post"}</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 md:p-12">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">{post.title}</h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8 pb-8 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
              {post.category && (
                <Badge className="bg-accent text-accent-foreground">{post.category}</Badge>
              )}
            </div>

            {/* Content */}
            <div className="prose dark:prose-invert max-w-none mb-8">
              <p className="text-lg text-foreground/80 mb-6">{post.excerpt}</p>
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="space-y-4 text-foreground/70"
              />
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-8 border-t border-border/50">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-12">
          <Link to="/blog">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to All Posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
