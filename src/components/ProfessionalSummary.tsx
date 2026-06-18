import { Terminal } from "lucide-react";

export const ProfessionalSummary = () => (
  <div className="glass-card rounded-2xl border border-primary/20 overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 border-b border-border/30">
      <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
      <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
      <Terminal className="w-3.5 h-3.5 text-muted-foreground ml-2" />
      <span className="text-xs font-mono text-muted-foreground">summary.txt</span>
    </div>
    <div className="px-5 py-4">
      <p className="text-sm text-foreground/90 leading-relaxed">
        <span className="text-primary font-mono text-xs mr-1">&gt;</span>
        AWS Certified DevOps Engineer with hands-on experience in cloud automation, CI/CD pipelines,
        Infrastructure as Code, and Kubernetes. Proficient in deploying and managing scalable
        microservices on AWS EKS using GitOps, Prometheus/Grafana monitoring, and Terraform IaC.
        Seeking a DevOps or Platform Engineering role to automate infrastructure, streamline
        deployments, and improve system reliability at scale.
      </p>
    </div>
  </div>
);
