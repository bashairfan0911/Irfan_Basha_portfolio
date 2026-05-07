import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

// ── Change this to your desired admin password ─────────────────────────────
const ADMIN_PASSWORD = "Irfan@2024";
// ───────────────────────────────────────────────────────────────────────────

const SESSION_KEY = "admin_auth";

function isAuthed(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

interface Props {
  children: React.ReactNode;
}

export default function BlogAuthGate({ children }: Props) {
  const [authed, setAuthed] = useState(isAuthed);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    setAuthed(isAuthed());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      sessionStorage.setItem("admin_auth_pw", input); // used by Admin.tsx for API calls
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  };

  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center px-4">
      <Card className="w-full max-w-sm border-border/50 shadow-2xl">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your password to manage blog posts.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPw ? "text" : "password"}
                placeholder="Admin password"
                value={input}
                autoFocus
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(false);
                }}
                className={`pl-10 pr-10 ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-destructive text-center font-medium animate-shake">
                Incorrect password. Try again.
              </p>
            )}

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
