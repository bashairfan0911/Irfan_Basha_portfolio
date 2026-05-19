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
import { ArrowLeft, Plus, Trash2, Edit, Save, X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ContentBlock, parseContent, BlogPost } from "@/context/BlogContext";
import { useBlog } from "@/context/BlogContext";
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
};

export default function Admin() {
  const { posts, loading: postsLoading, refreshPosts } = useBlog();
  const password = sessionStorage.getItem("admin_auth_pw") || "";

  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [blocks, setBlocks] = useState<ContentBlock[]>(defaultBlocks);
  const coverFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // password is already verified by BlogAuthGate; just read it
  }, []);

  const handleCoverUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setFormData((f) => ({ ...f, featuredImage: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setBlocks(defaultBlocks);
  };

  const apiHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${password}`,
  });

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
    });
    setBlocks(parseContent(post.content));
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingPost(null);
    resetForm();
  };

  const isFormOpen = isCreating || !!editingPost;
  const rawPosts = posts;

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
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Post title"
                  className="text-base sm:text-lg"
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
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Tags <span className="text-muted-foreground font-normal">(comma-separated)</span></label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="kubernetes, docker, devops"
                  />
                </div>
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
              <CardTitle className="text-lg sm:text-xl">All Posts ({posts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
                  <Loader2 className="h-5 w-5 animate-spin" /> Loading posts...
                </div>
              ) : rawPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No posts yet.</p>
                  <Button onClick={() => setIsCreating(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Create your first post
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {rawPosts.map((post) => (
                    <div key={post.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 border border-border/50 rounded-xl hover:bg-muted/30 transition-colors">
                      {post.featuredImage && (
                        <img src={post.featuredImage} alt={post.title}
                          className="w-full h-32 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => (e.currentTarget.style.display = "none")} />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate text-sm sm:text-base">{post.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                          {post.category && <span>{post.category} · </span>}
                          {post.readTime} min read
                          {post.createdAt && <span> · {new Date(post.createdAt).toLocaleDateString()}</span>}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0 self-end sm:self-auto">
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
