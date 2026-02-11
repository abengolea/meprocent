import { getApp, getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { firebaseApp: null, auth: null, firestore: null };
  }

  try {
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY') {
      console.warn('Firebase API Key missing or placeholder. Please check your .env file.');
      return { firebaseApp: null, auth: null, firestore: null };
    }

    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApp();
    }

    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);

    return { firebaseApp, auth, firestore };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return { firebaseApp: null, auth: null, firestore: null };
  }
}

export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { FirebaseProvider, useFirebase, useFirebaseApp, useAuth, useFirestore } from './provider';
