
/**
 * @fileoverview Funciones de acceso a datos. 
 * Migradas de mocks estáticos a consultas reales de Firestore.
 */

import { collection, getDocs, query, where, doc, getDoc, orderBy } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { Alarma, Equipo, Intervencion, PlanMantenimiento, User, Empresa, Insumo } from '@/lib/types';

const { firestore: db } = initializeFirebase();

export const getInsumos = async (): Promise<Insumo[]> => {
  if (!db) return [];
  const snap = await getDocs(collection(db, 'insumos'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Insumo));
};

export const getAlarms = async (): Promise<Alarma[]> => {
  if (!db) return [];
  const snap = await getDocs(query(collection(db, 'alarmas')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Alarma));
};

export const getAlarmById = async (id: string): Promise<Alarma | undefined> => {
  if (!db) return undefined;
  const d = await getDoc(doc(db, 'alarmas', id));
  return d.exists() ? ({ id: d.id, ...d.data() } as Alarma) : undefined;
};

export const getEquipos = async (): Promise<Equipo[]> => {
  if (!db) return [];
  const snap = await getDocs(collection(db, 'equipos'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Equipo));
};

export const getEquipoById = async (id: string): Promise<Equipo | undefined> => {
  if (!db) return undefined;
  const d = await getDoc(doc(db, 'equipos', id));
  return d.exists() ? { id: d.id, ...d.data() } as Equipo : undefined;
};

export const getIntervenciones = async (): Promise<Intervencion[]> => {
  if (!db) return [];
  const snap = await getDocs(query(collection(db, 'intervenciones'), orderBy('fechaInicio', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Intervencion));
};

export const getIntervencionById = async (id: string): Promise<Intervencion | undefined> => {
  if (!db) return undefined;
  const d = await getDoc(doc(db, 'intervenciones', id));
  return d.exists() ? { id: d.id, ...d.data() } as Intervencion : undefined;
};

export const getPlanes = async (): Promise<PlanMantenimiento[]> => {
  if (!db) return [];
  const snap = await getDocs(collection(db, 'planes'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as PlanMantenimiento));
};

export const getEmpresas = async (): Promise<Empresa[]> => {
  if (!db) return [];
  const snap = await getDocs(collection(db, 'empresas'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Empresa));
};

export const getEmpresaById = async (id: string): Promise<Empresa | undefined> => {
  if (!db) return undefined;
  const d = await getDoc(doc(db, 'empresas', id));
  return d.exists() ? { id: d.id, ...d.data() } as Empresa : undefined;
};

export const getIntervencionesByEmpresaId = async (empresaId: string): Promise<Intervencion[]> => {
  if (!db) return [];
  const snap = await getDocs(query(collection(db, 'intervenciones'), where('empresaId', '==', empresaId), orderBy('fechaInicio', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Intervencion));
};

export const getEquiposByEmpresaId = async (empresaId: string): Promise<Equipo[]> => {
  if (!db) return [];
  const snap = await getDocs(query(collection(db, 'equipos'), where('empresaId', '==', empresaId)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Equipo));
};

export const getIntervencionesByEquipoId = async (equipoId: string): Promise<Intervencion[]> => {
  if (!db) return [];
  const snap = await getDocs(query(collection(db, 'intervenciones'), where('equipoId', '==', equipoId), orderBy('fechaInicio', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Intervencion));
};

export const getLecturasByEquipoId = async (id: string) => [];

export const mockUsers: User[] = []; // Los usuarios se consultan vía hooks de Firebase
