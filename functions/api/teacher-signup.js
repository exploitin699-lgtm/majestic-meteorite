const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const functions = require('firebase-functions');

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const auth = getAuth(app);
const db = getFirestore(app);

// Define the Cloud Function
const teacherSignup = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email, password, full_name, subjects, class_levels } = req.body;

    // Validation
    if (!email || !password || !full_name) {
      res.status(400).json({ error: 'Missing required fields: email, password, full_name' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    // Create user with Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: full_name,
    });

    // Store additional data in Firestore
    await db.collection('teachers').doc(userRecord.uid).set({
      uid: userRecord.uid,
      full_name,
      email,
      subjects: Array.isArray(subjects) ? subjects : [],
      class_levels: Array.isArray(class_levels) ? class_levels : [],
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({ success: true, uid: userRecord.uid, message: 'Account created successfully' });
  } catch (error) {
    console.error('Signup error:', error);

    let errorMessage = 'Signup failed';
    let statusCode = 500;

    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Email already in use';
      statusCode = 400;
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
      statusCode = 400;
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak';
      statusCode = 400;
    } else if (error.message?.includes('PERMISSION_DENIED')) {
      errorMessage = 'Permission denied - check Firestore rules';
      statusCode = 403;
    }

    res.status(statusCode).json({ error: errorMessage });
  }
});

module.exports = { teacherSignup };