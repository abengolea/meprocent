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
    const errorMsg = `Faltan variables de entorno esenciales: ${missing.join(', ')}`;
    if (typeof window === 'undefined') {
      // Color rojo en consola de servidor
      console.error('\x1b[31m%s\x1b[0m', 'ERROR FATAL: ' + errorMsg);
    } else {
      console.error('Firebase Error: ' + errorMsg);
    }
  }
}
