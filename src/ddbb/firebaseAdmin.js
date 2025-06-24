import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';
import { firebaseAdminConfig, firebaseClientConfig } from '../utils/firebase-config.js';

// Cargar variables de entorno
config();

// Variables globales para la instancia única
let adminApp = null;
let authService = null;
let dbService = null;

// Estado de la configuración
const configStatus = {
  hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
  hasProjectId: !!(process.env.FIREBASE_PROJECT_ID || process.env.PUBLIC_FIREBASE_PROJECT_ID),
  isConfigured: false,
  mode: 'none'
};

// Función para inicializar Firebase (solo se ejecuta una vez)
function initializeFirebaseAdmin() {
  if (adminApp) {
    return adminApp; // Ya inicializado
  }

  try {
    // Verificar si ya existe una app
    const existingApps = getApps();
    if (existingApps.length > 0) {
      adminApp = existingApps[0];
      configStatus.isConfigured = true;
      configStatus.mode = 'existing-app';
      console.log('✅ Usando Firebase Admin app existente');
    } else {
      // Opción 1: Service Account Key (preferida para producción)
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
          const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
          
          // Validar que el service account tenga el project_id
          if (!serviceAccount.project_id) {
            throw new Error('Service account JSON is missing project_id');
          }
          
          adminApp = initializeApp({
            credential: cert(serviceAccount),
            projectId: serviceAccount.project_id // Usar el project_id del service account
          });
          configStatus.isConfigured = true;
          configStatus.mode = 'service-account';
          console.log('✅ Firebase Admin inicializado con Service Account Key');
        } catch (parseError) {
          console.error('❌ Error parsing service account key:', parseError.message);
          throw parseError;
        }
      } 
      // Opción 2: Configuración mínima con project ID
      else if (firebaseAdminConfig.projectId) {
        console.log('⚠️ No service account key found, usando configuración mínima');
        console.log('🔧 Project ID:', firebaseAdminConfig.projectId);
        
        // Intentar usar Application Default Credentials
        try {
          adminApp = initializeApp({
            projectId: firebaseAdminConfig.projectId
          });
          configStatus.isConfigured = true;
          configStatus.mode = 'default-credentials';
          console.log('✅ Firebase Admin inicializado con Default Credentials');
        } catch (defaultError) {
          console.log('⚠️ Default credentials no disponibles, modo limitado');
          configStatus.mode = 'limited';
        }
      }
    }

    // Inicializar servicios si la app está configurada
    if (adminApp && configStatus.isConfigured) {
      try {
        authService = getAuth(adminApp);
        dbService = getFirestore(adminApp);
        console.log('✅ Servicios Firebase Auth y Firestore inicializados');
      } catch (serviceError) {
        console.error('⚠️ Error inicializando servicios:', serviceError.message);
      }
    }

  } catch (error) {
    console.error('❌ Error crítico inicializando Firebase Admin:', error.message);
    configStatus.mode = 'error';
  }

  return adminApp;
}

// Inicializar Firebase la primera vez que se importa este módulo
initializeFirebaseAdmin();

// Función para obtener usuarios (con fallback a datos demo)
export async function getUsers(maxResults = 1000) {
  if (!authService || !configStatus.isConfigured) {
    console.log('🔄 Firebase Admin no configurado, retornando datos demo');
    return getDemoUsers();
  }

  try {
    const listUsersResult = await authService.listUsers(maxResults);
    return {
      users: listUsersResult.users.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        disabled: user.disabled,
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
        providerData: user.providerData
      })),
      totalUsers: listUsersResult.users.length,
      mode: 'live'
    };
  } catch (error) {
    console.error('❌ Error obteniendo usuarios de Firebase:', error.message);
    return getDemoUsers();
  }
}

// Datos demo para cuando Firebase no esté configurado
function getDemoUsers() {
  const demoUsers = [
    {
      uid: 'demo_user_1',
      email: 'admin@yournewsontime.com',
      displayName: 'Admin Demo',
      emailVerified: true,
      disabled: false,
      creationTime: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 días atrás
      lastSignInTime: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 horas atrás
      providerData: [{ providerId: 'password' }]
    },
    {
      uid: 'demo_user_2',
      email: 'user@example.com',
      displayName: 'Usuario Demo',
      emailVerified: true,
      disabled: false,
      creationTime: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 días atrás
      lastSignInTime: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 día atrás
      providerData: [{ providerId: 'google.com' }]
    },
    {
      uid: 'demo_user_3',
      email: 'test@demo.com',
      displayName: null,
      emailVerified: false,
      disabled: false,
      creationTime: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 días atrás
      lastSignInTime: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 días atrás
      providerData: [{ providerId: 'password' }]
    }
  ];

  return {
    users: demoUsers,
    totalUsers: demoUsers.length,
    mode: 'demo'
  };
}

// Función para obtener estadísticas de usuarios
export async function getUsersStats() {
  const userData = await getUsers();
  const users = userData.users;
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const lastWeek = new Date(today.getTime() - 86400000 * 7);
  const lastMonth = new Date(today.getTime() - 86400000 * 30);

  const stats = {
    total: users.length,
    verified: users.filter(u => u.emailVerified).length,
    disabled: users.filter(u => u.disabled).length,
    newToday: users.filter(u => new Date(u.creationTime) >= today).length,
    newYesterday: users.filter(u => {
      const created = new Date(u.creationTime);
      return created >= yesterday && created < today;
    }).length,
    newThisWeek: users.filter(u => new Date(u.creationTime) >= lastWeek).length,
    newThisMonth: users.filter(u => new Date(u.creationTime) >= lastMonth).length,
    activeToday: users.filter(u => u.lastSignInTime && new Date(u.lastSignInTime) >= today).length,
    activeThisWeek: users.filter(u => u.lastSignInTime && new Date(u.lastSignInTime) >= lastWeek).length,
    providers: {}
  };

  // Contar proveedores
  users.forEach(user => {
    if (user.providerData && user.providerData.length > 0) {
      user.providerData.forEach(provider => {
        stats.providers[provider.providerId] = (stats.providers[provider.providerId] || 0) + 1;
      });
    }
  });

  return {
    ...stats,
    mode: userData.mode
  };
}

export const auth = authService;
export const db = dbService;

// Función para verificar el estado de la configuración
export function getFirebaseAdminStatus() {
  return {
    ...configStatus,
    projectId: firebaseAdminConfig.projectId,
    hasClientConfig: !!(firebaseClientConfig.apiKey && firebaseClientConfig.projectId)
  };
}