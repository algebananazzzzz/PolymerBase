
variable "application_stage" {
  type    = string
  default = "dev"
}

variable "deployment_config" {
  type    = string
  default = "CodeDeployDefault.LambdaAllAtOnce"
}

variable "aws_region" {
  type    = string
  default = "ap-southeast-1"
}

variable "application_name" {

}
