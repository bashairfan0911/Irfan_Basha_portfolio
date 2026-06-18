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
  Strikethrough,
  Superscript,
  Subscript,
  Indent,
  Outdent,
  Palette,
  Eraser,
  Table,
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
  const lastKeyRef = useRef<string>("");
  // Table picker state
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [tableHover, setTableHover] = useState({ r: 0, c: 0 });
  // Save selection before toolbar button steals focus
  const savedRange = useRef<Range | null>(null);

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
        case "s": if (e.shiftKey) { e.preventDefault(); exec("strikeThrough"); } break;
      }
    }
  }, [exec]);

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:", "https://");
    if (url) exec("createLink", url);
  }, [exec]);

  // Restore saved selection then injext HTML at that cursor position
  const insertHtmlAtCursor = useCallback((html: string) => {
    const sel = window.getSelection();
    let range = savedRange.current;
    if (!range && sel && sel.rangeCount > 0) range = sel.getRangeAt(0);
    if (range) {
      sel?.removeAllRanges();
      sel?.addRange(range);
      range.deleteContents();
      const div = document.createElement("div");
      div.innerHTML = html;
      const frag = document.createDocumentFragment();
      let lastNode: Node | null = null;
      while (div.firstChild) { lastNode = div.firstChild; frag.appendChild(div.firstChild); }
      range.insertNode(frag);
      if (lastNode) {
        const after = range.cloneRange();
        after.setStartAfter(lastNode);
        after.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(after);
      }
    } else {
      // Fallback: append to editor
      if (ref.current) ref.current.innerHTML += html;
    }
    if (ref.current) onChange(ref.current.innerHTML);
    savedRange.current = null;
  }, [onChange]);

  // Restore selection then run execCommand — used by color and eraser
  const restoreAndExec = useCallback((cmd: string, val?: string) => {
    const sel = window.getSelection();
    if (savedRange.current) {
      ref.current?.focus();
      sel?.removeAllRanges();
      sel?.addRange(savedRange.current);
    } else {
      ref.current?.focus();
    }
    document.execCommand(cmd, false, val ?? "");
    if (ref.current) onChange(ref.current.innerHTML);
    savedRange.current = null;
  }, [onChange]);

  const doInsertTable = useCallback((rows: number, cols: number) => {
    setShowTablePicker(false);
    const thCells = Array.from({ length: cols }, (_, i) =>
      `<th style="border:1px solid #d1d5db;padding:6px 10px;background:#f3f4f6;font-weight:600;text-align:left">Header ${i + 1}</th>`
    ).join("");
    const tdCells = Array.from({ length: cols }, () =>
      `<td style="border:1px solid #d1d5db;padding:6px 10px">&nbsp;</td>`
    ).join("");
    const bodyRows = Array.from({ length: rows }, () => `<tr>${tdCells}</tr>`).join("");
    const html = `<table style="border-collapse:collapse;width:100%;margin:1rem 0"><thead><tr>${thCells}</tr></thead><tbody>${bodyRows}</tbody></table><p><br></p>`;
    // Restore cursor then use execCommand — browser handles block-level insertion correctly
    const sel = window.getSelection();
    if (savedRange.current) {
      ref.current?.focus();
      sel?.removeAllRanges();
      sel?.addRange(savedRange.current);
      savedRange.current = null;
    } else {
      ref.current?.focus();
    }
    document.execCommand("insertHTML", false, html);
    if (ref.current) onChange(ref.current.innerHTML);
  }, [onChange]);

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

        <Sep />

        {/* Strikethrough, Superscript, Subscript */}
        <ToolbarBtn title="Strikethrough  (Ctrl+Shift+S)" onClick={() => exec("strikeThrough")}>
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Superscript" onClick={() => exec("superscript")}>
          <Superscript className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Subscript" onClick={() => exec("subscript")}>
          <Subscript className="h-3.5 w-3.5" />
        </ToolbarBtn>

        <Sep />

        {/* Indent / Outdent */}
        <ToolbarBtn title="Increase indent" onClick={() => exec("indent")}>
          <Indent className="h-3.5 w-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Decrease indent" onClick={() => exec("outdent")}>
          <Outdent className="h-3.5 w-3.5" />
        </ToolbarBtn>

        <Sep />

        {/* Insert Link */}
        <ToolbarBtn title="Insert link (Ctrl+K)" onClick={insertLink}>
          <LinkIcon className="h-3.5 w-3.5" />
        </ToolbarBtn>

        {/* Insert Table — grid picker */}
        <div className="relative">
          <ToolbarBtn
            title="Insert table"
            onClick={() => {
              // Save cursor before focus leaves editor
              const sel = window.getSelection();
              if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
              setShowTablePicker((v) => !v);
            }}
          >
            <Table className="h-3.5 w-3.5" />
          </ToolbarBtn>
          {showTablePicker && (
            <div
              className="absolute left-0 top-8 z-50 bg-card border border-border/60 rounded-xl shadow-xl p-3"
              onMouseLeave={() => setTableHover({ r: 0, c: 0 })}
            >
              <p className="text-[10px] font-mono text-muted-foreground mb-2 text-center">
                {tableHover.r > 0 && tableHover.c > 0
                  ? `${tableHover.r} × ${tableHover.c} table`
                  : "Hover to pick size"}
              </p>
              <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
                {Array.from({ length: 6 }, (_, ri) =>
                  Array.from({ length: 6 }, (_, ci) => (
                    <div
                      key={`${ri}-${ci}`}
                      onMouseEnter={() => setTableHover({ r: ri + 1, c: ci + 1 })}
                      onClick={() => doInsertTable(ri + 1, ci + 1)}
                      className={`w-5 h-5 rounded-sm border cursor-pointer transition-colors ${
                        ri < tableHover.r && ci < tableHover.c
                          ? "bg-primary/70 border-primary"
                          : "bg-muted/30 border-border/40 hover:bg-muted/60"
                      }`}
                    />
                  ))
                )}
              </div>
              <button
                onClick={() => setShowTablePicker(false)}
                className="mt-2 w-full text-[10px] text-muted-foreground hover:text-foreground transition-colors text-center"
              >Cancel</button>
            </div>
          )}
        </div>

        <Sep />

        {/* Font colour — save range on mousedown, restore before applying */}
        <label
          title="Font color"
          className="h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0 cursor-pointer"
          onMouseDown={() => {
            // Save selection NOW before OS color dialog opens and steals focus
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
          }}
        >
          <Palette className="h-3.5 w-3.5" />
          <input
            type="color"
            defaultValue="#e11d48"
            className="sr-only"
            onChange={(e) => restoreAndExec("foreColor", e.target.value)}
          />
        </label>

        {/* Remove formatting — restores selection then strips format */}
        <ToolbarBtn title="Remove formatting (select text first)" onClick={() => restoreAndExec("removeFormat")}>
          <Eraser className="h-3.5 w-3.5" />
        </ToolbarBtn>
      </div>

      {/* ── Editable area ── */}
      {/* Scoped style: heading sizes match BlogPost prose-h1/h2/h3 exactly */}
      <style>{`
        .rich-editor h1 {
          font-size: 1.5rem; /* prose-h1: text-2xl */
          font-weight: 700;
          line-height: 1.25;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid hsl(var(--border) / 0.4);
          color: hsl(var(--foreground));
        }
        @media (min-width: 640px) {
          .rich-editor h1 { font-size: 1.875rem; } /* sm:prose-h1: text-3xl */
        }
        .rich-editor h2 {
          font-size: 1.25rem; /* prose-h2: text-xl */
          font-weight: 700;
          line-height: 1.3;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid hsl(var(--border) / 0.3);
          color: hsl(var(--foreground));
        }
        @media (min-width: 640px) {
          .rich-editor h2 { font-size: 1.5rem; } /* sm:prose-h2: text-2xl */
        }
        .rich-editor h3 {
          font-size: 1.125rem; /* prose-h3: text-lg */
          font-weight: 600;
          line-height: 1.4;
          margin-top: 1rem;
          margin-bottom: 0.4rem;
          color: hsl(var(--foreground));
        }
        @media (min-width: 640px) {
          .rich-editor h3 { font-size: 1.25rem; } /* sm:prose-h3: text-xl */
        }
        .rich-editor h4 { font-size: 1rem; font-weight: 600; margin-top: 0.75rem; margin-bottom: 0.25rem; }
        .rich-editor p  { margin-top: 0; margin-bottom: 0.75rem; line-height: 1.75; }
        .rich-editor ul, .rich-editor ol { margin: 0.5rem 0 1rem; padding-left: 1.5rem; }
        .rich-editor li { margin: 0.25rem 0; line-height: 1.65; }
        .rich-editor blockquote {
          border-left: 3px solid hsl(var(--primary));
          background: hsl(var(--muted) / 0.3);
          padding: 0.25rem 1rem;
          border-radius: 0 0.5rem 0.5rem 0;
          margin: 1rem 0;
          color: hsl(var(--foreground) / 0.8);
        }
        .rich-editor strong { font-weight: 600; }
        .rich-editor code {
          font-family: ui-monospace, monospace;
          font-size: 0.82em;
          padding: 0.1em 0.35em;
          background: hsl(var(--muted) / 0.7);
          border-radius: 0.25rem;
          color: hsl(var(--primary));
          white-space: pre-wrap;
          word-break: break-all;
        }
        .rich-editor pre {
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
          font-size: 0.82em;
          line-height: 1.55;
          background: hsl(var(--muted) / 0.5);
          border: 1px solid hsl(var(--border) / 0.4);
          border-radius: 0.5rem;
          padding: 0.85rem 1rem;
          margin: 0.75rem 0 1rem;
          overflow-x: auto;          /* scroll instead of wrap */
          white-space: pre;           /* never wrap inside pre */
          word-break: normal;         /* keep words intact */
          overflow-wrap: normal;
        }
        .rich-editor pre code {
          background: none;
          border: none;
          padding: 0;
          font-size: 1em;
          color: hsl(var(--foreground) / 0.9);
          white-space: pre;           /* inherit pre nowrap */
          word-break: normal;
          overflow-wrap: normal;
        }
      `}</style>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onMouseUp={() => {
          // Save selection so table picker can restore it after focus leaves
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
        }}
        data-placeholder="Start writing here…  Use the toolbar above for headings, bold, alignment, lists, and more. Ctrl+B / Ctrl+I / Ctrl+U shortcuts work too."
        className="rich-editor min-h-[220px] p-4 text-sm text-foreground focus:outline-none"
      />
    </div>
  );
}

