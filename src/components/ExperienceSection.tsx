import { Calendar, MapPin, Briefcase, FolderGit2 } from "lucide-react";

const experiences = [
  {
    id: 1,
    company: "PearlThoughts",
    position: "DevOps Engineer Intern",
    duration: "Dec 2025 – Jan 2026",
    location: "Remote",
    type: "Internship",
    typeColor: "#00d4ff",
    achievements: [
      "Built AWS infrastructure using Terraform IaC (EC2, Security Groups, IAM, networking)",
      "Automated server provisioning with Bash scripts",
      "Worked on CI/CD pipelines applying cloud best practices",
    ],
    technologies: ["AWS", "Terraform", "EC2", "IAM", "Bash", "CI/CD"],
  },
  {
    id: 2,
    company: "Three-tier App on AWS EKS",
    position: "Cloud & DevOps Engineer",
    duration: "2024 – 2025",
    location: "Personal Project",
    type: "Project",
    typeColor: "#00ff88",
    achievements: [
      "Deployed ReactJS/NodeJS/MongoDB on EKS with 99.9% uptime via AWS Load Balancer Controller",
      "Cut provisioning time from 4 hrs → 15 min using Terraform; deployment time ↓ 70% via Jenkins + ArgoCD",
      "40% cost optimization with efficient resource management & auto-cleanup",
    ],
    technologies: ["AWS EKS", "Terraform", "Jenkins", "ArgoCD", "Docker", "Kubernetes", "Prometheus", "Grafana"],
  },
  {
    id: 3,
    company: "Wanderlust — Blogging Platform",
    position: "Full-Stack & DevOps Engineer",
    duration: "2024 – 2025",
    location: "Personal Project",
    type: "Project",
    typeColor: "#a855f7",
    achievements: [
      "Production-ready MERN platform with JWT auth, Redis caching, RESTful API — 99.9% availability",
      "Containerised all services with Docker: eliminated config drift across environments",
      "Jenkins CI/CD pipeline + Jest tests cut manual deployment steps by 80%",
    ],
    technologies: ["React", "Node.js", "Express", "TypeScript", "Redis", "Docker", "Jenkins", "Jest"],
  },
];

export const ExperienceSection = () => (
  <div className="glass-card rounded-2xl border border-border/30 p-5">
    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-5">Experience & Projects</p>

    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-3.5 top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-green-400/30 to-transparent" />

      <div className="space-y-5">
        {experiences.map(({ id, company, position, duration, location, type, typeColor, achievements, technologies }) => (
          <div key={id} className="flex gap-4">
            {/* Dot */}
            <div className="flex-shrink-0 mt-1.5 relative z-10">
              <div className="w-2 h-2 rounded-full ml-2.5" style={{ background: typeColor, boxShadow: `0 0 6px ${typeColor}80` }} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-4 border-b border-border/20 last:border-0 last:pb-0">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                <div>
                  <h4 className="text-sm font-bold text-foreground leading-tight">{company}</h4>
                  <p className="text-xs font-mono mt-0.5" style={{ color: typeColor }}>{position}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
                    style={{ color: typeColor, borderColor: `${typeColor}30`, background: `${typeColor}10` }}>
                    {type}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground font-mono mb-2">
                <span className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{duration}</span>
                <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{location}</span>
              </div>

              <ul className="space-y-1 mb-2">
                {achievements.map((a, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-muted-foreground leading-relaxed">
                    <span className="text-primary mt-0.5 flex-shrink-0">✦</span>{a}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1">
                {technologies.map((t) => (
                  <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-border/30 text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);