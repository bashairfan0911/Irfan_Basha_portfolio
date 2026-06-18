import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github, Calendar, Users, Target, FileText, BookOpen, CheckCircle2, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

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
    githubLink: "https://github.com/bashairfan0911/professional_portfolio.git",
    notesLink: "https://docs.google.com/document/d/14z5K1lSAm9FC7QYOqhczLwscymkwigBjj23BzfmiNmM/edit?usp=sharing",
    interviewNotesLink: "https://interviews.prodevopsguytech.com/",
    image: "/images/portfolio.png"
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
  demoLink: "",
  githubLink: "https://github.com/bashairfan0911/vpc-and-vpc-peering.git",
  image: "/images/vpcandvpcpeering.png"
},

  3: {
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
    githubLink: "https://github.com/bashairfan0911/retail-store-sample-app.git",
    image: "/images/EKS.gif"
  },
  4: {
    title: "EkoMart - E-Commerce Platform",
    description: "Full-stack MERN e-commerce application with admin panel, product management, shopping cart, and Razorpay payment integration.",
    longDescription: "EkoMart is a comprehensive e-commerce platform built using the MERN stack (MongoDB, Express, React, Node.js). The application features a complete shopping experience with user authentication, product browsing, cart management, and secure payment processing. The admin panel provides full control over products, categories, and orders. The platform demonstrates modern full-stack development practices with RESTful API design, JWT authentication, cloud-based image storage, and responsive UI design.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "JWT", "Razorpay", "Cloudinary", "Material-UI", "Vite", "Bcrypt"],
    features: [
      "User authentication and authorization with JWT tokens",
      "Secure password hashing using Bcrypt",
      "Product catalog with categories and search functionality",
      "Shopping cart with add, update, and remove operations",
      "Razorpay payment gateway integration for secure checkout",
      "Admin dashboard for product, category, and order management",
      "Cloudinary integration for optimized image storage and delivery",
      "Responsive design with Material-UI components",
      "RESTful API architecture with Express and MongoDB",
      "User profile management and order history"
    ],
    challenges: [
      "Implementing secure authentication flow with JWT and refresh tokens",
      "Integrating Razorpay payment gateway and handling payment callbacks",
      "Managing complex state across multiple components in React",
      "Optimizing image uploads and storage with Cloudinary",
      "Designing scalable MongoDB schemas for products, users, and orders",
      "Implementing role-based access control for admin features"
    ],
    outcomes: [
      "Successfully deployed full-stack e-commerce platform with payment processing",
      "Implemented secure authentication system protecting user data",
      "Created intuitive admin panel for efficient store management",
      "Achieved responsive design working seamlessly across all devices",
      "Gained hands-on experience with MERN stack and third-party integrations",
      "Built scalable RESTful APIs following industry best practices"
    ],
    duration: "3 weeks",
    role: "Full-Stack Developer",
    status: "Live",
    demoLink: "https://ekomart.netlify.app/",
    githubLink: "https://github.com/bashairfan0911/EkoMart.git",
    image: "/images/DevSecOps+GitOps.gif"
  },
  5: {
    title: "Wanderlust - Travel Blog Platform",
    description: "MERN stack travel blog platform deployed on Kubernetes with Docker containerization and complete DevOps pipeline.",
    longDescription: "Wanderlust is a comprehensive travel blog platform built with the MERN stack and deployed on Kubernetes. This project demonstrates advanced DevOps practices including container orchestration, persistent storage management, and microservices architecture. The application uses MongoDB for data persistence, Redis for caching, and is fully containerized with Docker. Deployed on a Kubernetes cluster with proper resource management, DNS resolution, and service discovery. The project showcases production-ready deployment strategies with persistent volumes, config management, and scalable architecture suitable for high-traffic applications.",
    image: "/images/wanderlust.png",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Redis", "Kubernetes", "Docker", "Persistent Volumes", "AWS EC2", "Kubeadm"],
    features: [
      "Full MERN stack travel blog with user authentication",
      "Kubernetes deployment with persistent volume claims for data persistence",
      "Redis caching layer for improved performance",
      "MongoDB with persistent storage using Kubernetes PVs and PVCs",
      "Multi-node Kubernetes cluster setup with kubeadm",
      "DNS resolution with CoreDNS for service discovery",
      "Docker containerization with optimized images",
      "Environment-based configuration management",
      "NodePort service exposure for external access",
      "Scalable microservices architecture with separate frontend and backend services"
    ],
    challenges: [
      "Setting up multi-node Kubernetes cluster on AWS EC2 instances",
      "Configuring persistent volumes and claims for stateful applications",
      "Managing DNS resolution and CoreDNS pod distribution across nodes",
      "Connecting backend services to MongoDB and Redis within Kubernetes",
      "Building and pushing Docker images to DockerHub registry",
      "Ensuring proper service discovery and inter-pod communication",
      "Managing environment variables across different deployment environments",
      "Debugging pod connectivity and service networking issues"
    ],
    outcomes: [
      "Successfully deployed production-ready travel blog on Kubernetes cluster",
      "Implemented persistent storage ensuring data survives pod restarts",
      "Achieved scalable architecture with independent frontend and backend services",
      "Mastered Kubernetes concepts including deployments, services, PVs, and PVCs",
      "Gained hands-on experience with container orchestration and microservices",
      "Built complete CI/CD workflow from code to Kubernetes deployment",
      "Enhanced understanding of cloud-native application architecture",
      "Demonstrated ability to troubleshoot and resolve complex deployment issues"
    ],
    duration: "2 weeks",
    role: "DevOps Engineer",
    status: "Complete",
    demoLink: "",
    githubLink: "https://github.com/bashairfan0911/wanderlust.git"
  },
  6: {
    title: "Azure DevOps End-to-End Project with Terraform",
    description: "Automated Azure Kubernetes Service (AKS) infrastructure deployment across multiple environments using Terraform and Azure DevOps Pipelines.",
    longDescription: "This project automates the deployment of Azure Kubernetes Service (AKS) clusters across multiple environments (dev, staging, prod) using Terraform and Azure DevOps Pipelines. It implements infrastructure as code (IaC) best practices with remote state management, modular architecture, and automated CI/CD workflows. The solution includes automated Azure Service Principal creation, secure Key Vault integration for secrets management, and complete CI/CD pipelines for both infrastructure deployment and destruction. The modular Terraform architecture ensures reusability across environments while maintaining complete isolation between dev, staging, and production workloads.",
    image: "/images/azure-terraform.png",
    technologies: ["Terraform", "Azure DevOps", "AKS", "Azure Key Vault", "Service Principal", "Azure Storage", "YAML Pipelines", "Azure CNI", "RBAC"],
    features: [
      "Multi-environment AKS cluster provisioning (dev/staging/prod) with complete isolation",
      "Automated Azure Service Principal creation and management with Contributor role",
      "Secure Key Vault integration for secrets management with RBAC-based access",
      "Remote state management using Azure Storage with state locking",
      "CI/CD pipelines for infrastructure deployment and destruction with approval gates",
      "Modular Terraform architecture with reusable modules (AKS, Key Vault, Service Principal)",
      "Auto-scaling node pools (1-3 nodes) with Standard_DS2_v2 VMs across 3 availability zones",
      "Azure CNI networking with Standard Load Balancer integration",
      "Automated kubeconfig generation for cluster access",
      "Branch-based deployment strategy with feature branches and pull requests"
    ],
    challenges: [
      "Designing modular Terraform architecture for multi-environment deployments",
      "Implementing secure state management with Azure Storage backend and locking",
      "Configuring Azure Service Principal with proper RBAC permissions",
      "Managing secrets securely across environments using Key Vault",
      "Building automated pipelines with validation, planning, and approval stages",
      "Ensuring environment isolation while maintaining code reusability",
      "Implementing safe destruction workflows with manual approval gates",
      "Coordinating Terraform state across multiple environments"
    ],
    outcomes: [
      "Successfully deployed automated multi-environment AKS infrastructure",
      "Achieved complete environment isolation with dedicated resource groups and state files",
      "Implemented secure secrets management with Azure Key Vault integration",
      "Built production-ready CI/CD pipelines with validation and approval workflows",
      "Reduced infrastructure provisioning time by approximately 80% through automation",
      "Enabled consistent and repeatable deployments across all environments",
      "Gained hands-on experience with Terraform modules and Azure DevOps Pipelines",
      "Demonstrated IaC best practices with remote state and modular architecture"
    ],
    duration: "3 weeks",
    role: "DevOps Engineer",
    status: "Complete",
    demoLink: "",
    githubLink: "https://github.com/bashairfan0911/Azure-DevOps-End-to-End-Project-with-Terraform.git"
  },
  7: {
    title: "DevSecOps Pipeline - Wanderlust",
    description: "End-to-end DevSecOps implementation with Jenkins CI/CD, OWASP dependency scanning, SonarQube code quality analysis, Trivy security scanning, and GitOps deployment using ArgoCD on AWS EKS.",
    longDescription: "This project demonstrates a complete DevSecOps pipeline implementation for the Wanderlust travel blog application. Built on AWS EKS with a focus on security, automation, and GitOps principles, the pipeline integrates multiple security scanning tools at different stages. Jenkins orchestrates the CI process with OWASP dependency checks, SonarQube code quality analysis, and Trivy container security scanning. ArgoCD handles continuous deployment using GitOps methodology, automatically syncing Kubernetes manifests from Git. The infrastructure includes comprehensive monitoring with Prometheus and Grafana, providing real-time insights into application performance and cluster health. This project showcases industry-standard DevSecOps practices with automated security gates, quality checks, and zero-downtime deployments.",
    image: "/images/DevSecOps+GitOps.gif",
    technologies: ["Jenkins", "ArgoCD", "SonarQube", "Trivy", "OWASP", "AWS EKS", "Helm", "Prometheus", "Grafana", "Docker", "Kubernetes", "eksctl"],
    features: [
      "Jenkins CI pipeline with master-worker architecture for distributed builds",
      "OWASP Dependency-Check for identifying vulnerable dependencies",
      "SonarQube integration for code quality and security vulnerability analysis",
      "Trivy filesystem and container image scanning for security vulnerabilities",
      "GitOps deployment workflow with ArgoCD for automated Kubernetes deployments",
      "AWS EKS cluster provisioned with eksctl and managed node groups",
      "Helm charts for Prometheus and Grafana monitoring stack deployment",
      "Email notifications for pipeline status and build results",
      "Multi-stage Docker builds with security best practices",
      "Automated webhook integration between GitHub, Jenkins, SonarQube, and ArgoCD"
    ],
    challenges: [
      "Configuring Jenkins master-worker setup with proper SSH authentication",
      "Integrating multiple security scanning tools into a cohesive pipeline",
      "Setting up SonarQube webhooks and quality gates for automated checks",
      "Managing ArgoCD cluster authentication and repository connections",
      "Configuring AWS EKS with proper IAM roles and OIDC provider",
      "Implementing secure credential management across pipeline stages",
      "Troubleshooting Docker socket permissions for container operations",
      "Setting up Prometheus and Grafana with proper service exposure"
    ],
    outcomes: [
      "Deployed fully automated DevSecOps pipeline with security scanning at every stage",
      "Achieved GitOps-based deployment with ArgoCD for declarative infrastructure",
      "Implemented comprehensive monitoring with Prometheus and Grafana dashboards",
      "Reduced deployment time and manual errors through automation",
      "Enhanced security posture with multiple scanning tools and quality gates",
      "Gained hands-on experience with industry-standard DevSecOps tools and practices",
      "Built production-ready CI/CD pipeline following security best practices",
      "Demonstrated ability to integrate and orchestrate complex toolchains"
    ],
    duration: "3 weeks",
    role: "DevSecOps Engineer",
    status: "Complete",
    demoLink: "",
    githubLink: "https://github.com/bashairfan0911/wanderlust.git"
  },
  8: {
    title: "Microservices Voting Application with Azure CI/CD Pipeline",
    description: "Architected cloud-native voting application with 5 microservices using Python (Flask), .NET Core, Node.js, Redis, and PostgreSQL on Azure Kubernetes Service.",
    longDescription: "This project demonstrates a production-grade microservices architecture deployed on Azure Kubernetes Service (AKS) with a sophisticated CI/CD pipeline. The voting application consists of 5 independent microservices built with different technology stacks, showcasing polyglot architecture and modern cloud-native practices. The CI/CD pipeline leverages GitHub Actions for automated multi-platform Docker builds (amd64, arm64, arm/v7) with a dual registry strategy pushing to both Docker Hub and Azure Container Registry. Path-based build triggers ensure only modified services are rebuilt, optimizing pipeline efficiency by 70%. The application features real-time results visualization using WebSockets, Redis message queue for inter-service communication, and PostgreSQL for persistent data storage. Kubernetes manifests follow GitOps principles with health checks, volume persistence, and production-ready configurations.",
    image: "/images/azure.png",
    technologies: ["Python", "Flask", ".NET Core", "Node.js", "Redis", "PostgreSQL", "Azure AKS", "GitHub Actions", "Docker", "Kubernetes", "WebSockets", "YAML"],
    features: [
      "5 microservices architecture with polyglot technology stack (Python, .NET, Node.js)",
      "Azure Kubernetes Service deployment with production-ready configurations",
      "GitHub Actions CI/CD with multi-platform Docker builds (amd64, arm64, arm/v7)",
      "Dual registry strategy pushing to Docker Hub and Azure Container Registry",
      "Path-based build triggers optimizing CI/CD efficiency by 70%",
      "Real-time results dashboard using WebSockets for live updates",
      "Redis message queue for asynchronous inter-service communication",
      "PostgreSQL database with persistent volume claims for data durability",
      "Health checks and liveness probes for all microservices",
      "Infrastructure as Code with Kubernetes YAML manifests following GitOps principles"
    ],
    challenges: [
      "Orchestrating 5 independent microservices with different technology stacks",
      "Implementing multi-platform Docker builds for ARM and x86 architectures",
      "Configuring dual registry strategy with proper authentication and secrets management",
      "Optimizing CI/CD pipeline with path-based triggers to avoid unnecessary builds",
      "Setting up real-time WebSocket communication between frontend and backend services",
      "Managing inter-service communication using Redis pub/sub messaging",
      "Ensuring data persistence with PostgreSQL and Kubernetes persistent volumes",
      "Implementing proper health checks and graceful shutdown for all services"
    ],
    outcomes: [
      "Deployed production-ready microservices application on Azure AKS",
      "Reduced deployment time by 90% through automated CI/CD pipeline",
      "Achieved 70% CI/CD efficiency improvement with path-based build triggers",
      "Implemented real-time voting results with WebSocket technology",
      "Built scalable architecture supporting multiple concurrent users",
      "Mastered multi-platform Docker builds and container registry management",
      "Gained hands-on experience with Azure cloud services and AKS",
      "Demonstrated ability to work with polyglot microservices architecture"
    ],
    duration: "3 weeks",
    role: "Cloud DevOps Engineer",
    status: "Complete",
    demoLink: "",
    githubLink: "https://github.com/bashairfan0911/voting-app.git"
  }
};

