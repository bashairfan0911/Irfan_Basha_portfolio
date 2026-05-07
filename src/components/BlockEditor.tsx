import { useRef } from "react";
import { ContentBlock } from "@/context/BlogContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Type,
  ImagePlus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Upload,
  Link as LinkIcon,
  X,
  Maximize2,
} from "lucide-react";

interface Props {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

type ImageBlock = Extract<ContentBlock, { type: "image" }>;

/** Detect natural width/height from a src string (dataURL or URL) */
function detectImageSize(src: string): Promise<{ naturalWidth: number; naturalHeight: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
    img.onerror = () => resolve({ naturalWidth: 0, naturalHeight: 0 });
    img.src = src;
  });
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Returns a human-readable aspect label */
function aspectLabel(w: number, h: number): string {
  if (!w || !h) return "";
  const ratio = w / h;
  if (ratio > 1.7) return "Landscape 16:9";
  if (ratio > 1.2) return "Landscape 4:3";
  if (ratio > 0.9) return "Square 1:1";
  if (ratio > 0.6) return "Portrait 3:4";
  return "Portrait 9:16";
}

export default function BlockEditor({ blocks, onChange }: Props) {
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const updateBlock = (index: number, block: ContentBlock) => {
    const next = [...blocks];
    next[index] = block;
    onChange(next);
  };

  const remove = (index: number) => onChange(blocks.filter((_, i) => i !== index));

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...blocks];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const next = [...blocks];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  const addText = () => onChange([...blocks, { type: "text", value: "" }]);
  const addImage = () => onChange([...blocks, { type: "image", url: "", caption: "" }]);

  const handleFileUpload = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) return;
    const dataUrl = await readFileAsDataURL(file);
    const { naturalWidth, naturalHeight } = await detectImageSize(dataUrl);
    updateBlock(index, {
      ...(blocks[index] as ImageBlock),
      url: dataUrl,
      naturalWidth,
      naturalHeight,
    });
  };

  const handleUrlCommit = async (index: number, url: string) => {
    if (!url.startsWith("http")) return;
    const { naturalWidth, naturalHeight } = await detectImageSize(url);
    updateBlock(index, { ...(blocks[index] as ImageBlock), url, naturalWidth, naturalHeight });
  };

  const clearImage = (index: number) => {
    updateBlock(index, {
      ...(blocks[index] as ImageBlock),
      url: "",
      naturalWidth: undefined,
      naturalHeight: undefined,
    });
  };

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <div
          key={i}
          className="group relative border border-border/50 rounded-lg bg-card overflow-hidden"
        >
          {/* Toolbar */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-border/30 bg-muted/30">
            <GripVertical className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex-1">
              {block.type === "text" ? "📝 Text" : "🖼️ Image"}
              {block.type === "image" && block.naturalWidth && block.naturalHeight && (
                <span className="ml-2 normal-case text-muted-foreground/60 font-normal">
                  {block.naturalWidth}×{block.naturalHeight}px · {aspectLabel(block.naturalWidth, block.naturalHeight)}
                </span>
              )}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0"
                onClick={() => moveUp(i)} disabled={i === 0} title="Move up">
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0"
                onClick={() => moveDown(i)} disabled={i === blocks.length - 1} title="Move down">
                <ChevronDown className="h-3 w-3" />
              </Button>
              <Button type="button" variant="ghost" size="sm"
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                onClick={() => remove(i)} title="Delete block">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3">
            {block.type === "text" ? (
              <Textarea
                value={block.value}
                onChange={(e) => updateBlock(i, { type: "text", value: e.target.value })}
                placeholder="Write content here... Use HTML: <b>bold</b>, <i>italic</i>, <h2>heading</h2>, <ul><li>item</li></ul>, <a href=''>link</a>, <code>code</code>"
                rows={5}
                className="font-mono text-sm resize-y border-0 shadow-none focus-visible:ring-0 p-0 bg-transparent"
              />
            ) : block.url ? (
              /* ── Image preview with natural aspect ratio ─────────────────── */
              <div className="space-y-2">
                <div className="relative">
                  {/* Size badge */}
                  {block.naturalWidth && block.naturalHeight && (
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                      <Maximize2 className="h-3 w-3" />
                      {block.naturalWidth}×{block.naturalHeight} · {aspectLabel(block.naturalWidth, block.naturalHeight)}
                    </div>
                  )}
                  {/* Remove button */}
                  <Button
                    type="button" variant="destructive" size="sm"
                    className="absolute top-2 right-2 z-10 h-7 w-7 p-0 rounded-full"
                    onClick={() => clearImage(i)} title="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                  {/* Image at natural aspect ratio */}
                  <div
                    className="overflow-hidden rounded-lg border border-border/40 bg-muted/20"
                    style={
                      block.naturalWidth && block.naturalHeight
                        ? { aspectRatio: `${block.naturalWidth} / ${block.naturalHeight}` }
                        : {}
                    }
                  >
                    <img
                      src={block.url}
                      alt={block.caption || "image"}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                {/* Caption */}
                <Input
                  value={block.caption ?? ""}
                  onChange={(e) => updateBlock(i, { ...block, caption: e.target.value })}
                  placeholder="Caption (optional)"
                  className="text-sm"
                />
              </div>
            ) : (
              /* ── Upload / URL picker ──────────────────────────────────────── */
              <div className="space-y-3">
                <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center space-y-3">
                  <div className="text-3xl">🖼️</div>
                  <p className="text-sm text-muted-foreground">
                    Upload a local image or paste a URL.<br />
                    <span className="text-xs">Aspect ratio will be auto-detected.</span>
                  </p>

                  {/* File upload */}
                  <input
                    ref={(el) => { fileInputRefs.current[i] = el; }}
                    type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(i, file);
                      e.target.value = "";
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" className="gap-2"
                    onClick={() => fileInputRefs.current[i]?.click()}>
                    <Upload className="h-4 w-4" /> Upload from device
                  </Button>

                  {/* Drag & drop */}
                  <div
                    className="border border-dashed border-border/30 rounded-md p-3 text-xs text-muted-foreground cursor-pointer hover:border-primary/40 transition-colors"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith("image/")) handleFileUpload(i, file);
                    }}
                  >
                    or drag & drop an image here
                  </div>

                  {/* URL input */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-px bg-border/40" />
                    <span className="text-xs text-muted-foreground">or paste URL</span>
                    <div className="flex-1 h-px bg-border/40" />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        defaultValue=""
                        placeholder="https://example.com/photo.jpg"
                        className="pl-8 text-sm h-8"
                        onBlur={(e) => {
                          const val = e.target.value.trim();
                          if (val) {
                            // First set the URL, then detect size
                            updateBlock(i, { ...(block as ImageBlock), url: val });
                            handleUrlCommit(i, val);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) {
                              updateBlock(i, { ...(block as ImageBlock), url: val });
                              handleUrlCommit(i, val);
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/* Caption field even before image is set */}
                <Input
                  value={block.caption ?? ""}
                  onChange={(e) => updateBlock(i, { ...block, caption: e.target.value })}
                  placeholder="Caption (optional)"
                  className="text-sm"
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add block buttons */}
      <div className="flex gap-2 pt-1">
        <Button type="button" variant="outline" size="sm" onClick={addText} className="gap-2 border-dashed">
          <Type className="h-4 w-4" /> Add Text Block
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={addImage} className="gap-2 border-dashed">
          <ImagePlus className="h-4 w-4" /> Add Image Block
        </Button>
      </div>
    </div>
  );
}
