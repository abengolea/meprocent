
'use client';

import { collection, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';

export type AuditAction =
  | "CREATED"
  | "ASSIGNED"
  | "STARTED"
  | "UPDATED"
  | "EVIDENCE_ADDED"
  | "SIGN_REQUESTED"
  | "SIGNED"
  | "LOCKED"
  | "CLOSED";

interface AuditLogParams {
  db: Firestore;
  interventionId: string;
  action: AuditAction;
  userId: string;
  userName: string;
  payload?: Record<string, any>;
}

/**
 * Registra una acción en el historial de auditoría de una intervención.
 * Crucial para cumplimiento normativo y certificación legal.
 */
export async function writeAuditLog({
  db,
  interventionId,
  action,
  userId,
  userName,
  payload = {}
}: AuditLogParams) {
  if (!db || !interventionId) return;

  const auditRef = collection(db, 'intervenciones', interventionId, 'audit');
  
  try {
    await addDoc(auditRef, {
      timestamp: serverTimestamp(),
      action,
      userId,
      userName,
      payload,
    });
  } catch (error) {
    // Los errores aquí no deben bloquear la UI pero sí registrarse
    console.error(`Audit Log Failure [${action}]:`, error);
  }
}
