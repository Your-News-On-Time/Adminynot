import type { APIRoute } from 'astro';
import { getUsers } from '../../ddbb/firebaseAdmin.js';

export const GET: APIRoute = async () => {
  try {
    const userData = await getUsers();
    
    return new Response(JSON.stringify({
      success: true,
      data: userData,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error en endpoint usuarios-lista:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Error obteniendo lista de usuarios',
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
