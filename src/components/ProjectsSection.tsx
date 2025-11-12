import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, TrendingUp, Shield, Database, Cloud, Container, Settings, ShoppingCart, Plane, ChevronDown, ShieldCheck, Vote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const projects = [
  {
    id: 1,
    title: "Personal Portfolio Website",
    description: "Built a responsive portfolio website using React, TypeScript, and Tailwind CSS with modern animations and dark theme. Deployed on Vercel with continuous deployment.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vercel", "Git"],
    metrics: ["Responsive Design", "SEO Optimized", "Fast Loading"],
    icon: Cloud,
    status: "Live",
    link: "#",
    image: "/images/portfolio.png"
  },
  {
    id: 3,
    title: "Multi-tier Retail Store Application",
    description: "A Multi-tier Retail Store Application to demonstrate Kubernetes To Production with EKS + Terraform & GitOps With ArgoCD & GitHub Actions",
    technologies: ["Kubernetes", "EKS", "Terraform", "ArgoCD", "GitHub Actions", "Docker"],
    metrics: ["Production Ready", "GitOps", "Auto Scaling"],
    icon: Container,
    status: "Complete",
    link: "#",
    image: "/images/retail.png"
  },
  {
    id: 7,
    title: "Microservices Voting Application with Azure CI/CD Pipeline",
    description: "Architected cloud-native voting application with 5 microservices using Python (Flask), .NET Core, Node.js, Redis, and PostgreSQL on Azure Kubernetes Service. Built automated CI/CD pipeline using GitHub Actions with multi-platform Docker builds and dual registry strategy.",
    technologies: ["Python", "Flask", ".NET Core", "Node.js", "Redis", "PostgreSQL", "Azure AKS", "GitHub Actions", "Docker", "Kubernetes", "WebSockets"],
    metrics: ["5 Microservices", "90% Faster Deploy", "70% CI/CD Efficiency"],
    icon: Vote,
    status: "Complete",
    link: "#",
    image: "/images/azure.png",
  },
  {
    id: 4,
    title: "EkoMart - E-Commerce Platform",
    description: "Full-stack MERN e-commerce application with admin panel, product management, shopping cart, and Razorpay payment integration. Features JWT authentication, Cloudinary image storage, and responsive Material-UI design.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "JWT", "Razorpay", "Cloudinary", "Material-UI"],
    metrics: ["Full-Stack", "Payment Gateway", "Admin Panel"],
    icon: ShoppingCart,
    status: "Live",
    link: "#",
    image: "/images/ekomart.png"
  },
  {
    id: 5,
    title: "Wanderlust - Travel Blog Platform",
    description: "MERN stack travel blog platform deployed on Kubernetes with Docker containerization. Features persistent storage with MongoDB, Redis caching, and complete CI/CD pipeline for scalable deployment.",
    technologies: ["React", "Node.js", "MongoDB", "Redis", "Kubernetes", "Docker", "Persistent Volumes"],
    metrics: ["K8s Deployment", "Microservices", "Scalable"],
    icon: Plane,
    status: "Complete",
    link: "#",
    image: "/images/wanderlust.png",
  },
  {
    id: 6,
    title: "DevSecOps Pipeline - Wanderlust",
    description: "End-to-end DevSecOps implementation with Jenkins CI/CD, OWASP dependency scanning, SonarQube code quality analysis, Trivy security scanning, and GitOps deployment using ArgoCD on AWS EKS with Prometheus & Grafana monitoring.",
    technologies: ["Jenkins", "ArgoCD", "SonarQube", "Trivy", "OWASP", "AWS EKS", "Helm", "Prometheus", "Grafana"],
    metrics: ["Full CI/CD", "Security Scanning", "GitOps"],
    icon: ShieldCheck,
    status: "Complete",
    link: "#",
    image: "/images/wanderlust.png",
  },
  {
    id: 2,
    title: "AWS VPC & VPC Peering",
    description: "Designed and deployed secure, scalable Virtual Private Clouds with cross-account VPC peering to enable private communication between services while reducing latency and cost.",
    technologies: ["AWS VPC", "VPC Peering", "EC2", "Route Tables", "Security Groups", "CloudFormation"],
    metrics: ["3 Networks", "≈25% Latency Reduction", "≈15% Cost Optimization"],
    icon: Cloud,
    status: "Complete",
    link: "#",
    image: "/images/vpcandvpcpeering.png"
  }
];

export const ProjectsSection = () => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  
  const INITIAL_PROJECTS_COUNT = 4;
  const displayedProjects = showAll ? projects : projects.slice(0, INITIAL_PROJECTS_COUNT);

  const handleViewDetails = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <section id="projects" className="py-20 bg-card/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Personal Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hands-on learning projects that demonstrate my growing skills and passion for technology
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {displayedProjects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <Card 
                key={project.id} 
                className="card-gradient border-border/50 overflow-hidden group hover:scale-[1.02] transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden bg-secondary/30">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="text-xs bg-success/90 text-white border-success/30 backdrop-blur">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent"></div>
                </div>

                <div className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-card-foreground mb-2">{project.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">{project.description}</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-secondary/30 rounded-lg">
                    {project.metrics.map((metric, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-lg font-bold text-primary">{metric.split(' ')[0]}</div>
                        <div className="text-xs text-muted-foreground">{metric.split(' ').slice(1).join(' ')}</div>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => handleViewDetails(project.id)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                      <Github className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Show More Button */}
        {projects.length > INITIAL_PROJECTS_COUNT && (
          <div className="flex justify-center mt-12">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              {showAll ? (
                <>
                  Show Less
                  <ChevronDown className="ml-2 h-5 w-5 rotate-180 transition-transform" />
                </>
              ) : (
                <>
                  Show More Projects
                  <ChevronDown className="ml-2 h-5 w-5 transition-transform" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
