# Kind Kubernetes Cluster - Portfolio Deployment

This directory contains Kubernetes manifests for deploying the Irfan Portfolio application using [Kind](https://kind.sigs.k8s.io/) (Kubernetes in Docker).

## 📋 Prerequisites

### Required Software
- **Docker Desktop** (with WSL 2 on Windows or native Docker on Linux/macOS)
- **kubectl** - Kubernetes command-line tool
- **kind** - Kubernetes in Docker

### Installation

#### Windows
```bash
# Using Chocolatey
choco install kind
choco install kubernetes-cli

# Using Scoop
scoop install kind
scoop install kubectl

# Or download from:
# - Kind: https://kind.sigs.k8s.io/docs/user/quick-start/
# - kubectl: https://kubernetes.io/docs/tasks/tools/
```

#### macOS
```bash
brew install kind kubernetes-cli
```

#### Linux
```bash
# Kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

## 📁 Files

### `Cluster.yaml`
Kind cluster configuration with:
- 1 Control Plane node
- 2 Worker nodes
- Kubernetes v1.27.0

### `deployment.yml`
Kubernetes Deployment manifest that defines:
- **Image**: `irfan8194/irfan-portfolio:latest`
- **Replicas**: 3 pods
- **Container Port**: 80
- **Namespace**: `portfolio-ns`

### `svc.yml`
Kubernetes Service manifest that:
- Exposes the deployment internally
- Routes traffic to port 80
- Type: ClusterIP (default)

## 🚀 Getting Started

### 1. Create the Cluster
```bash
kind create cluster --config kind/Cluster.yaml --name portfolio-cluster
```

**On Windows with Docker Desktop:**
Ensure WSL 2 is enabled and Docker is running in WSL 2 mode.

### 2. Verify Cluster
```bash
# List clusters
kind get clusters

# Get cluster info
kubectl cluster-info --context kind-portfolio-cluster

# Check nodes
kubectl get nodes
```

### 3. Create Namespace
```bash
kubectl create namespace portfolio-ns
```

### 4. Load Docker Image (if not using DockerHub)
```bash
kind load docker-image irfan8194/irfan-portfolio:latest --name portfolio-cluster
```

### 5. Deploy Application
```bash
# Apply deployment
kubectl apply -f kind/deployment.yml

# Apply service
kubectl apply -f kind/svc.yml
```

### 6. Verify Deployment
```bash
# Check pods
kubectl get pods -n portfolio-ns

# Check services
kubectl get svc -n portfolio-ns

# Check deployment status
kubectl describe deployment portfolio-deployment -n portfolio-ns
```

### 7. View Logs
```bash
# View logs from all pods
kubectl logs -n portfolio-ns -l app=portfolio-app --tail=100

# Follow logs in real-time
kubectl logs -n portfolio-ns -l app=portfolio-app -f

# View logs from a specific pod
kubectl logs -n portfolio-ns <pod-name>
```

### 8. Access Application (Port Forwarding)
```bash
# Forward local port 8080 to service port 80
kubectl port-forward -n portfolio-ns svc/portfolio-service 8080:80

# Access at: http://localhost:8080
```

### 9. Port Forward Alternative (NodePort)
Edit `svc.yml` to use NodePort:
```yaml
spec:
  type: NodePort
  selector:
    app: portfolio-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
      nodePort: 30080
```

Then access at: `http://localhost:30080`

## 🔧 Useful Commands

### Debugging
```bash
# Describe a pod
kubectl describe pod <pod-name> -n portfolio-ns

# Get pod details
kubectl get pod <pod-name> -n portfolio-ns -o yaml

# Check events
kubectl get events -n portfolio-ns

# Access pod shell
kubectl exec -it <pod-name> -n portfolio-ns -- /bin/sh
```

### Scaling
```bash
# Scale replicas
kubectl scale deployment portfolio-deployment -n portfolio-ns --replicas=5

# Watch scaling progress
kubectl get pods -n portfolio-ns --watch
```

### Updates
```bash
# Update image
kubectl set image deployment/portfolio-deployment \
  portfolio-container=irfan8194/irfan-portfolio:v2.0 \
  -n portfolio-ns

# Rollout status
kubectl rollout status deployment/portfolio-deployment -n portfolio-ns

# Rollback
kubectl rollout undo deployment/portfolio-deployment -n portfolio-ns
```

### Cleanup
```bash
# Delete deployment
kubectl delete deployment portfolio-deployment -n portfolio-ns

# Delete service
kubectl delete service portfolio-service -n portfolio-ns

# Delete namespace
kubectl delete namespace portfolio-ns

# Delete entire cluster
kind delete cluster --name portfolio-cluster
```

## 🐛 Troubleshooting

### Cluster Creation Fails on Windows
**Issue**: `timed out waiting for the condition`

**Solutions**:
1. Ensure Docker Desktop is running with WSL 2 backend
2. Check Docker resources: Settings → Resources → Memory (allocate 4GB+)
3. Use Docker Desktop's built-in Kubernetes instead:
   - Enable Kubernetes in Docker Desktop settings
   - Use `--context docker-desktop` instead of `--context kind-portfolio-cluster`

### Pods Stuck in Pending
```bash
kubectl describe pod <pod-name> -n portfolio-ns
# Check events for resource constraints or image pull errors
```

### Image Pull Errors
```bash
# Check image is available
docker images | grep irfan8194

# If missing, pull from DockerHub
docker pull irfan8194/irfan-portfolio:latest

# Load into Kind
kind load docker-image irfan8194/irfan-portfolio:latest --name portfolio-cluster
```

### Port Forward Not Working
```bash
# Verify service is running
kubectl get svc -n portfolio-ns

# Check if port is already in use
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows
```

## 📊 Monitoring

### Resource Usage
```bash
# Check node resources
kubectl top nodes

# Check pod resources
kubectl top pod -n portfolio-ns
```

### Dashboard (Optional)
```bash
# Deploy Kubernetes Dashboard
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml

# Access dashboard
kubectl proxy
# Visit: http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

# Get token
kubectl -n kubernetes-dashboard create token admin-user
```

## 🔐 Security Notes

- Current setup uses default Docker image from DockerHub
- For production: Use private registries and image pull secrets
- Consider using Network Policies to restrict traffic
- Implement Resource Quotas and Limits

## 📚 Resources

- [Kind Official Documentation](https://kind.sigs.k8s.io/)
- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

## 🎯 Next Steps

1. Monitor pods and logs
2. Test application functionality
3. Scale replicas based on load
4. Implement CI/CD pipeline for automated deployments
5. Set up persistent volumes for data storage
6. Configure Ingress for better routing

---

**Last Updated**: May 6, 2026
**Kubernetes Version**: v1.27.0
**Docker Image**: `irfan8194/irfan-portfolio:latest`
