import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { useBlog } from "@/context/BlogContext";
import { toast } from "sonner";

export default function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addPost, updatePost, getPost } = useBlog();
  const isEditing = id && id !== "new";
  const existingPost = isEditing ? getPost(id) : null;

  const [formData, setFormData] = useState({
    title: existingPost?.title || "",
    excerpt: existingPost?.excerpt || "",
    content: existingPost?.content || "",
    date: existingPost?.date || new Date().toISOString().split("T")[0],
    author: existingPost?.author || "",
    category: existingPost?.category || "",
    tags: existingPost?.tags.join(", ") || "",
    readTime: existingPost?.readTime || 5,
    featuredImage: existingPost?.featuredImage || "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(formData.featuredImage || null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "readTime" ? parseInt(value) : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          featuredImage: base64String,
        }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: "",
    }));
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.excerpt || !formData.content || !formData.author || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    const postData = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      date: formData.date,
      author: formData.author,
      category: formData.category,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      readTime: formData.readTime,
      featuredImage: formData.featuredImage || undefined,
    };

    if (isEditing && id) {
      updatePost(id, postData);
      toast.success("Post updated successfully");
    } else {
      addPost(postData);
      toast.success("Post created successfully");
    }

    setShowConfirm(false);
    navigate("/blog");
  };

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

        {/* Editor Card */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Post" : "Create New Post"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium mb-2">Featured Image</label>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Featured"
                        className="w-full h-64 object-cover rounded-lg border border-border/50"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border/50 rounded-lg cursor-pointer hover:bg-card/50 transition">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload image</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter post title"
                  className="bg-background border-border/50"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium mb-2">Excerpt *</label>
                <Textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Enter post excerpt"
                  rows={3}
                  className="bg-background border-border/50"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">Content (HTML) *</label>
                <Textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Enter post content (supports HTML)"
                  rows={10}
                  className="bg-background border-border/50 font-mono text-sm"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium mb-2">Author *</label>
                <Input
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  className="bg-background border-border/50"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <Input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., DevOps, Kubernetes, AWS"
                  className="bg-background border-border/50"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <Input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., devops, ci-cd, automation"
                  className="bg-background border-border/50"
                />
              </div>

              {/* Date and Read Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="bg-background border-border/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Read Time (minutes)</label>
                  <Input
                    name="readTime"
                    type="number"
                    value={formData.readTime}
                    onChange={handleChange}
                    min="1"
                    className="bg-background border-border/50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  {isEditing ? "Update Post" : "Create Post"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/blog")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isEditing ? "Update Post" : "Create Post"}</AlertDialogTitle>
            <AlertDialogDescription>
              {isEditing
                ? "Are you sure you want to update this post?"
                : "Are you sure you want to create this post?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave}>
              {isEditing ? "Update" : "Create"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
