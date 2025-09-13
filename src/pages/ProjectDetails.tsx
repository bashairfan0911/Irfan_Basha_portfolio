import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Github, Calendar, Users, Target } from "lucide-react";

const projectsData = {
  1: {
    title: "Personal Portfolio Website",
    description: "Built a responsive portfolio website using React, TypeScript, and Tailwind CSS with modern animations and dark theme. Deployed on Vercel with continuous deployment.",
    longDescription: "This portfolio website showcases my journey as a fresh graduate entering the tech industry. The project demonstrates my understanding of modern web development practices, responsive design principles, and user experience considerations. I focused on creating a clean, professional interface that effectively communicates my skills and aspirations while maintaining excellent performance and accessibility standards.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vercel", "Git"],
    features: [
      "Fully responsive design that works across all devices",
      "Dark theme with smooth transitions and animations",
      "SEO optimized with meta tags and structured data",
      "Fast loading times with optimized assets",
      "Interactive contact form with validation",
      "Modern UI components and micro-interactions"
    ],
    challenges: [
      "Learning TypeScript while building the project",
      "Implementing smooth animations without affecting performance",
      "Creating a design that stands out while remaining professional",
      "Optimizing for different screen sizes and devices"
    ],
    outcomes: [
      "Successfully deployed and accessible to recruiters",
      "Gained hands-on experience with modern React patterns",
      "Improved understanding of responsive design principles",
      "Enhanced knowledge of deployment and CI/CD processes"
    ],
    duration: "2 weeks",
    role: "Solo Developer",
    status: "Live",
    demoLink: "https://professional-portfolio-theta-lac.vercel.app/", 
    githubLink: "https://github.com/bashairfan0911/professional_portfolio.git" 
  },
 2: {
  title: "AWS VPC & VPC Peering",
  description:
    "Architected and deployed secure, scalable Virtual Private Clouds on AWS with cross-account VPC peering to enable private communication between environments.",
  longDescription:
    "This project focused on mastering AWS networking fundamentals and implementing real-world connectivity between isolated networks. I created multiple VPCs with custom CIDR blocks, configured route tables, and established VPC peering to allow seamless and secure communication across accounts while minimizing latency and cost. Emphasis was placed on high availability, proper security group configurations, and infrastructure-as-code practices using CloudFormation.",
  technologies: [
    "AWS VPC",
    "VPC Peering",
    "EC2",
    "Route Tables",
    "Security Groups",
    "CloudFormation",
    "IAM"
  ],
  features: [
    "Creation of multiple isolated VPCs with custom CIDR ranges",
    "Cross-account VPC peering for secure private communication",
    "Automated provisioning with AWS CloudFormation templates",
    "Fine-grained access control using Security Groups and NACLs",
    "High-availability design with multi-AZ subnets",
    "Monitoring and cost optimization using AWS CloudWatch and Cost Explorer"
  ],
  challenges: [
    "Designing non-overlapping CIDR blocks for multiple VPCs",
    "Ensuring secure routing and preventing transitive peering",
    "Balancing performance with cost when selecting peering options",
    "Automating repeatable deployments using CloudFormation"
  ],
  outcomes: [
    "Deployed 3 production-ready VPCs with successful peering connections",
    "Reduced inter-service latency by approximately 25%",
    "Lowered cross-VPC data transfer costs by ~15%",
    "Strengthened understanding of AWS networking and infrastructure-as-code"
  ],
  duration: "4 weeks",
  role: "Cloud Engineer",
  status: "Complete",
  demoLink: "", // leave empty if no live demo
  githubLink: "https://github.com/bashairfan0911/vpc-and-vpc-peering.git"
},

  3: {
    title: "Dockerized Web Application",
    description: "Containerized a simple web application using Docker, learned about multi-stage builds, and practiced container orchestration fundamentals.",
    longDescription: "This project focused on learning containerization technologies and DevOps practices. I took a basic web application and transformed it into a fully containerized solution with proper orchestration, demonstrating understanding of modern deployment strategies.",
    technologies: ["Docker", "Node.js", "HTML/CSS", "Docker Compose", "GitHub"],
    features: [
      "Multi-stage Docker builds for optimization",
      "Docker Compose for multi-container orchestration",
      "Environment-specific configurations",
      "Automated health checks and monitoring",
      "Volume management for persistent data",
      "Network configuration for container communication"
    ],
    challenges: [
      "Understanding Docker concepts and best practices",
      "Optimizing container images for size and performance",
      "Managing container networking and volumes",
      "Implementing proper security measures"
    ],
    outcomes: [
      "Reduced deployment complexity and errors",
      "Improved application portability across environments",
      "Gained hands-on experience with containerization",
      "Understanding of modern DevOps workflows"
    ],
    duration: "2 weeks",
    role: "DevOps Learner",
    status: "Learning",
    demoLink: "https://professional-portfolio-theta-lac.vercel.app/", 
    githubLink: "" // removed to test disabled state
  },
    4: {
    title: "Multi-Tier Retail Store Application",
    description: "A containerized microservices e-commerce platform with a full GitOps CI/CD pipeline on AWS.",
    longDescription: "This project is a multi-tier retail store application designed for production-ready deployment on AWS. The system separates the front-end, back-end, and database into independent containerized services. It uses Kubernetes (AWS EKS with Auto Mode) for orchestration and Terraform for infrastructure provisioning. A GitOps-based CI/CD pipeline (Argo CD for deployments and GitHub Actions for continuous integration) automates all builds and releases. The platform includes centralized inventory and order management across multiple store locations, demonstrating scalability and high availability. Real-time monitoring and logging are implemented via Grafana and Prometheus, providing insights into system performance and health.",
    technologies: [
      "Java", "Spring Boot", "React (TypeScript)", "Go", "Docker",
      "Kubernetes (AWS EKS)", "AWS (EKS, RDS, etc.)", "Terraform", "Argo CD",
      "Grafana", "Prometheus", "GitHub Actions"
    ],
    features: [
      "Multi-tier microservices architecture (separate UI, API, and database layers)",
      "Automated GitOps deployment pipeline with Argo CD and GitHub Actions",
      "AWS EKS Auto Mode for managed Kubernetes scaling",
      "Centralized multi-store inventory and order tracking system",
      "Comprehensive monitoring dashboards with Grafana and Prometheus",
      "Automated infrastructure provisioning with Terraform"
    ],
    challenges: [
      "Coordinating and deploying multiple containerized services across tiers",
      "Building a robust CI/CD pipeline and GitOps workflow",
      "Ensuring high availability and fault tolerance (targeting 99.9% uptime)",
      "Designing a flexible database schema for multi-store inventory",
      "Managing cloud resources and costs with autoscaling configurations"
    ],
    outcomes: [
      "Deployed a fully automated, multi-store retail system on AWS EKS with minimal manual intervention",
      "Enabled rapid, reliable feature releases through a GitOps workflow",
      "Achieved strong system reliability and observability with real-time monitoring",
      "Gained hands-on experience with Kubernetes, Terraform, and cloud-native CI/CD best practices"
    ],
    duration: "1 week",
    role: "DevOps",
    status: "Complete",
    demoLink: "http://k8s-ingressn-ingressn-458fe101d6-c35438a11e41fed0.elb.us-west-2.amazonaws.com/",
    githubLink: "https://github.com/bashairfan0911/retail-store-sample-app.git"
  }
};

