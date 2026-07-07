#!/bin/bash
set -e

# ==============================================================================
# Script de Despliegue de Imagen Docker a AWS ECR
# Este script automatiza la compilación y subida de la imagen de Next.js
# ==============================================================================

# Obtener dinámicamente el Account ID del usuario
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="sa-east-1"
REPO_NAME="pruff-property-finder-repo"
ECR_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

echo "-> Account ID: $ACCOUNT_ID"
echo "-> Región: $REGION"
echo "-> Repositorio: $REPO_NAME"

# 1. Login en AWS ECR
echo -e "\n[1/4] Autenticando con AWS ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_URI

# 2. Compilar imagen forzando arquitectura linux/amd64 (Para Fargate X86_64)
# (Es importante el '../../' para construir desde la raíz del proyecto)
echo -e "\n[2/4] Compilando imagen de Docker (linux/amd64)..."
docker build --platform linux/amd64 -t $REPO_NAME ../../

# 3. Etiquetar la imagen
echo -e "\n[3/4] Etiquetando imagen para ECR..."
docker tag ${REPO_NAME}:latest ${ECR_URI}/${REPO_NAME}:latest

# 4. Subir imagen
echo -e "\n[4/5] Subiendo imagen a AWS (Esto puede tardar unos minutos)..."
docker push ${ECR_URI}/${REPO_NAME}:latest

echo -e "\n ¡Imagen subida exitosamente!"
echo "Para desplegar estos cambios, ejecuta: ./update-fargate.sh"
