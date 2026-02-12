'use client';

import { collection, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';

export type AuditAction =
  | "CREATED"
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
    console.error(`Audit Log Failure [${action}]:`, error);
  }
}