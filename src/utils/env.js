// src/utils/env.js
import dotenv from 'dotenv';

// Cargar variables de entorno una sola vez
dotenv.config();

export const env = {
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  NEWSDATA_API_KEY: process.env.NEWSDATA_API_KEY,
  GOOGLE_CLOUD_API_KEY: process.env.GOOGLE_CLOUD_API_KEY
};

export default env;
