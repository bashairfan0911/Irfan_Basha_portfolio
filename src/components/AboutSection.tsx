import { useRef } from "react";
import { Terminal, Cloud, GitBranch, Award, Briefcase, MapPin, Mail, Linkedin, Github } from "lucide-react";

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateZ(4px)`;
  };
  const onLeave = () => { ref.current!.style.transform = "none"; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={`tilt-card relative transition-transform duration-300 ${className}`}>
      {children}
    </div>
  );
}

const stats = [
  { value: "2+", label: "Projects", icon: GitBranch, color: "text-green-400", border: "border-green-400/20" },
  { value: "7+", label: "Certs", icon: Award, color: "text-yellow-400", border: "border-yellow-400/20" },
  { value: "1", label: "Internship", icon: Briefcase, color: "text-primary", border: "border-primary/20" },
  { value: "AWS", label: "Certified", icon: Cloud, color: "text-orange-400", border: "border-orange-400/20" },
];

const journey = [
  { year: "2021", event: "Started B.E. Computer Science Engineering @ Aalim Muhammed Salegh College" },
  { year: "2024", event: "Built Three-tier AWS EKS app with 99.9% uptime & 40% cost optimization" },
  { year: "2025", event: "AWS Certified Solutions Architect + 6 Oracle & Google certifications" },
  { year: "2025", event: "DevOps Intern @ PearlThoughts — Terraform, EC2, CI/CD pipelines" },
  { year: "2025", event: "Built Wanderlust platform: Docker, Jenkins, Redis, 80% faster deploys" },
];

const interests = ["Cloud Architecture", "Agentic AI", "Platform Engineering", "Open Source", "Kubernetes", "Observability"];

export const AboutSection = () => (
  <section id="about" className="py-14 sm:py-20 relative overflow-hidden bg-card/30">
    <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

    <div className="container mx-auto px-4 relative z-10">
      {/* Heading */}
      <div className="text-center mb-10 sm:mb-14">
        <span className="text-xs font-mono text-green-400 uppercase tracking-[0.2em] mb-2 block">&gt;_ about_me.md</span>
        <h2 className="text-2xl sm:text-4xl font-black mb-3">
          <span className="text-gradient-vivid">About Me</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-start">

        {/* ── Left: bio + journey ── */}
        <div className="space-y-6">
          {/* Terminal bio card */}
          <TiltCard>
            <div className="glass-card rounded-2xl border border-border/30 overflow-hidden">
              {/* Terminal bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 border-b border-border/30">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <span className="w-3 h-3 rounded-full bg-green-500/60" />
                <Terminal className="w-3.5 h-3.5 text-muted-foreground ml-2" />
                <span className="text-xs font-mono text-muted-foreground">irfan@devops ~ $ cat about.txt</span>
              </div>
              <div className="p-5 font-sans">
                <p className="text-foreground/90 leading-relaxed text-sm mb-3">
                  I'm <span className="text-gradient-vivid font-semibold">Irfan Basha</span>, an AWS Certified
                  DevOps Engineer from Chennai, India. I specialise in cloud automation, Kubernetes
                  orchestration, and building resilient CI/CD pipelines that cut deployment time and costs.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm mb-3">
                  I'm actively exploring <span className="text-green-400 font-mono text-xs">Agentic AI</span> and
                  <span className="text-primary font-mono text-xs"> Platform Engineering</span> — building
                  intelligent systems that self-heal and self-scale.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Outside of code, I'm a DevOps evangelist who believes infrastructure should be
                  <em className="text-foreground/80"> invisible, reliable, and automated</em>.
                </p>

                {/* Contact links */}
                <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-border/30">
                  <a href="mailto:bashairfan0911@gmail.com" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-mono">
                    <Mail className="w-3.5 h-3.5" /> bashairfan0911@gmail.com
                  </a>
                  <a href="https://www.linkedin.com/in/irfanbasha518/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-mono">
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                  <a href="https://github.com/bashairfan0911" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-mono">
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </a>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                    <MapPin className="w-3.5 h-3.5" /> Chennai, India
                  </span>
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Interests */}
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">Interests</p>
            <div className="flex flex-wrap gap-2">
              {interests.map((t) => (
                <span key={t} className="text-xs px-3 py-1.5 rounded-full border border-primary/20 text-primary/80 glass-card font-mono hover:border-primary/50 hover:text-primary transition-all duration-200 cursor-default">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: stats + timeline ── */}
        <div className="space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ value, label, icon: Icon, color, border }) => (
              <TiltCard key={label}>
                <div className={`glass-card rounded-2xl border ${border} p-4 text-center`}>
                  <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
                  <div className={`text-2xl font-black ${color}`}>{value}</div>
                  <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mt-0.5">{label}</div>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* Journey timeline */}
          <div className="glass-card rounded-2xl border border-border/30 p-5">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Journey</p>
            <div className="relative">
              <div className="absolute left-[52px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-green-400/30 to-transparent" />
              <div className="space-y-4">
                {journey.map(({ year, event }) => (
                  <div key={year + event} className="flex gap-4 items-start">
                    <span className="text-xs font-black font-mono text-primary w-[44px] flex-shrink-0 pt-0.5">{year}</span>
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5 relative z-10" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
