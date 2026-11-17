/**
 * @fileoverview Validador de variables de entorno para Firebase.
 */

export const env = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Valida que todas las variables de entorno necesarias estén presentes.
 * Emite un error en consola si faltan, facilitando el diagnóstico.
 */
export function validateEnv() {
  const missing = Object.entries(env)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    const errorMsg = `Faltan variables de entorno de Firebase: ${missing.join(', ')}. Creá .env.local (ver .env.example).`;
    console.warn(errorMsg);
    return false;
  }
  return true;
}

export function hasFirebaseEnv() {
  return Object.values(env).every(Boolean);
}
