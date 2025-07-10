// Endpoint para verificar variables de entorno en producción
export const GET = async () => {
  const envVars = {
    // Variables públicas (seguras de mostrar)
    PUBLIC_FIREBASE_PROJECT_ID: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    PUBLIC_FIREBASE_AUTH_DOMAIN: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    PUBLIC_FIREBASE_API_KEY: import.meta.env.PUBLIC_FIREBASE_API_KEY ? "✅ Present" : "❌ Missing",
    PUBLIC_FIREBASE_APP_ID: import.meta.env.PUBLIC_FIREBASE_APP_ID ? "✅ Present" : "❌ Missing",
    
    // Variables privadas (solo verificar existencia)
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? "✅ Present" : "❌ Missing",
    NEWSDATA_API_KEY: process.env.NEWSDATA_API_KEY ? "✅ Present" : "❌ Missing",
    FIREBASE_SERVICE_ACCOUNT_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? "✅ Present" : "❌ Missing",
    
    // Info del entorno
    NODE_ENV: process.env.NODE_ENV || "unknown",
    VERCEL: process.env.VERCEL ? "✅ Running on Vercel" : "❌ Not Vercel",
    VERCEL_ENV: process.env.VERCEL_ENV || "unknown"
  };

  return new Response(JSON.stringify({
    success: true,
    environment: envVars,
    timestamp: new Date().toISOString(),
    message: "Environment variables check"
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
};
