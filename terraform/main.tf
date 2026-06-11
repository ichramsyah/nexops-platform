module "vpc" {
  source      = "./modules/vpc"
  project_id  = var.project_id
  region      = var.region
  vpc_name    = var.vpc_name
  subnet_name = var.subnet_name
  subnet_cidr = var.subnet_cidr
}

module "firewall" {
  source     = "./modules/firewall"
  project_id = var.project_id
  vpc_name   = module.vpc.vpc_name
}

module "compute" {
  source               = "./modules/compute"
  project_id           = var.project_id
  region               = var.region
  zone                 = var.zone
  subnet_id            = module.vpc.subnet_id
  master_machine_type  = var.master_machine_type
  worker_machine_type  = var.worker_machine_type
  db_machine_type      = var.db_machine_type
  master_disk_size     = var.master_disk_size
  worker_disk_size     = var.worker_disk_size
  db_disk_size         = var.db_disk_size
  vm_image             = var.vm_image
  ssh_user             = var.ssh_user
  ssh_public_key_path  = var.ssh_public_key_path
  environment          = var.environment
}
