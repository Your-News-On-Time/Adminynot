#!/bin/bash

echo "🔄 Reiniciando servidor con nuevas credenciales de Firebase..."

# Matar procesos existentes en el puerto
echo "🛑 Deteniendo servidor actual..."
lsof -ti:4321,4322 | xargs kill -9 2>/dev/null || true

# Esperar un momento
sleep 2

# Iniciar servidor
echo "🚀 Iniciando servidor con credenciales actualizadas..."
npm run dev

echo ""
echo "✅ Servidor reiniciado!"
echo "📱 Dashboard: http://localhost:4321/dashboard"
echo ""
echo "🧪 Para probar la integración:"
echo "   ./test-integration.sh"
