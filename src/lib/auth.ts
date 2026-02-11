import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const { auth, firestore } = initializeFirebase();

/**
 * Sincroniza el perfil de usuario de Auth con la colección 'users' en Firestore.
 * Si es el email del administrador, otorga permisos de super_admin.
 */
async function syncUserProfile(user: FirebaseUser, displayName?: string) {
  if (!user || !firestore) return;

  const userRef = doc(firestore, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  const isSuperAdminEmail = user.email === 'abengolea1@gmail.com';
  
  const baseData = {
    id: user.uid,
    email: user.email,
    displayName: displayName || user.displayName || 'Usuario',
    photoURL: user.photoURL || '',
    lastLoginAt: serverTimestamp(),
    activo: true,
  };

  // Si el usuario no existe, o si es el email de super admin (para asegurar el rol)
  if (!userSnap.exists() || isSuperAdminEmail) {
    await setDoc(userRef, {
      ...baseData,
      role: isSuperAdminEmail ? 'super_admin' : (userSnap.data()?.role || 'cliente'),
      empresaId: isSuperAdminEmail ? 'meprocent-admin' : (userSnap.data()?.empresaId || 'default'),
      createdAt: userSnap.exists() ? userSnap.data()?.createdAt : serverTimestamp(),
    }, { merge: true });
  } else {
    // Si ya existe, solo actualizamos datos básicos y último login
    await setDoc(userRef, baseData, { merge: true });
  }
}

export async function signUpEmail(email: string, password: string, displayName?: string) {
  if (!auth) throw new Error('Firebase Auth not initialized');
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await syncUserProfile(userCredential.user, displayName);
  return userCredential.user;
}

export async function signInEmail(email: string, password: string) {
  if (!auth) throw new Error('Firebase Auth not initialized');
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  await syncUserProfile(userCredential.user);
  return userCredential.user;
}

export async function signInGoogle() {
  if (!auth) throw new Error('Firebase Auth not initialized');
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  await syncUserProfile(userCredential.user);
  return userCredential.user;
}

export async function signOutUser() {
  if (!auth) return;
  return await signOut(auth);
}

export function onAuthChanged(callback: (user: FirebaseUser | null) => void) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}
