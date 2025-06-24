// src/ddbb/newsdata.js
import fetch from "node-fetch";
import { env } from '../utils/env.js';
import { logNewsDataRequest } from './apiLogger.js';

const NEWSDATA_API_KEY = env.NEWSDATA_API_KEY;

export async function fetchNewsExecutions({ q, from, to, language, category, country, userAgent, ip }) {
  const startTime = Date.now();
  
  const params = new URLSearchParams({
    apikey: NEWSDATA_API_KEY,
    ...(q && { q }),
    ...(language && { language }),
    ...(category && { category }),
    ...(country && { country }),
    ...(from && { from_date: from }),
    ...(to && { to_date: to })
  });

  console.log('🔍 Making NewsData.io request:', params.toString());

  try {
    const res = await fetch(`https://newsdata.io/api/1/news?${params}`);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (!res.ok) {
      // Registrar error
      await logNewsDataRequest({
        parameters: { q, from, to, language, category, country },
        userAgent,
        ip,
        status: 'error',
        statusCode: res.status,
        responseTime,
        error: `NewsData API error ${res.status}`
      });
      
      throw new Error(`NewsData error ${res.status}`);
    }
    
    const data = await res.json();
    
    // Registrar petición exitosa
    await logNewsDataRequest({
      parameters: { q, from, to, language, category, country },
      userAgent,
      ip,
      status: 'success',
      statusCode: res.status,
      responseTime,
      resultsCount: data.totalResults || 0,
      responseSize: JSON.stringify(data).length
    });
    
    console.log('✅ NewsData.io request successful:', {
      results: data.totalResults,
      responseTime: `${responseTime}ms`
    });
    
    return {
      totalResults: data.totalResults,
      articles: data.results
    };
  } catch (error) {
    console.error('❌ NewsData.io request failed:', error.message);
    
    // Registrar error si no se hizo antes
    if (!error.message.includes('NewsData error')) {
      await logNewsDataRequest({
        parameters: { q, from, to, language, category, country },
        userAgent,
        ip,
        status: 'error',
        error: error.message
      });
    }
    throw error;
  }
}

// Función auxiliar para hacer peticiones de prueba (testing)
export async function testNewsDataConnection() {
  try {
    const result = await fetchNewsExecutions({
      q: 'test',
      language: 'en',
      userAgent: 'Admin-Dashboard-Test',
      ip: 'localhost'
    });
    return { success: true, message: 'NewsData.io connection successful' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}