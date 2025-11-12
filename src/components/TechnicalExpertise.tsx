import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Code, Server, Award } from "lucide-react";
import { FaAws, FaDocker, FaPython, FaGitAlt, FaJenkins, FaJava } from "react-icons/fa";
import { SiGooglecloud, SiKubernetes, SiTerraform, SiPrometheus, SiGrafana, SiAnsible } from "react-icons/si";

// Azure Icon Component
const AzureIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.379 23.343a1.62 1.62 0 0 0 1.536-2.14v.002L17.35 1.76A1.62 1.62 0 0 0 15.816.657H8.184A1.62 1.62 0 0 0 6.65 1.76L.086 21.204a1.62 1.62 0 0 0 1.536 2.139h4.741a1.62 1.62 0 0 0 1.535-1.103l.977-2.892 4.947 3.675c.28.208.618.32.966.32h7.591m-3.096-3.24h-5.883l-2.286-6.845 5.07-8.735 3.099 15.58" />
  </svg>
);

const technicalSkills = [
  {
    category: "Amazon Web Services (AWS)",
    icon: FaAws,
    skills: ["EC2", "EKS", "ECR", "VPC", "S3", "Lambda", "CloudWatch", "IAM"]
  },
  {
    category: "Microsoft Azure",
    icon: AzureIcon,
    skills: ["Azure AKS", "Azure Container Registry", "Azure DevOps", "Virtual Networks"]
  },
  {
    category: "Google Cloud Platform (GCP)",
    icon: SiGooglecloud,
    skills: ["Compute Engine", "GKE", "Cloud Storage", "Cloud Functions"]
  },
  {
    category: "Container Technologies",
    icon: FaDocker,
    skills: ["Docker", "Kubernetes", "Helm Charts"]
  },
  {
    category: "Kubernetes",
    icon: SiKubernetes,
    skills: ["EKS", "AKS", "GKE", "Deployments", "Services", "Ingress"]
  },
  {
    category: "Infrastructure as Code",
    icon: SiTerraform,
    skills: ["Terraform", "AWS CLI", "CloudFormation"]
  },
  {
    category: "CI/CD & GitOps",
    icon: FaJenkins,
    skills: ["Jenkins", "ArgoCD", "GitHub Actions"]
  },
  {
    category: "Version Control",
    icon: FaGitAlt,
    skills: ["Git", "GitHub", "GitLab"]
  },
  {
    category: "Monitoring & Observability",
    icon: SiPrometheus,
    skills: ["Prometheus", "Grafana", "CloudWatch", "Log Analysis"]
  },
  {
    category: "Configuration Management",
    icon: SiAnsible,
    skills: ["Ansible", "YAML Manifests"]
  },
  {
    category: "Programming Languages",
    icon: FaPython,
    skills: ["Python", "Java", "Shell Scripting", "SQL/NoSQL"]
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
    title: "Oracle Cloud Infrastructure 2025 Certified DevOps Professional",
    issuer: "Oracle",
    credentialUrl: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=C8F2CA3627E56BB3A2A887C1F257481548DA7B2A20CF1E747FB5F2893B3A43BB",
    validity: "Issued: 2025",
    icon: Award
  },
  {
    title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    issuer: "Oracle",
    credentialUrl: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=3856E0F59B786EAEBCBB0D0FA8AC1FD92B0027CDA96A7AF0EAFE77F1078A479E",
    validity: "Issued: 2025",
    icon: Award
  },
  {
    title: "Oracle Cloud Infrastructure 2025 Certified Multicloud Architect Professional",
    issuer: "Oracle",
    credentialUrl: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=50E592F48CBB302BE2304939448ED70492FCA5B1855170FDCF2013A26E106BBE",
    validity: "Issued: 2025",
    icon: Award
  },
  {
    title: "Oracle Analytics Cloud",
    issuer: "Oracle",
    credentialUrl: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=6109577756FDC4BDD9D3E711C9C2BC946F293D82EEA2F6C93FAF07F8D6508F68",
    validity: "September 2025 - September 2027",
    icon: Award
  },
  {
    title: "MongoDB Node.js Developer Path",
    issuer: "MongoDB for SmartBridge",
    credentialUrl: "https://learn.mongodb.com/c/4lcMpkcbT2qLXmVqnGyIEw",
    validity: "Certification ID: MDBuj0lzlt386",
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
                      <IconComponent className="w-6 h-6 text-primary" />
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
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">
            <span className="text-gradient">Certifications</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
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
