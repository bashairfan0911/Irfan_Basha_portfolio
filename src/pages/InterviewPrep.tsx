import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, BookOpen, Code, Code2, Cloud, Container, GitBranch, Activity, Server, Terminal, HelpCircle, Lightbulb, CheckCircle2, AlertCircle, Users, Network, FileText, Layers, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { FaAws, FaDocker, FaPython, FaGitAlt, FaJenkins } from "react-icons/fa";
import { SiGooglecloud, SiKubernetes, SiTerraform, SiPrometheus, SiAnsible, SiGithubactions } from "react-icons/si";

// Azure Icon Component
const AzureIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.379 23.343a1.62 1.62 0 0 0 1.536-2.14v.002L17.35 1.76A1.62 1.62 0 0 0 15.816.657H8.184A1.62 1.62 0 0 0 6.65 1.76L.086 21.204a1.62 1.62 0 0 0 1.536 2.139h4.741a1.62 1.62 0 0 0 1.535-1.103l.977-2.892 4.947 3.675c.28.208.618.32.966.32h7.591m-3.096-3.24h-5.883l-2.286-6.845 5.07-8.735 3.099 15.58" />
  </svg>
);

interface InterviewNotes {
  questions: string[];
  concepts: { term: string; definition: string }[];
  bestPractices: string[];
  scenarios: string[];
}

interface ToolBlock {
  category: string;
  icon: any;
  color: string;
  tools: {
    name: string;
    icon: any;
    topics: string[];
    questionAreas: string[];
    notes: InterviewNotes;
  }[];
}

