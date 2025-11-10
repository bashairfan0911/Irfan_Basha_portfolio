import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Container, Settings, GitBranch, Activity, Code, Server, Award } from "lucide-react";

const technicalSkills = [
  {
    category: "Cloud Platforms",
    icon: Cloud,
    skills: ["Amazon Web Services (AWS)", "Microsoft Azure", "Google Cloud Platform (GCP)"]
  },
  {
    category: "Container Technologies",
    icon: Container,
    skills: ["Docker", "Kubernetes", "Helm Charts"]
  },
  {
    category: "Infrastructure Automation",
    icon: Settings,
    skills: ["Terraform", "AWS CLI", "Infrastructure as Code"]
  },
  {
    category: "CI/CD & GitOps",
    icon: GitBranch,
    skills: ["Jenkins", "ArgoCD", "Git", "GitHub Actions"]
  },
  {
    category: "Monitoring & Observability",
    icon: Activity,
    skills: ["Prometheus", "Grafana", "CloudWatch", "Log Analysis"]
  },
  {
    category: "Configuration Management",
    icon: Server,
    skills: ["Ansible", "YAML Manifests"]
  },
  {
    category: "Programming",
    icon: Code,
    skills: ["Python", "Shell Scripting", "SQL/NoSQL"]
  },
  {
    category: "Operating Systems",
    icon: Server,
    skills: ["Linux Administration", "Windows"]
  }
];

const certifications = [
  {
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    credentialUrl: "https://www.credly.com/badges/8336f37b-d694-499c-812c-06e86db040c7",
    validity: "July 21, 2025 - July 21, 2028",
    icon: Award
  },
  {
    title: "Google Data Analytics Professional Certificate",
    issuer: "Google",
    credentialUrl: "https://www.credly.com/badges/dc2deaa4-1d54-40c1-b8e6-5be2badfb151/public_url",
    validity: "Issued: March 21, 2025",
    icon: Award
  }
];

export const TechnicalExpertise = () => {
  return (
    <section className="py-20 bg-card/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Technical Expertise</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive skill set in modern DevOps and cloud technologies
          </p>
        </div>

        {/* Technical Skills */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-6">
            {technicalSkills.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.category}
                  className="card-gradient border-border/50 p-6 hover:scale-[1.02] transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">{category.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Certifications */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">
            <span className="text-gradient">Certifications</span>
          </h3>
          <div className="space-y-6">
            {certifications.map((cert, index) => {
              const IconComponent = cert.icon;
              return (
                <Card 
                  key={cert.title}
                  className="card-gradient border-border/50 p-6 hover:scale-[1.01] transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 glow-effect">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-card-foreground mb-2">{cert.title}</h4>
                      <p className="text-muted-foreground mb-2">{cert.issuer}</p>
                      <p className="text-sm text-muted-foreground mb-3">{cert.validity}</p>
                      <a 
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 text-sm underline"
                      >
                        View Credential →
                      </a>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
