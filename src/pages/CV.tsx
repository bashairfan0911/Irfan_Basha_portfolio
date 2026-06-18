import { useState } from "react";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ProfessionalSummary } from "@/components/ProfessionalSummary";
import { TechnicalExpertise } from "@/components/TechnicalExpertise";
import { Download, ArrowLeft, FileText, ChevronDown, MapPin, Mail, Phone, Linkedin, Github, GraduationCap, Award } from "lucide-react";
import { Link } from "react-router-dom";

const RESUME_PATH = "/images/resume/IRFAN_BASHA_RESUME.pdf";

const CV = () => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border/40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/">
              <button className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </Link>
            <div className="w-px h-4 bg-border/50" />
            <div className="min-w-0">
              <span className="text-sm font-black text-gradient-vivid hidden sm:block">Irfan Basha</span>
              <span className="text-[10px] font-mono text-muted-foreground hidden sm:block">DevOps · Platform Eng · Agentic AI</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-all duration-200"
            >
              <FileText className="w-3.5 h-3.5" />
              {showPreview ? "Hide PDF" : "View PDF"}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showPreview ? "rotate-180" : ""}`} />
            </button>
            <a href={RESUME_PATH} download="Irfan_Basha_Resume.pdf">
              <button className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg shadow-neon-blue transition-all duration-200 hover:scale-105"
                style={{ background: "linear-gradient(135deg,hsl(195 100% 55%),hsl(148 100% 50%))", color: "#020810", fontWeight: 700 }}>
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
            </a>
          </div>
        </div>
      </header>

      {/* ── PDF Preview (collapsible) ── */}
      <div className={`overflow-hidden transition-all duration-500 ${showPreview ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-muted/20 border-b border-border/30 py-4 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-2 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-primary" /> Resume Preview</span>
              <a href={RESUME_PATH} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Open fullscreen ↗</a>
            </div>
            <div className="rounded-xl overflow-hidden border border-border/40 shadow-lg bg-white">
              <iframe src={`${RESUME_PATH}#toolbar=0&navpanes=0&view=FitH`} title="Resume" className="w-full"
                style={{ height: "clamp(380px, 70vh, 820px)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Resume Body ── */}
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
      <div className="container mx-auto px-4 py-8 relative z-10 max-w-5xl">

        {/* ── Resume Header ── */}
        <div className="glass-card rounded-2xl border border-primary/20 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-1">
                <span className="text-gradient-vivid">Irfan Basha</span>
              </h1>
              <p className="text-sm font-bold text-foreground/80 mb-3">
                AWS Certified DevOps Engineer · Platform Engineer · Agentic AI Developer
              </p>
              <div className="flex flex-wrap gap-3 text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Chennai, India</span>
                <a href="mailto:bashairfan0911@gmail.com" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Mail className="w-3 h-3" /> bashairfan0911@gmail.com
                </a>
                <a href="tel:+918610164761" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Phone className="w-3 h-3" /> +91 86101 64761
                </a>
                <a href="https://www.linkedin.com/in/irfanbasha518/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Linkedin className="w-3 h-3" /> LinkedIn
                </a>
                <a href="https://github.com/bashairfan0911" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Github className="w-3 h-3" /> GitHub
                </a>
              </div>
            </div>
            {/* Quick stats */}
            <div className="flex sm:flex-col gap-4 sm:gap-2 sm:text-right flex-shrink-0">
              {[["AWS Certified", "#FF9900"], ["7+ Certs", "#00ff88"], ["2+ Projects", "#00d4ff"]].map(([label, color]) => (
                <span key={label} className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border"
                  style={{ color, borderColor: `${color}30`, background: `${color}10` }}>{label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">

          {/* Left column */}
          <div className="space-y-6">
            {/* Summary */}
            <section>
              <SectionLabel label="Professional Summary" />
              <ProfessionalSummary />
            </section>

            {/* Experience */}
            <section>
              <SectionLabel label="Experience & Projects" />
              <ExperienceSection />
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Education */}
            <section>
              <SectionLabel label="Education" />
              <div className="glass-card rounded-2xl border border-border/30 p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-primary/10 flex-shrink-0">
                    <GraduationCap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground leading-tight">B.E. Computer Science Engineering</h4>
                    <p className="text-[11px] text-primary/80 font-mono mt-0.5">Aalim Muhammed Salegh College of Engineering</p>
                    <div className="flex flex-wrap gap-2 mt-1.5 text-[10px] font-mono text-muted-foreground">
                      <span>2021 – 2025</span>
                      <span className="text-yellow-400 font-bold">GPA: 8.0/10</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {["Data Structures","DBMS","Cloud Computing","Software Engineering","OS","Computer Networks"].map((c) => (
                    <span key={c} className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-border/30 text-muted-foreground">{c}</span>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-border/20">
                  <span className="text-[10px] text-green-400 font-mono">✦ Best Project Award — Final Year Capstone</span>
                </div>
              </div>
            </section>

            {/* Key Skills Quick Reference */}
            <section>
              <SectionLabel label="Core Strengths" />
              <div className="glass-card rounded-2xl border border-border/30 p-5">
                <div className="space-y-2">
                  {[
                    ["Cloud Platforms", "AWS · Azure"],
                    ["Containers", "Docker · Kubernetes · EKS"],
                    ["CI/CD", "Jenkins · ArgoCD · GitHub Actions"],
                    ["IaC", "Terraform · Ansible"],
                    ["Monitoring", "Prometheus · Grafana · EFK"],
                    ["Languages", "Python · Bash · TypeScript"],
                    ["OS", "Linux · Shell Scripting"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2 text-[10px]">
                      <span className="font-mono font-bold text-primary/80 w-20 flex-shrink-0">{k}</span>
                      <span className="text-muted-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Technical Expertise + Certs — full width */}
        <div className="mt-6">
          <SectionLabel label="Technical Skills & Certifications" />
          <TechnicalExpertise />
        </div>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-border/30 text-center text-xs font-mono text-muted-foreground">
          © 2026 Irfan Basha · AWS Certified DevOps Engineer ·{" "}
          <a href={RESUME_PATH} download="Irfan_Basha_Resume.pdf" className="text-primary hover:underline">Download Resume PDF</a>
        </footer>
      </div>
    </main>
  );
};

// Small section label component
function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-[9px] font-mono text-primary/60 uppercase tracking-[0.2em]">&gt;_</span>
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-border/30" />
    </div>
  );
}

export default CV;
