// src/pages/API/track-newsdata.js
import { logNewsDataRequest } from '../../ddbb/apiLogger.js';

export const POST = async ({ request }) => {
  try {
    const requestData = await request.json();
    
    // Validar que tenemos los datos necesarios
    if (!requestData.parameters) {
      return new Response(
        JSON.stringify({ error: 'Missing parameters field' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Registrar la petición
    await logNewsDataRequest({
      parameters: requestData.parameters,
      userAgent: requestData.userAgent || request.headers.get('user-agent'),
      ip: requestData.ip || request.headers.get('x-forwarded-for') || 'unknown',
      status: requestData.status || 'success',
      statusCode: requestData.statusCode || 200,
      responseTime: requestData.responseTime || 0,
      resultsCount: requestData.resultsCount || 0,
      responseSize: requestData.responseSize || 0
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Request logged successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error tracking NewsData request:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to log request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
