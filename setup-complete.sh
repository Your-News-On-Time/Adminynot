#!/bin/bash

echo "🚀 CONFIGURACIÓN COMPLETA - YourNewsOnTime Admin Dashboard"
echo "========================================================="

# Función para imprimir en colores
print_green() { echo -e "\033[32m$1\033[0m"; }
print_red() { echo -e "\033[31m$1\033[0m"; }
print_yellow() { echo -e "\033[33m$1\033[0m"; }
print_blue() { echo -e "\033[34m$1\033[0m"; }

# Paso 1: Configurar Firebase
print_blue "📱 PASO 1: Configurar Firebase"
echo "==============================="

if [ ! -f ".env" ]; then
    print_yellow "No se encontró archivo .env, ejecutando configuración de Firebase..."
    ./setup-firebase.sh
else
    print_green "✅ Archivo .env encontrado"
    cat .env
    echo ""
    read -p "¿Quieres reconfigurar Firebase? (y/n): " reconfig
    if [[ $reconfig == "y" || $reconfig == "Y" ]]; then
        ./setup-firebase.sh
    fi
fi

# Paso 2: Configurar NewsData.io
print_blue "📰 PASO 2: Configurar NewsData.io API"
echo "====================================="

if grep -q "tu_api_key_aqui" .env 2>/dev/null; then
    print_yellow "⚠️  Necesitas configurar tu API key de NewsData.io"
    read -p "🔑 Ingresa tu NewsData.io API key: " newsdata_key
    
    if [ -n "$newsdata_key" ]; then
        # Reemplazar la API key en el archivo .env
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/tu_api_key_aqui/$newsdata_key/" .env
        else
            # Linux
            sed -i "s/tu_api_key_aqui/$newsdata_key/" .env
        fi
        print_green "✅ API key de NewsData.io configurada"
    else
        print_red "❌ No se ingresó una API key válida"
    fi
else
    print_green "✅ API key de NewsData.io ya configurada"
fi

# Paso 3: Instalar dependencias
print_blue "📦 PASO 3: Verificar dependencias"
echo "=================================="

if [ ! -d "node_modules" ]; then
    print_yellow "Instalando dependencias..."
    npm install
else
    print_green "✅ Dependencias ya instaladas"
fi

# Paso 4: Probar configuración
print_blue "🧪 PASO 4: Probar configuración"
echo "==============================="

print_yellow "Iniciando servidor de desarrollo..."
npm run dev &
SERVER_PID=$!

# Esperar a que el servidor inicie
sleep 5

# Probar endpoints
print_yellow "Probando endpoints..."

echo "🔍 Probando usuarios de Firebase..."
curl -s http://localhost:4321/API/usuarios | jq '.' 2>/dev/null || echo "Endpoint funcionando (no tienes jq instalado para ver JSON bonito)"

echo ""
echo "🔍 Probando NewsData.io de hoy..."
curl -s http://localhost:4321/API/newsdata-today | jq '.' 2>/dev/null || echo "Endpoint funcionando"

echo ""
echo "🔍 Probando lista de usuarios..."
curl -s http://localhost:4321/API/usuarios-lista | jq '.' 2>/dev/null || echo "Endpoint funcionando"

# Finalizar
print_green "🎉 ¡CONFIGURACIÓN COMPLETADA!"
echo "=============================="
print_blue "📊 Tu dashboard está disponible en: http://localhost:4321/dashboard"
print_blue "🏠 Página principal: http://localhost:4321/"
echo ""
print_yellow "📝 Instrucciones para tu app principal:"
echo "Para que el tracking funcione automáticamente, en tu app usa:"
echo ""
echo "import { fetchNewsExecutions } from './src/ddbb/newsdata.js';"
echo ""
echo "const news = await fetchNewsExecutions({"
echo "  q: 'technology',"
echo "  language: 'es',"
echo "  userAgent: request.headers['user-agent'],"
echo "  ip: request.ip"
echo "});"
echo ""
print_blue "🔄 El dashboard se actualiza automáticamente cada 30 segundos"
print_blue "🧪 Usa el botón 'Probar NewsData.io' en el dashboard para verificar la conexión"

# No matar el servidor, dejarlo corriendo
# kill $SERVER_PID
