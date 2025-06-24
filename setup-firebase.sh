#!/bin/bash

echo "🔥 Configuración de Firebase para YourNewsOnTime Admin"
echo "=================================================="

# Verificar si gcloud está instalado
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI no está instalado."
    echo "📦 Instalando Google Cloud CLI..."
    
    # Detectar el sistema operativo
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install google-cloud-sdk
        else
            echo "🔔 Por favor instala Homebrew primero o descarga gcloud manualmente:"
            echo "   https://cloud.google.com/sdk/docs/install"
            exit 1
        fi
    else
        echo "🔔 Por favor instala Google Cloud CLI manualmente:"
        echo "   https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
fi

echo "✅ Google Cloud CLI disponible"

# Verificar si ya está autenticado
if gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n 1 | grep -q "@"; then
    echo "✅ Ya tienes una cuenta autenticada:"
    gcloud auth list --filter=status:ACTIVE --format="value(account)"
    
    read -p "¿Quieres usar esta cuenta? (y/n): " use_current
    if [[ $use_current != "y" && $use_current != "Y" ]]; then
        echo "🔄 Iniciando nueva autenticación..."
        gcloud auth application-default login
    else
        echo "🔄 Configurando credenciales por defecto..."
        gcloud auth application-default login
    fi
else
    echo "🔄 Iniciando autenticación..."
    gcloud auth application-default login
fi

# Listar proyectos disponibles
echo ""
echo "📋 Tus proyectos de Firebase/Google Cloud:"
gcloud projects list --format="table(projectId,name,projectNumber)"

echo ""
read -p "🎯 Ingresa el PROJECT_ID de tu app de Firebase: " project_id

if [ -n "$project_id" ]; then
    # Configurar el proyecto por defecto
    gcloud config set project $project_id
    
    # Crear archivo .env
    cat > .env << EOF
# Firebase Configuration (auto-generated)
FIREBASE_PROJECT_ID=$project_id

# NewsData.io API Key
NEWSDATA_API_KEY=tu_api_key_aqui

# Google Application Default Credentials se configuran automáticamente
# No necesitas FIREBASE_CLIENT_EMAIL ni FIREBASE_PRIVATE_KEY
EOF

    echo "✅ Archivo .env creado con tu proyecto: $project_id"
    echo "🔔 No olvides añadir tu NEWSDATA_API_KEY en el archivo .env"
    echo ""
    echo "🚀 ¡Listo! Ahora ejecuta: npm run dev"
else
    echo "❌ No se ingresó un PROJECT_ID válido"
    exit 1
fi
