terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  # backend "s3" {
  #   bucket         = "rentario-terraform-state"
  #   key            = "prod/terraform.tfstate"
  #   region         = "sa-east-1"
  #   dynamodb_table = "terraform-locks"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region
}

module "networking" {
  source = "./modules/networking"
  
  project_name = var.project_name
  environment  = var.environment
}

module "database" {
  source = "./modules/database"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.networking.vpc_id
  db_subnets   = module.networking.private_subnet_ids
  ecs_sg_id    = module.networking.ecs_sg_id
}

module "compute" {
  source = "./modules/compute"

  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = module.networking.vpc_id
  public_subnets     = module.networking.public_subnet_ids
  ecs_sg_id          = module.networking.ecs_sg_id
  db_secret_arn      = module.database.db_secret_arn
  db_endpoint        = module.database.db_endpoint
  resend_api_key     = var.resend_api_key
  cloudflare_token   = var.cloudflare_token
  session_secret     = var.session_secret
}

module "events" {
  source = "./modules/events"

  project_name = var.project_name
  environment  = var.environment
  app_domain   = var.app_domain
}
