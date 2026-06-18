import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Upload,
  Loader2,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { ContentBlock, parseContent, BlogPost } from "@/context/BlogContext";
import BlockEditor from "@/components/BlockEditor";

const ADMIN_API = "/api/admin/posts.mjs";

const defaultBlocks: ContentBlock[] = [{ type: "text", value: "" }];

const emptyForm = {
  title: "",
  excerpt: "",
  author: "Irfan Basha",
  category: "",
  tags: "",
  readTime: 5,
  featuredImage: "",
  pdfUrl: "",
};

// ─── Smart Tag Picker ──────────────────────────────────────────────────────────

function TagsField({
  value,
  onChange,
  allPosts,
}: {
  value: string;
  onChange: (v: string) => void;
  allPosts: BlogPost[];
}) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Collect every unique tag from existing posts
  const allKnownTags = Array.from(
    new Set(allPosts.flatMap((p) => p.tags).map((t) => t.toLowerCase().trim()))
  ).sort();

  // Parse current comma-separated value into individual tags
  const currentTags = value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Suggestions: match typed input, exclude already-added tags
  const suggestions = allKnownTags.filter(
    (t) => t.includes(input.toLowerCase()) && !currentTags.includes(t)
  );

  const addTag = (tag: string) => {
    const t = tag.trim().toLowerCase();
    if (!t || currentTags.includes(t)) return;
    onChange([...currentTags, t].join(", "));
    setInput("");
    setOpen(false);
  };

  const removeTag = (tag: string) => {
    onChange(currentTags.filter((t) => t !== tag).join(", "));
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) addTag(input);
    } else if (e.key === "Backspace" && !input && currentTags.length) {
      removeTag(currentTags[currentTags.length - 1]);
    }
    if (e.key === "Escape") setOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <label className="text-sm font-medium mb-1.5 block">
        Tags{" "}
        <span className="text-muted-foreground font-normal">
          (type &amp; pick or press Enter)
        </span>
      </label>

      {/* Pills + input container */}
      <div
        className="min-h-[2.4rem] flex flex-wrap gap-1.5 items-center
          rounded-lg border border-input bg-background px-2 py-1.5
          cursor-text focus-within:ring-2 focus-within:ring-ring"
        onClick={() => wrapRef.current?.querySelector("input")?.focus()}
      >
        {currentTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
              bg-primary/10 text-primary text-xs font-medium border border-primary/20"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              className="hover:text-destructive transition-colors"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true); }}
          onKeyDown={handleKey}
          onFocus={() => setOpen(true)}
          placeholder={currentTags.length ? "" : "kubernetes, docker…"}
          className="flex-1 min-w-[100px] bg-transparent text-sm outline-none
            placeholder:text-muted-foreground/50 py-0.5"
        />
      </div>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-auto
          rounded-lg border border-border/60 bg-popover shadow-lg"
        >
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); addTag(s); }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-muted/60
                flex items-center gap-2 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Admin Page ────────────────────────────────────────────────────────────────

