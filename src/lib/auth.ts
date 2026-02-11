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
  serverTimestamp 
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const { auth, firestore } = initializeFirebase();

/**
 * Sincroniza el perfil de usuario de Auth con la colección 'users' en Firestore.
 */
async function syncUserProfile(user: FirebaseUser, displayName?: string) {
  if (!user) return;

  const userRef = doc(firestore, 'users', user.uid);
  
  // Usamos setDoc con merge para no sobrescribir roles existentes
  // pero aseguramos que el documento exista con datos básicos.
  await setDoc(userRef, {
    id: user.uid,
    email: user.email,
    displayName: displayName || user.displayName || 'Usuario',
    photoURL: user.photoURL || '',
    lastLoginAt: serverTimestamp(),
    // Campos por defecto para nuevos usuarios
    active: true,
    createdAt: serverTimestamp(),
  }, { merge: true });

  // Nota: El rol se gestionará en el Paso 4. 
  // Por ahora, si no tiene rol, asignamos 'cliente' por defecto según el requerimiento.
}

export async function signUpEmail(email: string, password: string, displayName?: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await syncUserProfile(userCredential.user, displayName);
  
  const userRef = doc(firestore, 'users', userCredential.user.uid);
  await setDoc(userRef, { role: 'cliente' }, { merge: true });
  
  return userCredential.user;
}

export async function signInEmail(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  await syncUserProfile(userCredential.user);
  return userCredential.user;
}

export async function signInGoogle() {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  await syncUserProfile(userCredential.user);
  
  // Asignamos rol por defecto si es nuevo
  const userRef = doc(firestore, 'users', userCredential.user.uid);
  await setDoc(userRef, { role: 'cliente' }, { merge: true });
  
  return userCredential.user;
}

export async function signOutUser() {
  return await signOut(auth);
}

export function onAuthChanged(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
