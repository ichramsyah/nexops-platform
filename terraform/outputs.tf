# ============================================================
# VM External IPs
# ============================================================
output "master_external_ip" {
  description = "External IP of the K3s master (control plane) VM"
  value       = module.compute.master_external_ip
}

output "worker_external_ip" {
  description = "External IP of the K3s worker VM"
  value       = module.compute.worker_external_ip
}

output "db_internal_ip" {
  description = "Internal IP of the PostgreSQL VM (no external IP)"
  value       = module.compute.db_internal_ip
}

# ============================================================
# SSH Instructions
# ============================================================
output "ssh_master" {
  description = "SSH command to connect to master VM"
  value       = "ssh -i ~/.ssh/nexops_rsa nexops@${module.compute.master_external_ip}"
}

output "ssh_worker" {
  description = "SSH command to connect to worker VM"
  value       = "ssh -i ~/.ssh/nexops_rsa nexops@${module.compute.worker_external_ip}"
}

# ============================================================
# Kubernetes API
# ============================================================
output "k8s_api_endpoint" {
  description = "Kubernetes API server endpoint"
  value       = "https://${module.compute.master_external_ip}:6443"
}

# ============================================================
# Ansible Inventory Snippet
# ============================================================
output "ansible_inventory_snippet" {
  description = "Copy this block into ansible/inventory/hosts.ini"
  value       = <<-EOT
    [master]
    nexops-master ansible_host=${module.compute.master_external_ip} ansible_user=nexops ansible_ssh_private_key_file=~/.ssh/nexops_rsa

    [worker]
    nexops-worker ansible_host=${module.compute.worker_external_ip} ansible_user=nexops ansible_ssh_private_key_file=~/.ssh/nexops_rsa

    [db]
    nexops-db ansible_host=${module.compute.db_internal_ip} ansible_user=nexops ansible_ssh_private_key_file=~/.ssh/nexops_rsa ansible_ssh_common_args='-o ProxyJump=nexops@${module.compute.master_external_ip}'
  EOT
}
