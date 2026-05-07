import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Clock, Loader2 } from "lucide-react";
import { useBlog, parseContent, ContentBlock } from "@/context/BlogContext";

function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.type === "text") {
          return (
            <div
              key={i}
              dangerouslySetInnerHTML={{ __html: block.value }}
              className="prose prose-neutral dark:prose-invert max-w-none
                prose-p:text-foreground/80 prose-headings:text-foreground
                prose-strong:text-foreground prose-code:text-primary
                prose-a:text-primary prose-a:underline
                prose-ul:text-foreground/80 prose-ol:text-foreground/80
                prose-li:text-foreground/80 prose-blockquote:border-primary"
            />
          );
        }

        if (block.type === "image") {
          const hasSize = block.naturalWidth && block.naturalHeight;
          const isPortrait = hasSize && block.naturalHeight! > block.naturalWidth!;

          return (
            <figure key={i} className="my-2">
              <a
                href={block.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block overflow-hidden rounded-xl border border-border/50 hover:border-primary/50 transition-colors bg-muted/10 ${
                  isPortrait ? "mx-auto max-w-sm" : "w-full"
                }`}
                style={
                  hasSize
                    ? { aspectRatio: `${block.naturalWidth} / ${block.naturalHeight}` }
                    : {}
                }
              >
                <img
                  src={block.url}
                  alt={block.caption || ""}
                  className="w-full h-full object-contain hover:scale-[1.02] transition-transform duration-300"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </a>
              {block.caption && (
                <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        return null;
      })}
    </div>
  );
}

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

  const blocks = parseContent(post.content);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Navigation */}
        <div className="flex gap-2 mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => navigate("/blog")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Blog
          </Button>
        </div>

        <article className="bg-card border border-border/50 rounded-xl shadow-lg overflow-hidden">
          {/* Cover image */}
          {post.featuredImage ? (
            <div className="w-full h-72 md:h-96 overflow-hidden">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-5xl">📝</span>
            </div>
          )}

          <div className="p-6 md:p-10">
            {/* Category */}
            {post.category && (
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                {post.category}
              </Badge>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border/40">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            {/* Excerpt */}
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed font-medium">
              {post.excerpt}
            </p>

            {/* Inline blocks: text + images mixed */}
            <BlockRenderer blocks={blocks} />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border/40">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </article>

        <div className="mt-10">
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
