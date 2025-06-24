import type { APIRoute } from 'astro';
import { getUsersStats } from '../../ddbb/firebaseAdmin.js';

export const GET: APIRoute = async () => {
  try {
    const stats = await getUsersStats();
    
    return new Response(JSON.stringify({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error en endpoint usuarios:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Error obteniendo estadísticas de usuarios',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};