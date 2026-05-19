import { useRef, useState, useCallback, useEffect } from "react";
import { ContentBlock } from "@/context/BlogContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { marked } from "marked";
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
  Bold,
  Italic,
  Underline,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  FileText,
  PenLine,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

type ImageBlock = Extract<ContentBlock, { type: "image" }>;
type EditorMode = "write" | "markdown";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file, "UTF-8");
  });
}

function aspectLabel(w: number, h: number): string {
  if (!w || !h) return "";
  const ratio = w / h;
  if (ratio > 1.7) return "16:9";
  if (ratio > 1.2) return "4:3";
  if (ratio > 0.9) return "1:1";
  if (ratio > 0.6) return "3:4";
  return "9:16";
}

// ─── Toolbar atoms ────────────────────────────────────────────────────────────

function ToolbarBtn({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        // Prevent editor from losing focus when clicking toolbar buttons
        e.preventDefault();
        onClick();
      }}
      className="h-7 w-7 flex items-center justify-center rounded text-muted-foreground
        hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-5 bg-border/50 mx-0.5 flex-shrink-0" />;
}

// ─── Rich Text Editor ─────────────────────────────────────────────────────────

interface RichTextEditorProps {
  /** HTML string stored in the block */
  initialValue: string;
  /** Called with updated HTML whenever the user edits */
  onChange: (html: string) => void;
  /** A stable key — when it changes we re-initialize innerHTML from initialValue */
  editorKey: string;
}

function RichTextEditor({ initialValue, onChange, editorKey }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Track what key we last initialized for, so we only reset when the block identity changes
  const lastKeyRef = useRef<string>("");

  useEffect(() => {
    if (!ref.current) return;
    if (lastKeyRef.current === editorKey) return; // already initialized for this block
    lastKeyRef.current = editorKey;
    ref.current.innerHTML = initialValue;
  }, [editorKey, initialValue]);

  const exec = useCallback((cmd: string, value?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, value ?? "");
    if (ref.current) onChange(ref.current.innerHTML);
  }, [onChange]);

  const fmtBlock = useCallback((tag: string) => {
    ref.current?.focus();
    document.execCommand("formatBlock", false, tag);
    if (ref.current) onChange(ref.current.innerHTML);
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (ref.current) onChange(ref.current.innerHTML);
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b": e.preventDefault(); exec("bold"); break;
        case "i": e.preventDefault(); exec("italic"); break;
        case "u": e.preventDefault(); exec("underline"); break;
      }
    }
  }, [exec]);

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-card shadow-sm">
      {/* ── Toolbar — scrolls horizontally on small screens ── */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-muted/25 border-b border-border/30 overflow-x-auto scrollbar-none">
        {/* Headings */}
        <ToolbarBtn title="Heading 1  (H1)" onClick={() => fmtBlock("h1")}>
          <Heading1 className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Heading 2  (H2)" onClick={() => fmtBlock("h2")}>
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Heading 3  (H3)" onClick={() => fmtBlock("h3")}>
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Paragraph" onClick={() => fmtBlock("p")}>
          <Type className="h-3.5 w-3.5" />
        </ToolbarBtn>

        <Sep />

        {/* Inline formatting */}
        <ToolbarBtn title="Bold  (Ctrl+B)" onClick={() => exec("bold")}>
          <Bold className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Italic  (Ctrl+I)" onClick={() => exec("italic")}>
          <Italic className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Underline  (Ctrl+U)" onClick={() => exec("underline")}>
          <Underline className="h-3.5 w-3.5" />
        </ToolbarBtn>

        <Sep />

        {/* Alignment */}
        <ToolbarBtn title="Align Left" onClick={() => exec("justifyLeft")}>
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Align Center" onClick={() => exec("justifyCenter")}>
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Align Right" onClick={() => exec("justifyRight")}>
          <AlignRight className="h-3.5 w-3.5" />
        </ToolbarBtn>

        <Sep />

        {/* Block elements */}
        <ToolbarBtn title="Code block" onClick={() => fmtBlock("pre")}>
          <Code className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Blockquote" onClick={() => fmtBlock("blockquote")}>
          <Quote className="h-3.5 w-3.5" />
        </ToolbarBtn>

        <Sep />

        {/* Lists */}
        <ToolbarBtn title="Bullet list" onClick={() => exec("insertUnorderedList")}>
          <List className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Numbered list" onClick={() => exec("insertOrderedList")}>
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarBtn>

        <Sep />

        {/* Misc */}
        <ToolbarBtn title="Horizontal rule" onClick={() => exec("insertHorizontalRule")}>
          <Minus className="h-3.5 w-3.5" />
        </ToolbarBtn>
      </div>

      {/* ── Editable area ── */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder="Start writing here…  Use the toolbar above for headings, bold, alignment, lists, and more. Ctrl+B / Ctrl+I / Ctrl+U shortcuts work too."
        className="rich-editor min-h-[220px] p-4 text-sm text-foreground focus:outline-none"
      />
    </div>
  );
}

