variable "project_name" { type = string }
variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "public_subnets" { type = list(string) }
variable "ecs_sg_id" { type = string }
variable "db_secret_arn" { type = string }
variable "resend_api_key" { type = string }
variable "cloudflare_token" { type = string }
variable "db_endpoint" { type = string }
variable "aws_region" {
  type    = string
  default = "sa-east-1"
}
