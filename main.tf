terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20.0"
    }
  }
}

provider "docker" {}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "docker_image" "app" {
  name = "docker.io/laulauchau/product-feedback-app:latest"
  keep_locally = false
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