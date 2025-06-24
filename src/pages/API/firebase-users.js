// src/pages/API/firebase-users.js
import { getUsers } from '../../ddbb/firebaseAdmin.js';

// Usar la función centralizada que maneja tanto el modo demo como el modo live
async function getAllUsers() {
  try {
    const userData = await getUsers();
    return userData.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      creationTime: user.creationTime,
      emailVerified: user.emailVerified,
      disabled: user.disabled,
      lastSignInTime: user.lastSignInTime
    }));
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
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