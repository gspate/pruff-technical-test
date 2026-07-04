variable "project_name" { type = string }
variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "db_subnets" { type = list(string) }
variable "ecs_sg_id" { type = string }
