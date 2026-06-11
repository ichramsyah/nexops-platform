# 🚀 NexOps Platform

> **A production-grade, self-managed Kubernetes DevSecOps platform built from scratch on Google Cloud Platform.**

Built by **Ichramsyah Abdurrachman** — DevOps Engineer

---

## 📋 Overview

NexOps Platform demonstrates a complete, enterprise-grade DevSecOps platform engineering workflow. Instead of relying on managed Kubernetes (GKE), this project provisions raw GCP Compute Engine VMs using Terraform, bootstraps a self-managed K3s cluster using Ansible, and deploys a full suite of DevOps tools via GitOps (ArgoCD).

Every component — from infrastructure to CI/CD to observability — is codified, versioned, and automated.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      GCP — asia-southeast2 (Jakarta)           │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                nexops-vpc (10.0.1.0/24)                  │   │
│  │                                                          │   │
│  │  ┌──────────────────┐   ┌──────────────────┐            │   │
│  │  │  nexops-master   │   │  nexops-worker   │            │   │
│  │  │  e2-medium       │   │  e2-standard-4   │            │   │
│  │  │  2vCPU / 4GB     │◄──│  4vCPU / 16GB   │            │   │
│  │  │  K3s Control     │   │                  │            │   │
│  │  │  Plane           │   │  ┌────────────┐  │            │   │
│  │  └─────────┬────────┘   │  │ argocd     │  │            │   │
│  │            │            │  │ jenkins    │  │            │   │
│  │            │ K3s API    │  │ sonarqube  │  │            │   │
│  │            └────────────►  │ prometheus │  │            │   │
│  │                         │  │ grafana    │  │            │   │
│  │                         │  │ loki       │  │            │   │
│  │                         │  │ staging    │  │            │   │
│  │                         │  │ prod       │  │            │   │
│  │                         │  └────────────┘  │            │   │
│  │                         └──────────────────┘            │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────┐                        │   │
│  │  │  nexops-db (private only)   │                        │   │
│  │  │  e2-small / 2GB             │                        │   │
│  │  │  PostgreSQL (standalone)    │                        │   │
│  │  │  Databases: sonarqube,      │                        │   │
│  │  │             nexops_app      │                        │   │
│  │  └─────────────────────────────┘                        │   │
│  └──────────────────────────────────────────────────────── ┘   │
└─────────────────────────────────────────────────────────────────┘
```

### DevSecOps Pipeline Flow

```
Developer Push → GitHub → Jenkins Webhook
                              │
                    ┌─────────▼──────────┐
                    │  Ephemeral K8s Pod  │
                    │  (Dynamic Agent)    │
                    └─────────┬───────────┘
                              │
               ┌──────────────▼──────────────┐
               │   Stage 1: Trivy FS Scan     │ ← Source code secrets/CVE scan
               └──────────────┬──────────────┘
               ┌──────────────▼──────────────┐
               │  Stage 2: SonarQube Gate     │ ← Code quality + SAST (BLOCKS on fail)
               └──────────────┬──────────────┘
               ┌──────────────▼──────────────┐
               │   Stage 3: Docker Build      │
               └──────────────┬──────────────┘
               ┌──────────────▼──────────────┐
               │  Stage 4: Trivy Image Scan   │ ← BLOCKS on CRITICAL CVEs
               └──────────────┬──────────────┘
               ┌──────────────▼──────────────┐
               │  Stage 5: Push to GAR        │ ← Google Artifact Registry
               └──────────────┬──────────────┘
               ┌──────────────▼──────────────┐
               │  Stage 6: Update Manifests   │ ← Updates image tag in Git
               └──────────────┬──────────────┘
                              │
                    ┌─────────▼───────────┐
                    │      ArgoCD         │ ← Detects Git change, syncs cluster
                    └─────────┬───────────┘
                    ┌─────────▼───────────┐
                    │  staging namespace   │ → Auto-deployed
                    └─────────────────────┘
                    ┌─────────────────────┐
                    │  prod namespace      │ → Manual promotion
                    └─────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Cloud** | Google Cloud Platform | Infrastructure hosting |
