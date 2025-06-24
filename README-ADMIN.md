# 🚀 YourNewsOnTime Admin Dashboard

**Dashboard completamente funcional** para monitorear usuarios de Firebase y peticiones a NewsData.io API en tiempo real.

## ⚡ Configuración Rápida (1 minuto)

```bash
# 1. Ejecutar configuración automática
./setup-complete.sh

# 2. Abrir en navegador
open http://localhost:4321/dashboard
```

## 🎯 Características

- ✅ **Usuarios reales de Firebase** (total y activos últimos 30 días)
- ✅ **Peticiones reales a NewsData.io** con límites y uso actual
- ✅ **Lista completa de usuarios** con fotos, emails, últimos accesos
- ✅ **Auto-refresh cada 30 segundos**
- ✅ **Tracking automático** de peticiones API
- ✅ **Indicadores Live/Demo** según disponibilidad de datos
- ✅ **Botones de prueba y configuración**

## 📊 Datos Reales

### 🔥 Firebase

- **Total de usuarios** registrados
- **Usuarios activos** (últimos 30 días)
- **Lista detallada** con metadatos

### 📰 NewsData.io

- **Peticiones de hoy** vs límite diario
- **Peticiones restantes**
- **Porcentaje de uso** con barra visual
- **Historial de peticiones**

## 🛠️ Configuración Manual

### 1. Firebase

```bash
# Opción A: Google Cloud CLI (recomendado)
gcloud auth application-default login

# Opción B: Variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

### 2. NewsData.io

```bash
# Añadir a .env
NEWSDATA_API_KEY=tu_api_key_real
```

### 3. Tracking Automático

En tu app principal, reemplaza llamadas directas con:

```javascript
import { fetchNewsExecutions } from "./src/ddbb/newsdata.js";

// Esto registra automáticamente cada petición
const news = await fetchNewsExecutions({
  q: "technology",
  language: "es",
  category: "sports",
  country: "us",
  userAgent: request.headers["user-agent"],
  ip: request.ip,
});
```

## 🎮 Funcionalidades

### Dashboard Principal

- **3 tarjetas** con métricas en tiempo real
- **Lista de usuarios** scrolleable
- **Auto-refresh** cada 30 segundos
- **Botones de acción** para pruebas

### Endpoints API

- `/API/usuarios` - Estadísticas de usuarios
- `/API/usuarios-lista` - Lista completa de usuarios
- `/API/newsdata-today` - Uso de NewsData.io hoy
- `/API/newsdata-logs` - Historial de peticiones
- `/API/test-newsdata` - Prueba de conectividad
- `/API/track-newsdata` - Registro manual de peticiones

### Base de Datos

- **Colección `api_requests`** en Firestore
- **Logging automático** de todas las peticiones
- **Estadísticas** calculadas en tiempo real

## 🚀 Comandos

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview build
npm run preview

# Configuración completa
./setup-complete.sh

# Solo Firebase
./setup-firebase.sh
```

## 🎨 UI/UX

- **Diseño moderno** con Tailwind CSS
- **Indicadores visuales** (Live/Demo)
- **Responsive** (móvil, tablet, desktop)
- **Barras de progreso** para límites API
- **Iconos** para proveedores de autenticación
- **Fechas humanizadas** ("Hoy", "Ayer", "Hace X días")

## 🔧 Troubleshooting

### Firebase no conecta

```bash
# Verificar autenticación
gcloud auth list

# Re-autenticar
gcloud auth application-default login
```

### NewsData.io no funciona

- Verificar API key en `.env`
- Usar botón "🧪 Probar NewsData.io"
- Revisar límites en tu dashboard de NewsData.io

### Datos no se actualizan

- El dashboard se actualiza cada 30 segundos automáticamente
- Usar botón "🔄 Actualizar datos" para refresh manual
- Verificar que tu app esté usando `fetchNewsExecutions()`

## 📈 Analytics

El sistema registra automáticamente:

- **Parámetros** de cada petición
- **Tiempo de respuesta**
- **Cantidad de resultados**
- **IP y User Agent**
- **Estado** (éxito/error)
- **Timestamp** preciso

Ideal para hacer gráficas comparativas y análisis de uso.

---

**¡Dashboard 100% funcional con datos reales!** 🎉
