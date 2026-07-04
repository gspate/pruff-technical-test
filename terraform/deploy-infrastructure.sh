#!/bin/bash
set -e

# ==============================================================================
# Script de Despliegue de Infraestructura a AWS
# Ejecuta Terraform Apply inyectando automáticamente las variables del .env
# ==============================================================================

echo " Iniciando Despliegue de Infraestructura..."

# Verificar si existe el archivo .env un nivel arriba
if [ ! -f "../.env" ]; then
    echo "Error: No se encontró el archivo .env en la raíz del proyecto."
    echo "Asegúrate de copiar .env.example a .env y configurarlo."
    exit 1
fi

echo "-> Cargando variables de entorno desde .env..."
# Exportar las variables omitiendo comentarios
export $(grep -v '^#' ../.env | xargs)

# Validar que existan las claves necesarias
if [ -z "$RESEND_API_KEY" ] || [ -z "$CLOUDFLARE_TUNNEL_TOKEN" ]; then
    echo "Error: Faltan RESEND_API_KEY o CLOUDFLARE_TUNNEL_TOKEN en el .env"
    exit 1
fi

APP_DOMAIN="pruff.rentario.cl"

echo "-> Dominio Objetivo: $APP_DOMAIN"
echo "-> Lanzando Terraform Apply..."
echo ""

# Ejecutar el binario local de terraform y pasarle las variables
./bin/terraform apply \
    -var="resend_api_key=$RESEND_API_KEY" \
    -var="cloudflare_token=$CLOUDFLARE_TUNNEL_TOKEN" \
    -var="app_domain=$APP_DOMAIN"

echo ""
echo "¡Despliegue finalizado! Si Terraform marcó éxito, tu infraestructura está viva."
