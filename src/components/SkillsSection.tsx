import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Server, Cloud, Database } from "lucide-react";

interface Skill {
  name: string;
  level: number;
  category: 'devops' | 'cloud' | 'container' | 'programming';
  icon: any;
}

const skills: Skill[] = [
  { name: 'AWS (EC2, EKS, ECR, VPC)', level: 85, category: 'cloud', icon: Cloud },
  { name: 'Azure & GCP', level: 70, category: 'cloud', icon: Cloud },
  { name: 'Docker & Kubernetes', level: 85, category: 'container', icon: Server },
  { name: 'Helm Charts', level: 80, category: 'container', icon: Server },
  { name: 'Terraform & IaC', level: 85, category: 'devops', icon: Code2 },
  { name: 'Jenkins & ArgoCD', level: 80, category: 'devops', icon: Server },
  { name: 'GitHub Actions', level: 85, category: 'devops', icon: Server },
  { name: 'Prometheus & Grafana', level: 75, category: 'devops', icon: Database },
  { name: 'Ansible & YAML', level: 75, category: 'devops', icon: Code2 },
  { name: 'Python & Shell Scripting', level: 80, category: 'programming', icon: Code2 },
  { name: 'SQL & NoSQL', level: 75, category: 'programming', icon: Database },
  { name: 'Linux Administration', level: 85, category: 'programming', icon: Server },
];

const categoryColors = {
  devops: 'bg-primary/10 text-primary border-primary/20',
  cloud: 'bg-tech-accent/10 text-tech-accent border-tech-accent/20',
  container: 'bg-data-viz/10 text-data-viz border-data-viz/20',
  programming: 'bg-warning/10 text-warning border-warning/20',
};

export const SkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Technical Skills</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Production-ready DevOps and Cloud expertise with hands-on experience in modern infrastructure
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => {
            const IconComponent = skill.icon;
            return (
              <Card key={skill.name} className="card-gradient border-border/50 p-6 group hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground">{skill.name}</h3>
                  </div>
                  <Badge className={categoryColors[skill.category]}>
                    {skill.category.toUpperCase()}
                  </Badge>
                </div>
              
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Proficiency</span>
                    <span className="text-primary font-medium">{skill.level}%</span>
                  </div>
                  
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-tech-accent rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: isVisible ? `${skill.level}%` : '0%',
                        transitionDelay: `${index * 100}ms`
                      }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Skill Categories */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8 text-gradient">Core Competencies</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['Cloud Platforms (AWS, Azure, GCP)', 'Container Technologies', 'Infrastructure as Code', 'CI/CD & GitOps', 'Monitoring & Observability', 'Configuration Management'].map((resource) => (
              <Badge key={resource} variant="outline" className="px-4 py-2 text-sm border-primary/30 text-primary hover:bg-primary/10">
                {resource}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
