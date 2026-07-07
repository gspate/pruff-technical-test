#!/bin/bash
set -e

# ==============================================================================
# Script para actualizar ECS Fargate
# Fuerza al servicio a descargar la imagen :latest más reciente desde ECR
# ==============================================================================

echo -e "\n[+] Forzando actualización del servicio en Fargate para cargar la nueva imagen..."
aws ecs update-service --cluster pruff-property-finder-cluster --service pruff-property-finder-service --force-new-deployment --no-cli-pager > /dev/null

echo -e "\n ¡Servidores reiniciando exitosamente!"
echo "Fargate tardará un par de minutos en apagar los contenedores viejos y levantar los nuevos."
