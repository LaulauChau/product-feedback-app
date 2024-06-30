provider "aws" {
  region = "eu-west-1"
}

resource "aws_eks_cluster" "example" {
  name     = "product-feedback-cluster"
  role_arn = aws_iam_role.example.arn

  vpc_config {
    subnet_ids = ["subnet-12345678", "subnet-87654321"]  # Specify your subnet IDs
  }
}

resource "aws_iam_role" "example" {
  name = "eks-cluster-example"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })
}

resource "kubernetes_deployment" "app" {
  metadata {
    name = "product-feedback-app"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "product-feedback"
      }
    }

    template {
      metadata {
        labels = {
          app = "product-feedback"
        }
      }

      spec {
        container {
          image = docker_image.app.name
          name  = "product-feedback"

          port {
            container_port = 3000
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "app" {
  metadata {
    name = "product-feedback-service"
  }

  spec {
    selector = {
      app = kubernetes_deployment.app.spec.0.template.0.metadata.0.labels.app
    }

    port {
      port        = 80
      target_port = 3000
    }

    type = "NodePort"
  }
}