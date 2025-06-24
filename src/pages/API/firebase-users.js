// src/pages/API/firebase-users.js
import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: `firebase-admin@${process.env.FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
      privateKey: "-----BEGIN PRIVATE KEY-----\nDUMMY_KEY\n-----END PRIVATE KEY-----\n"
    }),
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

async function getAllUsers() {
  const listUsersResult = await admin.auth().listUsers();
  // Puedes filtrar, mapear, etc. aquí si quieres.
  return listUsersResult.users.map(u => ({
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    creationTime: u.metadata?.creationTime
  }));
}

export const GET = async ({ request }) => {
  try {
    const users = await getAllUsers();
    return new Response(JSON.stringify({ users, total: users.length }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}