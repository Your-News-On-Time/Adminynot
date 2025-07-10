# 🚀 CONFIGURACIÓN VERCEL - PASO A PASO

## 🔧 **PROBLEMA IDENTIFICADO:**
- ✅ **Local**: Funciona (tienes .env)
- ❌ **Vercel**: No funciona (faltan variables de entorno)

## 📋 **SOLUCIÓN - Configurar Variables en Vercel:**

### 1. **Accede a Vercel Dashboard:**
```
https://vercel.com/dashboard
```

### 2. **Ve a tu proyecto → Settings → Environment Variables**

### 3. **Añade ESTAS variables una por una:**

#### 🔥 **Variables Firebase (CRÍTICAS para login):**
```
Nombre: PUBLIC_FIREBASE_API_KEY
Valor: AIzaSyBJ_IZ7ZXpx2UnctSmXaM0f0LP6ox2Aw6k
Entornos: ✅ Production ✅ Preview ✅ Development
```

```
Nombre: PUBLIC_FIREBASE_AUTH_DOMAIN
Valor: yournewsontime-dd461.firebaseapp.com
Entornos: ✅ Production ✅ Preview ✅ Development
```

```
Nombre: PUBLIC_FIREBASE_PROJECT_ID
Valor: yournewsontime-dd461
Entornos: ✅ Production ✅ Preview ✅ Development
```

```
Nombre: PUBLIC_FIREBASE_STORAGE_BUCKET
Valor: yournewsontime-dd461.firebasestorage.app
Entornos: ✅ Production ✅ Preview ✅ Development
```

```
Nombre: PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Valor: 111111944454
Entornos: ✅ Production ✅ Preview ✅ Development
```

```
Nombre: PUBLIC_FIREBASE_APP_ID
Valor: 1:111111944454:web:050da5505962271344c687
Entornos: ✅ Production ✅ Preview ✅ Development
```

#### 🔧 **Variables Backend:**
```
Nombre: FIREBASE_PROJECT_ID
Valor: yournewsontime-dd461
Entornos: ✅ Production ✅ Preview ✅ Development
```

```
Nombre: NEWSDATA_API_KEY
Valor: pub_e7c6a98efbf94bc687f983a2d50299ee
Entornos: ✅ Production ✅ Preview ✅ Development
```

#### 🔑 **Service Account Key (MUY IMPORTANTE):**
```
Nombre: FIREBASE_SERVICE_ACCOUNT_KEY
Valor: {{YOUR_FIREBASE_SERVICE_ACCOUNT_KEY_JSON}}
Entornos: ✅ Production ✅ Preview ✅ Development

⚠️ IMPORTANTE: Copia TODO el JSON en UNA SOLA LÍNEA
```

### 4. **Después de añadir todas las variables:**
- Click en **"Redeploy"** o **"Trigger new deployment"**
- Espera a que termine el despliegue

### 5. **Verificar que funciona:**
Una vez desplegado, ve a:
```
https://tu-dominio.vercel.app/API/env-check
```

Debería mostrar todas las variables como "✅ Present"

### 6. **Probar el login:**
```
https://tu-dominio.vercel.app/
```

¡El login con Firebase debería funcionar ahora!

---

## 🔍 **PARA DEBUGGING:**
Si sigue sin funcionar:
1. Ve a `/API/env-check` en tu dominio
2. Verifica que todas las variables digan "✅ Present"
3. Si alguna dice "❌ Missing", añádela en Vercel y redespliega
