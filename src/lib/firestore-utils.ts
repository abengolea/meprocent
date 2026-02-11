'use client';

import { collection, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';

/**
 * Registra una acción en el historial de auditoría de una intervención.
 * Este registro es vital para la certificación legal de los servicios.
 */
export async function logIntervencionAction(
  db: Firestore, 
  intervencionId: string, 
  userId: string, 
  userName: string, 
  action: string, 
  changes: any = {}
) {
  if (!db || !intervencionId) return;

  const auditRef = collection(db, 'intervenciones', intervencionId, 'audit');
  
  try {
    await addDoc(auditRef, {
      timestamp: serverTimestamp(),
      userId,
      userName,
      action,
      changes,
    });
  } catch (error) {
    console.error('Error recording audit log:', error);
    // No bloqueamos la ejecución principal por un error de log, 
    // pero en producción querrías saber si esto falla.
  }
}
