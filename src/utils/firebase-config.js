// Configuración de Firebase para cliente y admin
import { config } from 'dotenv';

// Cargar variables de entorno
config();

// Configuración del cliente Firebase (frontend)
export const firebaseClientConfig = {
  apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.PUBLIC_FIREBASE_APP_ID
};

// Configuración mínima para admin usando las credenciales disponibles
export const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.PUBLIC_FIREBASE_PROJECT_ID,
  // Si no tienes service account key, usaremos la configuración de cliente donde sea posible
  apiKey: process.env.GOOGLE_CLOUD_API_KEY || process.env.PUBLIC_FIREBASE_API_KEY
};

// Verificar configuración
export const isFirebaseConfigured = () => {
  const clientConfigured = !!(
    firebaseClientConfig.apiKey && 
    firebaseClientConfig.projectId && 
    firebaseClientConfig.authDomain
  );
  
  const adminConfigured = !!(
    firebaseAdminConfig.projectId
  );
  
  return {
    client: clientConfigured,
    admin: adminConfigured,
    projectId: firebaseAdminConfig.projectId
  };
};

console.log('Firebase Config Status:', isFirebaseConfigured());