// ─── colour map keyed by project status ───────────────────────────────────────
const STATUS_STYLE: Record<string, { text: string; border: string; bg: string }> = {
  Live:     { text: "text-green-400",  border: "border-green-400/40",  bg: "bg-green-400/10"  },
  Complete: { text: "text-primary",    border: "border-primary/40",    bg: "bg-primary/10"    },
};

// accent colour per project id
const ACCENT: Record<number, string> = {
  1: "#06b6d4", 2: "#f59e0b", 3: "#00d4ff",
  4: "#f59e0b", 5: "#a855f7", 6: "#0078d4", 7: "#22c55e", 8: "#00ff88",
};

export const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>("overview");

  const projectId = parseInt(id || "0");
  const project = projectsData[projectId as keyof typeof projectsData];
  const color = ACCENT[projectId] ?? "#00d4ff";
  const p = project as typeof project & { notesLink?: string; interviewNotesLink?: string };

  if (!project || !id || isNaN(projectId)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-xs text-muted-foreground mb-3">&gt;_ project not found</p>
          <h1 className="text-3xl font-black text-foreground mb-4">404</h1>
          <button onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono border border-border/50 hover:border-primary/50 hover:text-primary transition-all">
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const status = STATUS_STYLE[project.status] ?? STATUS_STYLE.Complete;

  const Section = ({ id: sid, label, icon: Icon, children }: { id: string; label: string; icon: React.ElementType; children: React.ReactNode }) => {
    const open = openSection === sid;
    return (
      <div className="glass-card rounded-2xl border border-border/30 overflow-hidden">
        <button
          onClick={() => setOpenSection(open ? null : sid)}
          className="w-full flex items-center justify-between gap-3 px-5 py-3.5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Icon className="w-3.5 h-3.5" style={{ color }} />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-foreground/80">{label}</span>
          </div>
          {open ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
        {open && <div className="px-5 pb-5 pt-2 border-t border-border/20">{children}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Fixed top bar ── */}
      <div className="fixed top-0 left-0 right-0 z-40 h-14 bg-background/90 backdrop-blur-md border-b border-border/30 flex items-center">
        <div className="w-16 flex-shrink-0" /> {/* hamburger clearance */}
        <button onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Portfolio
        </button>
        <span className="ml-3 text-muted-foreground/40">·</span>
        <span className="ml-3 text-xs font-mono text-muted-foreground truncate max-w-xs hidden sm:block">{project.title}</span>
        <div className="ml-auto pr-4">
          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${status.text} ${status.border} ${status.bg}`}>
            {project.status}
          </span>
        </div>
      </div>
      <div className="h-14" /> {/* spacer */}

      {/* ── Colour accent strip ── */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}44)` }} />

      {/* ── Hero ── */}
      <div className="container mx-auto px-4 pt-8 pb-4 max-w-5xl">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color }}>
          &gt;_ project/{id}
        </p>
        <h1 className="text-2xl sm:text-4xl font-black text-foreground mb-3 leading-tight">{project.title}</h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">{project.description}</p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-4 mt-5">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" style={{ color }} />
            <span>{project.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Users className="w-3.5 h-3.5" style={{ color }} />
            <span>{project.role}</span>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="container mx-auto px-4 pb-16 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Left: sections */}
          <div className="lg:col-span-2 space-y-3">

            {/* Image */}
            {project.image && (
              <div className="rounded-2xl border border-border/30 overflow-hidden">
                <img src={project.image} alt={project.title} className="w-full h-auto object-cover" />
              </div>
            )}

            {/* Overview */}
            <Section id="overview" label="Overview" icon={FileText}>
              <p className="text-sm text-muted-foreground leading-relaxed">{project.longDescription}</p>
            </Section>

            {/* Features */}
            <Section id="features" label="Key Features" icon={Zap}>
              <div className="grid sm:grid-cols-2 gap-2">
                {project.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-border/20">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color }} />
                    <p className="text-xs text-muted-foreground leading-relaxed">{f}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Challenges */}
            <Section id="challenges" label="Challenges & Learning" icon={Target}>
              <div className="space-y-2">
                {project.challenges.map((c, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-400/5 border border-amber-400/15">
                    <Target className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-400" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{c}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Outcomes */}
            <Section id="outcomes" label="Results & Outcomes" icon={CheckCircle2}>
              <div className="space-y-2">
                {project.outcomes.map((o, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-green-400/5 border border-green-400/15">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-green-400" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{o}</p>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* Right: sidebar */}
          <div className="space-y-4">

            {/* Tech stack */}
            <div className="glass-card rounded-2xl border border-border/30 p-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-3">Tech Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((t) => (
                  <span key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border/40 text-muted-foreground bg-white/[0.03] hover:border-opacity-60 transition-colors">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="glass-card rounded-2xl border border-border/30 p-4 space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-3">Links</p>

              {project.demoLink ? (
                <a href={project.demoLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold w-full transition-all hover:scale-[1.02]"
                  style={{ background: `${color}18`, color, border: `1px solid ${color}40` }}>
                  <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                </a>
              ) : (
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono w-full opacity-40 cursor-not-allowed border border-border/30 text-muted-foreground">
                  <ExternalLink className="w-3.5 h-3.5" /> No Demo
                </div>
              )}

              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold w-full border border-border/40 text-muted-foreground hover:border-border/70 hover:text-foreground transition-all">
                  <Github className="w-3.5 h-3.5" /> View Code
                </a>
              )}

              {p.notesLink && (
                <a href={p.notesLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold w-full border border-border/40 text-muted-foreground hover:border-border/70 hover:text-foreground transition-all">
                  <FileText className="w-3.5 h-3.5" /> Project Notes
                </a>
              )}

              {p.interviewNotesLink && (
                <a href={p.interviewNotesLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold w-full border border-border/40 text-muted-foreground hover:border-border/70 hover:text-foreground transition-all">
                  <BookOpen className="w-3.5 h-3.5" /> Interview Notes
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
