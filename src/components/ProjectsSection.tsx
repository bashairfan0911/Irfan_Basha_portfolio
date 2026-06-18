import { useRef, useState } from "react";
import { ExternalLink, Github, Layers, Cloud, Container, ShoppingCart, Plane, Vote, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

// TiltCard reused locally
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    el.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateZ(8px)`;
  };
  const onLeave = () => { ref.current!.style.transform = "none"; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={`tilt-card relative transition-transform duration-300 ${className}`}>
      {children}
    </div>
  );
}

const projects = [
  {
    id: 3,
    title: "Three-tier App on AWS EKS",
    short: "EKS · GitOps · Terraform",
    description: "Enterprise-grade three-tier application (ReactJS, NodeJS, MongoDB) on Amazon EKS with 99.9% uptime using AWS Load Balancer Controller. Provisioning time cut from 4 hrs to 15 min via Terraform IaC.",
    technologies: ["AWS EKS","Terraform","ArgoCD","Jenkins","Docker","Kubernetes","Prometheus","Grafana"],
    metrics: [["99.9%","Uptime"],["70%","Faster Deploy"],["40%","Cost Saved"]],
    icon: Cloud,
    status: "Complete",
    color: "#00d4ff",
    id_slug: "3",
  },
  {
    id: 8,
    title: "Azure Microservices Voting App",
    short: "Azure AKS · CI/CD · 5 Services",
    description: "Cloud-native voting app with 5 microservices (Python Flask, .NET Core, Node.js, Redis, PostgreSQL) on Azure AKS. Automated CI/CD via GitHub Actions with multi-platform Docker builds.",
    technologies: ["Python","Flask",".NET Core","Node.js","Redis","PostgreSQL","Azure AKS","GitHub Actions","Docker"],
    metrics: [["5","Microservices"],["90%","Faster Deploy"],["70%","CI/CD Efficiency"]],
    icon: Vote,
    status: "Complete",
    color: "#00ff88",
    id_slug: "8",
  },
  {
    id: 5,
    title: "Wanderlust — Blogging Platform",
    short: "Docker · Jenkins · Redis · K8s",
    description: "Production-ready blogging platform (React, Node.js, Express, TypeScript) with JWT/session auth, Redis server-side caching, and Jenkins CI/CD pipeline cutting manual deploy steps by 80%.",
    technologies: ["React","Node.js","Express","TypeScript","Redis","Docker","Jenkins","Jest","K8s"],
    metrics: [["99.9%","Availability"],["80%","Fewer Steps"],["Redis","Caching"]],
    icon: Plane,
    status: "Live",
    color: "#a855f7",
    id_slug: "5",
  },
  {
    id: 4,
    title: "EkoMart — E-Commerce Platform",
    short: "MERN · Razorpay · Cloudinary",
    description: "Full-stack MERN e-commerce platform with admin panel, product management, shopping cart, and Razorpay payment integration. Features JWT auth, Cloudinary image storage, and responsive UI.",
    technologies: ["React","Node.js","Express","MongoDB","JWT","Razorpay","Cloudinary","Material-UI"],
    metrics: [["Full-Stack","MERN"],["Payment","Gateway"],["Admin","Panel"]],
    icon: ShoppingCart,
    status: "Live",
    color: "#f59e0b",
    id_slug: "4",
  },
  {
    id: 1,
    title: "Personal Portfolio Website",
    short: "React · TypeScript · Tailwind",
    description: "This portfolio — built with React, TypeScript, and Tailwind CSS with 3D animations, particle effects, and a full blog/admin system. Deployed on Vercel with CI/CD.",
    technologies: ["React","TypeScript","Tailwind CSS","Vite","Vercel","Docker"],
    metrics: [["3D UI","Animations"],["SEO","Optimized"],["Blog","CMS"]],
    icon: Layers,
    status: "Live",
    color: "#06b6d4",
    id_slug: "1",
  },
];

const STATUS_STYLE: Record<string, string> = {
  Live:     "text-green-400 border-green-400/30 bg-green-400/10",
  Complete: "text-primary  border-primary/30  bg-primary/10",
};

export const ProjectsSection = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="projects" className="py-14 sm:py-20 relative overflow-hidden bg-background">
      <div className="absolute inset-0 grid-overlay opacity-25 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-xs font-mono text-green-400 uppercase tracking-[0.2em] mb-2 block">&gt;_ projects.yaml</span>
          <h2 className="text-2xl sm:text-4xl font-black mb-3">
            <span className="text-gradient-vivid">Projects</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Production-grade cloud & DevOps projects with real metrics
          </p>
        </div>

        {/* Project cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {projects.map((p) => {
            const Icon = p.icon;
            const isOpen = expanded === p.id;
            return (
              <TiltCard key={p.id}>
                <div
                  className="glass-card rounded-2xl border border-border/30 overflow-hidden h-full flex flex-col hover:border-border/60 transition-all duration-300 cursor-pointer"
                  style={{ boxShadow: isOpen ? `0 0 20px ${p.color}20` : undefined }}
                  onClick={() => setExpanded(isOpen ? null : p.id)}
                >
                  {/* Header strip */}
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg,${p.color},${p.color}44)` }} />

                  <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl flex-shrink-0" style={{ background: `${p.color}18` }}>
                          <Icon className="w-5 h-5" style={{ color: p.color }} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground leading-tight">{p.title}</h3>
                          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{p.short}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${STATUS_STYLE[p.status]}`}>
                          {p.status}
                        </span>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2">
                      {p.metrics.map(([val, label]) => (
                        <div key={label} className="text-center p-1.5 rounded-lg bg-white/[0.03] border border-border/20">
                          <div className="text-xs font-black" style={{ color: p.color }}>{val}</div>
                          <div className="text-[9px] text-muted-foreground font-mono">{label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Expandable description */}
                    {isOpen && (
                      <div className="animate-reveal-up">
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{p.description}</p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {p.technologies.map((t) => (
                            <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-border/40 text-muted-foreground bg-white/[0.02]">{t}</span>
                          ))}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/project/${p.id_slug}`); }}
                          className="w-full py-2 rounded-xl text-xs font-mono font-bold border transition-all duration-200 hover:scale-[1.02]"
                          style={{ borderColor: `${p.color}40`, color: p.color, background: `${p.color}08` }}
                        >
                          View Details →
                        </button>
                      </div>
                    )}

                    {/* Tech preview (collapsed) */}
                    {!isOpen && (
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {p.technologies.slice(0, 4).map((t) => (
                          <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-border/30 text-muted-foreground">{t}</span>
                        ))}
                        {p.technologies.length > 4 && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 text-muted-foreground/60">+{p.technologies.length - 4} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
