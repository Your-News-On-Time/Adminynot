// Temporal: Verificar configuración de Firebase en tu aplicación
// Ve a tu aplicación en Vercel y añade esto al final de la URL: /API/firebase-debug

export const GET = async () => {
  // Verificar todas las variables de Firebase
  const firebaseVars = {
    PUBLIC_FIREBASE_API_KEY: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    PUBLIC_FIREBASE_AUTH_DOMAIN: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    PUBLIC_FIREBASE_PROJECT_ID: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    PUBLIC_FIREBASE_STORAGE_BUCKET: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    PUBLIC_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    PUBLIC_FIREBASE_APP_ID: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  };

  // Verificar si alguna está undefined
  const missingVars = Object.entries(firebaseVars)
    .filter(([key, value]) => !value || value === 'undefined')
    .map(([key]) => key);

  // Test de la API key
  let apiKeyTest = "Unknown";
  if (firebaseVars.PUBLIC_FIREBASE_API_KEY) {
    try {
      const testUrl = `https://identitytoolkit.googleapis.com/v1/projects/${firebaseVars.PUBLIC_FIREBASE_PROJECT_ID}?key=${firebaseVars.PUBLIC_FIREBASE_API_KEY}`;
      const response = await fetch(testUrl);
      apiKeyTest = response.ok ? "✅ Valid" : `❌ Invalid (${response.status})`;
    } catch (error) {
      apiKeyTest = `❌ Error: ${error.message}`;
    }
  }

  return new Response(JSON.stringify({
    success: true,
    firebaseConfig: firebaseVars,
    missingVariables: missingVars,
    apiKeyTest: apiKeyTest,
    timestamp: new Date().toISOString(),
    instructions: {
      step1: "If API key test fails, go to Firebase Console",
      step2: "https://console.firebase.google.com/project/yournewsontime-dd461/settings/general",
      step3: "Copy the correct configuration from 'Your apps' section",
      step4: "Update the variables in Vercel and redeploy"
    }
  }, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
};