| **IaC** | Terraform | Provision VPC, Firewall, VMs |
| **Config Mgmt** | Ansible | OS setup, K3s bootstrap, PostgreSQL |
| **Kubernetes** | K3s (self-managed) | Container orchestration on VMs |
| **GitOps CD** | ArgoCD | Declarative deployment sync |
| **CI** | Jenkins | Orchestrates DevSecOps pipeline |
| **Code Quality** | SonarQube | SAST, code smells, quality gates |
| **Vulnerability Scan** | Trivy | FS + image CVE scanning |
| **Ingress** | Nginx Ingress | HTTP/S routing |
| **TLS** | Cert-Manager + Let's Encrypt | Automated certificates |
| **Metrics** | Prometheus | Cluster + app metrics |
| **Dashboards** | Grafana | Visualization & alerting |
| **Logs** | Loki | Log aggregation |
| **Database** | PostgreSQL (standalone VM) | SonarQube + backend data |
| **Backend** | Go | RESTful API |
| **Frontend** | React (Vite) | Web Dashboard |
| **Registry** | Google Artifact Registry | Docker image storage |

---

## 📁 Repository Structure

```
nexops-platform/
├── terraform/          # Phase 1: GCP infrastructure
│   └── modules/
│       ├── vpc/        # VPC, subnet, Cloud NAT
│       ├── firewall/   # Firewall rules
│       └── compute/    # 3 VM instances
├── ansible/            # Phase 2: Configuration management
│   ├── roles/
│   │   ├── common/     # OS hardening
│   │   ├── k3s-master/ # K3s control plane
│   │   ├── k3s-worker/ # K3s agent join
│   │   └── postgresql/ # Standalone DB setup
│   └── playbooks/      # Execution playbooks
├── kubernetes/         # Cluster bootstrap manifests
├── argocd/             # GitOps definitions (App-of-Apps)
├── monitoring/         # Prometheus/Grafana/Loki configs
├── applications/       # Demo app + Jenkinsfile
│   ├── backend/        # Go REST API
│   │   ├── main.go
│   │   ├── Dockerfile  # Multi-stage, non-root
│   │   └── go.mod
│   ├── frontend/       # React Web Dashboard
│   │   ├── src/        
│   │   ├── Dockerfile  # Multi-stage, Nginx served
│   │   └── package.json
│   ├── Jenkinsfile     # 7-stage DevSecOps pipeline for both
│   └── k8s/            # Kubernetes manifests
│       ├── backend.yaml
│       ├── frontend.yaml
│       └── ingress.yaml
├── security/
│   └── network-policies/ # Zero-trust namespace isolation
└── docs/               # Runbooks, setup guides
```

---

## 🚀 Getting Started

### Prerequisites
- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.5.0
- [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/) >= 2.14
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/docs/intro/install/) >= 3.0
- GCP Project with billing enabled
- An SSH key pair (`~/.ssh/nexops_rsa`)

### Step 1: SSH Key Setup
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/nexops_rsa -C "nexops@platform"
```

### Step 2: Provision Infrastructure
```bash
cd terraform/

# Initialize Terraform (creates GCS state bucket first time)
terraform init

# Review what will be created
terraform plan

# Apply infrastructure
terraform apply

# Get Ansible inventory
terraform output ansible_inventory_snippet
```

### Step 3: Configure VMs & Bootstrap K3s
```bash
# Paste terraform output into ansible/inventory/hosts.ini
cd ansible/

# Run all playbooks in sequence
ansible-playbook playbooks/01-common.yml
ansible-playbook playbooks/02-k3s-master.yml
ansible-playbook playbooks/03-k3s-worker.yml
ansible-playbook playbooks/04-postgresql.yml

# Verify cluster
kubectl --kubeconfig=../kubeconfig.yaml get nodes -o wide
```

### Step 4: Bootstrap ArgoCD
```bash
export KUBECONFIG=$(pwd)/../kubeconfig.yaml

# Apply namespaces
kubectl apply -f kubernetes/bootstrap/namespaces.yaml

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for ArgoCD to be ready
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=120s

# Apply App-of-Apps (this bootstraps ALL tools automatically)
kubectl apply -f argocd/app-of-apps.yaml
```

### Step 5: Access Services
```bash
# ArgoCD initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Port-forward ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Access: https://localhost:8080
```

---

## 📊 Service URLs (after DNS/Ingress setup)

| Service | URL |
| :--- | :--- |
| ArgoCD | `https://argocd.nexops.local` |
| Jenkins | `https://jenkins.nexops.local` |
| SonarQube | `https://sonarqube.nexops.local` |
| Grafana | `https://grafana.nexops.local` |
| Application (staging) | `https://staging.nexops.local` |
| Application (prod) | `https://app.nexops.local` |

---

## 👤 Author

**Ichramsyah Abdurrachman**
DevOps Engineer 
Jakarta, Indonesia

---

*Built as a portfolio project demonstrating production-grade DevSecOps platform engineering.*