export const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const projectId = parseInt(id || '0');
  const project = projectsData[projectId as keyof typeof projectsData];
  
  if (!project || !id || isNaN(projectId)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/20 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4 hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Button>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-gradient">{project.title}</h1>
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              {project.status}
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground">{project.description}</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Overview */}
            <Card className="card-gradient border-border/50 p-8">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Project Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{project.longDescription}</p>
            </Card>

            {/* Key Features */}
            <Card className="card-gradient border-border/50 p-8">
              <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-card-foreground">{feature}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Challenges & Solutions */}
            <Card className="card-gradient border-border/50 p-8">
              <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Challenges & Learning</h2>
              <div className="space-y-4">
                {project.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-warning/10 rounded-lg border border-warning/20">
                    <Target className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-card-foreground">{challenge}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Outcomes */}
            <Card className="card-gradient border-border/50 p-8">
              <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Results & Outcomes</h2>
              <div className="space-y-4">
                {project.outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-success/10 rounded-lg border border-success/20">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-card-foreground">{outcome}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card className="card-gradient border-border/50 p-6">
              <h3 className="text-lg font-semibold mb-4 text-card-foreground">Project Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-sm font-medium text-card-foreground">{project.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="text-sm font-medium text-card-foreground">{project.role}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Technologies */}
            <Card className="card-gradient border-border/50 p-6">
              <h3 className="text-lg font-semibold mb-4 text-card-foreground">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!project.demoLink}
                asChild={!!project.demoLink}
              >
                {project.demoLink ? (
                  <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full border-primary/30 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!project.githubLink}
                asChild={!!project.githubLink}
              >
                {project.githubLink ? (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View Code
                  </a>
                ) : (
                  <>
                    <Github className="mr-2 h-4 w-4" />
                    View Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