// ─── GitHub markdown CSS (embedded in iframe — immune to dark theme) ──────────

const GITHUB_MD_CSS = `
*, *::before, *::after { box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  font-size: 16px;
  line-height: 1.5;
  color: #24292f;
  background-color: #ffffff;
  padding: 24px 32px 32px;
  margin: 0;
  word-wrap: break-word;
}
a { color: #0969da; text-decoration: none; }
a:hover { text-decoration: underline; }

/* ── Headings — absolute px sizes so they are ALWAYS visually bigger than body text ── */
h1 {
  font-size: 36px !important;
  font-weight: 700 !important;
  line-height: 1.2 !important;
  color: #24292f !important;
  margin-top: 0 !important;
  margin-bottom: 16px !important;
  padding-bottom: 10px !important;
  border-bottom: 2px solid #d0d7de !important;
}
h2 {
  font-size: 28px !important;
  font-weight: 700 !important;
  line-height: 1.25 !important;
  color: #24292f !important;
  margin-top: 28px !important;
  margin-bottom: 14px !important;
  padding-bottom: 8px !important;
  border-bottom: 1px solid #d0d7de !important;
}
h3 {
  font-size: 22px !important;
  font-weight: 600 !important;
  line-height: 1.25 !important;
  color: #24292f !important;
  margin-top: 24px !important;
  margin-bottom: 12px !important;
}
h4 {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: #24292f !important;
  margin-top: 20px !important;
  margin-bottom: 10px !important;
}
h5 {
  font-size: 15px !important;
  font-weight: 600 !important;
  color: #24292f !important;
  margin-top: 16px !important;
  margin-bottom: 8px !important;
}
h6 {
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #57606a !important;
  margin-top: 16px !important;
  margin-bottom: 8px !important;
}

p  { margin-top: 0; margin-bottom: 16px; }
ul, ol { margin-top: 0; margin-bottom: 16px; padding-left: 2em; }
ul ul, ul ol, ol ol, ol ul { margin-top: 0; margin-bottom: 0; }
li { margin-top: .25em; }
li + li { margin-top: .25em; }
li > p { margin-top: 16px; }
blockquote {
  margin: 0 0 16px 0; padding: 0 1em;
  color: #57606a;
  border-left: .25em solid #d0d7de;
  background: transparent;
}
blockquote > :first-child { margin-top: 0; }
blockquote > :last-child  { margin-bottom: 0; }
hr { height: 0; margin: 24px 0; border: 0; border-top: 2px solid #d0d7de; }
pre {
  margin-top: 0; margin-bottom: 16px;
  padding: 16px;
  overflow: auto;
  font-size: 85%; line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
}
pre code {
  display: inline; padding: 0; margin: 0;
  overflow: visible; line-height: inherit;
  background: transparent; border: 0;
  font-size: 100%; border-radius: 0; color: #24292f;
}
code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 85%;
  padding: .2em .4em;
  background: rgba(175,184,193,.2);
  border-radius: 6px;
  color: #24292f;
}
table {
  border-spacing: 0; border-collapse: collapse;
  display: block; width: max-content; max-width: 100%;
  overflow: auto; margin-bottom: 16px;
}
th, td { padding: 6px 13px; border: 1px solid #d0d7de; }
th { font-weight: 600; background: #f6f8fa; }
tr { background: #fff; border-top: 1px solid #d8dee4; }
tr:nth-child(2n) { background: #f6f8fa; }
img { max-width: 100%; border-radius: 6px; vertical-align: middle; }
strong { font-weight: 600; color: #24292f; }
kbd {
  display: inline-block; padding: 3px 5px;
  font-size: 11px; line-height: 10px; color: #24292f;
  background: #f6f8fa; border: 1px solid rgba(175,184,193,.2);
  border-radius: 6px; box-shadow: inset 0 -1px 0 rgba(175,184,193,.2);
}
details { display: block; }
summary { display: list-item; cursor: pointer; }
`;

