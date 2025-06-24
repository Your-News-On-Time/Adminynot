# 📊 YourNewsOnTime Admin Dashboard

Panel de administración para monitorear usuarios de Firebase y peticiones a NewsData.io API.

## 🚀 Configuración

### 1. Variables de Entorno

Copia `.env.example` a `.env` y configura:

```bash
cp .env.example .env
```

### 2. Firebase Setup

**Opción A: Application Default Credentials (Recomendado)**

```bash
# Instalar Google Cloud CLI
# Autenticarse
gcloud auth application-default login
```

**Opción B: Variables de entorno**

```env
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_CLIENT_EMAIL=tu-service-account@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu clave privada\n-----END PRIVATE KEY-----\n"
```

### 3. NewsData.io API Key

```env
NEWSDATA_API_KEY=tu-api-key-de-newsdata
```

## 📈 Tracking de API Requests

### Automático (Recomendado)

Importa y usa la función `fetchNewsExecutions` desde tu app:

```javascript
import { fetchNewsExecutions } from "./src/ddbb/newsdata.js";

// Esto automáticamente registrará la petición
const news = await fetchNewsExecutions({
  q: "technology",
  language: "es",
  userAgent: req.headers["user-agent"],
  ip: req.ip,
});
```

### Manual

Envía datos al endpoint de tracking:

```javascript
fetch("/API/track-newsdata", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    parameters: { q: "sports", language: "es" },
    status: "success",
    responseTime: 245,
    resultsCount: 10,
  }),
});
```

## 🔥 Base de Datos Firestore

El sistema crea automáticamente la colección `api_requests` con esta estructura:

```javascript
{
  timestamp: Date,
  endpoint: 'newsdata.io',
  parameters: { q: 'sports', language: 'es' },
  userAgent: 'Mozilla/5.0...',
  ip: '192.168.1.1',
  status: 'success',
  statusCode: 200,
  responseTime: 245,
  resultsCount: 10,
  responseSize: 1024
}
```

## 📊 Funcionalidades

- **Usuarios Firebase**: Total y activos (últimos 30 días)
- **API Requests**: Total, promedio diario, y estadísticas detalladas
- **Fallback**: Datos demo si no se puede conectar a Firebase
- **Indicadores**: "Live" para datos reales, "Demo" para fallback

## 🛠️ Desarrollo

```bash
npm install
npm run dev
```

## 📦 Build

```bash
npm run build
```