const devopsTools: ToolBlock[] = [
  {
    category: "Cloud Platforms",
    icon: Cloud,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    tools: [
      {
        name: "AWS",
        icon: FaAws,
        topics: ["EC2", "S3", "VPC", "IAM", "EKS", "ECR", "Lambda", "CloudFormation", "Route53"],
        questionAreas: ["Service Architecture", "Security Best Practices", "Cost Optimization", "High Availability"],
        notes: {
          questions: [
            "What is the difference between EC2 and Lambda?",
            "Explain VPC and its components (subnets, route tables, internet gateway)",
            "How do you secure AWS resources using IAM policies?",
            "What is the difference between S3 Standard and S3 Glacier?",
            "How would you design a highly available architecture in AWS?",
            "Explain the difference between Security Groups and NACLs",
            "What is CloudFormation and how does it differ from Terraform?",
            "How do you implement auto-scaling in AWS?"
          ],
          concepts: [
            { term: "EC2", definition: "Elastic Compute Cloud - Virtual servers in AWS cloud for running applications" },
            { term: "S3", definition: "Simple Storage Service - Object storage service with 99.999999999% durability" },
            { term: "VPC", definition: "Virtual Private Cloud - Isolated network environment in AWS" },
            { term: "IAM", definition: "Identity and Access Management - Service for managing access to AWS resources" },
            { term: "EKS", definition: "Elastic Kubernetes Service - Managed Kubernetes service" },
            { term: "Lambda", definition: "Serverless compute service that runs code in response to events" }
          ],
          bestPractices: [
            "Always use IAM roles instead of access keys for EC2 instances",
            "Enable MFA for root and privileged accounts",
            "Use VPC endpoints for private connectivity to AWS services",
            "Implement least privilege principle for IAM policies",
            "Enable CloudTrail for audit logging",
            "Use encryption at rest and in transit",
            "Tag all resources for cost allocation and management",
            "Implement backup and disaster recovery strategies"
          ],
          scenarios: [
            "Application is slow: Check CloudWatch metrics, review auto-scaling policies, analyze database performance",
            "High AWS bill: Use Cost Explorer, implement resource tagging, review unused resources, use Reserved Instances",
            "Security breach: Check CloudTrail logs, review IAM policies, enable GuardDuty, rotate credentials",
            "Service outage: Implement multi-AZ deployment, use Route53 health checks, configure auto-scaling"
          ]
        }
      },
      {
        name: "Azure",
        icon: AzureIcon,
        topics: ["Virtual Machines", "AKS", "ACR", "Azure DevOps", "Resource Groups", "ARM Templates"],
        questionAreas: ["Resource Management", "Identity & Access", "Networking", "DevOps Integration"],
        notes: {
          questions: [
            "What is the difference between Resource Groups and Subscriptions?",
            "Explain Azure AD and its role in Azure",
            "How does AKS differ from self-managed Kubernetes?",
            "What are ARM templates and how do they work?",
            "Explain Azure Virtual Networks and peering",
            "What is the difference between Azure DevOps and GitHub Actions?"
          ],
          concepts: [
            { term: "Resource Group", definition: "Logical container for Azure resources that share the same lifecycle" },
            { term: "AKS", definition: "Azure Kubernetes Service - Managed Kubernetes cluster service" },
            { term: "ARM Template", definition: "Azure Resource Manager template - JSON file for infrastructure as code" },
            { term: "Azure AD", definition: "Azure Active Directory - Cloud-based identity and access management service" }
          ],
          bestPractices: [
            "Organize resources using Resource Groups by lifecycle or application",
            "Use Azure Policy for governance and compliance",
            "Implement RBAC for access control",
            "Use Managed Identities instead of service principals where possible",
            "Enable Azure Security Center for threat protection",
            "Use Azure Monitor for comprehensive monitoring"
          ],
          scenarios: [
            "Deploy multi-region application: Use Traffic Manager, configure geo-replication for databases",
            "Migrate on-prem to Azure: Use Azure Migrate, plan network connectivity, implement hybrid identity",
            "Cost optimization: Use Azure Advisor recommendations, implement auto-shutdown for dev resources"
          ]
        }
      },
      {
        name: "Google Cloud Platform",
        icon: SiGooglecloud,
        topics: ["Compute Engine", "GKE", "Cloud Storage", "Cloud Functions", "VPC", "IAM"],
        questionAreas: ["Service Comparison", "Networking", "Security", "Deployment Models"],
        notes: {
          questions: [
            "What is the difference between Compute Engine and App Engine?",
            "Explain GKE autopilot vs standard mode",
            "How does GCP IAM differ from AWS IAM?",
            "What are the different storage classes in Cloud Storage?",
            "Explain VPC network peering in GCP"
          ],
          concepts: [
            { term: "Compute Engine", definition: "Virtual machines running in Google's data centers" },
            { term: "GKE", definition: "Google Kubernetes Engine - Managed Kubernetes service" },
            { term: "Cloud Functions", definition: "Serverless execution environment for event-driven code" },
            { term: "VPC", definition: "Virtual Private Cloud - Global private network in GCP" }
          ],
          bestPractices: [
            "Use service accounts with minimal permissions",
            "Implement VPC Service Controls for data exfiltration protection",
            "Use Cloud Armor for DDoS protection",
            "Enable Cloud Audit Logs for compliance",
            "Use Cloud KMS for encryption key management"
          ],
          scenarios: [
            "Deploy globally: Use Cloud CDN, multi-region deployments, Cloud Load Balancing",
            "Data analytics pipeline: Use Cloud Storage, Dataflow, BigQuery",
            "Microservices architecture: Use GKE, Cloud Run, Pub/Sub for messaging"
          ]
        }
      }
    ]
  },
  {
    category: "Container Technologies",
    icon: Container,
    color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    tools: [
      {
        name: "Docker",
        icon: FaDocker,
        topics: ["Containerization", "Dockerfile", "Docker Compose", "Volumes", "Networks", "Multi-stage Builds"],
        questionAreas: ["Container Lifecycle", "Image Optimization", "Networking", "Security", "Best Practices"],
        notes: {
          questions: [
            "What is the difference between a Docker image and a container?",
            "Explain Docker layers and how they work",
            "What is the difference between CMD and ENTRYPOINT?",
            "How do you optimize Docker images for size?",
            "Explain Docker networking modes (bridge, host, none, overlay)",
            "What are Docker volumes and why are they important?",
            "How does multi-stage build work and what are its benefits?",
            "What is the difference between COPY and ADD in Dockerfile?"
          ],
          concepts: [
            { term: "Image", definition: "Read-only template with instructions for creating a container" },
            { term: "Container", definition: "Runnable instance of an image with its own filesystem, networking, and process space" },
            { term: "Layer", definition: "Each instruction in Dockerfile creates a layer, cached for faster builds" },
            { term: "Volume", definition: "Persistent data storage mechanism that exists outside container lifecycle" },
            { term: "Multi-stage Build", definition: "Using multiple FROM statements to create smaller final images" }
          ],
          bestPractices: [
            "Use official base images from trusted sources",
            "Minimize number of layers by combining RUN commands",
            "Use .dockerignore to exclude unnecessary files",
            "Run containers as non-root user",
            "Use specific image tags instead of 'latest'",
            "Scan images for vulnerabilities using tools like Trivy",
            "Use multi-stage builds to reduce image size",
            "Leverage build cache by ordering Dockerfile instructions properly"
          ],
          scenarios: [
            "Container keeps restarting: Check logs with 'docker logs', verify health checks, check resource limits",
            "Image size too large: Use multi-stage builds, minimize layers, use alpine base images",
            "Slow build times: Optimize layer caching, use .dockerignore, parallelize builds",
            "Data loss on restart: Use volumes for persistent data, implement backup strategies"
          ]
        }
      },
      {
        name: "Kubernetes",
        icon: SiKubernetes,
        topics: ["Pods", "Deployments", "Services", "ConfigMaps", "Secrets", "Ingress", "StatefulSets", "RBAC"],
        questionAreas: ["Architecture", "Orchestration", "Scaling", "Networking", "Storage", "Security"],
        notes: {
          questions: [
            "Explain Kubernetes architecture (control plane and worker nodes)",
            "What is the difference between Deployment and StatefulSet?",
            "How does Kubernetes Service discovery work?",
            "Explain the difference between ClusterIP, NodePort, and LoadBalancer services",
            "What are ConfigMaps and Secrets, and how do they differ?",
            "How does Kubernetes handle rolling updates and rollbacks?",
            "Explain Kubernetes networking (Pod-to-Pod, Service-to-Pod)",
            "What is RBAC and how do you implement it in Kubernetes?"
          ],
          concepts: [
            { term: "Pod", definition: "Smallest deployable unit, contains one or more containers sharing network and storage" },
            { term: "Deployment", definition: "Manages stateless applications, handles rolling updates and scaling" },
            { term: "Service", definition: "Abstraction for exposing Pods as a network service with stable IP" },
            { term: "ConfigMap", definition: "Store non-sensitive configuration data as key-value pairs" },
            { term: "Secret", definition: "Store sensitive data like passwords, tokens, keys (base64 encoded)" },
            { term: "Ingress", definition: "Manages external HTTP/HTTPS access to services with routing rules" },
            { term: "StatefulSet", definition: "Manages stateful applications with stable network identities and persistent storage" }
          ],
          bestPractices: [
            "Use namespaces to organize resources and implement multi-tenancy",
            "Implement resource requests and limits for all containers",
            "Use liveness and readiness probes for health checking",
            "Store sensitive data in Secrets, not ConfigMaps",
            "Implement RBAC with least privilege principle",
            "Use Horizontal Pod Autoscaler for automatic scaling",
            "Implement network policies for pod-to-pod communication control",
            "Use labels and selectors for resource organization",
            "Implement pod disruption budgets for high availability"
          ],
          scenarios: [
            "Pods not starting: Check events with 'kubectl describe', verify image pull, check resource availability",
            "Service not accessible: Verify service selector matches pod labels, check network policies, verify ingress rules",
            "High memory usage: Implement resource limits, use HPA, optimize application code",
            "Rolling update failed: Check rollout status, verify health probes, review deployment strategy",
            "Persistent data loss: Use StatefulSets with PersistentVolumeClaims, implement backup strategies"
          ]
        }
      }
    ]
  },
  {
    category: "CI/CD Tools",
    icon: GitBranch,
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    tools: [
      {
        name: "Jenkins",
        icon: FaJenkins,
        topics: ["Pipelines", "Jenkinsfile", "Plugins", "Agents", "Distributed Builds", "Blue Ocean"],
        questionAreas: ["Pipeline Design", "Integration", "Security", "Scaling", "Best Practices"],
        notes: {
          questions: [
            "What is the difference between Declarative and Scripted pipelines?",
            "How do you implement parallel execution in Jenkins?",
            "Explain Jenkins master-slave architecture",
            "How do you secure Jenkins (credentials, RBAC)?",
            "What are Jenkins shared libraries and when to use them?",
            "How do you handle pipeline failures and notifications?",
            "Explain the difference between agent any and agent none"
          ],
          concepts: [
            { term: "Pipeline", definition: "Automated process defined in code for building, testing, and deploying applications" },
            { term: "Jenkinsfile", definition: "Text file containing pipeline definition, stored in source control" },
            { term: "Agent", definition: "Machine or container where pipeline steps execute" },
            { term: "Stage", definition: "Logical grouping of steps in a pipeline (build, test, deploy)" },
            { term: "Shared Library", definition: "Reusable pipeline code shared across multiple projects" }
          ],
          bestPractices: [
            "Store Jenkinsfile in source control with application code",
            "Use declarative pipeline syntax for better readability",
            "Implement pipeline as code for version control and review",
            "Use credentials plugin for secure credential management",
            "Implement proper error handling and notifications",
            "Use Docker agents for consistent build environments",
            "Implement pipeline caching to speed up builds",
            "Use Blue Ocean for better visualization"
          ],
          scenarios: [
            "Build fails intermittently: Check agent resources, review logs, implement retry logic",
            "Slow pipeline execution: Parallelize stages, use caching, optimize Docker builds",
            "Security vulnerability: Update plugins, implement RBAC, use credentials plugin, enable audit logs",
            "Agent offline: Configure cloud agents, implement auto-scaling, use Docker agents"
          ]
        }
      },
      {
        name: "GitHub Actions",
        icon: SiGithubactions,
        topics: ["Workflows", "Actions", "Runners", "Secrets", "Matrix Builds", "Artifacts"],
        questionAreas: ["Workflow Syntax", "CI/CD Patterns", "Security", "Optimization"],
        notes: {
          questions: [
            "What is the difference between GitHub Actions and Jenkins?",
            "How do you create a custom GitHub Action?",
            "Explain the workflow syntax and triggers",
            "How do you implement matrix builds?",
            "What are GitHub-hosted vs self-hosted runners?",
            "How do you manage secrets in GitHub Actions?",
            "Explain caching in GitHub Actions"
          ],
          concepts: [
            { term: "Workflow", definition: "Automated process defined in YAML file in .github/workflows" },
            { term: "Action", definition: "Reusable unit of code that performs a specific task" },
            { term: "Runner", definition: "Server that runs workflows (GitHub-hosted or self-hosted)" },
            { term: "Job", definition: "Set of steps that execute on the same runner" },
            { term: "Matrix Build", definition: "Run jobs with multiple configurations in parallel" }
          ],
          bestPractices: [
            "Use official actions from GitHub Marketplace",
            "Pin actions to specific versions using SHA",
            "Use secrets for sensitive data, never hardcode",
            "Implement caching for dependencies to speed up workflows",
            "Use matrix builds for testing across multiple versions",
            "Limit workflow permissions using GITHUB_TOKEN",
            "Use environments for deployment protection rules",
            "Implement workflow reusability with composite actions"
          ],
          scenarios: [
            "Workflow not triggering: Check trigger conditions, verify branch names, review permissions",
            "Slow workflow: Implement caching, use matrix builds, optimize dependencies",
            "Secret not accessible: Verify secret scope (repo/org/environment), check permissions",
            "Runner out of space: Clean up artifacts, use self-hosted runners, optimize Docker layers"
          ]
        }
      }
    ]
  },
  {
    category: "Infrastructure as Code",
    icon: Code,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    tools: [
      {
        name: "Terraform",
        icon: SiTerraform,
        topics: ["HCL", "State Management", "Modules", "Providers", "Workspaces", "Remote Backend"],
        questionAreas: ["State Management", "Module Design", "Best Practices", "Multi-Cloud", "Security"],
        notes: {
          questions: [
            "What is Terraform state and why is it important?",
            "Explain the difference between terraform plan and terraform apply",
            "How do you manage Terraform state in a team environment?",
            "What are Terraform modules and when should you use them?",
            "How do you handle secrets in Terraform?",
            "Explain Terraform workspaces and their use cases",
            "What is the difference between count and for_each?",
            "How do you import existing infrastructure into Terraform?"
          ],
          concepts: [
            { term: "State", definition: "File tracking current infrastructure state, mapping resources to configuration" },
            { term: "Provider", definition: "Plugin that enables Terraform to interact with cloud platforms or services" },
            { term: "Module", definition: "Container for multiple resources used together, promotes reusability" },
            { term: "Workspace", definition: "Separate state files for same configuration (dev, staging, prod)" },
            { term: "Remote Backend", definition: "Store state file remotely (S3, Azure Storage) with locking" }
          ],
          bestPractices: [
            "Store state in remote backend with state locking enabled",
            "Use version control for Terraform code",
            "Implement modules for reusable infrastructure patterns",
            "Use variables and outputs for flexibility",
            "Never commit sensitive data or state files to version control",
            "Use terraform fmt and terraform validate before commits",
            "Implement CI/CD for Terraform deployments",
            "Use data sources to reference existing resources",
            "Tag all resources for organization and cost tracking"
          ],
          scenarios: [
            "State file corrupted: Restore from backup, use state locking, implement versioning",
            "Resource drift: Run terraform plan regularly, use terraform refresh, implement drift detection",
            "Concurrent modifications: Use remote backend with locking, implement proper CI/CD",
            "Destroy protection: Use prevent_destroy lifecycle, implement approval workflows",
            "Large state file: Split into multiple states, use modules, implement workspaces"
          ]
        }
      },
      {
        name: "Ansible",
        icon: SiAnsible,
        topics: ["Playbooks", "Roles", "Inventory", "Modules", "Variables", "Vault"],
        questionAreas: ["Configuration Management", "Idempotency", "Best Practices", "Security"],
        notes: {
          questions: [
            "What is idempotency in Ansible and why is it important?",
            "Explain the difference between Ansible playbooks and roles",
            "How do you manage sensitive data in Ansible?",
            "What is Ansible inventory and how do you organize it?",
            "Explain the difference between Ansible and Terraform",
            "How do you handle errors in Ansible playbooks?",
            "What are Ansible facts and how are they used?"
          ],
          concepts: [
            { term: "Playbook", definition: "YAML file defining automation tasks to be executed on managed nodes" },
            { term: "Role", definition: "Reusable collection of tasks, variables, and files organized in standard structure" },
            { term: "Inventory", definition: "List of managed nodes organized into groups" },
            { term: "Module", definition: "Unit of code that performs specific task (copy, yum, service, etc.)" },
            { term: "Vault", definition: "Encrypted storage for sensitive data like passwords and keys" },
            { term: "Idempotency", definition: "Running playbook multiple times produces same result without side effects" }
          ],
          bestPractices: [
            "Use roles for organizing complex playbooks",
            "Store sensitive data in Ansible Vault",
            "Use dynamic inventory for cloud environments",
            "Implement proper error handling with blocks and rescue",
            "Use tags for selective playbook execution",
            "Keep playbooks idempotent",
            "Use variables for flexibility and reusability",
            "Implement testing with Molecule",
            "Use version control for playbooks and roles"
          ],
          scenarios: [
            "Playbook fails on some hosts: Use ignore_errors, implement error handling, check host connectivity",
            "Slow playbook execution: Use async tasks, implement parallelism, optimize task order",
            "Configuration drift: Run playbooks regularly, implement drift detection, use check mode",
            "Secret management: Use Ansible Vault, integrate with external secret managers"
          ]
        }
      }
    ]
  },
  {
    category: "Monitoring & Observability",
    icon: Activity,
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    tools: [
      {
        name: "Prometheus",
        icon: SiPrometheus,
        topics: ["Metrics", "PromQL", "Alerting", "Service Discovery", "Exporters", "Federation"],
        questionAreas: ["Metric Types", "Query Language", "Alert Design", "Architecture", "Best Practices"],
        notes: {
          questions: [
            "What are the four metric types in Prometheus?",
            "Explain how Prometheus scraping works",
            "What is PromQL and how do you write queries?",
            "How do you design effective alerts in Prometheus?",
            "What are exporters and when do you need them?",
            "Explain Prometheus federation and when to use it",
            "How do you handle high cardinality in Prometheus?"
          ],
          concepts: [
            { term: "Counter", definition: "Metric that only increases (requests, errors)" },
            { term: "Gauge", definition: "Metric that can go up or down (memory usage, temperature)" },
            { term: "Histogram", definition: "Samples observations and counts them in buckets (request duration)" },
            { term: "Summary", definition: "Similar to histogram but calculates quantiles on client side" },
            { term: "Exporter", definition: "Component that exposes metrics in Prometheus format" },
            { term: "PromQL", definition: "Prometheus Query Language for querying time-series data" }
          ],
          bestPractices: [
            "Use appropriate metric types for different use cases",
            "Implement proper labeling strategy (avoid high cardinality)",
            "Set up alerting rules with proper thresholds",
            "Use recording rules for frequently used queries",
            "Implement service discovery for dynamic environments",
            "Set appropriate scrape intervals based on requirements",
            "Use federation for scaling Prometheus",
            "Implement long-term storage with Thanos or Cortex"
          ],
          scenarios: [
            "High memory usage: Reduce retention period, optimize queries, implement federation",
            "Missing metrics: Check service discovery, verify exporter configuration, check firewall rules",
            "Alert fatigue: Review alert thresholds, implement alert grouping, use inhibition rules",
            "Slow queries: Use recording rules, optimize PromQL queries, add indexes"
          ]
        }
      },
      {
        name: "Grafana",
        icon: Activity,
        topics: ["Dashboards", "Data Sources", "Alerts", "Panels", "Variables", "Plugins"],
        questionAreas: ["Dashboard Design", "Data Visualization", "Alerting", "Integration"],
        notes: {
          questions: [
            "How do you create effective dashboards in Grafana?",
            "What are Grafana variables and how do you use them?",
            "Explain the difference between Grafana and Prometheus alerting",
            "How do you integrate multiple data sources in Grafana?",
            "What are Grafana plugins and how do you use them?",
            "How do you implement dashboard as code?"
          ],
          concepts: [
            { term: "Dashboard", definition: "Collection of panels displaying metrics and visualizations" },
            { term: "Panel", definition: "Individual visualization component (graph, table, gauge)" },
            { term: "Data Source", definition: "Backend system providing data (Prometheus, InfluxDB, Elasticsearch)" },
            { term: "Variable", definition: "Dynamic values for creating flexible, reusable dashboards" },
            { term: "Alert", definition: "Notification triggered when metric crosses threshold" }
          ],
          bestPractices: [
            "Use variables for dynamic, reusable dashboards",
            "Organize dashboards with folders and tags",
            "Implement dashboard versioning and backup",
            "Use appropriate visualization types for different metrics",
            "Set up proper alert notification channels",
            "Use dashboard as code with provisioning",
            "Implement role-based access control",
            "Create dashboard templates for consistency"
          ],
          scenarios: [
            "Dashboard loading slowly: Optimize queries, reduce time range, use query caching",
            "Alerts not firing: Check notification channels, verify alert rules, check data source connectivity",
            "Data not showing: Verify data source configuration, check time range, review query syntax",
            "Permission issues: Review RBAC settings, check organization membership"
          ]
        }
      }
    ]
  },
  {
    category: "Version Control",
    icon: GitBranch,
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    tools: [
      {
        name: "Git",
        icon: FaGitAlt,
        topics: ["Branching", "Merging", "Rebasing", "Cherry-pick", "Stash", "Hooks", "Submodules"],
        questionAreas: ["Workflow Strategies", "Conflict Resolution", "Best Practices", "Advanced Commands"],
        notes: {
          questions: [
            "What is the difference between merge and rebase?",
            "Explain Git branching strategies (GitFlow, trunk-based)",
            "How do you resolve merge conflicts?",
            "What is the difference between git pull and git fetch?",
            "Explain git cherry-pick and when to use it",
            "What are Git hooks and how do you use them?",
            "How do you undo commits (reset vs revert)?",
            "What is git stash and when is it useful?"
          ],
          concepts: [
            { term: "Branch", definition: "Pointer to a specific commit, allows parallel development" },
            { term: "Merge", definition: "Combine changes from different branches, creates merge commit" },
            { term: "Rebase", definition: "Reapply commits on top of another branch, creates linear history" },
            { term: "Cherry-pick", definition: "Apply specific commit from one branch to another" },
            { term: "Stash", definition: "Temporarily save uncommitted changes" },
            { term: "Hook", definition: "Script that runs automatically on Git events (pre-commit, post-merge)" }
          ],
          bestPractices: [
            "Use meaningful commit messages following conventional commits",
            "Create feature branches for new development",
            "Keep commits small and focused on single change",
            "Pull before pushing to avoid conflicts",
            "Use .gitignore to exclude unnecessary files",
            "Never force push to shared branches",
            "Use tags for release versions",
            "Implement code review process with pull requests",
            "Use Git hooks for automated checks (linting, testing)"
          ],
          scenarios: [
            "Merge conflict: Use git status to identify conflicts, edit files, mark resolved with git add",
            "Accidentally committed sensitive data: Use git filter-branch or BFG Repo-Cleaner, rotate secrets",
            "Need to undo commit: Use git revert for shared branches, git reset for local changes",
            "Lost commits: Use git reflog to find lost commits, git cherry-pick to recover",
            "Large repository: Use git LFS for large files, implement shallow clones"
          ]
        }
      }
    ]
  },
  {
    category: "Scripting & Programming",
    icon: Terminal,
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    tools: [
      {
        name: "Python",
        icon: FaPython,
        topics: ["Automation Scripts", "APIs", "Data Processing", "Libraries", "Error Handling"],
        questionAreas: ["Scripting Best Practices", "Automation", "API Integration", "Testing"],
        notes: {
          questions: [
            "How do you handle errors in Python scripts?",
            "Explain the difference between lists and tuples",
            "How do you make HTTP requests in Python?",
            "What are Python virtual environments and why use them?",
            "How do you read and write files in Python?",
            "Explain decorators and their use cases",
            "What is the difference between == and is?",
            "How do you work with JSON in Python?"
          ],
          concepts: [
            { term: "List", definition: "Mutable ordered collection of items" },
            { term: "Dictionary", definition: "Key-value pairs for storing and retrieving data" },
            { term: "Function", definition: "Reusable block of code that performs specific task" },
            { term: "Module", definition: "File containing Python code that can be imported" },
            { term: "Virtual Environment", definition: "Isolated Python environment with its own packages" },
            { term: "Exception", definition: "Error that occurs during program execution" }
          ],
          bestPractices: [
            "Use virtual environments for dependency isolation",
            "Follow PEP 8 style guide for code formatting",
            "Implement proper error handling with try-except",
            "Use type hints for better code documentation",
            "Write unit tests for automation scripts",
            "Use logging instead of print statements",
            "Keep functions small and focused",
            "Use context managers for resource management",
            "Document code with docstrings"
          ],
          scenarios: [
            "Script fails silently: Implement logging, add error handling, use exit codes",
            "Dependency conflicts: Use virtual environments, pin package versions in requirements.txt",
            "Slow script execution: Profile code, optimize loops, use async for I/O operations",
            "API rate limiting: Implement retry logic with exponential backoff, use caching"
          ]
        }
      },
      {
        name: "Bash",
        icon: Terminal,
        topics: ["Shell Scripting", "Text Processing", "System Administration", "Cron Jobs"],
        questionAreas: ["Script Writing", "Text Processing", "System Tasks", "Debugging"],
        notes: {
          questions: [
            "What is the difference between $@ and $*?",
            "How do you handle errors in bash scripts?",
            "Explain the difference between [ ] and [[ ]]",
            "How do you process command-line arguments?",
            "What are pipes and redirections in bash?",
            "How do you schedule tasks with cron?",
            "Explain the difference between source and ./script.sh"
          ],
          concepts: [
            { term: "Variable", definition: "Named storage for values (NAME=value)" },
            { term: "Pipe", definition: "Send output of one command as input to another (|)" },
            { term: "Redirection", definition: "Redirect input/output (>, <, >>)" },
            { term: "Exit Code", definition: "Numeric value indicating command success (0) or failure (non-zero)" },
            { term: "Cron", definition: "Time-based job scheduler for running scripts periodically" }
          ],
          bestPractices: [
            "Always quote variables to prevent word splitting",
            "Use set -e to exit on errors",
            "Use set -u to catch undefined variables",
            "Add shebang (#!/bin/bash) at the beginning",
            "Use functions for code reusability",
            "Implement proper error handling and logging",
            "Use shellcheck for script validation",
            "Add comments for complex logic",
            "Use meaningful variable names"
          ],
          scenarios: [
            "Script fails with 'command not found': Check PATH, use absolute paths, verify permissions",
            "Cron job not running: Check cron logs, verify cron syntax, use absolute paths in script",
            "Permission denied: Use chmod to set execute permissions, check file ownership",
            "Variable not expanding: Check quoting, use ${var} syntax, verify variable is set"
          ]
        }
      }
    ]
  },
  {
    category: "Infrastructure as Code",
    icon: Code2,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    tools: [
      {
        name: "Terraform",
        icon: SiTerraform,
        topics: ["State Management", "Drift Detection", "Modules", "Workspaces", "Remote Backend", "Team Collaboration"],
        questionAreas: ["State File Issues", "Drift Detection", "Multi-Environment Management", "Team Collaboration", "Production Safety"],
        notes: {
          questions: [
            "Terraform apply fails halfway. What happens to your infrastructure and how do you recover?",
            "Infrastructure was changed manually in the cloud console. How do you detect and fix state drift?",
            "Your Terraform state file got deleted or corrupted. What do you do?"
          ],
          concepts: [
            { term: "State File", definition: "JSON file tracking real-world resources managed by Terraform, critical for drift detection and updates" },
            { term: "Drift", definition: "Difference between Terraform state and actual infrastructure due to out-of-band changes" },
            { term: "Remote Backend", definition: "Storage location for state file (S3, Terraform Cloud) enabling team collaboration and automatic backups" }
          ],
          bestPractices: [
            "Always use remote backend (S3/Terraform Cloud) with versioning enabled",
            "Enable state locking with DynamoDB to prevent concurrent modifications",
            "Run 'terraform plan' before 'apply' to review changes and detect drift",
            "Never manually edit infrastructure, always use Terraform for changes",
            "Back up state file before major changes"
          ],
          scenarios: [
            "Apply fails halfway: Fix error and rerun apply - Terraform resumes from where it failed",
            "Manual console changes: Run 'terraform plan' to see drift, decide to update code or revert infrastructure",
            "State file lost: Restore from S3 version history, or manually import all resources (last resort)"
          ]
        }
      }
    ]
  },
  {
    category: "CI/CD Tools",
    icon: GitBranch,
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    tools: [
      {
        name: "Jenkins",
        icon: FaJenkins,
        topics: ["Pipelines", "Job Failures", "Performance", "Secrets Management", "Zero-Downtime Deployments"],
        questionAreas: ["Pipeline Debugging", "Performance Optimization", "Security Best Practices", "Deployment Strategies", "Scaling Jenkins"],
        notes: {
          questions: [
            "A Jenkins job is failing, but it works fine when run manually. How do you debug?",
            "Jenkins pipeline suddenly became slow. What could be the reasons?"
          ],
          concepts: [
            { term: "Jenkins Agent", definition: "Worker node that executes builds, separating build execution from Jenkins master for better performance" },
            { term: "Pipeline", definition: "Script defining automated build/test/deploy process, written in Groovy using Declarative or Scripted syntax" },
            { term: "Workspace", definition: "Directory on agent where source code is checked out and build happens, should be cleaned regularly" }
          ],
          bestPractices: [
            "Never run builds on Jenkins master, always use agents",
            "Clean workspace before/after builds to avoid disk space issues",
            "Use local artifact caching (Nexus/Artifactory) to speed up dependency downloads",
            "Implement parallel stages for independent tasks (tests, lint, build)",
            "Set up build log rotation to keep max 10-30 builds"
          ],
          scenarios: [
            "Job fails in Jenkins, works manually: Check PATH differences, environment variables, permissions",
            "Slow pipeline: Identify bottleneck stage, check agent load, add parallel stages, set up local artifact cache"
          ]
        }
      },
      {
        name: "GitHub Actions",
        icon: SiGithubactions,
        topics: ["Workflows", "Runners", "Secrets", "Caching", "Matrix Builds", "Reusable Workflows"],
        questionAreas: ["Workflow Design", "Performance Optimization", "Security", "Advanced Patterns"],
        notes: {
          questions: [
            "What are GitHub Actions workflows and how do you structure them?",
            "How do you use matrix builds to test across multiple versions?",
            "Explain how to cache dependencies for faster builds"
          ],
          concepts: [
            { term: "Workflow", definition: "Automated process defined in YAML, triggered by events like push, PR, or schedule" },
            { term: "Runner", definition: "Server that executes workflows, can be GitHub-hosted (ubuntu/windows/mac) or self-hosted" },
            { term: "Matrix Build", definition: "Strategy to run job across multiple versions/OSes in parallel, useful for compatibility testing" }
          ],
          bestPractices: [
            "Use actions/cache to speed up builds by caching dependencies",
            "Pin action versions to specific tags (@v3, not @main) for stability",
            "Store all secrets in repository/organization secrets, never hardcode",
            "Use matrix builds to test across multiple Node/Python/OS versions",
            "Implement path filters to avoid unnecessary workflow runs"
          ],
          scenarios: [
            "Full CI/CD: Lint → Test (matrix) → Build → Deploy (conditional on main branch)",
            "Matrix testing: Test app on Node 14/16/18 and ubuntu/windows/mac in parallel",
            "Caching: Cache node_modules with key based on package-lock.json hash for faster installs"
          ]
        }
      }
    ]
  },
  {
    category: "Configuration Management",
    icon: Settings,
    color: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    tools: [
      {
        name: "Ansible",
        icon: SiAnsible,
        topics: ["Playbooks", "Inventory", "Roles", "Handlers", "Vault", "Idempotency"],
        questionAreas: ["Playbook Structure", "Secrets Management", "Deployment Scenarios", "Best Practices"],
        notes: {
          questions: [
            "Explain playbook structure and idempotency in Ansible",
            "How do you use Ansible Vault for secrets management?"
          ],
          concepts: [
            { term: "Idempotency", definition: "Property where running a playbook multiple times produces the same result without unwanted side effects" },
            { term: "Ansible Vault", definition: "Built-in encryption tool for protecting sensitive data like passwords and keys in playbooks" },
            { term: "Handler", definition: "Task triggered by notify directive, typically used for service restarts, runs once at end of playbook" }
          ],
          bestPractices: [
            "Use native Ansible modules instead of shell commands for idempotency",
            "Encrypt all secrets with ansible-vault, never commit plain text passwords",
            "Organize playbooks with roles for reusability across projects",
            "Test playbooks in check mode before applying to production",
            "Use version control for all playbooks and inventory files"
          ],
          scenarios: [
            "Deploying application: Use roles for common tasks (nginx, app), vault for secrets, handlers for service restarts",
            "Managing secrets: Create encrypted vars file with ansible-vault, use --vault-password-file in CI/CD",
            "Ensuring idempotency: Run playbook twice, verify second run shows changed=0"
          ]
        }
      }
    ]
  },
  {
    category: "Interview Prep Resources",
    icon: FileText,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    tools: [
      {
        name: "Linux Questions",
        icon: Terminal,
        topics: ["File System", "Processes", "Networking", "Package Management", "Monitoring", "User Management"],
        questionAreas: ["System Administration", "Command Line", "Troubleshooting", "Performance Tuning"],
        notes: {
          questions: [
            "What is the difference between absolute and relative paths?",
            "Explain Linux file permissions (rwx)",
            "How do you kill a process in Linux?",
            "What is the difference between apt and yum?",
            "How do you check network connectivity in Linux?"
          ],
          concepts: [
            { term: "File System", definition: "Hierarchical structure for organizing files and directories" },
            { term: "Process", definition: "Running instance of a program with its own memory space" },
            { term: "Package Manager", definition: "Tool for installing, updating, and removing software packages" }
          ],
          bestPractices: [
            "Always use sudo carefully and understand what commands do",
            "Regularly update system packages for security",
            "Use version control for configuration files",
            "Monitor system resources to prevent issues"
          ],
          scenarios: [
            "Disk full: Use df and du to find large files, clean up logs, expand storage",
            "Process consuming CPU: Use top/htop to identify, check logs, restart if needed",
            "Permission denied: Check file permissions with ls -l, use chmod/chown appropriately"
          ]
        }
      },
      {
        name: "Networking Questions",
        icon: Network,
        topics: ["OSI Model", "TCP/IP", "DNS", "HTTP/HTTPS", "Load Balancing", "Subnetting"],
        questionAreas: ["Protocols", "Troubleshooting", "Network Design", "Security"],
        notes: {
          questions: [
            "Explain the OSI model and its 7 layers",
            "What is the difference between TCP and UDP?",
            "How does DNS work?",
            "What is the difference between Layer 4 and Layer 7 load balancing?",
            "How do you troubleshoot network connectivity issues?"
          ],
          concepts: [
            { term: "OSI Model", definition: "7-layer model for network communication (Physical, Data Link, Network, Transport, Session, Presentation, Application)" },
            { term: "TCP", definition: "Transmission Control Protocol - reliable, connection-oriented protocol" },
            { term: "DNS", definition: "Domain Name System - translates domain names to IP addresses" },
            { term: "Load Balancer", definition: "Distributes network traffic across multiple servers" }
          ],
          bestPractices: [
            "Use HTTPS for secure communication",
            "Implement proper firewall rules",
            "Monitor network performance and latency",
            "Use CDN for global content delivery",
            "Implement DDoS protection"
          ],
          scenarios: [
            "Website not accessible: Check DNS resolution, verify firewall rules, test connectivity",
            "Slow network: Check bandwidth usage, analyze latency, optimize routing",
            "SSL certificate error: Verify certificate validity, check domain match, renew if expired"
          ]
        }
      },
      {
        name: "Behavioral Questions",
        icon: Users,
        topics: ["Teamwork", "Leadership", "Problem Solving", "Communication", "Adaptability", "Time Management"],
        questionAreas: ["STAR Method", "Soft Skills", "Situational Questions", "Career Goals"],
        notes: {
          questions: [
            "Tell me about a time you worked on a team project",
            "Describe a challenging technical problem you solved",
            "Tell me about a time you had to learn a new technology quickly",
            "How do you handle conflicts with team members?",
            "Describe a time you took initiative"
          ],
          concepts: [
            { term: "STAR Method", definition: "Situation, Task, Action, Result - framework for answering behavioral questions" },
            { term: "Soft Skills", definition: "Personal attributes that enable effective interaction and collaboration" },
            { term: "Growth Mindset", definition: "Belief that abilities can be developed through dedication and hard work" }
          ],
          bestPractices: [
            "Use specific examples with measurable results",
            "Focus on your individual contributions",
            "Be honest about challenges and what you learned",
            "Prepare examples for common question categories",
            "Practice STAR method responses"
          ],
          scenarios: [
            "Team conflict: Listen actively, find common ground, focus on project goals, escalate if needed",
            "Tight deadline: Prioritize tasks, communicate with stakeholders, work efficiently, ask for help",
            "Technical challenge: Break down problem, research solutions, test approaches, document learnings"
          ]
        }
      }
    ]
  }
];

