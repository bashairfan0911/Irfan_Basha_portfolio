import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Code, BookOpen, HelpCircle } from "lucide-react";
import { Link, useParams, Navigate } from "react-router-dom";
import { FaAws, FaDocker, FaJenkins, FaGitAlt } from "react-icons/fa";
import { SiKubernetes, SiTerraform, SiAnsible, SiGithubactions } from "react-icons/si";

// Azure Icon Component
const AzureIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.379 23.343a1.62 1.62 0 0 0 1.536-2.14v.002L17.35 1.76A1.62 1.62 0 0 0 15.816.657H8.184A1.62 1.62 0 0 0 6.65 1.76L.086 21.204a1.62 1.62 0 0 0 1.536 2.139h4.741a1.62 1.62 0 0 0 1.535-1.103l.977-2.892 4.947 3.675c.28.208.618.32.966.32h7.591m-3.096-3.24h-5.883l-2.286-6.845 5.07-8.735 3.099 15.58" />
    </svg>
);

// Helper function to format answers with proper structure and line breaks
const formatAnswer = (answer: string) => {
    const elements: JSX.Element[] = [];
    let key = 0;

    // Split the answer by bold markers while preserving them
    const parts = answer.split(/(\*\*[^*]+\*\*)/g);

    parts.forEach((part, index) => {
        if (!part.trim()) return;

        if (part.startsWith('**') && part.endsWith('**')) {
            // This is bold text
            const text = part.slice(2, -2);

            // Check if this is a section header (ends with : or starts with number)
            const isHeader = text.endsWith(':') || /^\d+[\).]\s/.test(text) || /^(Step|Method|Scenario|Example|Real|Before|After)\s/i.test(text);

            elements.push(
                <div key={key++} className={isHeader ? "mt-4 first:mt-0 mb-1" : "inline"}>
                    <strong className="text-foreground font-semibold">
                        {text}
                    </strong>
                    {!isHeader && ' '}
                </div>
            );
        } else {
            // Regular text - split into sentences for better spacing
            const sentences = part.split(/(?<=\.)\s+(?=[A-Z**])/g);

            sentences.forEach((sentence) => {
                if (sentence.trim()) {
                    elements.push(
                        <span key={key++} className="inline">
                            {sentence}{' '}
                        </span>
                    );
                }
            });
        }
    });

    return (
        <div className="text-base leading-7 space-y-1">
            {elements}
        </div>
    );
};


interface QA {
    question: string;
    answer: string;
}

