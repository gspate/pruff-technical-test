#!/bin/bash
set -e

# ==============================================================================
# Script de Destrucción de Infraestructura a AWS
# Elimina TODOS los recursos creados para detener el cobro en la nube
# ==============================================================================

echo "======================================================"
echo "🧨 Iniciando Destrucción de Infraestructura (Terraform)"
echo "======================================================"
echo "⚠️  ADVERTENCIA: Esto eliminará la Base de Datos, los Contenedores y la Red."
echo "Se perderán todos los datos guardados en producción."
echo ""

# Validar que exista el .env para poder pasar las variables requeridas
if [ ! -f "../.env" ]; then
    echo "❌ Error: No se encontró el archivo .env. Terraform lo necesita para leer las claves."
    exit 1
fi

export $(grep -v '^#' ../.env | xargs)
APP_DOMAIN="pruff.rentario.cl"

echo "-> Destruyendo recursos en AWS..."
./bin/terraform destroy \
    -var="resend_api_key=$RESEND_API_KEY" \
    -var="cloudflare_token=$CLOUDFLARE_TUNNEL_TOKEN" \
    -var="app_domain=$APP_DOMAIN"

echo ""
echo "✅ ¡Infraestructura destruida con éxito! AWS ya no te cobrará por estos recursos."
