// src/pages/API/test-newsdata.js
import { env } from '../../utils/env.js';
import { testNewsDataConnection } from '../../ddbb/newsdata.js';

export const GET = async ({ request }) => {
  try {
    console.log('🧪 Testing NewsData.io connection...');
    console.log('📋 Environment check:', {
      NEWSDATA_API_KEY: env.NEWSDATA_API_KEY ? 'Configured' : 'Missing'
    });
    
    const result = await testNewsDataConnection();
    
    return new Response(
      JSON.stringify({
        ...result,
        timestamp: new Date().toISOString(),
        apiKeyStatus: env.NEWSDATA_API_KEY ? 'Configured' : 'Missing',
        message: result.success ? 
          'NewsData.io API está funcionando correctamente!' : 
          'Error conectando con NewsData.io API'
      }),
      { 
        status: result.success ? 200 : 500,
        headers: { "Content-Type": "application/json; charset=utf-8" } 
      }
    );
  } catch (error) {
    console.error('Error testing NewsData connection:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        apiKeyStatus: env.NEWSDATA_API_KEY ? 'Configured' : 'Missing',
        message: 'No se pudo probar la conexión con NewsData.io'
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json; charset=utf-8" } 
      }
    );
  }
}