// Tool data with comprehensive Q&A from document
const toolsData = {
    "aws": {
        name: "AWS",
        icon: FaAws,
        category: "Cloud Platforms",
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        topics: ["EC2", "S3", "VPC", "IAM", "EKS", "Lambda", "ALB/NLB", "Cost Optimization", "Blue-Green Deployment", "Monitoring"],
        questionAreas: ["Service Architecture", "Security & IAM", "Cost Optimization", "High Availability", "Production Deployments"],
        qa: [
            {
                question: "How do you design a highly available architecture in AWS?",
                answer: "**High Availability Design Strategy**: **1) Multi-AZ Deployment** - Spread resources across at least 2-3 Availability Zones within a region. If one AZ fails, others continue serving traffic. **2) Load Balancing** - Use Application Load Balancer (ALB) to distribute traffic across instances in multiple AZs. Configure health checks to automatically remove unhealthy instances. **3) Auto Scaling** - Set up Auto Scaling Groups with min/max/desired capacity. Scale based on CloudWatch metrics (CPU, memory, request count). **4) Database HA** - Use RDS Multi-AZ for automatic failover. For higher requirements, use Aurora with read replicas across AZs. **5) Route 53** - Configure DNS failover policies. Use health checks to automatically route traffic to healthy endpoints. **6) Static Content** - Store in S3 (99.999999999% durability) and serve via CloudFront CDN for global distribution. **7) Elastic IP** - Use for static IP requirements with automatic remapping during failures. **8) Backup & Recovery** - Automated snapshots, cross-region backup, tested recovery procedures. **9) Monitoring** - CloudWatch alarms, AWS Health Dashboard, real-time alerting. This ensures zero single points of failure and automatic recovery from component failures."
            },
            {
                question: "How do you manage cost optimization in production AWS accounts?",
                answer: "**Cost Optimization Strategy**: **1) Right-Sizing** - Use AWS Compute Optimizer to identify underutilized instances. Downsize or switch to newer instance types (e.g., Graviton for 20% savings). **2) Reserved Instances & Savings Plans** - For predictable workloads, purchase 1-3 year commitments (up to 72% savings). Use Savings Plans for flexibility across instance families. **3) Spot Instances** - Use for fault-tolerant workloads (batch processing, CI/CD runners) - save up to 90%. Combine with On-Demand for critical components. **4) Auto Scaling** - Scale down during off-hours. Use scheduled scaling for predictable patterns. **5) S3 Storage Classes** - Implement lifecycle policies to automatically move infrequently accessed data to cheaper storage (S3-IA, Glacier). **6) EBS Optimization** - Delete unattached volumes. Use gp3 instead of gp2 (20% cheaper). Enable EBS snapshots cleanup. **7) Cost Explorer & Budgets** - Set up AWS Budgets with alerts. Review Cost Explorer monthly for anomalies. Tag resources for cost allocation. **8) Unused Resources** - Regular cleanup: old snapshots, unused load balancers, detached volumes, idle instances. **9) Data Transfer** - Use VPC endpoints to avoid data transfer costs. Compress data before transfer. Implement CloudFront for caching. **Real Example**: Tag all resources with 'Environment' and 'Team', create budgets per team, review top 10 cost drivers monthly, achieved 35% reduction in 6 months."
            },
            {
                question: "Difference between ALB and NLB with real use cases?",
                answer: "**Application Load Balancer (ALB)** - Layer 7 (HTTP/HTTPS). **Features**: Host/path-based routing, WebSocket support, HTTP/2, SSL termination, authentication integration (Cognito, OIDC), fixed response/redirects. **Use Cases**: Modern web applications, microservices with different routing rules, need content-based routing (route /api/* to API servers, /static/* to static servers), require WebSocket support, need built-in authentication. **Performance**: Handles ~10s of thousands requests/sec. **Network Load Balancer (NLB)** - Layer 4 (TCP/UDP/TLS). **Features**: Ultra-low latency (<100 microseconds), handles millions of requests/sec, preserves source IP, static IP support, TLS termination. **Use Cases**: Extreme performance requirements, non-HTTP protocols (gaming servers, IoT, database connections), need static IP for firewall whitelisting, TCP/UDP load balancing, real-time applications requiring low latency. **Real-World Decision**: Use **ALB** for typical web/API applications with routing logic. Use **NLB** when you need extreme performance, non-HTTP protocols, or static IPs (e.g., financial trading platforms needing microsecond latency, game servers, SIP trunking services). **Cost**: Both charge per hour + LCU (Load Balancer Capacity Units), but NLB typically cheaper for high throughput. **Example**: E-commerce site with microservices → ALB (route /products to product service, /users to user service). Real-time gaming platform → NLB (UDP traffic, ultra-low latency)."
            },
            {
                question: "How do you secure secrets in AWS pipelines?",
                answer: "**Secrets Management Best Practices**: **1) AWS Secrets Manager** - Store database passwords, API keys, credentials. Automatic rotation (30/60/90 days). Fine-grained IAM access control. Encryption at rest (KMS). **2) Parameter Store (SSM)** - For configuration data and secrets. Free tier available. Supports SecureString (KMS encrypted). Good for non-rotating secrets. **3) Pipeline Integration** - In CodePipeline/CodeBuild: Retrieve secrets at runtime using IAM roles (NO hardcoding). Use environment variables passed from Secrets Manager. Example CodeBuild buildspec: `DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id prod/db --query SecretString --output text)`. **4) IAM Roles** - Use task/execution roles with least privilege. No long-lived access keys. Temporary credentials only. **5) Encryption** - Encrypt at rest using KMS. Use separate KMS keys per environment. Enable versioning for secrets rotation. **6) Audit & Monitoring** - CloudTrail logs all secret access. CloudWatch alarms for unauthorized access attempts. **7) Never Commit** - Use git-secrets or pre-commit hooks to prevent accidental commits. Scan repositories with tools like TruffleHog. **Real Example**: Jenkins pipeline retrieving RDS password: `withAWS(role:'pipeline-role') { def dbPassword = sh(script: \"aws secretsmanager get-secret-value --secret-id prod/rds-password --query SecretString --output text\", returnStdout: true).trim() }`. This ensures credentials are never in code, automatically rotated, and access is logged."
            },
            {
                question: "How do you handle IAM for multi-team environments?",
                answer: "**Multi-Team IAM Strategy**: **1) Account Structure** - Use AWS Organizations with separate accounts per team/environment (dev-team-a, prod-team-a). Centralized billing, consolidated CloudTrail. **2) Cross-Account Roles** - Teams assume roles from their own accounts into shared accounts. Use STS AssumeRole with MFA. **3) Permission Boundaries** - Define maximum permissions teams can grant. Prevents privilege escalation. Applied at user/role creation. **4) IAM Groups** - Create groups per role (developers, devops, read-only). Assign users to groups, not individual permissions. **5) Tag-Based Access Control** - Tag resources with 'Team:TeamA'. IAM policy: Allow actions only on resources where Team=TeamA. **6) Service Control Policies (SCP)** - Organization-level guardrails. Example: Deny deletion of CloudTrail, enforce MFA, restrict regions. **7) Least Privilege** - Start with minimal permissions. Use Access Analyzer to identify unused permissions. Grant additional as needed with review process. **8) Audit & Compliance** - IAM Access Advisor shows last access times. Regular quarterly access reviews. Automated reports of unused credentials. **9) Automation** - Use Terraform/CloudFormation for IAM management. Version control all policies. Peer review for changes. **Real Example**: Team A can only manage EC2 instances tagged with 'Team:TeamA', enforced by this IAM policy: `\"Condition\": {\"StringEquals\": {\"ec2:ResourceTag/Team\": \"TeamA\"}}`. Centralized security team manages VPC/security groups. Teams self-manage compute within boundaries. This prevents cross-team access, ensures compliance, maintains security."
            },
            {
                question: "How do you implement blue-green deployment in AWS?",
                answer: "**Blue-Green Deployment Strategy**: **What it is**: Two identical production environments (Blue=current, Green=new). Deploy to Green, test, then switch traffic. **AWS Implementation**: **Method 1 - ELB Target Groups**: **1)** Set up ALB with 2 target groups (Blue, Green). **2)** Deploy new version to Green target group. **3)** Run smoke tests against Green. **4)** Modify ALB listener rule to route 100% traffic to Green. **5)** Monitor for issues. Rollback = switch back to Blue (instant). **6)** Decommission Blue after stability confirmed. **Method 2 - Route 53 Weighted Routing**: Two complete environments with different DNS records. Gradually shift weight from Blue to Green (0%→10%→50%→100%). Instant rollback by changing weights. **Method 3 - Auto Scaling Groups**: Create new ASG with new launch template. Attach to same ALB. Scale up Green, validate, then scale down Blue. **Benefits**: **1) Zero Downtime** - Traffic switches instantly. **2) Easy Rollback** - Just switch back (seconds). **3) Real Production Testing** - Green runs in production environment. **4) No Version Conflicts** - Clear separation. **Challenges**: Database migrations (use backward-compatible changes), stateful sessions (use sticky sessions or external session store), double resources temporarily (higher cost). **Real Example**: E-commerce site during Black Friday. Blue runs v1.0. Deploy v2.0 to Green, test checkout flow. Switch 10% traffic to Green. Monitor error rates. If OK, gradually move to 100%. If issues, instant rollback to Blue. **CodeDeploy**: AWS CodeDeploy supports Blue/Green with automatic rollback based on CloudWatch alarms."
            },
            {
                question: "How do you monitor EC2 vs ECS vs EKS?",
                answer: "**Monitoring Strategy by Service**: **EC2 Monitoring**: **1) CloudWatch Metrics** - CPU, Network, Disk (requires CloudWatch agent for memory/disk). Set alarms for high CPU >80%, disk >85%. **2) CloudWatch Agent** - Install on instances for custom metrics (memory, disk, processes). Collect logs to CloudWatch Logs. **3) Systems Manager** - Inventory, patch compliance, session logging. **4) Application Logs** - Stream to CloudWatch Logs using agent. Set metric filters for errors. **ECS Monitoring**: **1) Container Insights** - Enable for cluster-level metrics (CPU, memory per task/service/cluster). **2) Task Definition Metrics** - Container CPU/memory utilization. **3) Service Metrics** - Running task count, deployment tracking. **4) CloudWatch Logs** - Configure log driver in task definition: `awslogs`. Each container sends logs to separate stream. **5) Application Metrics** - Use CloudWatch embedded metric format in application logs. **EKS Monitoring**: **1) Container Insights for EKS** - Cluster, namespace, pod, container level metrics. Shows CPU/memory/network/disk. **2) Control Plane Logs** - Enable audit, authenticator, controllerManager logs. Sent to CloudWatch. **3) Prometheus & Grafana** - Deploy in cluster for detailed metrics. Scrape application metrics. **4) Fluent Bit/Fluentd** - Pod log aggregation to CloudWatch/Elasticsearch. **5) AWS X-Ray** - Distributed tracing for microservices. **Comparison**: EC2 = instance-level, manual setup. ECS = container-level, AWS-native integration. EKS = comprehensive Kubernetes ecosystem, requires more tools. **Best Practice**: All three should send logs to centralized location (CloudWatch Logs), set up dashboards (CloudWatch Dashboard/ Grafana), configure alerts (CloudWatch Alarms/PagerDuty), implement distributed tracing (X-Ray). Cost consideration: Container Insights adds charges, tune retention based on needs."
            },
            {
                question: "How do you troubleshoot latency issues in AWS?",
                answer: "**Latency Troubleshooting Approach**: **1) Identify Layer** - **Network**: Check CloudWatch metrics for ELB latency, VPC Flow Logs. Use VPC Reachability Analyzer. **Application**: Check CloudWatch logs, X-Ray traces. **Database**: RDS Performance Insights, slow query logs. **2) Load Balancer Analysis** - **ALB Metrics**: TargetResponseTime (backend latency), RequestProcessingTime, ResponseProcessingTime. High values indicate backend or LB issues. **3) X-Ray Analysis** - See complete request trace across services. Identify slowest component (Lambda, RDS, external API). Example: Request takes 3s total, X-Ray shows: API Gateway (50ms) → Lambda (100ms) → RDS (2.8s) → bottleneck is database. **4) Application Profiling** - Enable detailed CloudWatch metrics. Add custom metrics for critical paths. Use APM tools (Datadog, NewRelic). **5) Network Checks** - **Cross-Region**: Check if traffic crosses regions unnecessarily. **NAT Gateway**: High latency through NAT? Use VPC endpoints instead. **Internet**: Use CloudFront to cache at edge locations. **6) Database Optimization** - **RDS Performance Insights**: Shows top SQL queries by load. **Slow Query Log**: Queries taking >5s. **Read Replicas**: Offload read traffic. **Connection Pooling**: Reduce connection establishment overhead. **7) Caching** - **CloudFront**: Cache static content at edge. **ElastiCache**: Cache frequent database queries (Redis/Memcached). **Application-Level**: In-memory caching. **8) Resource Constraints** - Check CPU, memory, network utilization. Underprovisioned instances? Scale up or out. **Real Example**: API latency spike from 100ms to 3s. Analysis: X-Ray shows RDS taking 2.9s. Performance Insights reveals table scan on users table (missing index). Added composite index on (user_id, created_at). Latency back to 100ms. **Tools**: AWS X-Ray, CloudWatch Logs Insights, RDS Performance Insights, VPC Flow Logs, curl with -w for timing."
            },
            {
                question: "How do you manage multiple AWS accounts?",
                answer: "**Multi-Account Management Strategy**: **1) AWS Organizations** - Create organization with management account. Organizational Units (OUs): Production, Development, Security, Shared Services. **2) Account Structure** - **By Environment**: prod-account, staging-account, dev-account. **By Team**: team-a-prod, team-a-dev, team-b-prod. **By Workload**: app-frontend, app-backend, data-platform. **Benefits**: Blast radius containment, separate billing, compliance boundaries. **3) Service Control Policies (SCPs)** - Guardrails across accounts. Example: Deny EC2 launch in unapproved regions, enforce MFA, prevent CloudTrail deletion. **4) Cross-Account Access** - Use IAM roles with AssumeRole, not access keys. Centralized identity account with SSO. Example: Developer assumes role from dev account into prod account (with MFA). **5) Centralized Logging** - All CloudTrail logs → S3 in security account. GuardDuty findings aggregated. VPC Flow Logs centralized. **6) Consolidated Billing** - Management account pays for all. Reserved Instance/ Savings Plan sharing across accounts. Cost allocation tags for chargeback. **7) Landing Zone** - Use AWS Control Tower for automated account provisioning. Pre-configured security baselines, guardrails, account factory. **8) Infrastructure as Code** - Terraform with separate state per account. Shared modules across accounts. CI/CD pipeline for infrastructure changes. **9) Networking** - Transit Gateway for hub-spoke connectivity between accounts. VPC peering for simple scenarios. Private connectivity to shared services. **Real Setup**: **Org Structure**: Root → Security OU (audit-account, log-archive-account) → Production OU (prod-app, prod-data) → Development OU (dev-account, sandbox-accounts). **Access Pattern**: Engineers federate via AWS SSO → AssumeRole into accounts based on AD groups. **Security**: SCPs prevent region sprawl, enforce encryption, require tagging. **Cost**: Billing alerts per OU, detailed cost reports by team."
            },
            {
                question: "How do you handle AWS service limits?",
                answer: "**Service Limits Management**: **Understanding Limits**: **1) Soft Limits** - Can be increased via support ticket (EC2 instances, EBS volumes, VPC limits). **2) Hard Limits** - Cannot be increased (S3 bucket names, IAM name lengths). **3) Rate Limits** - API throttling (requests per second). **Proactive Monitoring**: **1) Trusted Advisor** - Shows limit usage for common services (EC2 instances, VPC, RDS, ELB). Checks: Service Limits dashboard. **2) CloudWatch Metrics** - Some services publish usage metrics. Create alarms at 80% of limit. **3) Service Quotas Dashboard** - Central place to view and request increases. Shows current usage vs. limits. **4) Lambda Function** - Custom script checking limits using AWS APIs. Alert when approaching threshold. **Handling Approaches**: **1) Request Increases** - Submit via AWS Service Quotas console or support case. Provide justification (expected growth, use case). Usually approved within 24-48 hours. **2) Architecture Changes** - Hit EC2 instance limit? Use containerization (ECS/EKS) - more efficient. S3 request rate limit? Use CloudFront or add random prefix to keys. **3) Multi-Account Strategy** - Limits are per account. Split workloads across accounts to multiply limits. **4) Alternative Services** - Lambda concurrent executions limit? Consider Fargate. **5) Throttling Handling** - Implement exponential backoff in application code. Use SQS for request buffering during rate limit exceeded. **Real Scenarios**: **Scenario 1**: Black Friday traffic spike. Pre-request EC2 instance limits increase from 500 to 2000 two weeks before. Test auto-scaling up to new limits. **Scenario 2**: S3 PUT rate limit (3500 requests/sec per prefix). Solution: Hash-based prefix distribution (objects spread across 10 prefixes = 35,000 req/sec capability). **Scenario 3**: Lambda concurrent executions limit hit causing throttling. Solution: Request increase from 1000 to 5000, implement SQS queue for overflow requests, add retry logic with exponential backoff. **Best Practice**: Quarterly limit review, automate monitoring, request increases proactively for expected growth, document limits in architecture reviews."
            }
        ],
        concepts: [
            { term: "Multi-AZ", definition: "Deploying resources across multiple Availability Zones for fault tolerance and high availability" },
            { term: "ALB", definition: "Application Load Balancer - Layer 7 load balancer with advanced routing capabilities" },
            { term: "NLB", definition: "Network Load Balancer - Layer 4 load balancer optimized for ultra-low latency and high throughput" },
            { term: "Blue-Green Deployment", definition: "Deployment strategy using two identical environments, switching traffic between them for zero-downtime updates" },
            { term: "Service Limits", definition: "AWS quotas limiting resource usage per account, can be soft (increaseable) or hard (fixed)" }
        ],
        bestPractices: [
            "Use multi-AZ deployments for all production workloads",
            "Implement auto-scaling for dynamic capacity management",
            "Store secrets in Secrets Manager, never in code",
            "Tag all resources for cost allocation and management",
            "Set up CloudWatch alarms for critical metrics",
            "Request service limit increases proactively before hitting them"
        ],
        scenarios: [
            "High latency: Use X-Ray to trace requests, identify bottleneck (often database), optimize queries",
            "Cost spike: Review Cost Explorer, identify top costs, implement right-sizing and cleanup unused resources",
            "Deployment failure: Use blue-green deployment for instant rollback capability"
        ]
    },
    "docker": {
        name: "Docker",
        icon: FaDocker,
        category: "Container Technologies",
        color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
        topics: ["Containers", "Images", "Dockerfile", "Networking", "Volumes", "Multi-stage Builds", "Optimization", "Troubleshooting"],
        questionAreas: ["Container Failures", "Image Optimization", "Networking", "Data Persistence", "Production Debugging"],
        qa: [
            {
                question: "A Docker container exits immediately after starting. How do you debug it?",
                answer: "**Debugging Container Exit**: **Step 1 - Check Logs**: `docker logs <container-id>` - See what error caused exit. Common: missing CMD/ENTRYPOINT, application crash, permission denied. **Step 2 - Check Exit Code**: `docker ps -a` shows exit code. **0** = clean exit, **1** = application error, **137** = killed by OOM, **139** = segmentation fault. **Step 3 - Inspect Container**: `docker inspect <container-id>` - Check State section for exit reason, OOMKilled status. **Step 4 - Run Interactively**: `docker run -it <image> /bin/sh` - Override entrypoint to explore inside container. Check if application binary exists, has execute permission. **Step 5 - Check Dockerfile**: Look at CMD/ENTRYPOINT. Common mistake: `CMD node app.js` (runs in shell, exits) vs `CMD [\"node\", \"app.js\"]` (exec form, correct). **Step 6 - Test Application**: Run application manually inside container: `docker run -it <image> /bin/sh`, then `./app`. See exact error. **Common Causes**: **1) Missing application file** - COPY command failed or wrong path. **2) Permission denied** - File not executable, run chmod +x in Dockerfile. **3) Environment variables missing** - App crashes without DB_URL. **4) Wrong working directory** - WORKDIR not set correctly. **5) Application exits normally** - Background processes need something to keep container alive (use tail -f or proper init). **Real Example**: Container exiting immediately. Logs show \"node: not found\". Issue: base image was alpine, node binary at /usr/local/bin/node. Fixed by using proper node:alpine base image. **Prevention**: Test images locally before deploying, use health checks, ensure CMD [] exec form for proper signal handling."
            },
            {
                question: "Your Docker image size is very large. How do you optimize it?",
                answer: "**Image Size Optimization Strategies**: **1) Use Minimal Base Images**: **Before**: `FROM ubuntu:latest` (78MB) **After**: `FROM alpine:latest` (5MB). For minimal needs, use `scratch` (0MB). Example: node:16 (900MB) → node:16-alpine (170MB). **2) Multi-Stage Builds**: Build in one stage, copy artifacts to smaller runtime image. ```Dockerfile FROM golang:1.19 AS builder WORKDIR /app COPY . . RUN go build -o app . FROM alpine:latest COPY --from=builder /app/app . CMD [\"./app\"]``` Before: 800MB (with Go toolchain), After: 15MB (just binary + alpine). **3) Combine RUN Commands**: Each RUN creates layer. **Before**: ```RUN apt-get update RUN apt-get install -y curl RUN apt-get clean``` (3 layers). **After**: `RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*` (1 layer). **4) Use .dockerignore**: Exclude node_modules, .git, test files from build context. Can reduce context from 1GB to 50MB. **5) Remove Build Dependencies**: ```RUN apk add --no-cache --virtual .build-deps gcc musl-dev \\ && pip install --no-cache-dir -r requirements.txt \\ && apk del .build-deps``` Installs gcc for compilation, then removes it. **6) Optimize Layer Ordering**: Put frequently changing layers last. Dependencies first (rarely change), source code last (changes often). Maximizes cache hits. **7) Use Specific Tags**: `FROM node:16.14.2-alpine` not `FROM node:latest`. Ensures reproducibility and better caching. **8) Clean Package Managers**: `npm ci --only=production` (no dev deps), `pip install --no-cache-dir` (don't cache wheels), `apt-get clean`. **Real Example**: **Before**: ```Dockerfile FROM node:16 COPY . . RUN npm install RUN npm run build``` Size: 1.2GB. **After**: ```Dockerfile FROM node:16-alpine AS builder WORKDIR /app COPY package*.json ./ RUN npm ci --only=production COPY . . RUN npm run build FROM node:16-alpine WORKDIR /app COPY --from=builder /app/dist ./dist COPY --from=builder /app/node_modules ./node_modules CMD [\"node\", \"dist/server.js\"]``` Size: 180MB. **85% reduction!** **Tools**: `docker history <image>` shows layer sizes. `dive` tool analyzes image layers interactively."
            },
            {
                question: "A container works locally but fails in production. How do you troubleshoot?",
                answer: "**Environment Parity Troubleshooting**: **1) Compare Environments**: **Docker Version**: `docker version` - Different versions can behave differently. Production might be older. **Image Tags**: Ensure same image digest (not just tag). `latest` Tag in dev might be different from production. Use `docker images --digests`. **Host OS**: Kernel versions, security modules (SELinux/AppArmor) can affect containers. **2) Check Environment Variables**: **Missing Vars**: `docker inspect <container>` and compare Env section. Production might lack DB_URL, API_KEYS. **Different Values**: Dev uses localhost:3306, prod uses rds.amazonaws.com. **Solution**: Use docker-compose or env file to ensure consistency. **3) Volume/Mount Differences**: **Permissions**: Production volume might have different owner (uid/gid mismatch). Fix with chmod/chown in entrypoint script. **Missing Volumes**: Container expects volume mounted at /data but not present in production. **Path Differences**: /app/config in dev vs /etc/myapp in prod. **4) Network Issues**: **Service Discovery**: In dev, containers communicate via links. In prod, using service mesh with different DNS. **Port Conflicts**: Port 8080 available in dev, taken by another process in prod. **Firewall/Security Groups**: Prod environment has stricter network policies. **5) Resource Constraints**: **Memory Limit**: No limit in dev, 512MB limit in prod → OOMKilled. Check with `docker stats`. **CPU Throttling**: Prod has much higher load, causing timeouts. **Disk I/O**: Production storage slower (EBS vs local SSD). **6) Configuration Differences**: **Application Config**: Different config files, feature flags, database schemas. **Secrets**: Hardcoded in dev, from Secrets Manager in prod (might fail to fetch). **7) Debugging Steps**: **A) Run exact prod image locally**: `docker pull prod-registry/app:v1.2.3 && docker run -it prod-registry/app:v1.2.3 /bin/sh`. **B) Compare configurations**: Export prod env vars to local and test. **C) Check logs**: `docker logs` in prod vs dev - spot the difference. **D) Add verbose logging**: Temporarily increase log level to DEBUG. **Real Example**: App working in dev (MacOS), failing in prod (Linux). Issue: hardcoded /Users/dev/data path exists in Mac, but /Users doesn't exist in Linux container. Solution: Environment variable for data path, set differently per environment. **Prevention**: **1) Dev-Prod Parity**: Use same base images, same env var structure, docker-compose matching prod setup. **2) CI/CD Testing**: Run tests in container matching production. **3) Image Registry**: Use same registry for dev/staging/prod (with environment-specific tags). **4) Documentation**: Document all environment-specific configurations and requirements."
            }
        ],
        concepts: [
            { term: "Multi-stage Build", definition: "Docker feature using multiple FROM statements to create optimized final images by separating build and runtime environments" },
            { term: "Image Layer", definition: "Read-only filesystem change created by each Dockerfile instruction, cached for efficient rebuilds" },
            { term: "Container Exit Code", definition: "Status code when container exits: 0=success, 1=application error, 137=OOMKilled, 139=segfault" },
            { term: ".dockerignore", definition: "File specifying patterns to exclude from build context, reducing image size and build time" }
        ],
        bestPractices: [
            "Use alpine or slim base images for smaller size",
            "Implement multi-stage builds for compiled languages",
            "Order Dockerfile instructions from least to most frequently changing",
            "Never store secrets in images, use environment variables or secrets management",
            "Use specific image tags, avoid 'latest' in production",
            "Test images in staging environment matching production"
        ],
        scenarios: [
            "Container exits immediately: Check logs with 'docker logs', verify CMD/ENTRYPOINT, run interactively to debug",
            "Large image size: Use multi-stage build, switch to alpine base, combine RUN commands, use .dockerignore",
            "Works locally, fails in prod: Compare environments, check env vars, verify volumes, test with same image digest"
        ]
    },
    "kubernetes": {
        name: "Kubernetes",
        icon: SiKubernetes,
        category: "Container Orchestration",
        color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
        topics: ["Pods", "Deployments", "Services", "CrashLoopBackOff", "Troubleshooting", "High Availability", "RBAC", "Networking"],
        questionAreas: ["Pod Troubleshooting", "Production Failures", "Deployments & Rollbacks", "Service Discovery", "Cluster Management"],
        qa: [
            {
                question: "A pod is stuck in CrashLoopBackOff. How do you troubleshoot it step by step?",
                answer: "**CrashLoopBackOff Troubleshooting Process**: **What it means**: Container crashes after starting, Kubernetes keeps restarting it with increasing delays (backoff). **Step 1 - Check Pod Status**: `kubectl get pods` shows STATUS: CrashLoopBackOff, RESTARTS: high number. `kubectl describe pod <pod-name>` shows Events with Back-off restarting failed container. **Step 2 - View Current Logs**: `kubectl logs <pod-name>` - See why current instance crashed. Common: Application error, missing env var, failed health check. **Step 3 - View Previous Logs**: `kubectl logs <pod-name> --previous` - See logs from crashed container. Often shows actual error before it died. **Step 4 - Check Container Status**: `kubectl describe pod <pod-name>` → Containers section shows Last State: Terminated, Reason: Error, Exit Code. **Exit Code 1**: Application error. **137**: Killed (OOMKilled). **139**: Segfault. **Step 5 - Interactive Debug**: If container lives briefly, exec into it: `kubectl exec -it <pod-name> -- /bin/sh`. Check: files exist, permissions correct, can connect to dependencies. **Step 6 - Check Resources**: `kubectl describe pod <pod-name>` → Resource limits. OOMKilled? Increase memory limit. **Step 7 - Review Configuration**: Check deployment YAML: **Environment Variables** - Missing DB_URL? **Image** - Correct tag? **Command/Args** - Override entrypoint correctly? **ConfigMap/Secret** - Mounted and exists? **Step 8 - Test Locally**: Pull same image, run with docker: `docker run -it <image> /bin/sh`. Isolates k8s-specific vs application issue. **Common Root Causes**: **1) Application crashes on startup** - Missing required config, can't connect to database, code bug. **2) Liveness probe failing** - App takes 2min to start, probe checks after 30s → killed prematurely. **3) Insufficient resources** - Memory limit 128Mi, app needs 256Mi → OOMKilled. **4) Wrong startup command** - CMD overridden incorrectly in deployment. **5) Missing dependencies** - Database not ready, needs init container. **Real Example**: Pod CrashLoopBackOff with Exit Code 1. Previous logs: `Error: ECONNREFUSED connect ECONNREFUSED 127.0.0.1:5432`. App trying to connect to postgres on localhost. Fix: Change DB_HOST env var from 'localhost' to 'postgres-service'. **Prevention**: Add readiness/liveness probes with appropriate delays (`initialDelaySeconds`), set proper resource limits, add init containers for dependencies, use health endpoints in application."
            },
            {
                question: "Pods are in Pending state. What are the possible reasons?",
                answer: "**Pending Pod Diagnosis**: **What Pending means**: Pod accepted by cluster but not running. Waiting for resources or conditions to be met. **Diagnostic Command**: `kubectl describe pod <pod-name>` → Events section shows reason. **Common Causes**: **1) Insufficient Resources** - **CPU/Memory**: Node doesn't have enough to satisfy pod requests. **Events**: `0/3 nodes are available: 3 Insufficient cpu`. **Solution**: Reduce requests, add more nodes, or scale down other pods. Check: `kubectl top nodes`, `kubectl describe nodes`. **2) No Nodes Match Selectors** - **nodeSelector**: Pod requires `disktype=ssd`, no nodes have that label. **Taints/Tolerations**: All nodes tainted, pod lacks toleration. **Events**: `0/3 nodes available: 3 node(s) didn't match node selector`. **Solution**: Add label to nodes or remove/adjust nodeSelector. For taints: Add toleration or remove taint from nodes. **3) PersistentVolumeClaim Pending** - Pod waits for PVC to be bound. PVC stuck because no PV available or StorageClass can't provision. **Events**: `waiting for volume to be created`. **Solution**: Check `kubectl get pvc` status. Ensure StorageClass exists and is working. For static PVs, create matching PV. **4) Image Pull Backoff** - Can't pull container image. Wrong image name, registry auth failed, network issue. **Events**: `Failed to pull image`, `ImagePullBackOff`. **Solution**: Check image name/tag, create ImagePullSecret for private registries, verify network to registry. **5) Pod Affinity/Anti-Affinity** - Pod requires to run on node with certain pods (affinity) or away from certain pods (anti-affinity), conditions not met. **Events**: `didn't match pod affinity/anti-affinity`. **Solution**: Adjust affinity rules or add more nodes to satisfy constraints. **6) Quota Exceeded** - Namespace ResourceQuota exceeded. Not allowed to create more pods or use more CPU/memory. **Events**: `exceeded quota`. **Solution**: Increase quota or clean up resources in namespace. Check: `kubectl describe resourcequota -n <namespace>`. **Debugging Steps**: **1)** `kubectl describe pod <pod>` - Read Events from bottom up. **2)** `kubectl get events --sort-by='.lastTimestamp'` - See cluster-wide recent events. **3)** `kubectl top nodes` - Check node resource utilization. **4)** `kubectl get pvc` - Check persistent volume claim status. **5)** `kubectl describe node <node>` - See node conditions, taints, allocated resources. **Real Example**: Pod pending with event: `0/5 nodes available: 2 node(s) had taint {dedicated=gpu:NoSchedule}, 3 Insufficient memory`. Means: 2 nodes are GPU-dedicated (tainted), 3 nodes don't have enough memory. Solution: Either reduce pod memory request from 8Gi to 4Gi, OR add toleration for GPU taint if pod can run on GPU nodes, OR add new nodes to cluster. **Prevention**: Set realistic resource requests/limits, monitor cluster capacity, set up cluster autoscaler, use resource quotas properly, document node labels and taints."
            },
            {
                question: "A deployment rollout failed. How do you identify the issue and roll back safely?",
                answer: "**Deployment Rollout Failure Recovery**: **Step 1 - Check Rollout Status**: `kubectl rollout status deployment/<name>` shows if rollout is stuck or progressing. `kubectl rollout history deployment/<name>` shows revision history. **Step 2 - Describe Deployment**: `kubectl describe deployment <name>` → Events section shows errors. **Conditions** section shows Progressing status. Look for: `ReplicaSetCreateError`, `ProgressDeadlineExceeded`, `MinimumReplicasUnavailable`. **Step 3 - Check ReplicaSet**: `kubectl get rs` shows multiple ReplicaSets (old and new). New RS shows 0 READY pods. `kubectl describe rs <new-rs-name>` → Events shows why pods can't start. **Step 4 - Check Pod Issues**: `kubectl get pods` shows new pods failing. Use troubleshooting from previous questions (check logs, describe pod). Common issues: Image doesn't exist, new env var missing, health check failing, database migration failed. **Step 5 - Immediate Rollback** (if critical): `kubectl rollout undo deployment/<name>` - Rolls back to previous revision immediately. Or specific revision: `kubectl rollout undo deployment/<name> --to-revision=2`. **Step 6 - Verify Rollback**: `kubectl rollout status deployment/<name>` confirms rollback complete. `kubectl get pods` shows old version running healthy. **Step 7 - Root Cause Analysis**: With service stable, investigate why new version failed. Check application logs, test image locally, verify config changes. **Understanding Rollout Mechanics**: **Progressive Rollout**: New ReplicaSet scales up while old scales down. **Max Surge**: Extra pods allowed during update (default 25%). **Max Unavailable**: Pods that can be unavailable during update (default 25%). **Progress Deadline**: Time limit for rollout (default 600s). If exceeded, rollout considered failed. **Advanced Rollback Strategies**: **1) Rollback with Pause**: `kubectl rollout undo` then `kubectl rollout pause` - Holds at specific state for testing. Resume: `kubectl rollout resume`. **2) Manual ReplicaSet Scaling**: Scale down broken RS to 0, scale up working RS to desired. Not recommended (use undo instead). **3) Deployment Recreation**: `kubectl delete deployment` and reapply old YAML. Causes downtime, only for emergency. **Prevention Strategies**: **1) Readiness Probes**: Ensure new pods pass health check before receiving traffic. **2) Progressive Rollout in Stages**: Update in stages: First deploy to staging, then canary (5% prod traffic), then full rollout. **3) Automated Rollback**: Use tools like Argo Rollouts or Flagger that automatically rollback on metric degradation. **4) Image Testing**: Test new image in staging before prod. Verify startup, connections, basic functionality. **5) Deployment Config**: `spec.progressDeadlineSeconds: 600` - Limit rollout time. `spec.minReadySeconds: 30` - Wait before considering pod ready. **Real Scenario**: Deployed v2.0 with new database schema requirement. Pods start, then crash when trying to query. Rollout stuck at 2/10 replicas. **Events**: `Waiting for rollout: 2 out of 10 replicas updated`. **Action**: `kubectl rollout undo deployment/app` → Instant rollback to v1.9. **Root Cause**: Database migration didn't run. **Fix**: Run migration as Kubernetes Job before next deployment attempt. **Best Practice**: Always have rollback plan ready, use blue-green or canary for critical services, maintain deployment history, test rollouts in staging first."
            }
        ],
        concepts: [
            { term: "CrashLoopBackOff", definition: "Pod state where container repeatedly crashes and Kubernetes restarts it with exponentially increasing delays" },
            { term: "Pending Pod", definition: "Pod accepted by cluster but not running, usually waiting for resources or conditions to be met" },
            { term: "ReplicaSet", definition: "Ensures specified number of pod replicas running, managed by Deployment for updates" },
            { term: "Rollback", definition: "Reverting deployment to previous version, can be automatic or manual using 'kubectl rollout undo'" }
        ],
        bestPractices: [
            "Always set resource requests and limits for production pods",
            "Implement readiness and liveness probes with appropriate delays",
            "Use 'kubectl rollout undo' for safe rollbacks, not manual deletion",
            "Monitor pod events with 'kubectl describe pod' for troubleshooting",
            "Test deployments in staging before production rollouts",
            "Set progressDeadlineSeconds to detect failed rollouts automatically"
        ],
        scenarios: [
            "CrashLoopBackOff: Check logs (current and previous), verify config/env vars, check resource limits for OOMKilled",
            "Pending pods: Describe pod to see events, check node resources, verify PVC status, check node selectors/taints",
            "Failed rollout: Check ReplicaSet and pod status, rollback with 'kubectl rollout undo', investigate root cause after stability"
        ]
    },
    "terraform": {
        name: "Terraform",
        icon: SiTerraform,
        category: "Infrastructure as Code",
        color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        topics: ["State Management", "Drift Detection", "Modules", "Workspaces", "Remote Backend", "Team Collaboration", "Production Best Practices"],
        questionAreas: ["State File Issues", "Drift Detection", "Multi-Environment Management", "Team Collaboration", "Production Safety"],
        qa: [
            {
                question: "Terraform apply fails halfway. What happens to your infrastructure and how do you recover?",
                answer: "**Partial Apply Failure Recovery**: **What Happens**: **1) Partially Applied** - Resources created before failure remain created. Terraform state updated for successful resources only. Failed resource not in state. **2) State Consistency** - State file reflects what actually exists (successful resources), NOT what was intended (full plan). **3) Lock Released** - State lock automatically released after ~15 minutes or on Ctrl+C. **Example Scenario**: Plan: Create VPC, Subnet, EC2, RDS. EC2 creation fails. **Result**: VPC ✅ created (in state), Subnet ✅ created (in state), EC2 ❌ failed (NOT in state), RDS ⏸️ never attempted (NOT in state). **Recovery Steps**: **Step 1 - Don't Panic**: Infrastructure is in known state (check AWS console). State file accurate for what succeeded. **Step 2 - Read Error Message**: Terraform shows clear error - often permission denied, quota exceeded, invalid parameter. **Step 3 - Fix Root Cause**: Error: `InvalidAMI.NotFound` - Fix: Update AMI ID in code. Error: `LimitExceeded` - Request service limit increase. Error: `UnauthorizedOperation` - Add IAM permission. **Step 4 - Run Apply Again**: After fix, run `terraform apply` again. Terraform is idempotent - only creates missing resources (EC2, RDS in example). Won't touch VPC/Subnet (already in state). **Step 5 - Verify State**: `terraform state list` shows all resources. `terraform plan` shows no changes (if successful). **Advanced Recovery**: **1) Partial Destroy**: If you want to remove partial infrastructure: Target specific resources: `terraform destroy -target=aws_vpc.main`. **2) State Import**: If resource created BUT not in state (rare): `terraform import aws_instance.app i-1234567890`. Adds existing resource to state. **3) State Manual Edit** (DANGEROUS, last resort): `terraform state rm <resource>` - Remove from state without destroying. `terraform state mv <old> <new>` - Rename in state. **Prevention**: **1) Use '-target' for Risky Changes**: Test single resource: `terraform apply -target=aws_instance.critical`. **2) Smaller Changesets**: Apply infrastructure in layers (network first, compute later). **3) Plan Review**: Always review `terraform plan` output before apply. Look for destroys/replaces. **4) Remote Backend with Locking**: Prevents concurrent modifications. DynamoDB lock table for S3 backend. **5) Automated Backups**: State backup before every apply. S3 versioning enabled on backend bucket. **Real Example**: Applying infrastructure for new region. EC2 instance fails because security group referenced wrong VPC. **Recovery**: Commented out EC2 block, ran `terraform apply` to create base network, fixed EC2 security group reference, ran apply again. All successful. **Critical Understanding**: Terraform tracks real-world state. Partial failure means some resources exist, some don't. Re-running apply completes the job. Never manually delete resources that are in state - use terraform destroy instead."
            },
            {
                question: "Infrastructure was changed manually in the cloud console. How do you detect and fix state drift?",
                answer: "**State Drift Detection and Remediation**: **What is Drift**: Real infrastructure doesn't match Terraform state file. Happens when changes made outside Terraform (console, CLI, other tools). **Step 1 - Detect Drift**: **A) `terraform plan`**: Shows differences between state and real infrastructure. Output example: `~ aws_instance.app: instance_type: \"t3.medium\" => \"t3.large\" (drift detected)`. **B) `terraform refresh`**: Updates state file to match reality WITHOUT making changes. Shows what drifted. **C) Terraform Cloud Drift Detection**: Runs periodic drift detection, sends alerts. **Step 2 - Analyze Drift**: Determine why drift occurred: **1) Manual Change** - Someone changed tag in console. **2) Auto Scaling** - ASG changed instance count. **3) External Tool** - Migration script modified database. **4) AWS Auto-Updates** - Security group rules added automatically. **Step 3 - Decide on Remediation**: **Option A - Accept Drift (Update Code)**: Change was intentional/needed. Update Terraform code to match reality: Edit .tf file to reflect current state. Run `terraform apply` (no changes, just confirming). **Option B - Revert Drift (Enforce Code)**: Change was accidental/unauthorized. Let Terraform revert to coded state: Run `terraform apply` - Changes infrastructure back to match code. **Option C - Import Changes**: Complex manual changes. Run `terraform import` to adopt resources into state, then `terraform plan` to see remaining drift. **Step 4 - Fix Root Cause**: **1) Access Control** - Limit console access, use permission boundaries. **2) Policy Enforcement** - AWS Config rules to detect out-of-band changes. **3) Training** - Educate team: all infrastructure changes through Terraform. **4) Change Management** - Require code review for infrastructure changes. **Example Scenarios**: **Scenario 1 - Manual Tag Addition**: Engineer added `Environment=prod` tag via console during incident. **Detection**: `terraform plan` shows tag removal. **Fix**: Add tag to Terraform code, run apply. **Scenario 2 - Auto Scaling Drift**: ASG scaled from 3 to 5 instances. **Detection**: Plan shows change from 5 to 3. **Fix**: Update desired_count in code to 5 (accept drift), OR let Terraform scale back to 3 (revert drift), OR better: use autoscaling policy in Terraform so it's dynamic. **Scenario 3 - Security Group Modified**: Manual rule added to allow port 3306 from specific IP. **Detection**: Plan shows rule will be removed. **Fix**: Move rule to Terraform code, document why needed, apply. **Advanced Drift Handling**: **1) Ignore Specific Attributes**: Use `lifecycle { ignore_changes = [tags] }` if tags managed elsewhere. **2) Import Existing**: `terraform import aws_instance.new i-existing` - Adopt manually-created resource. **3) State Recovery**: Drift includes state corruption. Restore state from backup (S3 versioning). **4) Drift Prevention Tools**: **Terraform Sentinel** (policy as code), **Terraform Cloud** (drift detection), **AWS Config** (compliance rules). **Best Practices**: **1) Regular Drift Checks**: Run `terraform plan` daily in CI/CD. Alert on drift. **2) Protected Resources**: Use `lifecycle { prevent_destroy = true }` for critical resources. **3) State Locking**: Remote backend with locking prevents concurrent changes. **4) Audit Logs**: Monitor CloudTrail for non-Terraform changes. **5) Immutable Infrastructure**: Replace instead of modify. Reduces drift opportunity. **Real Example**: RDS instance manually modified from db.t3.small to db.t3.medium during performance incident. **Drift Detection**: terraform plan shows: `~ resource \"aws_db_instance\" \"main\" { ~ instance_class = \"db.t3.medium\" -> \"db.t3.small\" }`. **Decision**: Upsize was needed. **Remediation**: Update code to db.t3.medium, run apply, document in code comments why upsized. Alert team to make future changes via Terraform."
            },
            {
                question: "Your Terraform state file got deleted or corrupted. What do you do?",
                answer: "**State File Recovery**: **Severity**: Critical! State file is source of truth. Without it, Terraform doesn't know what it manages. Loss means potential duplicate resources or inability to manage existing. **Recovery Options** (from best to worst): **Option 1 - Restore from Backup** (BEST): **Remote Backend (S3)**: Enable versioning on S3 bucket. Recover: `aws s3api list-object-versions --bucket my-tf-state`. Copy previous version to current. **Terraform Cloud**: Automatic state versioning. Restore from UI or API. **Local Backup**: If you ran `terraform state pull > backup.tfstate` before. Restore: `terraform state push backup.tfstate`. **Git**: Some teams (not recommended) commit encrypted state. Restore from git history. **Option 2 - Rebuild State via Import** (TEDIOUS): If no backup, manually import all resources. **Steps**: **1)** List all resources in cloud (AWS Console, `aws resourcegroupstaggingapi get-resources`). **2)** For each resource, run import: `terraform import aws_instance.web i-1234567890`. **3)** Import all dependencies in order (VPC first, then subnets, then instances). **4)** Run `terraform plan` - Should show no changes if imports correct. **5)** Repeat for all resources (can take hours for large infrastructure). **Example Import**: ```bash terraform import aws_vpc.main vpc-abc123 terraform import aws_subnet.public subnet-def456 terraform import aws_instance.app i-789xyz ``` **Challenges**: Must know exact resource identifiers (instance IDs, ARNs). Must import in dependency order. Time-consuming for 100s of resources. **Option 3 - Recreate from Scratch** (RISKY/DOWNTIME): Extreme measure if imports too complex and no backup. **Steps**: **1)** Document all existing infrastructure (screenshots, exports). **2)** `terraform destroy` from empty state (won't work - no state to destroy from). **3)** Manually delete resources in console (or leave orphaned). **4)** `terraform apply` creates fresh infrastructure. **Risk**: Data loss (RDS databases deleted), downtime during recreation, IP changes, resource ID changes breaking integrations. **Prevention Strategies** (Critical!): **1) Remote Backend with Versioning**: ```hcl terraform { backend \"s3\" { bucket = \"my-tf-state\" key = \"prod/terraform.tfstate\" encrypt = true dynamodb_table = \"terraform-locks\" region = \"us-east-1\" versioning = true } } ``` S3 versioning = automatic state history. **2) Automated State Backups**: Pre-apply hook: `terraform state pull > backups/state-$(date +%Y%m%d-%H%M%S).tfstate`. Cron job for daily state backup to separate storage. **3) State File Protection**: `.gitignore` includes `*.tfstate*` (never commit to git). S3 bucket: encryption enabled, versioning enabled, MFA delete enabled, restricted access. **4) Immutable State Storage**: Write-once backup to Glacier after each apply. **5) Disaster Recovery Testing**: Quarterly: Test state restore from backup. Verify imported resources match reality. **Real Incident Response**: **Scenario**: Teammate accidentally ran `rm terraform.tfstate` on local machine. **Impact**: State file deleted, remote backend wasn't configured. **Recovery**: **1)** Checked S3 (no remote backend). **2)** Checked git history (not committed). **3)** Manual import required. **4)** Listed resources: 1 VPC, 3 subnets, 5 EC2, 2 RDS, 4 security groups, 1 ALB. **5)** Import process (3 hours): Started with `terraform import aws_vpc.main vpc-123`, then subnets, then instances, then everything else. **6)** Final `terraform plan` showed 2 minor drifts (tags added manually after last apply). **7)** Applied fixes, infrastructure now fully managed again. **Lesson**: Immediately configured S3 remote backend with versioning and DynamoDB locking. **Critical Takeaway**: **Prevention >> Recovery**. Always use remote backend with versioning. State file is MOST CRITICAL file in Terraform - protect it like production database."
            }
        ],
        concepts: [
            { term: "State File", definition: "JSON file tracking real-world resources managed by Terraform, critical for drift detection and updates" },
            { term: "Drift", definition: "Difference between Terraform state and actual infrastructure due to out-of-band changes" },
            { term: "Remote Backend", definition: "Storage location for state file (S3, Terraform Cloud) enabling team collaboration and automatic backups" },
            { term: "State Locking", definition: "Prevents concurrent Terraform runs from corrupting state, typically using DynamoDB or Terraform Cloud" }
        ],
        bestPractices: [
            "Always use remote backend (S3/Terraform Cloud) with versioning enabled",
            "Enable state locking with DynamoDB to prevent concurrent modifications",
            "Run 'terraform plan' before 'apply' to review changes and detect drift",
            "Never manually edit infrastructure, always use Terraform for changes",
            "Back up state file before major changes",
            "Use workspaces or separate state files for different environments"
        ],
        scenarios: [
            "Apply fails halfway: Fix error and rerun apply - Terraform resumes from where it failed, using state file to track progress",
            "Manual console changes (drift): Run 'terraform plan' to see drift, decide to update code or revert infrastructure",
            "State file lost: Restore from S3 version, or manually import all resources using 'terraform import' (last resort)"
        ]
    },
    "jenkins": {
        name: "Jenkins",
        icon: FaJenkins,
        category: "CI/CD Tools",
        color: "bg-red-500/10 text-red-500 border-red-500/20",
        topics: ["Pipelines", "Job Failures", "Performance", "Secrets Management", "Zero-Downtime Deployments", "Distributed Builds"],
        questionAreas: ["Pipeline Debugging", "Performance Optimization", "Security Best Practices", "Deployment Strategies", "Scaling Jenkins"],
        qa: [
            {
                question: "A Jenkins job is failing, but it works fine when run manually. How do you debug?",
                answer: "**Pipeline vs Manual Execution Debugging**: **Common Causes**: **1) Environment Differences**: **PATH Variable**: Manual session has different PATH. Jenkins can't find `npm`, `docker`, or other commands. **Fix**: Add to Jenkinsfile: `environment { PATH = \"/usr/local/bin:$PATH\" }`. Or use absolute paths: `/usr/local/bin/npm install`. **Environment Variables**: Manual has .bashrc loaded. Jenkins doesn't. Variables like JAVA_HOME, MAVEN_HOME missing. **Fix**: Set in Jenkinsfile: `environment { JAVA_HOME = \"/usr/lib/jvm/java-11\" }` or Configure System global properties. **Working Directory**: Manual runs from correct dir. Jenkins runs from workspace root. **Fix**: Use `dir('subdir') { ... }` or `cd subdir && command`. **2) Permissions Issues**: **File Permissions**: Manual runs as user with ownership. Jenkins runs as jenkins user without permissions. **Fix**: `chmod` files during build, or adjust Jenkins user permissions: `sudo chown -R jenkins:jenkins /path`. **Docker Socket**: Manual user in docker group. Jenkins user not. **Fix**: Add jenkins user to docker group: `sudo usermod -aG docker jenkins`. **SSH Keys**: Manual uses git via HTTPS or personal SSH. Jenkins needs deploy key. **Fix**: Add SSH credentials in Jenkins, use in pipeline: `git credentialsId: 'github-deploy-key'`. **3) Resource Constraints**: **Memory**: Manual has plenty of memory. Jenkins has Java heap limits. **Fix**: Increase Jenkins heap: `JAVA_OPTS=\"-Xmx2048m\"` in jenkins config. **CPU**: Jenkins node under high load running multiple jobs. **Fix**: Limit concurrent builds, add more agents. **Disk Space**: Jenkins workspace full from old builds. **Fix**: Add `cleanWs()` step, configure disk cleanup policies. **4) Timing/Race Conditions**: **Async Operations**: Manual waits patiently. Jenkins times out. **Fix**: Increase timeout: `timeout(time: 30, unit: 'MIN') { ... }`. **Network Calls**: Manual retries failed network calls. Jenkins doesn't. **Fix**: Add retry logic: `retry(3) { sh 'curl https://api...' }`. **5) Missing Dependencies**: **Global Tools**: Manual has node/maven installed globally. Jenkins node doesn't. **Fix**: Install tools on agent, or use Docker agent with tools: `agent { docker 'node:16' }`. **Credentials**: Manual has AWS credentials in ~/.aws. Jenkins doesn't. **Fix**: Add AWS credentials to Jenkins, use withAWS plugin. **Debugging Steps**: **1) Check Console Output**: Read full log. Look for \"command not found\", \"permission denied\", \"timeout\". **2) Add Debug Logging**: Add `sh 'env'` to see all env vars. Add `sh 'pwd && ls -la'` to see filesystem state. Add `sh 'which docker && docker --version'` to verify tools. **3) Run Same Commands**: SSH into Jenkins agent. Run exact same commands as jenkins user: `sudo su - jenkins`, `cd /var/lib/jenkins/workspace/my-job`, `./build.sh`. **4) Compare Environments**: Manual: `env > manual.txt`. Jenkins: `sh 'env > jenkins.txt'`. Compare files: `diff manual.txt jenkins.txt`. **5) Test Interactively**: Use Jenkins Script Console for quick tests: `println \"ls -la\".execute().text`. **Real Example**: **Scenario**: `npm install` works manually, fails in Jenkins with \"npm: command not found\". **Root Cause**: Jenkins PATH doesn't include /usr/local/bin where npm installed. **Debug**: In Jenkinsfile, added `sh 'echo $PATH'`. Showed PATH missing npm location. **Fix**: ```groovy pipeline { agent any environment { PATH = \"/usr/local/bin:$PATH\" } stages { stage('Build') { steps { sh 'npm install' } } } } ``` **Prevention**: **1) Use Docker Agents**: All dependencies in container image (node:16, maven:3.8). Consistent between developers and CI. **2) Declarative Environment**: All env vars in Jenkinsfile, not relying on system config. **3) Tool Management**: Jenkins Global Tool Configuration manages Java, Maven, Node versions. **4) Credentials Plugin**: Centralized secret management, no reliance on filesystem credentials."
            },
            {
                question: "Jenkins pipeline suddenly became slow. What could be the reasons?",
                answer: "**Jenkins Performance Degradation Analysis**: **Diagnostic Steps**: **1) Identify Bottleneck**: Check which stage is slow: Pipeline stage view shows time per stage. Console output shows timestamps. **2) Check Jenkins Master Load**: **Dashboard**: Manage Jenkins → System Information → Available Memory, CPU. **System Metrics**: `top` on Jenkins server shows CPU/memory usage. **Build Queue**: Many builds waiting = resource saturation. **Possible Causes & Solutions**: **1) Master Overload**: **Symptom**: Dashboard slow, job starts delayed, UI unresponsive. **Cause**: Too many jobs on master, large plugin count, insufficient heap. **Fix**: Increase Java heap: `JAVA_OPTS=\"-Xmx4096m -Xms2048m\"`. Move builds to agents (don't run on master). Disable/remove unused plugins. Upgrade Jenkins to latest (performance improvements). **2) Agent Issues**: **Symptom**: Specific agent's jobs slow, others normal. **Cause**: Agent underpowered, high disk I/O, network latency. **Fix**: Check agent resources: `ssh agent && top && df -h`. Add more agents or upgrade existing (more CPU/RAM). Use local cache for dependencies (Maven/npm cache). **3) Build Queue Saturation**: **Symptom**: Jobs wait in queue, take hours to start. **Cause**: All agents busy, more jobs than capacity. **Fix**: Add more agents. Limit concurrent builds per project. Use priorities (Priority Sorter plugin). Cancel old/stuck builds. **4) Checkpoint/Workspace Issues**: **Symptom**: \"Preparing workspace\" takes forever. **Cause**: Huge workspace, slow NFS/network storage. **Fix**: Add `cleanWs()` to clean workspace before build. Use faster storage (local SSD vs NFS). Add `.gitignore` to exclude large files. Sparse checkout for large repos. **5) Network Bottlenecks**: **Symptom**: Downloading dependencies takes long. **Cause**: Slow internet, external registry throttling, no caching. **Fix**: Set up local artifact repository (Nexus/Artifactory). Maven/npm configured to use local mirror. Docker registry mirror/cache. **6) SCM Checkout Slowness**: **Symptom**: Code checkout stage takes long. **Cause**: Large repository, no shallow clone, network slow. **Fix**: Shallow clone:`checkout([$class: 'GitSCM', extensions: [[$class: 'CloneOption', depth: 1, shallow: true]]])`. Sparse checkout (only needed subdirectories). Use faster Git protocol (SSH vs HTTPS). **7) Build Script Issues**: **Symptom**: Specific command within build is slow. **Cause**: Inefficient build process, unnecessary steps, no parallelization. **Fix**: Parallel stages: ```groovy parallel { stage('Test') { steps { sh 'npm test' } } stage('Lint') { steps { sh 'npm run lint' } } } ``` Incremental builds (only build changed modules). Cache dependencies between builds. **8) Plugin Performance**: **Symptom**: Slow after plugin update. **Cause**: Buggy/inefficient plugin version. **Fix**: Check plugin changelog for known issues. Downgrade to stable version. Report to plugin maintainers. **9) Database/Logs Growth**: **Symptom**: Jenkins getting slower over time. **Cause**: Huge build history, large console logs. **Fix**: Configure log rotation: Keep max 10 builds, 30 days. Clean up old workspaces. Vacuum/optimize database (if using external DB). **10) Test Execution Time**: **Symptom**: Test stage suddenly slow. **Cause**: Test suite grew, flaky tests retrying, resource contention. **Fix**: Parallelize tests across agents. Split test suites. Optimize slow tests. Remove/skip flaky tests temporarily. **Comparison Metrics**: **Before (Fast)**: Total: 5min = Checkout(30s) + Install(1min) + Build(2min) + Test(1min) + Deploy(30s). **After (Slow)**: Total: 25min = Checkout(5min) + Install(10min) + Build(2min) + Test(7min) + Deploy(1min). **Analysis**: Checkout & Install became bottlenecks. **Real Example**: **Scenario**: Pipeline increased from 8min to 45min over 2 months. **Investigation**: Stage View showed \"npm install\" went from 1min to 35min. **Root Cause**: npm registry (npmjs.com) rate limiting CI builds. **Solution**: Set up local Verdaccio npm proxy. Configured .npmrc to use proxy. Install time back to 1min. Also added node_modules caching between builds. **Monitoring Tools**: **1) Jenkins Monitoring Plugin**: Tracks response times, memory, CPU over time. **2) Pipeline Stage View**: Visual timeline of stage durations. **3) Blue Ocean**: Modern UI with better performance visibility. **4) Build Time Trend Plugin**: Graphs showing build duration trends. **Best Practices**: Run builds on agents, never master. Use lightweight executors (5-10 concurrent builds per agent). Regular cleanup of old builds and workspaces. Monitor and alert on build time increase (>20% triggers investigation). Use declarative pipeline with parallel stages. Cache dependencies locally."
            }
        ],
        concepts: [
            { term: "Jenkins Agent", definition: "Worker node that executes builds, separating build execution from Jenkins master for better performance" },
            { term: "Pipeline", definition: "Script defining automated build/test/deploy process, written in Groovy using Declarative or Scripted syntax" },
            { term: "Workspace", definition: "Directory on agent where source code is checked out and build happens, should be cleaned regularly" },
            { term: "Build Queue", definition: "Queue of pending builds waiting for available executor/agent resources" }
        ],
        bestPractices: [
            "Never run builds on Jenkins master, always use agents",
            "Clean workspace before/after builds to avoid disk space issues",
            "Use local artifact caching (Nexus/Artifactory) to speed up dependency downloads",
            "Implement parallel stages for independent tasks (tests, lint, build)",
            "Set up build log rotation to keep max 10-30 builds",
            "Monitor build times and set up alerts for performance degradation"
        ],
        scenarios: [
            "Job fails in Jenkins, works manually: Check PATH differences, environment variables, permissions, run as jenkins user to reproduce",
            "Slow pipeline: Identify bottleneck stage, check agent load, add parallel stages, set up local artifact cache",
            "Build queue backed up: Add more agents, limit concurrent builds, prioritize critical jobs, cancel stuck builds"
        ]
    },
    "ansible": {
        name: "Ansible",
        icon: SiAnsible,
        category: "Configuration Management",
        color: "bg-gray-500/10 text-gray-500 border-gray-500/20",
        topics: ["Playbooks", "Inventory", "Roles", "Handlers", "Vault", "Idempotency", "Templates"],
        questionAreas: ["Playbook Structure", "Secrets Management", "Deployment Scenarios", "Scaling", "Best Practices"],
        qa: [
            {
                question: "Explain playbook structure and idempotency in Ansible",
                answer: "**Ansible Playbook Structure**: **Basic Structure**: ```yaml --- - name: Configure Web Servers hosts: webservers become: yes vars: nginx_port: 80 tasks: - name: Install Nginx apt: name: nginx state: present - name: Start Nginx service: name: nginx state: started enabled: yes handlers: - name: Restart Nginx service: name: nginx state: restarted ``` **Components**: **1) Hosts** - Which servers to target (from inventory). **2) become** - Run as sudo/root. **3) vars** - Variables for this playbook. **4) tasks** - Ordered list of actions. **5) handlers** - Triggered by `notify`, run at end. **Idempotency Explained**: **What it is**: Running playbook multiple times produces same result. State-driven (desired state), not command-driven. **Why it matters**: Safe to rerun playbooks. Apply changes only when needed. No duplication or errors on repeat runs. **Example - Idempotent**: ```yaml - name: Create user user: name: deploy state: present shell: /bin/bash ``` Running first time: Creates user. Running again: No change (user already exists). Running 100 times: Still no change. **Example - NOT Idempotent**: ```yaml - name: Append to file shell: echo 'config line' >> /etc/app.conf ``` Running first time: Adds line. Running again: Adds duplicate line. Running 100 times: 100 duplicate lines! **Fix (make idempotent)**: ```yaml - name: Ensure config line lineinfile: path: /etc/app.conf line: 'config line' state: present ``` Now idempotent - line added once, no duplicates. **Modules vs Shell Commands**: **Idempotent Modules**: apt, yum, user, file, service, copy, template, lineinfile. Check current state before changing. **Non-Idempotent**: shell, command (run every time). **When to use shell**: No module exists for your need. Use with `creates`/`removes` for idempotency: ```yaml - name: Extract archive shell: tar xzf app.tar.gz creates: /opt/app/extracted ``` Runs only if /opt/app/extracted doesn't exist. **Testing Idempotency**: Run playbook twice: `ansible-playbook playbook.yml`, `ansible-playbook playbook.yml` (again). Second run should show: `changed=0`. All tasks green (ok), none yellow (changed). **Best Practices**: **1) Use native modules** over shell when possible. **2) Check mode** to test: `ansible-playbook playbook.yml --check`. **3) Tags** for partial runs: `--tags=nginx`. **4) Limit blast radius**: `--limit webserver1`. **Real-World Example**: **Setup Web Application**: ```yaml--- - hosts: app_servers become: yes roles: - common - nginx - application tasks: - name: Deploy app package: src: /tmp/app-v2.0.tar.gz dest: /var/www/app notify: Reload Nginx - name: Ensure app service running systemd: name: myapp state: started enabled: yes handlers: - name: Reload Nginx systemd: name: nginx state: reloaded ``` **First Run**: Installs nginx, copies files, starts services. Changes: 10. **Second Run**: Everything already in desired state. Changes: 0. **Third Run (after manual changes)**: Detects drift (file modified), restores desired state. Changes: 1. This is idempotency in action - reliable, predictable automation."
            },
            {
                question: "How do you use Ansible Vault for secrets management?",
                answer: "**Ansible Vault for Secrets**: **What is Vault**: Built-in encryption for sensitive data (passwords, keys, tokens). Encrypted files stored in version control safely. Only decrypted during playbook run with password. **Creating Encrypted Files**: **1) Create new encrypted file**: `ansible-vault create secrets.yml`. Opens editor, encrypts on save. **2) Encrypt existing file**: `ansible-vault encrypt vars/database.yml`. **3) View encrypted file**: `ansible-vault view secrets.yml`. Doesn't modify, just shows content. **4) Edit encrypted file**: `ansible-vault edit secrets.yml`. Decrypts, opens editor, re-encrypts. **5) Decrypt file** (not recommended for production): `ansible-vault decrypt secrets.yml`. **Using Vault in Playbooks**: **Example secrets.yml** (encrypted): ```yaml db_password: SuperSecret123! api_key: ABC123XYZ456 ``` **Playbook usage**: ```yaml --- - hosts: webservers vars_files: - secrets.yml tasks: - name: Create database postgresql_user: name: appuser password: \"{{ db_password }}\" ``` **Running with Vault**: **Interactive password**: `ansible-playbook site.yml --ask-vault-pass`. Prompts for password. **Password file**: `ansible-playbook site.yml --vault-password-file ~/.vault_pass`. Reads password from file. **Environment variable**: `export ANSIBLE_VAULT_PASSWORD_FILE=~/.vault_pass`, then `ansible-playbook site.yml`. **Multiple Vault IDs** (different passwords for different files): **Create with ID**: `ansible-vault create --vault-id prod@prompt secrets_prod.yml`. **Run with multiple IDs**: `ansible-playbook site.yml --vault-id dev@prompt --vault-id prod@~/.vault_prod_pass`. **Best Practices**: **1) Separate secrets from playbooks**: Store in vars/secrets.yml. Include with vars_files. Allows different secrets per environment. **2) Encrypt specific variables**: Instead of entire file: ```yaml user: deploy password: !vault | $ANSIBLE_VAULT;1.1;AES256 ... ``` Use `ansible-vault encrypt_string`: `ansible-vault encrypt_string 'SuperSecret' --name 'db_password'`. **3) Version control**: Commit encrypted files safely to Git. Store vault password externally (never commit vault password). **4) CI/CD Integration**: Store vault password in CI secret store (GitHub Secrets, Jenkins Credentials). Pass via environment variable or temp file. **5) Key rotation**: Rekey encrypted files: `ansible-vault rekey secrets.yml`. Updates encryption with new password. **6) Least privilege**: Different vault IDs for dev/staging/prod. Team members only have passwords for their environment. **Security Considerations**: **Password storage**: Use password manager (1Password, LastPass). Or secrets backend (HashiCorp Vault, AWS Secrets Manager). **File permissions**: `chmod 600 ~/.vault_pass` - only owner can read. **Audit**: Log vault access in CI/CD.Track who has vault passwords. **Real-World Example**: **Directory structure**: ``` inventory/ production.ini staging.ini group_vars/ all.yml webservers/ all.yml secrets.yml (encrypted) database/ all.yml secrets.yml (encrypted) ``` **group_vars/webservers/secrets.yml** (encrypted): ```yaml db_host: prod-db.example.com db_password: !vault|$ANSIBLE_VAULT;... ssl_cert_path: /etc/ssl/certs/app.crt ssl_key_content: !vault|$ANSIBLE_VAULT;... ``` **Playbook**: ```yaml - name: Deploy web application hosts: webservers tasks: - name: Configure database connection template: src: database.conf.j2 dest: /etc/app/database.conf vars: db_user: readonly db_password: \"{{ db_password }}\" ``` **Run**: `ansible-playbook -i inventory/production.ini deploy.yml --vault-password-file ~/.vault_prod_pass`. **Benefits**: Secrets encrypted in Git. Different passwords per environment. Developers can't see production secrets. Automated deployments work via stored vault password. **Alternative**: For enterprise, integrate with external secrets manager: ```yaml - name: Get secret from AWS Secrets Manager set_fact: db_password: \"{{ lookup('aws_secret', 'prod/db/password') }}\" ``` Provides centralized secrets, automatic rotation, audit logs. Ansible Vault good for small/medium teams, external secrets manager better for large enterprises."
            }
        ],
        concepts: [
            { term: "Idempotency", definition: "Property where running a playbook multiple times produces the same result without unwanted side effects" },
            { term: "Ansible Vault", definition: "Built-in encryption tool for protecting sensitive data like passwords and keys in playbooks" },
            { term: "Handler", definition: "Task triggered by notify directive, typically used for service restarts, runs once at end of playbook" },
            { term: "Role", definition: "Reusable collection of tasks, variables, handlers organized in standard structure for common configurations" }
        ],
        bestPractices: [
            "Use native Ansible modules instead of shell commands for idempotency",
            "Encrypt all secrets with ansible-vault, never commit plain text passwords",
            "Organize playbooks with roles for reusability across projects",
            "Test playbooks in check mode before applying to production",
            "Use version control for all playbooks and inventory files",
            "Separate secrets into different vault files per environment"
        ],
        scenarios: [
            "Deploying application: Use roles for common tasks (nginx, app), vault for secrets, handlers for service restarts",
            "Managing secrets: Create encrypted vars file with ansible-vault, use --vault-password-file in CI/CD",
            "Ensuring idempotency: Run playbook twice, verify second run shows changed=0, use creates/removes with shell commands"
        ]
    },
    "github-actions": {
        name: "GitHub Actions",
        icon: SiGithubactions,
        category: "CI/CD Tools",
        color: "bg-slate-500/10 text-slate-500 border-slate-500/20",
        topics: ["Workflows", "Runners", "Secrets", "Caching", "Matrix Builds", "Reusable Workflows"],
        questionAreas: ["Workflow Design", "Performance Optimization", "Security", "Advanced Patterns"],
        qa: [
            {
                question: "What are GitHub Actions workflows and how do you structure them?",
                answer: "**GitHub Actions Overview**: **What it is**: CI/CD platform integrated with GitHub. Automate build, test, deploy on events (push, PR, schedule). **Workflow Structure**: **Location**: `.github/workflows/ci.yml` (any .yml in .github/workflows/). **Basic Example**: ```yaml name: CI Pipeline on: [push, pull_request] # Trigger events jobs: build: runs-on: ubuntu-latest # Runner type steps: - uses: actions/checkout@v3 # Clone repo - name: Setup Node uses: actions/setup-node@v3 with: node-version: '16' - name: Install dependencies run: npm ci - name: Run tests run: npm test - name: Build run: npm run build ``` **Key Components**: **1) name** - Workflow display name. **2) on** - Trigger events (push, pull_request, schedule, workflow_dispatch). **3) jobs** - Parallel or sequential tasks. **4) runs-on** - Runner OS (ubuntu-latest, windows-latest, macos-latest, self-hosted). **5) steps** - Sequential actions within a job. **Advanced Patterns**: **Matrix Builds** - Test multiple versions: ```yaml jobs: test: strategy: matrix: node: [14, 16, 18] os: [ubuntu-latest, windows-latest] runs-on: ${{ matrix.os }} steps: - uses: actions/setup-node@v3 with: node-version: ${{ matrix.node }} - run: npm test ``` Runs 6 jobs (3 node versions × 2 OSes). **Job Dependencies**: ```yaml jobs: build: runs-on: ubuntu-latest steps: - run: npm run build test: needs: build # Waits for build to complete runs-on: ubuntu-latest steps: - run: npm test ``` **Conditional Execution**: ```yaml - name: Deploy to production if: github.ref == 'refs/heads/main' && github.event_name == 'push' run: ./deploy-prod.sh ``` Runs only on main branch pushes. **Secrets Management**: ```yaml - name: Deploy env: AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }} AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET }} run: aws s3 sync ./build s3://my-bucket ``` Secrets stored in repo settings → Secrets and variables. **Caching Dependencies**: ```yaml - uses: actions/cache@v3 with: path: ~/.npm key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }} - run: npm ci ``` Speeds up builds by caching node_modules. **Reusable Workflows**: **Called workflow (.github/workflows/deploy.yml)**: ```yaml on: workflow_call: inputs: environment: required: true type: string jobs: deploy: runs-on: ubuntu-latest steps: - run: echo Deploying to ${{ inputs.environment }} ``` **Caller workflow**: ```yaml jobs: deploy-prod: uses: ./.github/workflows/deploy.yml with: environment: production ``` **Real-World Example**: **E-commerce Site CI/CD**: ```yaml name: E-commerce Pipeline on: push: branches: [main, develop] pull_request: branches: [main] env: NODE_VERSION: '16' jobs: lint: runs-on: ubuntu-latest steps: - uses: actions/checkout@v3 - uses: actions/setup-node@v3 with: node-version: ${{ env.NODE_VERSION }} - run: npm ci - run: npm run lint test: runs-on: ubuntu-latest strategy: matrix: node: [14, 16, 18] steps: - uses: actions/checkout@v3 - uses: actions/setup-node@v3 with: node-version: ${{ matrix.node }} - uses: actions/cache@v3 with: path: ~/.npm key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }} - run: npm ci - run: npm test build: needs: [lint, test] runs-on: ubuntu-latest steps: - uses: actions/checkout@v3 - uses: actions/setup-node@v3 with: node-version: ${{ env.NODE_VERSION }} - run: npm ci - run: npm run build - uses: actions/upload-artifact@v3 with: name: build-output path: ./dist deploy: needs: build if: github.ref == 'refs/heads/main' runs-on: ubuntu-latest steps: - uses: actions/download-artifact@v3 with: name: build-output path: ./dist - name: Deploy to AWS env: AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }} AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET }} run: | aws s3 sync ./dist s3://prod-bucket aws cloudfront create-invalidation --distribution-id E123 --paths '/*' ``` **Flow**: PR → Lint + Test (matrix) → ✅. Push to main → Lint + Test + Build → Deploy to prod. **Best Practices**: **1) Use specific action versions** - `actions/checkout@v3`, not `@main`. **2) Minimize workflow runs** - Paths filter: `on: push: paths: ['src/**']`. **3) Secrets never in logs** - Don't `echo \"$SECRET\"`, use mask: `echo \"::add-mask::$SECRET\"`. **4) Self-hosted runners for speed** - Faster than GitHub-hosted, with caching. **5) YAML anchors** not supported - Use composite actions for reuse instead."
            }
        ],
        concepts: [
            { term: "Workflow", definition: "Automated process defined in YAML, triggered by events like push, PR, or schedule" },
            { term: "Runner", definition: "Server that executes workflows, can be GitHub-hosted (ubuntu/windows/mac) or self-hosted" },
            { term: "Matrix Build", definition: "Strategy to run job across multiple versions/OSes in parallel, useful for compatibility testing" },
            { term: "Reusable Workflow", definition: "Workflow that can be called from other workflows, promotes DRY principle in CI/CD" }
        ],
        bestPractices: [
            "Use actions/cache to speed up builds by caching dependencies",
            "Pin action versions to specific tags (@v3, not @main) for stability",
            "Store all secrets in repository/organization secrets, never hardcode",
            "Use matrix builds to test across multiple Node/Python/OS versions",
            "Implement path filters to avoid unnecessary workflow runs",
            "Use reusable workflows for common patterns across repositories"
        ],
        scenarios: [
            "Full CI/CD: Lint → Test (matrix) → Build → Deploy (conditional on main branch)",
            "Matrix testing: Test app on Node 14/16/18 and ubuntu/windows/mac in parallel (9 jobs)",
            "Caching: Cache node_modules with key based on package-lock.json hash for faster installs"
        ]
    }
};

