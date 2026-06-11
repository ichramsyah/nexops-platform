variable "project_id" { type = string }
variable "vpc_name"   { type = string }

# ============================================================
# Allow SSH from anywhere (can restrict to your IP)
# ============================================================
resource "google_compute_firewall" "allow_ssh" {
  name    = "nexops-allow-ssh"
  project = var.project_id
  network = var.vpc_name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["nexops-node"]
  description   = "Allow SSH from anywhere — restrict to admin IP in production"
}

# ============================================================
# Allow all internal traffic between VMs in the same VPC
# ============================================================
resource "google_compute_firewall" "allow_internal" {
  name    = "nexops-allow-internal"
  project = var.project_id
  network = var.vpc_name

  allow {
    protocol = "tcp"
  }

  allow {
    protocol = "udp"
  }

  allow {
    protocol = "icmp"
  }

  source_ranges = ["10.0.1.0/24"]
  target_tags   = ["nexops-node"]
  description   = "Allow all internal traffic between nexops VMs"
}

# ============================================================
# Allow HTTP/S (Nginx Ingress on worker node)
# ============================================================
resource "google_compute_firewall" "allow_http_https" {
  name    = "nexops-allow-http-https"
  project = var.project_id
  network = var.vpc_name

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["nexops-worker"]
  description   = "Allow HTTP and HTTPS traffic to the worker (Nginx Ingress)"
}

# ============================================================
# Allow Kubernetes API (6443) to master from anywhere
# ============================================================
resource "google_compute_firewall" "allow_k8s_api" {
  name    = "nexops-allow-k8s-api"
  project = var.project_id
  network = var.vpc_name

  allow {
    protocol = "tcp"
    ports    = ["6443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["nexops-master"]
  description   = "Allow access to K3s Kubernetes API server"
}

# ============================================================
# Allow NodePort services (30000-32767) on worker for testing
# ============================================================
resource "google_compute_firewall" "allow_nodeport" {
  name    = "nexops-allow-nodeport"
  project = var.project_id
  network = var.vpc_name

  allow {
    protocol = "tcp"
    ports    = ["30000-32767"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["nexops-worker"]
  description   = "Allow Kubernetes NodePort range on worker (useful for direct testing)"
}
