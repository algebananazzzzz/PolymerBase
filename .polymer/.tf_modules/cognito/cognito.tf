resource "aws_cognito_user_pool_client" "client" {
  name         = var.client_name
  user_pool_id = aws_cognito_user_pool.pool.id
}

resource "aws_cognito_user_pool_ui_customization" "custom" {
  count        = (var.ui_customisation == null) ? 0 : 1
  client_id    = aws_cognito_user_pool_client.client.id
  user_pool_id = aws_cognito_user_pool.pool.id
  css          = file(format("${path.root}/%s", var.ui_customisation))
  depends_on   = [aws_cognito_user_pool_client.client]
}

resource "aws_cognito_user_pool" "pool" {
  name                     = var.pool_name
  alias_attributes         = ["preferred_username", "email"]
  auto_verified_attributes = ["email"]

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "${var.application_name} Account Verification"
    email_message        = "Your confirmation code is {####}"
  }

  dynamic "schema" {
    for_each = var.custom_attributes

    content {
      name                     = schema.key
      attribute_data_type      = schema.value.type == "S" ? "String" : schema.value.type == "N" ? "Number" : "Unknown"
      developer_only_attribute = false
      mutable                  = true
      required                 = false

      dynamic "string_attribute_constraints" {
        for_each = schema.value.type == "S" ? [schema.value] : []

        content {
          min_length = string_attribute_constraints.value.min_length
          max_length = string_attribute_constraints.value.max_length
        }
      }

      dynamic "number_attribute_constraints" {
        for_each = schema.value.type == "N" ? [schema.value] : []

        content {
          min_value = number_attribute_constraints.value.min_value
          max_value = number_attribute_constraints.value.max_value
        }
      }
    }
  }
}

resource "aws_cognito_user_group" "group" {
  for_each     = var.usergroups
  name         = each.value
  user_pool_id = aws_cognito_user_pool.pool.id
  description  = "Managed by Terraform"
}
