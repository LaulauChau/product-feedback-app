# EKS Deployment Example

This directory contains example configurations for deploying the application to Amazon EKS (Elastic Kubernetes Service).

## Files

- `example-workflow.yml`: A GitHub Actions workflow for building the Docker image, pushing it to ECR, and deploying to EKS.
- `example-terraform-main.tf`: Terraform configuration for setting up the EKS cluster.
- `example-kubernetes-deployment.yaml`: Kubernetes manifest for the application deployment.
- `example-kubernetes-service.yaml`: Kubernetes manifest for the application service.

## Usage

To use these files for EKS deployment:

1. Copy `example-workflow.yml` to `.github/workflows/eks-deploy.yml` in your project root.
2. Copy `example-terraform-main.tf` to your Terraform configuration directory.
3. Create a `kubernetes` directory in your project root and copy the `example-kubernetes-*.yaml` files there.
4. Update the copied files with your specific details (AWS region, cluster name, etc.).
5. Set up the necessary secrets in your GitHub repository:
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
6. Ensure your AWS account is set up for EKS and you have the necessary permissions.

Note: These are example configurations and may need to be adjusted based on your specific requirements and infrastructure setup.

## Prerequisites

- AWS Account with EKS permissions
- Terraform installed locally for testing
- kubectl installed locally for testing
- Basic understanding of Kubernetes and AWS services

## Additional Resources

- [Amazon EKS Documentation](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)
- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Kubernetes Documentation](https://kubernetes.io/docs/home/)
