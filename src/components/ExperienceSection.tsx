import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar, MapPin } from "lucide-react";

const experiences = [
  {
    id: 1,
    company: "Retail Store Sample App - GitOps with Amazon EKS",
    position: "DevOps Engineer & Cloud Architect",
    duration: "2024 - 2025",
    location: "Personal Project",
    type: "Project",
    description: "Deployed a production-grade microservices retail application on AWS EKS using GitOps principles with automated CI/CD pipeline. Implemented infrastructure as code with Terraform and continuous deployment with ArgoCD.",
    achievements: [
      "Architected and deployed 5 microservices (UI, Catalog, Cart, Orders, Checkout) on AWS EKS Auto Mode",
      "Implemented GitOps workflow with ArgoCD for automated deployments and rollbacks",
      "Built CI/CD pipeline using GitHub Actions for automated Docker image builds and ECR pushes",
      "Provisioned AWS infrastructure using Terraform including VPC, EKS cluster, and security groups",
      "Configured NGINX Ingress Controller and Cert Manager for SSL/TLS termination",
      "Set up Helm charts for each microservice with automated version updates on code changes",
      "Implemented monitoring and observability with Prometheus and Grafana stack",
      "Achieved zero-downtime deployments with automated health checks and rollback capabilities"
    ],
    technologies: ["AWS EKS", "Terraform", "ArgoCD", "GitHub Actions", "Docker", "Kubernetes", "Helm", "NGINX", "ECR", "Prometheus", "Grafana"]
  },
  {
    id: 2,
    company: "EkoMart - E-Commerce Platform",
    position: "Full-Stack MERN Developer",
    duration: "2024 - 2025",
    location: "Personal Project",
    type: "Project",
    description: "Built a full-stack e-commerce application with admin panel, product management, shopping cart, and payment integration using the MERN stack (MongoDB, Express, React, Node.js).",
    achievements: [
      "Implemented user authentication with JWT and secure password hashing using Bcrypt",
      "Integrated Razorpay payment gateway for seamless checkout experience",
      "Built admin dashboard for product, category, and order management",
      "Configured Cloudinary for efficient image storage and delivery",
      "Developed RESTful APIs with Express and MongoDB for scalable backend",
      "Created responsive UI with Material-UI and React Router for navigation",
      "Deployed with Netlify (frontend) and configured for production environment"
    ],
    technologies: ["React", "Node.js", "Express", "MongoDB", "JWT", "Razorpay", "Cloudinary", "Material-UI", "Vite"]
  },
  {
    id: 2,
    company: "Personal Projects & Learning",
    position: "Self-Directed Learning",
    duration: "2024 - Present",
    location: "Remote",
    type: "Self-Study",
    description: "Building practical skills through hands-on projects and continuous learning in DevOps and data analytics.",
    achievements: [
      "Developed portfolio website using React, TypeScript, and Tailwind CSS",
      "Learning cloud technologies including AWS, Docker, and Kubernetes",
      "Practicing CI/CD pipelines and infrastructure automation",
      "Exploring data analysis tools and visualization techniques"
    ],
    technologies: ["React", "TypeScript", "Docker", "Git", "Linux", "Python"]
  }
];

export const ExperienceSection = () => {
  return (
    <section className="py-20 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Experience & Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Building skills through hands-on learning and personal projects
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-tech-accent to-data-viz opacity-30"></div>

            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div 
                  key={exp.id} 
                  className="relative animate-fade-in"
                  style={{ animationDelay: `${index * 300}ms` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-background glow-effect"></div>
                  
                  <div className="ml-20">
                    <Card className="card-gradient border-border/50 p-8 hover:scale-[1.02] transition-all duration-300">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Building className="w-5 h-5 text-primary" />
                            <h3 className="text-xl font-semibold text-card-foreground">{exp.company}</h3>
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              {exp.type}
                            </Badge>
                          </div>
                          
                          <h4 className="text-lg font-medium text-tech-accent mb-2">{exp.position}</h4>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {exp.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {exp.location}
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-6 leading-relaxed">{exp.description}</p>
                          
                          <div className="space-y-2 mb-6">
                            <h5 className="font-medium text-card-foreground">Key Achievements:</h5>
                            <ul className="space-y-2">
                              {exp.achievements.map((achievement, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs border-primary/30 text-primary">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};