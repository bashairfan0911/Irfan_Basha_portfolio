import { useRef } from "react";
import { Server } from "lucide-react";
import { FaAws, FaDocker, FaPython, FaGitAlt, FaJenkins } from "react-icons/fa";
import { SiKubernetes, SiTerraform, SiPrometheus, SiAnsible, SiGrafana } from "react-icons/si";

// ── TiltCard wrapper ────────────────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    el.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateZ(6px)`;
  };
  const onLeave = () => {
    ref.current!.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateZ(0)";
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={`tilt-card relative transition-transform duration-300 ease-out ${className}`}>
      {children}
    </div>
  );
}

// ── Skill data ──────────────────────────────────────────────────────────
const skills = [
  { name: "AWS",        icon: FaAws,        level: 85, cat: "Cloud",      desc: "EC2 · EKS · S3 · IAM · CloudWatch",       color: "#FF9900" },
  { name: "Kubernetes", icon: SiKubernetes, level: 82, cat: "Containers", desc: "EKS · AKS · Deployments · Ingress · HPA",  color: "#326CE5" },
  { name: "Terraform",  icon: SiTerraform,  level: 80, cat: "IaC",        desc: "Modules · State · Remote Backend",         color: "#7B42BC" },
  { name: "Docker",     icon: FaDocker,     level: 85, cat: "Containers", desc: "Build · Compose · Multi-stage · Registry", color: "#2496ED" },
  { name: "Jenkins",    icon: FaJenkins,    level: 78, cat: "CI/CD",      desc: "Pipelines · Shared Libs · ArgoCD",         color: "#D33833" },
  { name: "Prometheus", icon: SiPrometheus, level: 72, cat: "Monitor",    desc: "Metrics · Alerting · Rules · EFK Stack",   color: "#E6522C" },
  { name: "Grafana",    icon: SiGrafana,    level: 72, cat: "Monitor",    desc: "Dashboards · Alerts · Data Sources",       color: "#F46800" },
  { name: "Ansible",    icon: SiAnsible,    level: 70, cat: "Config",     desc: "Playbooks · Roles · Vars · Handlers",      color: "#EE0000" },
  { name: "Python",     icon: FaPython,     level: 76, cat: "Dev",        desc: "Automation · Scripts · APIs · OOP",        color: "#3776AB" },
  { name: "Git",        icon: FaGitAlt,     level: 90, cat: "Dev",        desc: "GitHub · GitLab · GitOps · Branching",     color: "#F05032" },
  { name: "Linux",      icon: Server,       level: 82, cat: "OS",         desc: "Admin · Shell · SSH · Netstat · DNS",      color: "#FCC624" },
  { name: "Azure",      icon: ({ className, style }: any) => <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M22.379 23.343a1.62 1.62 0 0 0 1.536-2.14v.002L17.35 1.76A1.62 1.62 0 0 0 15.816.657H8.184A1.62 1.62 0 0 0 6.65 1.76L.086 21.204a1.62 1.62 0 0 0 1.536 2.139h4.741a1.62 1.62 0 0 0 1.535-1.103l.977-2.892 4.947 3.675c.28.208.618.32.966.32h7.591m-3.096-3.24h-5.883l-2.286-6.845 5.07-8.735 3.099 15.58"/></svg>, level: 75, cat: "Cloud", desc: "AKS · ACR · Azure DevOps · VMs · Blob", color: "#0078D4" },
];

// ── Flip Skill Card ─────────────────────────────────────────────────────
function SkillCard({ skill, index }: { skill: typeof skills[0]; index: number }) {
  const Icon = skill.icon;
  const pct  = skill.level;

  return (
    <TiltCard>
      <div className="flip-card h-[120px] sm:h-[130px] cursor-pointer" tabIndex={0}>
        <div className="flip-card-inner">

          {/* Front */}
          <div className="flip-card-front glass-card border border-border/40 gap-2"
            style={{ animationDelay: `${index * 60}ms` }}>
            <div className="p-2 rounded-xl" style={{ background: `${skill.color}18` }}>
              <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: skill.color }} />
            </div>
            <p className="text-xs sm:text-sm font-bold text-foreground text-center leading-tight">{skill.name}</p>
            <span className="text-[9px] uppercase tracking-widest font-mono px-1.5 py-0.5 rounded-full border"
              style={{ color: skill.color, borderColor: `${skill.color}40`, background: `${skill.color}10` }}>
              {skill.cat}
            </span>
          </div>

          {/* Back */}
          <div className="flip-card-back border border-border/40 gap-2 px-3"
            style={{ background: `linear-gradient(135deg,${skill.color}18,${skill.color}05)` }}>
            <div className="text-2xl font-black" style={{ color: skill.color }}>{pct}%</div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-border/40 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg,${skill.color},${skill.color}99)` }} />
            </div>

            <p className="text-[9px] text-muted-foreground text-center leading-tight font-mono">{skill.desc}</p>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

// ── Competencies ────────────────────────────────────────────────────────
const competencies = [
  "Cloud Architecture",  "Infrastructure as Code", "Container Orchestration",
  "CI/CD Automation",    "GitOps Workflows",        "Monitoring & Alerting",
  "Security & IAM",      "Linux Administration",    "Scripting & Automation",
];

// ── Main export ─────────────────────────────────────────────────────────
export const SkillsSection = () => (
  <section id="skills" className="py-14 sm:py-20 bg-background relative overflow-hidden">
    {/* Faint grid */}
    <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

    <div className="container mx-auto px-4 relative z-10">
      {/* Heading */}
      <div className="text-center mb-8 sm:mb-12">
        <span className="text-xs font-mono text-green-400 uppercase tracking-[0.2em] mb-2 block">&gt;_ technical_skills.sh</span>
        <h2 className="text-2xl sm:text-3xl font-black mb-3">
          <span className="text-gradient-vivid">Technical Skills</span>
        </h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Hover / tap a card to see proficiency & tools
        </p>
      </div>

      {/* 4-col flip grid */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 mb-12">
        {skills.map((s, i) => <SkillCard key={s.name} skill={s} index={i} />)}
      </div>

      {/* Core competencies */}
      <div className="text-center">
        <h3 className="text-sm font-mono text-muted-foreground mb-4 uppercase tracking-widest">Core Competencies</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {competencies.map((c) => (
            <span key={c}
              className="text-xs px-3 py-1.5 rounded-full border border-primary/25 text-primary/80 glass-card hover:border-primary/50 hover:text-primary transition-all duration-200 cursor-default font-mono">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);
