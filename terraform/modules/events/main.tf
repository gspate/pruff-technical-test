resource "aws_iam_role" "scheduler_role" {
  name = "${var.project_name}-scheduler-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "scheduler.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_cloudwatch_event_rule" "daily_report" {
  name                = "${var.project_name}-daily-report"
  description         = "Trigger daily search reports via Cloudflare Tunnel"
  schedule_expression = "cron(0 12 * * ? *)" # 12:00 UTC = 08:00 AM Chile
}

resource "aws_cloudwatch_event_target" "daily_report" {
  rule     = aws_cloudwatch_event_rule.daily_report.name
  arn      = aws_cloudwatch_event_api_destination.report.arn
  role_arn = aws_iam_role.scheduler_role.arn

  retry_policy {
    maximum_retry_attempts       = 3
    maximum_event_age_in_seconds = 86400
  }
}

resource "aws_cloudwatch_event_connection" "report_auth" {
  name               = "${var.project_name}-report-auth"
  description        = "Connection with internal secret for daily report"
  authorization_type = "API_KEY"

  auth_parameters {
    api_key {
      key   = "x-internal-secret"
      value = "secret-for-cron" # In prod, this should be fetched from secrets manager
    }
  }
}

resource "aws_cloudwatch_event_api_destination" "report" {
  name                = "${var.project_name}-report-dest"
  description         = "API Destination for Daily Report"
  invocation_endpoint = "https://${var.app_domain}/api/internal/run-daily-report"
  http_method         = "POST"
  connection_arn      = aws_cloudwatch_event_connection.report_auth.arn
}

resource "aws_iam_role_policy" "scheduler_policy" {
  name = "${var.project_name}-scheduler-policy"
  role = aws_iam_role.scheduler_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "events:InvokeApiDestination"
        ]
        Resource = [
          aws_cloudwatch_event_api_destination.report.arn
        ]
      }
    ]
  })
}
