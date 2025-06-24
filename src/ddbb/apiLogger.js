// src/ddbb/apiLogger.js
import { db } from './firebaseAdmin.js';
import admin from 'firebase-admin';

// Usar la instancia centralizada de Firebase desde firebaseAdmin.js
// Esto evita conflictos de inicialización múltiple

// Función para registrar una petición a NewsData.io
export async function logNewsDataRequest(requestData) {
  try {
    const logEntry = {
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      endpoint: 'newsdata.io',
      parameters: requestData.parameters || {},
      userAgent: requestData.userAgent || '',
      ip: requestData.ip || '',
      status: requestData.status || 'success',
      responseSize: requestData.responseSize || 0,
      ...requestData
    };

    await db.collection('api_requests').add(logEntry);
    console.log('NewsData request logged successfully');
  } catch (error) {
    console.error('Error logging NewsData request:', error);
  }
}

// Función para obtener estadísticas de peticiones
export async function getApiRequestsStats(days = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const snapshot = await db.collection('api_requests')
      .where('timestamp', '>=', startDate)
      .orderBy('timestamp', 'desc')
      .get();

    const requests = [];
    snapshot.forEach(doc => {
      requests.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date()
      });
    });

    // Agrupar por días
    const dailyStats = {};
    requests.forEach(req => {
      const date = req.timestamp.toISOString().split('T')[0];
      dailyStats[date] = (dailyStats[date] || 0) + 1;
    });

    return {
      total: requests.length,
      dailyStats,
      recentRequests: requests.slice(0, 10), // Los 10 más recientes
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting API requests stats:', error);
    return {
      total: 0,
      dailyStats: {},
      recentRequests: [],
      error: 'Could not fetch API stats',
      lastUpdate: new Date().toISOString()
    };
  }
}
