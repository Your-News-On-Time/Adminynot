// src/pages/API/status.js
import dotenv from 'dotenv';
import { getFirebaseAdminStatus } from '../../ddbb/firebaseAdmin.js';

// Cargar variables de entorno
dotenv.config();

export const GET = async () => {
  try {
    // Información del entorno
    const env = {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '❌ No encontrado',
      NEWSDATA_API_KEY: process.env.NEWSDATA_API_KEY ? '✅ Configurado' : '❌ No encontrado',
      GOOGLE_CLOUD_API_KEY: process.env.GOOGLE_CLOUD_API_KEY ? '✅ Configurado' : '❌ No encontrado'
    };

    // Estado de Firebase Admin
    const firebaseStatus = getFirebaseAdminStatus();

    const status = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: env,
      values: {
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        NEWSDATA_API_KEY: process.env.NEWSDATA_API_KEY?.substring(0, 20) + '...',
        GOOGLE_CLOUD_API_KEY: process.env.GOOGLE_CLOUD_API_KEY?.substring(0, 20) + '...'
      },
      message: 'Dashboard API funcionando correctamente',
      firebase: {
        hasServiceAccount: firebaseStatus.hasServiceAccount,
        hasProjectId: firebaseStatus.hasProjectId,
        isConfigured: firebaseStatus.isConfigured,
        mode: firebaseStatus.mode,
        projectId: firebaseStatus.projectId,
        hasClientConfig: firebaseStatus.hasClientConfig
      }
    };

    return new Response(JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'ERROR',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