export default function Admin() {

  const password = sessionStorage.getItem("admin_auth_pw") || "";

  const [adminPosts, setAdminPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [blocks, setBlocks] = useState<ContentBlock[]>(defaultBlocks);
  const coverFileRef = useRef<HTMLInputElement | null>(null);
  const pdfFileRef = useRef<HTMLInputElement | null>(null);

  const apiHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${password}`,
  });

  const refreshPosts = async () => {
    try {
      setPostsLoading(true);
      const res = await fetch(ADMIN_API, { headers: apiHeaders() });
      if (!res.ok) throw new Error(`Failed to load posts (${res.status})`);
      const data = await res.json();
      const raw = (data.posts || []) as Array<Record<string, unknown>>;
      setAdminPosts(
        raw.map((p) => ({
          id: String(p._id),
          title: String(p.title || ""),
          excerpt: String(p.excerpt || ""),
          content: String(p.content || ""),
          author: String(p.author || ""),
          category: String(p.category || ""),
          tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
          readTime: Number(p.readTime) || 5,
          featuredImage: p.featuredImage ? String(p.featuredImage) : undefined,
          createdAt: String(p.createdAt || p._id),
          hidden: Boolean(p.hidden),
          pdfUrl: p.pdfUrl ? String(p.pdfUrl) : undefined,
        }))
      );
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    refreshPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCoverUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setFormData((f) => ({ ...f, featuredImage: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please select a valid PDF file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setFormData((f) => ({ ...f, pdfUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setBlocks(defaultBlocks);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.excerpt.trim()) {
      toast.error("Title and Excerpt are required");
      return;
    }

    const payload = {
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      content: JSON.stringify(blocks),
      createdAt: editingPost?.createdAt || new Date().toISOString(),
    };

    try {
      setSaving(true);
      let res: Response;

      if (editingPost) {
        res = await fetch(ADMIN_API, {
          method: "PUT",
          headers: apiHeaders(),
          body: JSON.stringify({ id: editingPost.id, ...payload }),
        });
      } else {
        res = await fetch(ADMIN_API, {
          method: "POST",
          headers: apiHeaders(),
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || "Failed to save");
      }

      toast.success(editingPost ? "Post updated!" : "Post published!");
      setEditingPost(null);
      setIsCreating(false);
      resetForm();
      await refreshPosts();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(ADMIN_API, {
        method: "DELETE",
        headers: apiHeaders(),
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || "Failed to delete");
      }
      toast.success("Post deleted");
      setDeleteConfirm(null);
      await refreshPosts();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete post");
    }
  };

  const handleToggleHidden = async (post: BlogPost) => {
    setTogglingId(post.id);
    const newHidden = !post.hidden;

    // Optimistic update — flip instantly in local state
    setAdminPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, hidden: newHidden } : p))
    );

    try {
      const res = await fetch(ADMIN_API, {
        method: "PATCH",
        headers: apiHeaders(),
        body: JSON.stringify({ id: post.id, hidden: newHidden }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || "Failed to update visibility");
      }
      toast.success(newHidden ? "Post hidden from public" : "Post is now visible");
    } catch (err: unknown) {
      // Roll back on failure
      setAdminPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, hidden: post.hidden } : p))
      );
      toast.error(err instanceof Error ? err.message : "Failed to toggle visibility");
    } finally {
      setTogglingId(null);
    }
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsCreating(false);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      category: post.category,
      tags: post.tags.join(", "),
      readTime: post.readTime,
      featuredImage: post.featuredImage || "",
      pdfUrl: post.pdfUrl || "",
    });
    setBlocks(parseContent(post.content));
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingPost(null);
    resetForm();
  };

  const isFormOpen = isCreating || !!editingPost;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Link to="/">
              <Button variant="ghost" className="gap-2 text-sm px-2 sm:px-4">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="ghost" size="sm" className="text-sm">View Blog →</Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Blog Admin</h1>
          </div>
          {!isFormOpen && (
            <Button
              onClick={() => { setIsCreating(true); setEditingPost(null); resetForm(); }}
              className="gap-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>New Post</span>
            </Button>
          )}
        </div>

        {/* Create / Edit Form */}
        {isFormOpen && (
          <Card className="mb-8 border-border/50 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl">
                  {editingPost ? "Edit Post" : "Create New Post"}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={cancelEdit} className="gap-1">
                  <X className="h-4 w-4" /> Cancel
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">

              {/* Title */}
              <div className="border-b-2 border-border/40 focus-within:border-primary/60 transition-colors pb-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-1 block">Post Title</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Untitled Post"
                  className="
                    w-full bg-transparent border-none outline-none
                    text-3xl sm:text-5xl font-black leading-tight
                    placeholder:text-muted-foreground/30
                    text-foreground
                  "
                />
              </div>

              {/* Category & Tags row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., DevOps, Cloud, Linux"
                  />
                </div>
                <TagsField
                  value={formData.tags}
                  onChange={(v) => setFormData({ ...formData, tags: v })}
                  allPosts={adminPosts}
                />
              </div>


              {/* Author & Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Author</label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Read Time (min)</label>
                  <Input
                    type="number"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                    min={1}
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Excerpt * <span className="text-muted-foreground font-normal">(shown on blog listing)</span>
                </label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A short summary of the post..."
                  rows={2}
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Cover Image <span className="text-muted-foreground font-normal">(featured image)</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    value={formData.featuredImage.startsWith("data:") ? "(local file — stored as base64)" : formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    placeholder="https://example.com/cover.jpg"
                    readOnly={formData.featuredImage.startsWith("data:")}
                    className="flex-1 min-w-0"
                  />
                  <input
                    ref={coverFileRef}
                    type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); e.target.value = ""; }}
                  />
                  <Button type="button" variant="outline" className="gap-1.5 flex-shrink-0 text-sm px-2 sm:px-4"
                    onClick={() => coverFileRef.current?.click()}>
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline">Upload</span>
                  </Button>
                  {formData.featuredImage && (
                    <Button type="button" variant="ghost" size="sm" className="flex-shrink-0"
                      onClick={() => setFormData({ ...formData, featuredImage: "" })}>✕</Button>
                  )}
                </div>
                {formData.featuredImage && (
                  <img
                    src={formData.featuredImage}
                    alt="Cover preview"
                    className="mt-3 h-32 sm:h-40 w-full object-cover rounded-lg border border-border/40"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>

              {/* PDF Upload */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    PDF Attachment <span className="text-muted-foreground font-normal">(optional — e.g. whitepaper, report)</span>
                  </span>
                </label>
                <div className="flex gap-2">
                  <Input
                    value={
                      formData.pdfUrl.startsWith("data:")
                        ? "(PDF file — stored as base64)"
                        : formData.pdfUrl
                    }
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                    placeholder="https://example.com/document.pdf or upload below"
                    readOnly={formData.pdfUrl.startsWith("data:")}
                    className="flex-1 min-w-0"
                  />
                  <input
                    ref={pdfFileRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePdfUpload(f); e.target.value = ""; }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-1.5 flex-shrink-0 text-sm px-2 sm:px-4"
                    onClick={() => pdfFileRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline">Upload PDF</span>
                  </Button>
                  {formData.pdfUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0"
                      onClick={() => setFormData({ ...formData, pdfUrl: "" })}
                    >✕</Button>
                  )}
                </div>
                {formData.pdfUrl && !formData.pdfUrl.startsWith("data:") && (
                  <a
                    href={formData.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-blue-500 hover:underline"
                  >
                    <FileText className="h-3.5 w-3.5" /> Preview PDF
                  </a>
                )}
                {formData.pdfUrl.startsWith("data:") && (
                  <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> PDF uploaded and ready to save
                  </p>
                )}
              </div>

              {/* Block editor */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Content <span className="text-muted-foreground font-normal">— write with rich text editor or upload a Markdown file</span>
                </label>
                <BlockEditor blocks={blocks} onChange={setBlocks} />
              </div>

              {/* Save / Cancel */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {editingPost ? "Update Post" : "Publish Post"}
                </Button>
                <Button variant="outline" onClick={cancelEdit} className="gap-2">
                  <X className="h-4 w-4" /> Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        {!isFormOpen && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">All Posts ({adminPosts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
                  <Loader2 className="h-5 w-5 animate-spin" /> Loading posts...
                </div>
              ) : adminPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No posts yet.</p>
                  <Button onClick={() => setIsCreating(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Create your first post
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {adminPosts.map((post) => (
                    <div key={post.id}
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 border rounded-xl transition-colors ${
                        post.hidden
                          ? "border-border/30 bg-muted/20 opacity-60"
                          : "border-border/50 hover:bg-muted/30"
                      }`}>
                      {post.featuredImage && (
                        <img src={post.featuredImage} alt={post.title}
                          className="w-full h-32 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => (e.currentTarget.style.display = "none")} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate text-sm sm:text-base">{post.title}</h3>
                          {post.hidden && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-muted border border-border/50 text-muted-foreground flex-shrink-0">
                              <EyeOff className="h-2.5 w-2.5" /> Hidden
                            </span>
                          )}
                          {post.pdfUrl && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex-shrink-0">
                              <FileText className="h-2.5 w-2.5" /> PDF
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                          {post.category && <span>{post.category} · </span>}
                          {post.readTime} min read
                          {post.createdAt && <span> · {new Date(post.createdAt).toLocaleDateString()}</span>}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0 self-end sm:self-auto flex-wrap">
                        {/* Hide / Show toggle */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleHidden(post)}
                          disabled={togglingId === post.id}
                          className={`gap-1 text-xs ${post.hidden ? "text-green-500 border-green-500/40 hover:text-green-400" : "text-amber-500 border-amber-500/40 hover:text-amber-400"}`}
                        >
                          {togglingId === post.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : post.hidden ? (
                            <><Eye className="h-3.5 w-3.5" /> Show</>
                          ) : (
                            <><EyeOff className="h-3.5 w-3.5" /> Hide</>
                          )}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => startEdit(post)} className="gap-1 text-xs">
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button variant="outline" size="sm"
                          className="text-destructive hover:text-destructive gap-1 text-xs"
                          onClick={() => setDeleteConfirm(post.id)}>
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="mx-4 sm:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
