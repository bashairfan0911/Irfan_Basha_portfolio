import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, FileText, FolderGit2, BookOpen, Terminal } from "lucide-react";
import { Link } from "react-router-dom";

// ── Interactive Particle Mesh Canvas ───────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const COUNT = 65;
    const CONNECT_DIST = 130;
    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
    const pts: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.4 + 0.6,
      hue: Math.random() > 0.5 ? 195 : 148,
    }));

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pts.forEach((p) => {
        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 90) {
          p.vx += (dx / d) * 0.25;
          p.vy += (dy / d) * 0.25;
        }
        // Speed cap
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > 1.8) { p.vx = (p.vx / spd) * 1.8; p.vy = (p.vy / spd) * 1.8; }

        p.x = (p.x + p.vx + canvas.width) % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,60%,0.75)`;
        ctx.fill();
      });

      // Connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dist = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (dist < CONNECT_DIST) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${0.25 * (1 - dist / CONNECT_DIST)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ── Typing animation ────────────────────────────────────────────────────
function useTyping(roles: string[]) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let i = 0;
    const role = roles[idx];
    const t = setInterval(() => {
      if (i <= role.length) { setText(role.slice(0, i)); i++; }
      else {
        clearInterval(t);
        setTimeout(() => {
          const b = setInterval(() => {
            if (i > 0) { setText(role.slice(0, i)); i--; }
            else { clearInterval(b); setIdx((x) => (x + 1) % roles.length); }
          }, 40);
        }, 2000);
      }
    }, 75);
    return () => clearInterval(t);
  }, [idx]);

  return text;
}

// ── Main Hero ───────────────────────────────────────────────────────────
const ROLES = ["DevOps Engineer", "Agentic AI Developer", "Platform Engineer", "Cloud Architect"];

const BADGES = [
  { label: "AWS", style: { top: "4%",  left: "80%" }, delay: "0s",   color: "text-orange-400 border-orange-400/30 bg-orange-400/5" },
  { label: "K8s", style: { top: "75%", left: "-8%" }, delay: "0.5s", color: "text-primary  border-primary/30  bg-primary/5"  },
  { label: "CI/CD",style:{top: "88%", left: "72%" }, delay: "1s",   color: "text-green-400 border-green-400/30 bg-green-400/5" },
  { label: "IaC",  style: { top: "20%", left: "-5%" }, delay: "1.5s", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5" },
];

export const HeroSection = () => {
  const typed = useTyping(ROLES);

  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background scanline-overlay">
      {/* Particle mesh */}
      <ParticleCanvas />
      {/* Grid */}
      <div className="absolute inset-0 grid-overlay pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-20">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left: Text ── */}
          <div className="order-2 md:order-1 text-center md:text-left animate-reveal-up">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <Terminal className="w-3 h-3" />
              Available for opportunities
            </div>

            {/* Name — glitch */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight tracking-tight">
              <span className="glitch-text text-gradient-vivid">Irfan Basha</span>
            </h1>

            {/* Terminal typing */}
            <div className="h-9 flex items-center justify-center md:justify-start mb-6">
              <span className="text-base sm:text-lg font-mono text-green-400">
                <span className="text-primary/50 mr-1">&gt;_</span>
                {typed}
                <span className="animate-blink-cur inline-block border-r-2 border-green-400 h-4 ml-0.5" />
              </span>
            </div>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
              AWS Certified DevOps Engineer crafting resilient infrastructure,
              automated pipelines, and intelligent cloud platforms. Turning
              complexity into seamless, scalable solutions.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Button asChild size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2 shadow-neon-blue hover:scale-105 transition-all duration-300">
                <Link to="/cv"><FileText className="w-4 h-4" /> View CV</Link>
              </Button>
              <Button asChild size="lg" variant="outline"
                className="border-green-500/40 text-green-400 hover:bg-green-400/10 font-semibold gap-2 hover:scale-105 transition-all duration-300">
                <a href="#projects"><FolderGit2 className="w-4 h-4" /> Projects</a>
              </Button>
              <Button asChild size="lg" variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 font-semibold gap-2 hover:scale-105 transition-all duration-300">
                <Link to="/blog"><BookOpen className="w-4 h-4" /> Blog</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-8 justify-center md:justify-start">
              {[["2+","Projects"],["7+","Certs"],["1","Internship"]].map(([v, l]) => (
                <div key={l} className="text-center">
                  <div className="text-2xl font-black text-gradient-vivid">{v}</div>
                  <div className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Photo ── */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
              {/* Outer spinning ring */}
              <div className="absolute inset-[-14px] rounded-full border border-primary/25 animate-spin-slow" />
              {/* Inner dashed ring */}
              <div className="absolute inset-[-6px] rounded-full border border-dashed border-green-400/20 animate-spin-rev" />

              {/* Glow blob */}
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />

              {/* Photo */}
              <div className="relative w-full h-full rounded-full overflow-hidden animate-photo-ring border-2 border-primary/40">
                <img src="/images/profile.jpeg" alt="Irfan Basha — DevOps Engineer"
                  className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
              </div>

              {/* Floating DevOps badges */}
              {BADGES.map((b) => (
                <div key={b.label}
                  className={`absolute px-2.5 py-1 rounded-lg border text-xs font-mono font-bold animate-float glass-card ${b.color}`}
                  style={{ ...b.style, animationDelay: b.delay }}>
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a href="#about" className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity animate-bounce">
        <span className="text-[10px] font-mono text-muted-foreground">scroll</span>
        <ChevronDown className="w-5 h-5 text-primary" />
      </a>
    </section>
  );
};