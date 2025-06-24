// src/pages/API/newsdata-logs.js
import { getApiRequestsStats } from '../../ddbb/apiLogger.js';

export const GET = async ({ request }) => {
  try {
    // Obtener estadísticas reales de las peticiones a NewsData.io
    const stats = await getApiRequestsStats(30); // Últimos 30 días
    
    return new Response(
      JSON.stringify({
        count: stats.total,
        dailyStats: stats.dailyStats,
        recentRequests: stats.recentRequests,
        lastUpdate: stats.lastUpdate
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json; charset=utf-8" } 
      }
    );
  } catch (error) {
    console.error('Error fetching NewsData logs:', error);
    
    // Fallback a datos simulados si hay error
    const fallbackLogs = [
      { id: '00217', user: 'mario@email.com', date: '2025-06-24 21:19', params: 'category=sports&country=es' },
      { id: '00216', user: 'carla@email.com', date: '2025-06-24 18:51', params: 'category=world&country=us' },
      { id: '00215', user: 'admin@email.com', date: '2025-06-23 16:42', params: 'category=tech&country=fr' },
    ];
    
    return new Response(
      JSON.stringify({ 
        count: fallbackLogs.length,
        recentRequests: fallbackLogs,
        error: 'Could not fetch real API stats',
        lastUpdate: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json; charset=utf-8" } 
      }
    );
  }
}