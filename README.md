# PolymerBase

PolymerBase is part of the Polymer framework, a DevOps framework created to provide developers with a framework empowering them to concentrate on what they do best – writing code and developing their applications. This is achieved through these steps:

1. Simplify the configuration process in provisioning resources by utilizing a single concise "Source-of-Truth" in the `stage.infrastructure.yml` files.
2. Establish robust CI/CD pipelines with GitHub Actions for seamless, automated deployments.
3. Minimize need for constant maintenance by provisioning Serverless AWS resources.


## Templates
Each template is designed with distinct integrations to fulfill specific purposes:

1. [PolymerBase repository](https://github.com/algebananazzzzz/PolymerBase) - for developing Backend resources e.g. GraphQL APIs and Cognito Pools
3. [PolymerFront repository](https://github.com/algebananazzzzz/PolymerFront) - for creating React applications with GraphQL and Amplify integrations
4. [PolymerFront-lite repository](https://github.com/algebananazzzzz/PolymerFront-lite) - lite version of PolymerFront

I highly recommend viewing [my blog](https://algebananazzzzz.com/blog/polymer) for a more comprehensive guide.


## Table of Contents

- [About](#about)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Configuration](#configuration)
  - [Resource Configuration](#resource-configuration)
  - [Lambda Configuration](#lambda-configuration)
- [Usage](#usage)
  - [Developing GraphQL APIs](#developing-graphql-apis-using-apollo-server)
- [Deployment](#deployment)
  - [Using GitHub Actions](#using-gitHub-actions-(recommended))
  - [Using Terraform Locally](#using-terraform-locally)
- [License](#license)
- [Contact](#contact)

## About

PolymerBase specialises in provisioning Backend resources like Lambda with API Gateway Integration (optional), DynamoDB, S3, Cognito, suitable for Fullstack Development. Additionally, it includes features to further enable creating GraphQL APIs using Apollo-Server.

## Getting Started

### Prerequisites

This project does not have any mandatory prerequisites for basic usage. You can get started without any specific requirements.

However, certain prerequisites are required if you choose to perform the following actions:

1. **Develop Apollo-Server Lambda APIs**: To run Apollo-Server locally during development phase, you must have the following tools installed:

  - **Node.js**: Download from [the official Node.js website](https://nodejs.org/). We recommend using Node.js version 14.17.0 or higher.
  - **NPM (Node Package Manager)**: NPM is usually included with Node.js installation. If NPM is not installed, you can download it from the [official npm website](https://www.npmjs.com/).


2. **Provision Resources Locally instead**: To provision resources locally using Terraform instead of through GitHub Actions, you must have Terraform installed:
  
  - **Download Terraform**: You can download Terraform from [the official Terraform website](https://www.terraform.io/). We recommend using Terraform version 0.14.0 or higher.


### Installation

1. **Clone the Repository**:

Clone the repository to your local machine using the following command:

```shell
git clone https://github.com/algebananazzzzz/PolymerBase.git
```

2. **For Local Development (Optional)**

To run Apollo-Server locally during development phase, follow these additional steps to download the required Node dependencies:

```shell
cd api/
npm install
```

If you decide not to develop Apollo-Server APIs, you can remove the api/ directory:

```shell
rm -r api/
```

## Configuration

### Resource Configuration

Resource configuration includes settings for provisioning AWS Resources such as Lambda functions, API Gateway, Cognito, and DynamoDB. These configurations are stored in YAML files specific to CI/CD staging environments. 

The configuration files must follow the naming convention `{stage}.infrastructure.yml`:

```
|-- .polymer
|   |-- .config
|   |   |-- dev.infrastructure.yml # for dev stage
|   |   |-- test.infrastructure.yml
|   |   |-- prod.infrastructure.yml
|   |   |-- example.infrastructure.yml # example configuration file
|-- other files and directories
```

Please view the [example configuration file](.polymer/.config/example.infrastructure.yml) to understand how to configure configuration files. The comments within the file provide detailed explanations of what each field configures.

### Lambda Configuration

Lambda Configuration encompasses various options such as Lambda Environment Variables, VPC settings, IAM Role configurations, Layers, and the runtime environment. To organize these configurations, create and specify a directory for each individual function using the "envfile_basedir" field in your Resource Configuration:

```yaml
lambda:
  api:
    function_name: GraphQLApi-%s-function
    basedir: api/dist
    envfile_basedir: .polymer/api_config # Specify this field
```

You can then store Lambda Configuration files adhering to the format {stage}.env.yml in the directory:

```
|-- .polymer
|   |-- api_config # configuration specific to a Lambda function
|   |   |-- dev.lambda.json # for dev stage
|   |   |-- test.lambda.json
|   |   |-- prod.lambda.json
|   |   |-- example.lambda.json # example configuration file
|-- other files and directories
```

Please view the [example configuration file](.polymer/api_config/example.lambda.json) to understand how to configure Lambda configuration files. The comments within the file provide detailed explanations of what each field configures.


## Usage

### Developing GraphQL APIs using Apollo-Server

With this framework, you can effortlessly develop **GraphQL APIs** using the **Apollo framework**, seamlessly integrating the Schema and Configuration with DynamoDB and S3 resource configurations. Learn more about [Apollo](https://www.apollographql.com). 

#### Export JSON and GraphQL Schema
To export a JSON file and GraphQL Schema with models representing the provisioned DynamoDB tables and S3 buckets for use within your application, follow these steps:

1. Configure the Export Location

First, configure the location where the exported files will be stored by specifying the paths in your `infrastructure.yml` configuration file:

```yaml
exports:
  app_config_output: app/src/app_config.json
  graphql_schema_output: app/src/schema/models.graphql
```

2. Run the Export Script

```shell
# Set your desired STAGE (e.g., dev, test, prod)
export STAGE=dev

# Run the export script
python3 .polymer/gen.py
```

#### Develop Apollo-Server Locally

To run Apollo Server locally during development, follow these steps:

```shell
cd api/
node src/index.js
```

The template includes a [starter example](api/) for your convenience. For a more advanced API integrated with Cognito User Pool and DynamoDB, please refer to the [example here](example/api/).

#### Modify server.js

For production, Webpack will bundle your server code from the `server.js` file, optimizing it for deployment. To prepare your Apollo Server for production, follow the documentation for [`startServerAndCreateLambdaHandler`](https://www.apollographql.com/docs/apollo-server/deployment/lambda/) to create a Lambda handler for serverless deployment.


## Installation

1. Clone the PolymerBase Framework
```shell
git clone https://github.com/algebananazzzzz/PolymerBase
```

## Deployment

### Using GitHub Actions (Recommended)

1. **Create a GitHub Repository:**
Start by creating a GitHub repository. After that, follow these steps to initialize Git and switch to the `dev` branch:
```
git init
git add -A
git commit
git checkout -b dev
git remote set-url origin https://github.com/{your_repository_name}.git
```

2. **Configure Secrets and Variables:**

For secure and streamline access to AWS and Terraform Cloud, follow these steps to configure secrets and variables within your GitHub repository:

- Click on the `Settings` tab within your repository.
- Navigate to `Secrets` (or `Environments` > `Secrets` depending on your GitHub version).
- Click on `New repository secret` to add secrets or `New repository variable` to add variables.

**Required Secrets:**

1. `AWS_ACCESS_KEY_ID`: Your AWS access key ID.
2. `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key.
3. `TF_API_TOKEN`: Obtain this token by going to your [Terraform Cloud tokens page](https://app.terraform.io/app/settings/tokens).

**Required Variables:**

1. `APPLICATION_NAME`: Set your application's name.
2. `AWS_REGION`: Define the AWS region you're working with.
3. `TF_ORGANISATION`: If not already created, create a Terraform Cloud organization for use.

3. **Push to GitHub**
```shell
git push --set-upstream origin dev
```

With GitHub Actions in place, this push will automatically trigger the following processes:

- Webpack will bundle your Node.js code, optimizing it for production deployment.

- If a workspace for your organization doesn't already exist, Terraform Cloud will create one.Terraform Cloud will then be triggered to provision the necessary resources according to your infrastructure configuration. 


4. **Staging**

After a successful deployment of the dev branch, you can extend the same workflow to deploy your application to other stages, such as **test** or **production**. Follow these steps for each stage:

- Create a new branch corresponding to the stage you want to deploy (e.g., `test`, `prod`).
- Merge the `dev` branch into the newly created stage branch. 

This push to the stage branch will automatically trigger GitHub Actions to provision resources for the specified stage. Repeat these steps for each stage as needed, allowing you to deploy your application to multiple environments seamlessly.


### Using Terraform Locally

If you prefer to use Terraform locally and avoid pushing code to GitHub, you can follow these steps. This approach offers several benefits, including greater control and flexibility over your infrastructure provisioning.

1. **Check Terraform Version**:

    After downloading Terraform, verify its version to ensure it's correctly installed:

     ```shell
     terraform -v
     ```
     
2. **Update terraform.tf Configuration**:

Modify the `terraform.tf` configuration file to specify the required Terraform version under the `required_version` block, and comment out the "cloud" block:

```hcl
terraform {
  required_version = "~>1.5.0"

    # cloud {
    #   workspaces {
    #     tags = ["github-actions"]
    #   }
    # }

  # Other configuration settings...
}
```

3. **Specify Staging Environment**:

To define the staging environment you intend to work with, set the `STAGE` variable:

```shell
export STAGE=dev
```

4. **Bundle Node.js files with Webpack**
To bundle your Node.js files using Webpack, optimizing it for production deployment:

```shell
cd api/
npm run build
```

5. **Terraform Init, Plan and Apply**:

```shell
terraform init
terraform plan
terraform apply --auto-approve
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
[Provide a way for users to contact you, whether it's an email address, a link to your website, or social media profiles.]


## Contact

For inquiries and further information, feel free to reach out to me through my [portfolio page](https://www.algebananazzzzz.com).
