import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Home, FileText, BookOpen, FolderGit2, GraduationCap, Mail, Code2, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const NAV_SECTIONS = [
  { label: "Home", href: "/", icon: Home, type: "page" },
  { label: "View CV", href: "/cv", icon: FileText, type: "page" },
  { label: "Blog", href: "/blog", icon: BookOpen, type: "page" },
];

const HOME_SECTIONS = [
  { label: "Technical Skills", id: "skills", icon: Code2 },
  { label: "Projects", id: "projects", icon: FolderGit2 },
  { label: "Education", id: "education", icon: GraduationCap },
  { label: "Contact", id: "contact", icon: Mail },
];

export function HamburgerNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { theme, toggle } = useTheme();

  // Close on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const scrollTo = (id: string) => {
    setOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 250);
  };

  return (
    <>
      {/* ── Hamburger button — fixed top-left ── */}
      <button
        id="nav-hamburger"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className="
          fixed top-4 left-4 z-50
          w-10 h-10 rounded-full
          flex flex-col items-center justify-center gap-[5px]
          border border-border/40
          bg-background/60 backdrop-blur-md
          hover:bg-muted/60 hover:border-border/80
          transition-all duration-300 hover:scale-110
          shadow-sm
        "
      >
        <span className="block w-4 h-[2px] bg-foreground rounded-full transition-all" />
        <span className="block w-4 h-[2px] bg-foreground rounded-full transition-all" />
        <span className="block w-4 h-[2px] bg-foreground rounded-full transition-all" />
      </button>

      {/* ── Backdrop ── */}
      <div
        onClick={() => setOpen(false)}
        className={`
          fixed inset-0 z-40 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* ── Slide-in drawer ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          w-72 max-w-[85vw]
          bg-card/95 backdrop-blur-xl
          border-r border-border/50
          shadow-2xl
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div>
            <p className="font-bold text-base text-gradient">Irfan Basha</p>
            <p className="text-xs text-muted-foreground">Portfolio Navigation</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Pages */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-2 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
            Pages
          </p>
          {NAV_SECTIONS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 group
                ${location.pathname === href
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted/60 hover:text-primary"}
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {location.pathname === href && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}

          {/* Home sections — only show when on / */}
          {isHome && (
            <>
              <div className="pt-3 pb-1">
                <p className="px-2 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Sections
                </p>
              </div>
              {HOME_SECTIONS.map(({ label, id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                    text-foreground hover:bg-muted/60 hover:text-primary
                    transition-all duration-200 text-left
                  "
                >
                  <Icon className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                  {label}
                </button>
              ))}
            </>
          )}
        </nav>

        {/* Theme toggle row */}
        <div className="px-5 py-3 border-t border-border/50">
          <button
            onClick={toggle}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
              text-foreground hover:bg-muted/60 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-primary flex-shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-primary flex-shrink-0" />
            )}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {theme === "dark" ? "☀️" : "🌙"}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            © 2026 Irfan Basha
          </p>
        </div>
      </aside>
    </>
  );
}