const ToolDetail = () => {
    const { toolSlug } = useParams<{ toolSlug: string }>();
    const tool = toolSlug ? toolsData[toolSlug as keyof typeof toolsData] : null;

    if (!tool) {
        return <Navigate to="/interview-prep" replace />;
    }

    const ToolIcon = tool.icon;

    return (
        <main className="overflow-x-hidden">
            {/* Header */}
            <section className="py-12 bg-background/80 border-b border-border/50">
                <div className="container mx-auto px-4">
                    <Link to="/interview-prep">
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Interview Prep
                        </Button>
                    </Link>

                    <div className="flex flex-col items-center text-center gap-6">
                        <div className={`p-4 rounded-2xl ${tool.color}`}>
                            <ToolIcon className="w-12 h-12" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                <span className="text-gradient">{tool.name} Interview Preparation</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                Production scenarios with comprehensive, senior-level answers
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3">
                            <Badge variant="outline" className="px-4 py-2 border-primary/30">
                                {tool.category}
                            </Badge>
                            <Badge variant="outline" className="px-4 py-2 border-primary/30">
                                {tool.qa.length} Q&A
                            </Badge>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Topics */}
            <section className="py-12 bg-background/50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Code className="w-5 h-5 text-primary" />
                        Key Topics
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {tool.topics.map((topic) => (
                            <Badge key={topic} variant="outline" className="px-4 py-2 text-sm border-primary/20">
                                {topic}
                            </Badge>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interview Areas */}
            <section className="py-12 bg-background/80">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Common Interview Areas
                    </h2>
                    <ul className="grid md:grid-cols-2 gap-4">
                        {tool.questionAreas.map((area) => (
                            <li key={area} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span className="text-lg">{area}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Q&A Section */}
            <section className="py-12 bg-background/50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        Production Scenarios & Interview Questions ({tool.qa.length})
                    </h2>
                    <Accordion type="multiple" className="space-y-4">
                        {tool.qa.map((item, idx) => (
                            <Card key={idx} className="card-gradient border-border/50 p-6">
                                <AccordionItem value={`qa-${idx}`} className="border-none">
                                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                                        <div className="flex items-start gap-3">
                                            <span className="text-primary font-bold flex-shrink-0">{idx + 1}.</span>
                                            <span>{item.question}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="mt-4 pl-8 text-muted-foreground leading-relaxed">
                                            {formatAnswer(item.answer)}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Card>
                        ))}
                    </Accordion>
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
        </main>
    );
};

export default ToolDetail;