// ─── Markdown Upload Panel ─────────────────────────────────────────────

function MarkdownUploadPanel({ onParsed }: { onParsed: (blocks: ContentBlock[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [lineCount, setLineCount] = useState(0);
  const [dragging, setDragging] = useState(false);

  const processFile = async (file: File) => {
    const name = file.name.toLowerCase();
    if (!name.endsWith(".md") && !name.endsWith(".markdown")) {
      toast.error("Please upload a .md or .markdown file");
      return;
    }
    const text = await readFileAsText(file);
    setFileName(file.name);
    setFileSize(file.size < 1024 ? `${file.size} B` : `${(file.size / 1024).toFixed(1)} KB`);
    setLineCount(text.split("\n").length);
    // @ts-ignore
    marked.setOptions({ breaks: true, gfm: true });
    const html = (await marked.parse(text)) as string;
    setPreview(html);
    onParsed([{ type: "text", value: html }]);
    toast.success(`Imported "${file.name}" successfully`);
  };

  const reset = () => {
    setPreview(""); setFileName(""); setFileSize(""); setLineCount(0);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) await processFile(f);
    e.target.value = "";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) await processFile(f);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone — hidden once file is loaded */}
      {!preview && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`group cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
            ${dragging ? "border-primary bg-primary/10" : "border-border/50 hover:border-primary/50 hover:bg-muted/10"}`}
        >
          <input ref={fileRef} type="file" accept=".md,.markdown" className="hidden" onChange={handleChange} />
          <div className="flex flex-col items-center gap-3">
            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-200
              ${dragging ? "bg-primary/20 scale-110" : "bg-muted/60 group-hover:bg-primary/10 group-hover:scale-105"}`}>
              <FileText className={`h-8 w-8 transition-colors ${dragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                {dragging ? "Drop to import!" : "Drop your Markdown file here"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports <code className="text-primary text-xs">.md</code> &amp; <code className="text-primary text-xs">.markdown</code>
                {" · "} All formatting preserved
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" className="gap-2 text-xs pointer-events-none mt-1">
              <Upload className="h-3.5 w-3.5" /> Browse Files
            </Button>
          </div>
        </div>
      )}

      {/* GitHub-style file preview */}
      {preview && (
        <div className="border border-border/50 rounded-xl overflow-hidden shadow-sm">
          {/* File header bar */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/40 border-b border-border/40">
            <FileText className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-sm font-semibold text-foreground truncate flex-1">{fileName}</span>
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
              <span>{lineCount} lines</span>
              <span>{fileSize}</span>
              <span className="text-green-400 font-medium">✓ Ready</span>
            </div>
            <button
              type="button"
              onClick={reset}
              className="ml-2 h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
              title="Remove file"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Second bar: action */}
          <div className="flex items-center gap-2 px-3 py-2 bg-muted/20 border-b border-border/30">
            <span className="text-xs text-muted-foreground flex-1">Preview — rendered exactly as it will appear in the blog post</span>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-xs text-primary hover:underline"
            >
              Change file
            </button>
            <input ref={fileRef} type="file" accept=".md,.markdown" className="hidden" onChange={handleChange} />
          </div>

          {/* Rendered markdown body */}
          <div
            className="px-6 py-5 sm:px-8 sm:py-6
              prose prose-sm sm:prose-base prose-neutral dark:prose-invert max-w-none
              prose-headings:text-foreground prose-headings:font-bold prose-headings:border-b prose-headings:border-border/30 prose-headings:pb-1
              prose-p:text-foreground/85 prose-p:leading-7
              prose-strong:text-foreground prose-strong:font-semibold
              prose-em:text-foreground/80
              prose-code:text-primary prose-code:bg-muted/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
              prose-pre:bg-muted/80 prose-pre:border prose-pre:border-border/40 prose-pre:rounded-lg prose-pre:overflow-x-auto
              prose-a:text-primary prose-a:underline-offset-2
              prose-blockquote:border-l-4 prose-blockquote:border-primary/60 prose-blockquote:bg-muted/20 prose-blockquote:py-0.5 prose-blockquote:not-italic
              prose-ul:text-foreground/80 prose-ol:text-foreground/80
              prose-li:marker:text-primary
              prose-table:border-collapse prose-th:bg-muted/40 prose-th:border prose-th:border-border/40 prose-th:px-3 prose-th:py-1.5
              prose-td:border prose-td:border-border/30 prose-td:px-3 prose-td:py-1.5
              prose-hr:border-border/40"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main BlockEditor ─────────────────────────────────────────────────────────

export default function BlockEditor({ blocks, onChange }: Props) {
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [editorMode, setEditorMode] = useState<EditorMode>("write");

  const updateBlock = useCallback((index: number, block: ContentBlock) => {
    const next = [...blocks];
    next[index] = block;
    onChange(next);
  }, [blocks, onChange]);

  const remove = useCallback((index: number) =>
    onChange(blocks.filter((_, i) => i !== index)), [blocks, onChange]);

  const moveUp = useCallback((index: number) => {
    if (index === 0) return;
    const next = [...blocks];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }, [blocks, onChange]);

  const moveDown = useCallback((index: number) => {
    if (index === blocks.length - 1) return;
    const next = [...blocks];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }, [blocks, onChange]);

  const addText = () => onChange([...blocks, { type: "text", value: "" }]);
  const addImage = () => onChange([...blocks, { type: "image", url: "", caption: "" }]);

  const handleFileUpload = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) return;
    const dataUrl = await readFileAsDataURL(file);
    const { naturalWidth, naturalHeight } = await detectImageSize(dataUrl);
    updateBlock(index, { ...(blocks[index] as ImageBlock), url: dataUrl, naturalWidth, naturalHeight });
  };

  const handleUrlCommit = async (index: number, url: string) => {
    if (!url.startsWith("http")) return;
    const { naturalWidth, naturalHeight } = await detectImageSize(url);
    updateBlock(index, { ...(blocks[index] as ImageBlock), url, naturalWidth, naturalHeight });
  };

  const clearImage = (index: number) => updateBlock(index, {
    ...(blocks[index] as ImageBlock),
    url: "",
    naturalWidth: undefined,
    naturalHeight: undefined,
  });

  const handleMarkdownParsed = (newBlocks: ContentBlock[]) => {
    onChange(newBlocks);
    // Switch to write mode so user sees the imported content
    setEditorMode("write");
  };

  return (
    <div className="space-y-4">

      {/* ── Mode Switcher ── */}
      <div className="inline-flex items-center gap-0.5 p-1 rounded-lg bg-muted/30 border border-border/40">
        {(["write", "markdown"] as EditorMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setEditorMode(mode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap
              ${editorMode === mode
                ? "bg-card text-foreground shadow-sm border border-border/30"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {mode === "write" ? <PenLine className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
            {mode === "write" ? "Write / Edit" : "Upload Markdown (.md)"}
          </button>
        ))}
      </div>

      {/* ── Markdown Upload Panel ── */}
      {editorMode === "markdown" && (
        <MarkdownUploadPanel onParsed={handleMarkdownParsed} />
      )}

      {/* ── Write Mode — block list ── */}
      {editorMode === "write" && (
        <div className="space-y-3">
          {blocks.map((block, i) => (
            <div
              key={i}
              className="group relative border border-border/50 rounded-xl bg-card overflow-hidden shadow-sm
                hover:border-border/80 transition-colors"
            >
              {/* Block header bar */}
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/20 border-b border-border/30">
                <GripVertical className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex-1 truncate">
                  {block.type === "text" ? "📝 Text Block" : "🖼️ Image Block"}
                  {block.type === "image" && block.naturalWidth && block.naturalHeight && (
                    <span className="ml-1.5 normal-case font-normal text-muted-foreground/50">
                      {block.naturalWidth}×{block.naturalHeight}px · {aspectLabel(block.naturalWidth, block.naturalHeight)}
                    </span>
                  )}
                </span>
                {/* Move / delete controls — always visible on mobile, hover on desktop */}
                <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0"
                    onClick={() => moveUp(i)} disabled={i === 0} title="Move up">
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0"
                    onClick={() => moveDown(i)} disabled={i === blocks.length - 1} title="Move down">
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => remove(i)} title="Delete block">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Block body */}
              <div className="p-3">
                {block.type === "text" ? (
                  <RichTextEditor
                    key={`block-${i}`}
                    editorKey={`block-${i}-${blocks.length}`}
                    initialValue={block.value}
                    onChange={(html) => updateBlock(i, { type: "text", value: html })}
                  />
                ) : block.url ? (
                  /* ── Image preview ── */
                  <div className="space-y-2">
                    <div className="relative">
                      {block.naturalWidth && block.naturalHeight && (
                        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                          <Maximize2 className="h-3 w-3" />
                          {block.naturalWidth}×{block.naturalHeight} · {aspectLabel(block.naturalWidth, block.naturalHeight)}
                        </div>
                      )}
                      <Button type="button" variant="destructive" size="sm"
                        className="absolute top-2 right-2 z-10 h-7 w-7 p-0 rounded-full"
                        onClick={() => clearImage(i)} title="Remove image">
                        <X className="h-3.5 w-3.5" />
                      </Button>
                      <div
                        className="overflow-hidden rounded-lg border border-border/40 bg-muted/20"
                        style={
                          block.naturalWidth && block.naturalHeight
                            ? { aspectRatio: `${block.naturalWidth} / ${block.naturalHeight}` }
                            : {}
                        }
                      >
                        <img src={block.url} alt={block.caption || "image"}
                          className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <Input value={block.caption ?? ""} placeholder="Caption (optional)" className="text-sm"
                      onChange={(e) => updateBlock(i, { ...block, caption: e.target.value })} />
                  </div>
                ) : (
                  /* ── Image picker ── */
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center space-y-3">
                      <div className="text-3xl">🖼️</div>
                      <p className="text-sm text-muted-foreground">
                        Upload a local image or paste a URL.<br />
                        <span className="text-xs">Aspect ratio auto-detected.</span>
                      </p>
                      <input
                        ref={(el) => { fileInputRefs.current[i] = el; }}
                        type="file" accept="image/*" className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload(i, f);
                          e.target.value = "";
                        }}
                      />
                      <Button type="button" variant="outline" size="sm" className="gap-2"
                        onClick={() => fileInputRefs.current[i]?.click()}>
                        <Upload className="h-4 w-4" /> Upload from device
                      </Button>
                      <div
                        className="border border-dashed border-border/30 rounded-md p-3 text-xs text-muted-foreground
                          cursor-pointer hover:border-primary/40 hover:bg-muted/10 transition-colors"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const f = e.dataTransfer.files?.[0];
                          if (f?.type.startsWith("image/")) handleFileUpload(i, f);
                        }}
                      >
                        or drag &amp; drop an image here
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-border/40" />
                        <span className="text-xs text-muted-foreground">or paste a URL</span>
                        <div className="flex-1 h-px bg-border/40" />
                      </div>
                      <div className="relative">
                        <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          defaultValue=""
                          placeholder="https://example.com/photo.jpg"
                          className="pl-8 text-sm h-9"
                          onBlur={(e) => {
                            const val = e.target.value.trim();
                            if (val) { updateBlock(i, { ...(block as ImageBlock), url: val }); handleUrlCommit(i, val); }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const val = (e.target as HTMLInputElement).value.trim();
                              if (val) { updateBlock(i, { ...(block as ImageBlock), url: val }); handleUrlCommit(i, val); }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <Input value={block.caption ?? ""} placeholder="Caption (optional)" className="text-sm"
                      onChange={(e) => updateBlock(i, { ...block, caption: e.target.value })} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {blocks.length === 0 && (
            <div className="text-center py-8 border border-dashed border-border/40 rounded-xl text-muted-foreground text-sm">
              No content blocks yet. Add one below.
            </div>
          )}

          {/* Add block buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button type="button" variant="outline" size="sm" onClick={addText}
              className="gap-2 border-dashed hover:border-primary/50 hover:bg-primary/5">
              <Type className="h-4 w-4" /> Add Text Block
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={addImage}
              className="gap-2 border-dashed hover:border-primary/50 hover:bg-primary/5">
              <ImagePlus className="h-4 w-4" /> Add Image Block
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
