# ============================================================
# Project
# ============================================================
variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "rinemaa-457218"
}

variable "credentials_file" {
  description = "Path to GCP service account credentials JSON file"
  type        = string
  default     = "../credentials.json"
}

variable "region" {
  description = "GCP region for all resources"
  type        = string
  default     = "asia-southeast2" # Jakarta
}

variable "zone" {
  description = "GCP zone for compute resources"
  type        = string
  default     = "asia-southeast2-a"
}

# ============================================================
# Network
# ============================================================
variable "vpc_name" {
  description = "Name of the VPC network"
  type        = string
  default     = "nexops-vpc"
}

variable "subnet_name" {
  description = "Name of the primary subnet"
  type        = string
  default     = "nexops-subnet"
}

variable "subnet_cidr" {
  description = "CIDR range for the primary subnet"
  type        = string
  default     = "10.0.1.0/24"
}

# ============================================================
# SSH Access
# ============================================================
variable "ssh_user" {
  description = "SSH username for VM access"
  type        = string
  default     = "nexops"
}

variable "ssh_public_key_path" {
  description = "Path to the SSH public key file to inject into VMs"
  type        = string
  default     = "~/.ssh/nexops_rsa.pub"
}

# ============================================================
# VM Configuration
# ============================================================
variable "master_machine_type" {
  description = "Machine type for K3s control plane VM"
  type        = string
  default     = "e2-medium"
}

variable "worker_machine_type" {
  description = "Machine type for K3s worker node VM"
  type        = string
  default     = "e2-standard-4"
}

variable "db_machine_type" {
  description = "Machine type for the standalone PostgreSQL VM"
  type        = string
  default     = "e2-small"
}

variable "master_disk_size" {
  description = "Boot disk size in GB for master VM"
  type        = number
  default     = 30
}

variable "worker_disk_size" {
  description = "Boot disk size in GB for worker VM"
  type        = number
  default     = 60
}

variable "db_disk_size" {
  description = "Boot disk size in GB for DB VM"
  type        = number
  default     = 20
}

variable "vm_image" {
  description = "OS image for all VMs (Ubuntu 22.04 LTS)"
  type        = string
  default     = "ubuntu-os-cloud/ubuntu-2204-lts"
}

# ============================================================
# Tags
# ============================================================
variable "environment" {
  description = "Environment label applied to all resources"
  type        = string
  default     = "platform"
}
