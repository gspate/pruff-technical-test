variable "aws_region" {
  type    = string
  default = "sa-east-1"
}

variable "project_name" {
  type    = string
  default = "pruff-property-finder"
}

variable "environment" {
  type    = string
  default = "production"
}

variable "resend_api_key" {
  type        = string
  description = "API key for Resend email service"
  sensitive   = true
}

variable "cloudflare_token" {
  type        = string
  description = "Cloudflare Tunnel Token for Zero Trust"
  sensitive   = true
}

variable "app_domain" {
  type        = string
  description = "The public domain on Cloudflare (e.g. rentario.cl)"
}

variable "session_secret" {
  type        = string
  description = "JWT Secret for Session Authentication"
  sensitive   = true
}
