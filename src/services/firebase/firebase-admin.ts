import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const adminApp = getApps().find((app: App) => app.name === 'admin') || initializeApp(firebaseAdminConfig, 'admin');

// Initialize Firebase Admin services
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);

export default adminApp;