// ─── Markdown Upload Panel ─────────────────────────────────────────────


function MarkdownUploadPanel({ onParsed }: { onParsed: (blocks: ContentBlock[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [lineCount, setLineCount] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(400);

  // Build a fully self-contained HTML document for the iframe
  const srcDoc = preview
    ? `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${GITHUB_MD_CSS}</style></head><body>${preview}</body></html>`
    : "";

  // Auto-resize iframe to fit content after it loads
  const handleIframeLoad = () => {
    const measureHeight = () => {
      try {
        const body = iframeRef.current?.contentDocument?.body;
        if (body) {
          const h = body.scrollHeight;
          // If height is 0, content hasn't painted yet — retry on next frame
          if (h > 0) {
            setIframeHeight(h + 40);
          } else {
            requestAnimationFrame(measureHeight);
          }
        }
      } catch { /* cross-origin — won't happen with srcdoc */ }
    };
    requestAnimationFrame(measureHeight);
  };

  const processFile = async (file: File) => {
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
    setPreview(""); setFileName(""); setFileSize(""); setLineCount(0); setIframeHeight(400);
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
          <input ref={fileRef} type="file" className="hidden" onChange={handleChange} />
          <div className="flex flex-col items-center gap-3">
            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-200
              ${dragging ? "bg-primary/20 scale-110" : "bg-muted/60 group-hover:bg-primary/10 group-hover:scale-105"}`}>
              <FileText className={`h-8 w-8 transition-colors ${dragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                {dragging ? "Drop to import!" : "Drop your file here"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Any text file (.md, .txt, .markdown, etc.)
                {" · "} Rendered as GitHub Markdown preview
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" className="gap-2 text-xs pointer-events-none mt-1">
              <Upload className="h-3.5 w-3.5" /> Browse Files
            </Button>
          </div>
        </div>
      )}

      {/* GitHub-style file preview using isolated iframe */}
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

          {/* Action bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-muted/20 border-b border-border/30">
            <span className="text-xs text-muted-foreground flex-1">
              Preview — GitHub-accurate rendering
            </span>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-xs text-primary hover:underline"
            >
              Change file
            </button>
            <input ref={fileRef} type="file" className="hidden" onChange={handleChange} />
          </div>

          {/* ── Isolated iframe preview ── */}
          <iframe
            ref={iframeRef}
            srcDoc={srcDoc}
            onLoad={handleIframeLoad}
            title="Markdown Preview"
            style={{
              width: "100%",
              height: `${Math.max(iframeHeight, 300)}px`,
              border: "none",
              display: "block",
              backgroundColor: "#ffffff",
            }}
            sandbox="allow-same-origin"
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
    // Defer mode switch one frame so React renders the new blocks before unmounting the panel
    requestAnimationFrame(() => setEditorMode("write"));
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
