/**
 * Run: node scripts/seed-k8s-blog.mjs
 * Inserts a comprehensive Kubernetes blog post into MongoDB.
 */
import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
const envPath = resolve(__dirname, "../.env");
const env = Object.fromEntries(
  readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
    .filter(([k]) => k)
);

const MONGODB_URI   = env.MONGODB_URI;
const DB_NAME       = env.MONGODB_DATABASE  || "portfolio";
const COLLECTION    = env.MONGODB_COLLECTION || "blogPosts";

if (!MONGODB_URI) { console.error("MONGODB_URI not set in .env"); process.exit(1); }

// ── Kubernetes blog content blocks ────────────────────────────────────────────
const blocks = [
  { type: "text", value: `<h2>What is Kubernetes?</h2><p>Kubernetes (K8s) is an open-source container orchestration platform that automates deploying, scaling, and managing containerized applications. Originally developed by Google, it is now maintained by the CNCF.</p><blockquote><strong>Core idea:</strong> You describe the desired state → Kubernetes makes it happen and keeps it that way.</blockquote>` },

  { type: "text", value: `<h2>Key Concepts</h2><ul><li><strong>Cluster</strong> — A set of nodes (machines) managed by Kubernetes</li><li><strong>Node</strong> — A worker machine (VM or physical) that runs Pods</li><li><strong>Pod</strong> — Smallest deployable unit; wraps one or more containers</li><li><strong>Namespace</strong> — Virtual cluster inside a cluster (isolation)</li><li><strong>Control Plane</strong> — Brain of K8s: API Server, Scheduler, etcd, Controller Manager</li></ul>` },

  { type: "text", value: `<h2>🛠 Installation — Zero to Running</h2><h3>1. Install kubectl (CLI)</h3><pre><code># Linux
curl -LO "https://dl.k8s.io/release/$(curl -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl && sudo mv kubectl /usr/local/bin/

# macOS
brew install kubectl

# Windows (choco)
choco install kubernetes-cli

# Verify
kubectl version --client</code></pre>` },

  { type: "text", value: `<h3>2. Local Cluster Options</h3><pre><code># Option A: Minikube (easiest for beginners)
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube start --driver=docker

# Option B: kind (Kubernetes IN Docker)
go install sigs.k8s.io/kind@latest
kind create cluster --name my-cluster

# Option C: k3s (lightweight, production-grade)
curl -sfL https://get.k3s.io | sh -</code></pre>` },

  { type: "text", value: `<h2>📋 Essential kubectl Commands</h2><h3>Cluster Info</h3><pre><code>kubectl cluster-info                   # cluster endpoint info
kubectl get nodes                      # list all nodes
kubectl get nodes -o wide              # with IP and OS info
kubectl describe node &lt;node-name&gt;     # detailed node info
kubectl top nodes                      # CPU/Memory usage</code></pre>` },

  { type: "text", value: `<h3>Namespaces</h3><pre><code>kubectl get namespaces                        # list all namespaces
kubectl create namespace dev                  # create namespace
kubectl config set-context --current --namespace=dev  # switch default ns
kubectl get all -n kube-system                # view system pods
kubectl delete namespace dev                  # delete namespace</code></pre>` },

  { type: "text", value: `<h3>Pods — The Basics</h3><pre><code># Run a pod instantly (imperative)
kubectl run nginx --image=nginx --port=80

# List pods
kubectl get pods
kubectl get pods -A                           # all namespaces
kubectl get pods -o wide                      # with node + IP
kubectl get pods --watch                      # live updates

# Inspect
kubectl describe pod &lt;name&gt;
kubectl logs &lt;pod-name&gt;
kubectl logs &lt;pod-name&gt; -f                   # follow logs
kubectl logs &lt;pod-name&gt; -c &lt;container&gt;       # specific container

# Execute into pod
kubectl exec -it &lt;pod-name&gt; -- /bin/bash
kubectl exec -it &lt;pod-name&gt; -- sh

# Delete
kubectl delete pod &lt;name&gt;
kubectl delete pod &lt;name&gt; --grace-period=0 --force</code></pre>` },

  { type: "text", value: `<h2>📦 Workloads</h2><h3>Deployment (most common workload)</h3><pre><code># Create deployment imperatively
kubectl create deployment my-app --image=nginx:1.25 --replicas=3

# From YAML
cat &lt;&lt;EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: nginx:1.25
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
EOF</code></pre>` },

  { type: "text", value: `<h3>Deployment Operations</h3><pre><code># Scale
kubectl scale deployment my-app --replicas=5

# Rolling update (zero downtime)
kubectl set image deployment/my-app app=nginx:1.26

# Watch rollout
kubectl rollout status deployment/my-app

# Rollback
kubectl rollout undo deployment/my-app
kubectl rollout undo deployment/my-app --to-revision=2
kubectl rollout history deployment/my-app

# Pause / Resume rollout
kubectl rollout pause deployment/my-app
kubectl rollout resume deployment/my-app</code></pre>` },

  { type: "text", value: `<h3>Other Workload Types</h3><pre><code># DaemonSet — runs on EVERY node (e.g. log collectors, monitoring agents)
# StatefulSet — ordered, stable pod names + persistent storage (e.g. databases)
# Job        — runs to completion (batch tasks)
# CronJob    — scheduled jobs

# Example CronJob
cat &lt;&lt;EOF | kubectl apply -f -
apiVersion: batch/v1
kind: CronJob
metadata:
  name: cleanup
spec:
  schedule: "0 2 * * *"       # daily at 2am
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: cleanup
            image: busybox
            command: ["/bin/sh", "-c", "echo Cleaning up..."]
          restartPolicy: OnFailure
EOF</code></pre>` },

  { type: "text", value: `<h2>🌐 Services & Networking</h2><pre><code># Expose a deployment
kubectl expose deployment my-app --port=80 --type=ClusterIP     # internal only
kubectl expose deployment my-app --port=80 --type=NodePort      # external via node IP
kubectl expose deployment my-app --port=80 --type=LoadBalancer  # cloud LB

# Service YAML example
cat &lt;&lt;EOF | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  name: my-app-svc
spec:
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
EOF

# Port forward (local access to any pod/service)
kubectl port-forward svc/my-app-svc 8080:80
kubectl port-forward pod/&lt;pod-name&gt; 8080:80</code></pre>` },

  { type: "text", value: `<h3>Ingress (HTTP routing)</h3><pre><code># Install nginx ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml

# Ingress resource
cat &lt;&lt;EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-app-svc
            port:
              number: 80
EOF</code></pre>` },

  { type: "text", value: `<h2>💾 Storage</h2><pre><code># PersistentVolume (PV) — cluster-level storage resource
# PersistentVolumeClaim (PVC) — pod's request for storage
# StorageClass — dynamic provisioning

cat &lt;&lt;EOF | kubectl apply -f -
# PVC
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: standard
---
# Use in Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: db
spec:
  replicas: 1
  selector:
    matchLabels:
      app: db
  template:
    metadata:
      labels:
        app: db
    spec:
      containers:
      - name: mongo
        image: mongo:7
        volumeMounts:
        - name: data
          mountPath: /data/db
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: my-pvc
EOF

kubectl get pv
kubectl get pvc</code></pre>` },

  { type: "text", value: `<h2>🔐 ConfigMaps & Secrets</h2><pre><code># ConfigMap — non-sensitive config
kubectl create configmap app-config \
  --from-literal=ENV=production \
  --from-literal=LOG_LEVEL=info
kubectl get configmap app-config -o yaml

# Secret — sensitive data (base64 encoded)
kubectl create secret generic db-secret \
  --from-literal=username=admin \
  --from-literal=password=supersecret
kubectl get secret db-secret -o jsonpath='{.data.password}' | base64 --decode

# Use in Pod
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: db-secret
      key: password
- name: LOG_LEVEL
  valueFrom:
    configMapKeyRef:
      name: app-config
      key: LOG_LEVEL</code></pre>` },

  { type: "text", value: `<h2>🔑 RBAC (Role-Based Access Control)</h2><pre><code>cat &lt;&lt;EOF | kubectl apply -f -
# Role — permissions within a namespace
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: dev
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
---
# RoleBinding — assign role to a user/serviceaccount
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: dev
subjects:
- kind: User
  name: jane
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
EOF

kubectl auth can-i list pods --namespace=dev --as=jane</code></pre>` },

  { type: "text", value: `<h2>📈 Autoscaling (HPA)</h2><pre><code># Horizontal Pod Autoscaler
# Scale based on CPU usage

kubectl autoscale deployment my-app \
  --cpu-percent=60 \
  --min=2 \
  --max=10

# OR via YAML
cat &lt;&lt;EOF | kubectl apply -f -
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 60
EOF

kubectl get hpa
kubectl describe hpa my-app-hpa</code></pre>` },

  { type: "text", value: `<h2>⛑ Health Checks (Probes)</h2><pre><code>containers:
- name: app
  image: my-app:latest
  # Liveness — restart pod if this fails
  livenessProbe:
    httpGet:
      path: /health
      port: 8080
    initialDelaySeconds: 15
    periodSeconds: 10
    failureThreshold: 3

  # Readiness — remove from LB if this fails
  readinessProbe:
    httpGet:
      path: /ready
      port: 8080
    initialDelaySeconds: 5
    periodSeconds: 5

  # Startup — give slow apps time to boot
  startupProbe:
    httpGet:
      path: /health
      port: 8080
    failureThreshold: 30
    periodSeconds: 10</code></pre>` },

  { type: "text", value: `<h2>⚓ Helm — Kubernetes Package Manager</h2><pre><code># Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Add a chart repo
helm repo add stable https://charts.helm.sh/stable
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Search
helm search repo nginx
helm search hub wordpress

# Install
helm install my-nginx bitnami/nginx
helm install my-mongo bitnami/mongodb \
  --set auth.rootPassword=secret \
  --set persistence.size=10Gi

# List releases
helm list
helm list -A                       # all namespaces

# Upgrade
helm upgrade my-nginx bitnami/nginx --set replicaCount=3

# Rollback
helm rollback my-nginx 1

# Uninstall
helm uninstall my-nginx

# Create your own chart
helm create my-chart
helm package my-chart
helm install my-app ./my-chart</code></pre>` },

  { type: "text", value: `<h2>🏷 Labels, Selectors & Taints</h2><pre><code># Labels
kubectl label pod my-pod env=production
kubectl label node worker-1 disk=ssd
kubectl get pods -l env=production
kubectl get pods -l 'env in (production,staging)'

# Remove label
kubectl label pod my-pod env-

# Node selectors (schedule pods on specific nodes)
spec:
  nodeSelector:
    disk: ssd

# Taints & Tolerations (repel pods from nodes)
kubectl taint nodes worker-1 dedicated=gpu:NoSchedule

# Toleration in pod spec
tolerations:
- key: "dedicated"
  operator: "Equal"
  value: "gpu"
  effect: "NoSchedule"</code></pre>` },

  { type: "text", value: `<h2>🔍 Debugging & Troubleshooting</h2><pre><code># Pod stuck in Pending / CrashLoopBackOff / Error?
kubectl describe pod &lt;name&gt;          # look at Events section
kubectl logs &lt;name&gt; --previous       # logs from crashed container

# Common issues:
# ImagePullBackOff  → wrong image name or private registry, no imagePullSecret
# Pending           → no node has enough resources, or taint/toleration mismatch
# CrashLoopBackOff  → app is crashing; check logs
# OOMKilled         → container exceeded memory limit; increase limits

# Debug with a temporary pod
kubectl run debug --image=busybox -it --rm -- sh
kubectl run debug --image=nicolaka/netshoot -it --rm -- bash

# Copy files from/to pod
kubectl cp &lt;pod&gt;:/path/to/file ./local-file
kubectl cp ./local-file &lt;pod&gt;:/path/to/file

# Resource usage
kubectl top pods
kubectl top nodes
kubectl top pods --sort-by=cpu
kubectl top pods --sort-by=memory</code></pre>` },

  { type: "text", value: `<h2>🌍 Production Best Practices</h2><ul><li>✅ Always set <code>resources.requests</code> and <code>resources.limits</code></li><li>✅ Use <strong>Namespaces</strong> to isolate environments (dev/staging/prod)</li><li>✅ Use <strong>RBAC</strong> — least privilege access</li><li>✅ Use <strong>NetworkPolicies</strong> to restrict pod-to-pod traffic</li><li>✅ Use <strong>PodDisruptionBudgets</strong> for high availability</li><li>✅ Enable <strong>HPA</strong> for workloads with variable load</li><li>✅ Use <strong>Secrets</strong> for sensitive data, not ConfigMaps</li><li>✅ Use <strong>readiness + liveness probes</strong> on all containers</li><li>✅ Use <strong>Helm</strong> for packaging and versioning your apps</li><li>✅ Store manifests in <strong>Git</strong> (GitOps with ArgoCD or Flux)</li><li>✅ Use <strong>imagePullPolicy: IfNotPresent</strong> in production</li><li>✅ Tag images with specific versions — never use <code>:latest</code> in prod</li></ul>` },

  { type: "text", value: `<h2>⚡ Quick Reference Cheatsheet</h2><pre><code># CLUSTER
kubectl cluster-info
kubectl get nodes -o wide
kubectl config get-contexts
kubectl config use-context &lt;name&gt;

# PODS
kubectl get pods -A -o wide
kubectl logs -f &lt;pod&gt; -c &lt;container&gt;
kubectl exec -it &lt;pod&gt; -- bash
kubectl delete pod &lt;pod&gt; --force

# DEPLOYMENTS
kubectl get deploy
kubectl scale deploy &lt;name&gt; --replicas=5
kubectl rollout restart deploy &lt;name&gt;
kubectl rollout status deploy &lt;name&gt;
kubectl rollout undo deploy &lt;name&gt;

# SERVICES
kubectl get svc -A
kubectl port-forward svc/&lt;name&gt; 8080:80

# DEBUGGING
kubectl describe &lt;resource&gt; &lt;name&gt;
kubectl get events --sort-by=.lastTimestamp
kubectl top pods --sort-by=cpu -A

# RESOURCES APPLY/DELETE
kubectl apply -f manifest.yaml
kubectl delete -f manifest.yaml
kubectl apply -f ./k8s/          # apply whole directory
kubectl diff -f manifest.yaml    # preview changes before apply</code></pre>` },
];

// ── Insert into MongoDB ───────────────────────────────────────────────────────
const post = {
  title: "Kubernetes Zero to Advanced — Commands, Concepts & Workflows",
  excerpt:
    "A complete Kubernetes guide covering installation, core concepts, kubectl commands, workloads, networking, storage, RBAC, autoscaling, Helm, and production best practices.",
  content: JSON.stringify(blocks),
  author: "Irfan Basha",
  category: "Kubernetes",
  tags: ["kubernetes", "k8s", "devops", "containers", "helm", "kubectl", "cloud-native"],
  readTime: 20,
  featuredImage: "https://kubernetes.io/images/kubernetes-horizontal-color.png",
  createdAt: new Date().toISOString(),
};

const client = new MongoClient(MONGODB_URI);
try {
  await client.connect();
  const col = client.db(DB_NAME).collection(COLLECTION);
  const result = await col.insertOne(post);
  console.log("✅  Kubernetes blog post inserted:", result.insertedId.toString());
} catch (err) {
  console.error("❌  Error:", err.message);
} finally {
  await client.close();
}
