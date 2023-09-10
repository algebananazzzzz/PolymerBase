output "function_name" {
  value = {
    for key, fn in module.lambda :
    key => fn.function_name
  }
}

output "api_gateway_integration_urls" {
  value = {
    for key, api in module.api :
    key => api.api_gateway_integration_url
  }
}

output "user_pool_id" {
  value = module.cognito_user_pool[0].user_pool_id
}

output "user_pool_client_id" {
  value = module.cognito_user_pool[0].user_pool_client_id
}

output "identity_pool_id" {
  value = module.cognito_identity_pool[0].identity_pool_id
}

output "databucket_name" {
  value = aws_s3_bucket.bucket.bucket
}
