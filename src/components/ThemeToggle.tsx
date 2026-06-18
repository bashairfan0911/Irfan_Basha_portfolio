import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`
        relative inline-flex items-center justify-center
        w-10 h-10 rounded-full
        border border-border/40
        bg-background/60 backdrop-blur-md
        text-muted-foreground hover:text-foreground
        hover:bg-muted/60 hover:border-border/80
        transition-all duration-300 hover:scale-110
        shadow-sm
        ${className}
      `}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 transition-transform duration-300 rotate-0" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-300 rotate-0" />
      )}
    </button>
  );
}