const InterviewPrep = () => {
  const [expandedTools, setExpandedTools] = useState<string[]>([]);

  return (
    <main className="overflow-x-hidden">
      {/* Header */}
      <section className="py-12 bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4">
          <Link to="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="flex flex-col items-center text-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-gradient">DevOps Interview Preparation</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive guide with interview questions, concepts, best practices, and real-world scenarios
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="px-4 py-2 border-primary/30">
                <BookOpen className="w-4 h-4 mr-2" />
                Interview Ready
              </Badge>
              <Badge variant="outline" className="px-4 py-2 border-primary/30">
                <Server className="w-4 h-4 mr-2" />
                Production Experience
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-4">
          {devopsTools.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            return (
              <div key={category.category} className="mb-16 last:mb-0">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-3xl font-bold text-gradient">{category.category}</h2>
                </div>

                {/* Tools Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {category.tools.map((tool, toolIndex) => {
                    const ToolIcon = tool.icon;
                    const toolSlug = tool.name.toLowerCase().replace(/\s+/g, '-');

                    // Special routing for dedicated resource pages
                    const specialRoutes: Record<string, string> = {
                      "linux-questions": "/interview-prep/linux",
                      "networking-questions": "/interview-prep/networking",
                      "behavioral-questions": "/interview-prep/behavioral"
                    };
                    const linkTo = specialRoutes[toolSlug] || `/interview-prep/tool/${toolSlug}`;

                    return (
                      <Link key={tool.name} to={linkTo} className="block">
                        <Card
                          className="card-gradient border-border/50 p-6 hover:scale-[1.02] transition-all duration-300 group cursor-pointer h-full"
                        >
                          {/* Tool Header */}
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <ToolIcon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold">{tool.name}</h3>
                          </div>

                          {/* Key Topics */}
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              Key Topics
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {tool.topics.map((topic) => (
                                <Badge
                                  key={topic}
                                  variant="outline"
                                  className="text-xs border-primary/20 hover:bg-primary/10 transition-colors"
                                >
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Question Areas */}
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              Common Interview Areas
                            </h4>
                            <ul className="space-y-2">
                              {tool.questionAreas.map((area) => (
                                <li
                                  key={area}
                                  className="text-sm text-card-foreground flex items-start gap-2"
                                >
                                  <span className="text-primary mt-1">•</span>
                                  <span>{area}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Expandable Interview Notes */}
                          <Accordion type="multiple" className="w-full">
                            {/* Common Questions */}
                            <AccordionItem value="questions" className="border-border/50">
                              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                                <div className="flex items-center gap-2">
                                  <HelpCircle className="w-4 h-4 text-primary" />
                                  Common Interview Questions ({tool.notes.questions.length})
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <ul className="space-y-3 mt-2">
                                  {tool.notes.questions.map((question, idx) => (
                                    <li key={idx} className="text-sm flex items-start gap-2">
                                      <span className="text-primary font-bold mt-0.5">{idx + 1}.</span>
                                      <span className="text-muted-foreground">{question}</span>
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>

                            {/* Important Concepts */}
                            <AccordionItem value="concepts" className="border-border/50">
                              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                                <div className="flex items-center gap-2">
                                  <Lightbulb className="w-4 h-4 text-primary" />
                                  Important Concepts ({tool.notes.concepts.length})
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-3 mt-2">
                                  {tool.notes.concepts.map((concept, idx) => (
                                    <div key={idx} className="border-l-2 border-primary/30 pl-3">
                                      <div className="font-semibold text-sm text-primary">{concept.term}</div>
                                      <div className="text-sm text-muted-foreground mt-1">{concept.definition}</div>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>

                            {/* Best Practices */}
                            <AccordionItem value="practices" className="border-border/50">
                              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-primary" />
                                  Best Practices ({tool.notes.bestPractices.length})
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <ul className="space-y-2 mt-2">
                                  {tool.notes.bestPractices.map((practice, idx) => (
                                    <li key={idx} className="text-sm flex items-start gap-2">
                                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span className="text-muted-foreground">{practice}</span>
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>

                            {/* Real-World Scenarios */}
                            <AccordionItem value="scenarios" className="border-border/50">
                              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-primary" />
                                  Real-World Scenarios ({tool.notes.scenarios.length})
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-3 mt-2">
                                  {tool.notes.scenarios.map((scenario, idx) => (
                                    <div key={idx} className="bg-muted/30 rounded-lg p-3">
                                      <div className="text-sm text-muted-foreground">{scenario}</div>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interview Tips */}
      <section className="py-16 bg-background/80 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gradient">Interview Tips</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 card-gradient border-border/50">
                <h3 className="font-bold mb-2">Hands-On Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Demonstrate practical knowledge with real-world project examples and specific metrics
                </p>
              </Card>
              <Card className="p-6 card-gradient border-border/50">
                <h3 className="font-bold mb-2">Best Practices</h3>
                <p className="text-sm text-muted-foreground">
                  Discuss security, scalability, and cost optimization strategies with concrete examples
                </p>
              </Card>
              <Card className="p-6 card-gradient border-border/50">
                <h3 className="font-bold mb-2">Problem Solving</h3>
                <p className="text-sm text-muted-foreground">
                  Explain your troubleshooting approach with step-by-step methodology and tools used
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background/80 border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 Irfan Basha. Fresh graduate ready to make an impact in tech.
          </p>
        </div>
      </footer>
    </main >
  );
};

export default InterviewPrep;
