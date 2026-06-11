variable "project_id"           { type = string }
variable "region"               { type = string }
variable "zone"                  { type = string }
variable "subnet_id"             { type = string }
variable "master_machine_type"   { type = string }
variable "worker_machine_type"   { type = string }
variable "db_machine_type"       { type = string }
variable "master_disk_size"      { type = number }
variable "worker_disk_size"      { type = number }
variable "db_disk_size"          { type = number }
variable "vm_image"              { type = string }
variable "ssh_user"              { type = string }
variable "ssh_public_key_path"   { type = string }
variable "environment"           { type = string }

locals {
  ssh_key_value = "${var.ssh_user}:${file(pathexpand(var.ssh_public_key_path))}"
  common_labels = {
    environment = var.environment
    project     = "nexops-platform"
    managed_by  = "terraform"
  }
}

# ============================================================
# Static External IPs
# ============================================================
resource "google_compute_address" "master_ip" {
  name    = "nexops-master-ip"
  project = var.project_id
  region  = var.region
}

resource "google_compute_address" "worker_ip" {
  name    = "nexops-worker-ip"
  project = var.project_id
  region  = var.region
}

# ============================================================
# VM: nexops-master (K3s Control Plane)
# ============================================================
resource "google_compute_instance" "master" {
  name         = "nexops-master"
  project      = var.project_id
  zone         = var.zone
  machine_type = var.master_machine_type
  tags         = ["nexops-node", "nexops-master"]
  labels       = merge(local.common_labels, { role = "master" })

  boot_disk {
    initialize_params {
      image = var.vm_image
      size  = var.master_disk_size
      type  = "pd-ssd"
    }
  }

  network_interface {
    subnetwork = var.subnet_id
    access_config {
      nat_ip = google_compute_address.master_ip.address
    }
  }

  metadata = {
    ssh-keys               = local.ssh_key_value
    enable-oslogin         = "FALSE"
    block-project-ssh-keys = "true"
    serial-port-enable     = "false"
  }

  # Startup script: install necessary base tools
  metadata_startup_script = <<-EOT
    #!/bin/bash
    apt-get update -y
    apt-get install -y curl wget git unzip jq apt-transport-https ca-certificates gnupg lsb-release
    echo "nexops-master ready" > /tmp/startup-complete
  EOT

  service_account {
    scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }

  lifecycle {
    prevent_destroy = false
  }
}

# ============================================================
# VM: nexops-worker (K3s Worker — all platform workloads)
# ============================================================
resource "google_compute_instance" "worker" {
  name         = "nexops-worker"
  project      = var.project_id
  zone         = var.zone
  machine_type = var.worker_machine_type
  tags         = ["nexops-node", "nexops-worker"]
  labels       = merge(local.common_labels, { role = "worker" })

  boot_disk {
    initialize_params {
      image = var.vm_image
      size  = var.worker_disk_size
      type  = "pd-ssd"
    }
  }

  network_interface {
    subnetwork = var.subnet_id
    access_config {
      nat_ip = google_compute_address.worker_ip.address
    }
  }

  metadata = {
    ssh-keys               = local.ssh_key_value
    enable-oslogin         = "FALSE"
    block-project-ssh-keys = "true"
    serial-port-enable     = "false"
  }

  metadata_startup_script = <<-EOT
    #!/bin/bash
    apt-get update -y
    apt-get install -y curl wget git unzip jq apt-transport-https ca-certificates gnupg lsb-release
    echo "nexops-worker ready" > /tmp/startup-complete
  EOT

  service_account {
    scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }

  lifecycle {
    prevent_destroy = false
  }
}

# ============================================================
# VM: nexops-db (Standalone PostgreSQL — NO external IP)
# ============================================================
resource "google_compute_instance" "db" {
  name         = "nexops-db"
  project      = var.project_id
  zone         = var.zone
  machine_type = var.db_machine_type
  tags         = ["nexops-node", "nexops-db"]
  labels       = merge(local.common_labels, { role = "database" })

  boot_disk {
    initialize_params {
      image = var.vm_image
      size  = var.db_disk_size
      type  = "pd-ssd"
    }
  }

  network_interface {
    # No access_config block = no external IP (private only)
    subnetwork = var.subnet_id
  }

  metadata = {
    ssh-keys               = local.ssh_key_value
    enable-oslogin         = "FALSE"
    block-project-ssh-keys = "true"
    serial-port-enable     = "false"
  }

  metadata_startup_script = <<-EOT
    #!/bin/bash
    apt-get update -y
    apt-get install -y curl wget
    echo "nexops-db ready" > /tmp/startup-complete
  EOT

  service_account {
    scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }

  lifecycle {
    prevent_destroy = false
  }
}

# ============================================================
# Outputs
# ============================================================
output "master_external_ip" {
  value = google_compute_address.master_ip.address
}

output "worker_external_ip" {
  value = google_compute_address.worker_ip.address
}

output "db_internal_ip" {
  value = google_compute_instance.db.network_interface[0].network_ip
}
