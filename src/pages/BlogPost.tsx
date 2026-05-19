import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Clock, Loader2, Copy, Check } from "lucide-react";
import { useBlog, parseContent, ContentBlock } from "@/context/BlogContext";

// ─── Copy button injector ─────────────────────────────────────────────────────
// Injects "Copy" buttons into every <pre> and <code> element after HTML renders

function useCopyButtons(ref: React.RefObject<HTMLDivElement | null>, dep: string) {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // ── pre / code blocks (multi-line)
    const preBlocks = container.querySelectorAll<HTMLPreElement>("pre");
    preBlocks.forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return; // already injected
      pre.style.position = "relative";

      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.setAttribute("aria-label", "Copy code");
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>Copy`;

      btn.addEventListener("click", async () => {
        const text = pre.querySelector("code")?.innerText ?? pre.innerText;
        try {
          await navigator.clipboard.writeText(text);
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Copied!`;
          btn.classList.add("copied");
          setTimeout(() => {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>Copy`;
            btn.classList.remove("copied");
          }, 2000);
        } catch {
          btn.textContent = "Failed";
        }
      });

      pre.appendChild(btn);
    });

    // ── inline <code> elements (not inside pre)
    const inlineCodes = container.querySelectorAll<HTMLElement>("code");
    inlineCodes.forEach((code) => {
      if (code.closest("pre")) return; // skip multi-line blocks
      if (code.dataset.copyInjected) return;
      code.dataset.copyInjected = "1";

      code.style.cursor = "pointer";
      code.title = "Click to copy";

      code.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code.innerText);
          const orig = code.style.outline;
          code.style.outline = "2px solid hsl(var(--primary))";
          code.title = "Copied!";
          setTimeout(() => {
            code.style.outline = orig;
            code.title = "Click to copy";
          }, 1500);
        } catch { /* ignore */ }
      });
    });
  }, [dep]);
}

// ─── Block renderer ───────────────────────────────────────────────────────────

function TextBlock({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useCopyButtons(ref, html);

  return (
    <div
      ref={ref}
      dangerouslySetInnerHTML={{ __html: html }}
      className="
        blog-prose
        prose prose-base sm:prose-lg prose-neutral dark:prose-invert max-w-none
        prose-p:text-foreground/85 prose-p:leading-[1.85] prose-p:my-4
        prose-headings:text-foreground prose-headings:font-bold prose-headings:leading-tight prose-headings:scroll-mt-20
        prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-4 prose-h1:pb-2 prose-h1:border-b prose-h1:border-border/40
        prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:pb-1 prose-h2:border-b prose-h2:border-border/30
        prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2
        prose-strong:text-foreground prose-strong:font-semibold
        prose-em:text-foreground/80
        prose-code:text-primary prose-code:bg-muted/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.82em] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-[hsl(220_16%_10%)] prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl prose-pre:text-sm prose-pre:leading-relaxed prose-pre:my-6 prose-pre:overflow-x-auto prose-pre:whitespace-pre-wrap prose-pre:break-all prose-pre:pt-10
        prose-pre:code:bg-transparent prose-pre:code:text-[hsl(200_100%_75%)] prose-pre:code:p-0 prose-pre:code:whitespace-pre-wrap prose-pre:code:break-all
        prose-a:text-primary prose-a:underline prose-a:underline-offset-2 hover:prose-a:opacity-75
        prose-ul:text-foreground/80 prose-ul:my-4 prose-ul:pl-6
        prose-ol:text-foreground/80 prose-ol:my-4 prose-ol:pl-6
        prose-li:my-1.5 prose-li:leading-relaxed
        prose-blockquote:border-l-[3px] prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-foreground/80 prose-blockquote:my-6
        prose-hr:border-border/40 prose-hr:my-8
        prose-img:rounded-xl prose-img:border prose-img:border-border/40 prose-img:mx-auto prose-img:shadow-md prose-img:max-w-full
        prose-table:w-full prose-table:border-collapse prose-table:my-6
        prose-th:border prose-th:border-border/50 prose-th:px-3 prose-th:py-2 prose-th:bg-muted/50 prose-th:font-semibold prose-th:text-left
        prose-td:border prose-td:border-border/40 prose-td:px-3 prose-td:py-2
      "
    />
  );
}

function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-2">
      {blocks.map((block, i) => {
        if (block.type === "text") {
          return <TextBlock key={i} html={block.value} />;
        }

        if (block.type === "image") {
          const hasSize = block.naturalWidth && block.naturalHeight;
          const isPortrait = hasSize && block.naturalHeight! > block.naturalWidth!;

          return (
            <figure key={i} className="my-6 sm:my-8">
              <a
                href={block.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block overflow-hidden rounded-xl border border-border/50 hover:border-primary/50 transition-colors bg-muted/10 ${
                  isPortrait ? "mx-auto max-w-xs sm:max-w-sm" : "w-full"
                }`}
                style={hasSize ? { aspectRatio: `${block.naturalWidth} / ${block.naturalHeight}` } : {}}
              >
                <img
                  src={block.url}
                  alt={block.caption || ""}
                  className="w-full h-full object-contain hover:scale-[1.01] transition-transform duration-300"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </a>
              {block.caption && (
                <figcaption className="mt-2 text-center text-xs sm:text-sm text-muted-foreground italic">
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPost, loading } = useBlog();
  const post = id ? getPost(id) : undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground text-sm">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <Button variant="ghost" onClick={() => navigate("/blog")} className="gap-2 mb-8 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Button>
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📄</div>
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <Link to="/blog"><Button>Return to Blog</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  const blocks = parseContent(post.content);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Sticky topbar ── */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border/40 px-3 sm:px-6 py-2.5 flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate("/blog")} className="gap-1.5 text-xs sm:text-sm h-8 px-2 sm:px-3">
          <ArrowLeft className="h-3.5 w-3.5" /> Blog
        </Button>
        <span className="text-border/60">·</span>
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-xs sm:text-sm h-8 px-2 sm:px-3">Home</Button>
        </Link>
        <span className="ml-auto text-xs text-muted-foreground hidden sm:block truncate max-w-xs">
          {post.title}
        </span>
      </div>

      {/* ── Cover image (full width, no card) ── */}
      {post.featuredImage && (
        <div className="w-full max-h-[420px] overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.parentElement!.style.display = "none"; }}
          />
        </div>
      )}

      {/* ── Main content — full-width reading column for 16" laptops ── */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">

        {/* Category */}
        {post.category && (
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-xs">
            {post.category}
          </Badge>
        )}

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4 text-foreground">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-muted-foreground mb-6 pb-5 border-b border-border/40">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {post.readTime} min read
          </span>
        </div>

        {/* Excerpt / lead */}
        {post.excerpt && (
          <p className="text-base sm:text-lg text-foreground/70 mb-8 leading-relaxed font-medium border-l-2 border-primary/50 pl-4 italic">
            {post.excerpt}
          </p>
        )}

        {/* Content blocks */}
        <BlockRenderer blocks={blocks} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border/40">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
            ))}
          </div>
        )}

        {/* Bottom nav */}
        <div className="mt-10 pt-4 border-t border-border/30 flex gap-3">
          <Button variant="outline" onClick={() => navigate("/blog")} className="gap-2 text-xs sm:text-sm">
            <ArrowLeft className="h-4 w-4" /> All Posts
          </Button>
          <Link to="/"><Button variant="ghost" className="text-xs sm:text-sm">Home</Button></Link>
        </div>
      </div>
    </div>
  );
}
