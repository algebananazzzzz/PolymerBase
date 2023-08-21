
data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    dynamic "principals" {
      for_each = var.configuration.assume_role

      content {
        type        = principals.key
        identifiers = principals.value
      }
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "role" {
  name               = var.configuration.role_name
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "aws_iam_policy_document" "policy" {
  dynamic "statement" {
    for_each = var.configuration.iam_permissions

    content {
      sid       = statement.key
      effect    = statement.value["effect"]
      actions   = statement.value["actions"]
      resources = statement.value["resources"]
    }
  }
}

resource "aws_iam_policy" "policy" {
  name   = format("CustomPolicyFor%s", var.configuration.role_name)
  policy = data.aws_iam_policy_document.policy.json
}

resource "aws_iam_role_policy_attachment" "role-attachment" {
  role       = aws_iam_role.role.name
  policy_arn = aws_iam_policy.policy.arn
}
