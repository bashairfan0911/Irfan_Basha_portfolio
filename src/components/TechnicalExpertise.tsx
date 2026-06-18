import { FaAws, FaDocker, FaPython, FaJenkins } from "react-icons/fa";
import { SiKubernetes, SiTerraform, SiPrometheus, SiAnsible } from "react-icons/si";
import { Activity, Server, ExternalLink } from "lucide-react";

const groups = [
  {
    label: "Cloud & Infra",
    color: "#FF9900",
    skills: ["AWS (EC2, EKS, S3, VPC)", "Azure (AKS, ACR)", "IAM & Security", "CloudWatch"],
  },
  {
    label: "Containers",
    color: "#2496ED",
    skills: ["Docker", "Kubernetes", "Amazon EKS", "Helm Charts", "Auto-Scaling"],
  },
  {
    label: "CI/CD & GitOps",
    color: "#D33833",
    skills: ["Jenkins", "ArgoCD", "GitHub Actions", "GitOps Workflows", "Git"],
  },
  {
    label: "IaC & Config",
    color: "#7B42BC",
    skills: ["Terraform", "Ansible", "CloudFormation", "YAML Manifests"],
  },
  {
    label: "Monitoring",
    color: "#E6522C",
    skills: ["Prometheus", "Grafana", "EFK Stack", "Alerting", "Jaeger"],
  },
  {
    label: "Scripting",
    color: "#3776AB",
    skills: ["Python", "Bash/Shell", "SQL/NoSQL", "Automation Scripts"],
  },
  {
    label: "Networking & OS",
    color: "#FCC624",
    skills: ["Linux Admin", "TCP/IP", "DNS", "Load Balancing", "SSH"],
  },
];

const certifications = [
  { short: "AWS SAA", title: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", url: "https://www.credly.com/badges/8336f37b-d694-499c-812c-06e86db040c7", validity: "Jul 2025 – Jul 2028", color: "#FF9900" },
  { short: "OCI DevOps", title: "OCI 2025 Certified DevOps Professional", issuer: "Oracle", url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=C8F2CA3627E56BB3A2A887C1F257481548DA7B2A20CF1E747FB5F2893B3A43BB", validity: "2025", color: "#F80000" },
  { short: "OCI AI", title: "OCI 2025 Certified AI Foundations Associate", issuer: "Oracle", url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=3856E0F59B786EAEBCBB0D0FA8AC1FD92B0027CDA96A7AF0EAFE77F1078A479E", validity: "2025", color: "#F80000" },
  { short: "OCI Multi", title: "OCI 2025 Certified Multicloud Architect", issuer: "Oracle", url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=50E592F48CBB302BE2304939448ED70492FCA5B1855170FDCF2013A26E106BBE", validity: "2025", color: "#F80000" },
  { short: "Google DA", title: "Google Data Analytics Professional", issuer: "Google/Coursera", url: "https://www.credly.com/badges/dc2deaa4-1d54-40c1-b8e6-5be2badfb151/public_url", validity: "Mar 2025", color: "#4285F4" },
  { short: "OAC", title: "Oracle Analytics Cloud", issuer: "Oracle", url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=6109577756FDC4BDD9D3E711C9C2BC946F293D82EEA2F6C93FAF07F8D6508F68", validity: "Sep 2025–2027", color: "#F80000" },
  { short: "MongoDB", title: "MongoDB Node.js Developer Path", issuer: "MongoDB/SmartBridge", url: "https://learn.mongodb.com/c/4lcMpkcbT2qLXmVqnGyIEw", validity: "MDBuj0lzlt386", color: "#00ED64" },
];

export const TechnicalExpertise = () => (
  <div className="space-y-6">
    {/* Skills grouped pills */}
    <div className="glass-card rounded-2xl border border-border/30 p-5">
      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4">Technical Skills</p>
      <div className="space-y-3">
        {groups.map(({ label, color, skills }) => (
          <div key={label} className="flex flex-wrap items-start gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider w-24 flex-shrink-0 pt-1" style={{ color }}>
              {label}
            </span>
            <div className="flex flex-wrap gap-1.5 flex-1">
              {skills.map((s) => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded-full border font-mono text-foreground/80"
                  style={{ borderColor: `${color}30`, background: `${color}08` }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Certifications compact grid */}
    <div className="glass-card rounded-2xl border border-border/30 p-5">
      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4">Certifications</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {certifications.map((c) => (
          <a key={c.short} href={c.url} target="_blank" rel="noopener noreferrer"
            className="flex items-start justify-between gap-2 p-2.5 rounded-xl border border-border/30 hover:border-border/60 transition-all duration-200 group bg-background/30">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: c.color, background: `${c.color}15` }}>{c.short}</span>
              </div>
              <p className="text-[10px] text-foreground/80 leading-tight font-medium line-clamp-2">{c.title}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5 font-mono">{c.validity}</p>
            </div>
            <ExternalLink className="w-3 h-3 text-muted-foreground/30 group-hover:text-muted-foreground flex-shrink-0 mt-0.5 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  </div>
);
