'use client';

import { collection, addDoc, getDocs, query, limit, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function seedDatabase(db: Firestore, empresaId: string, tecnicoId: string, tecnicoName: string) {
  const handlePermissionError = (path: string, operation: 'write' | 'create' | 'update', data?: any) => (err: any) => {
    if (err.code === 'permission-denied') {
      const permissionError = new FirestorePermissionError({
        path,
        operation,
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
    }
    throw err;
  };

  // 1. Empresa
  const empresaRef = doc(db, 'empresas', empresaId);
  const empresaData = {
    id: empresaId,
    razonSocial: empresaId === 'meprocent-admin' ? 'Meprocent Global Admin' : 'Empresa Demo S.A.',
    nombreComercial: empresaId === 'meprocent-admin' ? 'Meprocent' : 'Demo Client',
    activa: true
  };
  await setDoc(empresaRef, empresaData, { merge: true })
    .catch(handlePermissionError(empresaRef.path, 'write', empresaData));

  // 2. Equipos
  const equiposSnap = await getDocs(query(collection(db, 'equipos'), limit(1)))
    .catch(handlePermissionError('equipos', 'list'));

  if (equiposSnap.empty) {
    const eq1 = {
      codigoInterno: 'MOT-PLT1-001',
      descripcion: 'Motor Principal de Línea 1',
      tipoEquipo: 'motor',
      ubicacion: { planta: 'Planta Principal', sector: 'Producción' },
      estadoActual: 'operativo',
      empresaId: empresaId,
    };
    await addDoc(collection(db, 'equipos'), eq1)
      .catch(handlePermissionError('equipos', 'create', eq1));
  }

  // 3. Insumos
  const insumosSnap = await getDocs(query(collection(db, 'insumos'), limit(1)))
    .catch(handlePermissionError('insumos', 'list'));

  if (insumosSnap.empty) {
    const chemicals = [
      { internalCode: 'M01', type: 'chemical', name: 'Deltametrina 2.5', activeIngredient: 'Deltametrina', registration: 'SENASA 3421', toxicity: 'Clase II' },
      { internalCode: 'M02', type: 'chemical', name: 'Gel Cucarachicida Max', activeIngredient: 'Imidacloprid', registration: 'SENASA 9928', toxicity: 'Clase IV' },
    ];
    for (const chem of chemicals) {
      await addDoc(collection(db, 'insumos'), chem)
        .catch(handlePermissionError('insumos', 'create', chem));
    }
  }

  // 4. Intervención
  const intSnap = await getDocs(query(collection(db, 'intervenciones'), limit(1)))
    .catch(handlePermissionError('intervenciones', 'list'));

  if (intSnap.empty) {
    const intData = {
      vertical: 'pest_control',
      locked: false,
      token: Math.random().toString(36).substring(2, 15),
      numeroIntervencion: 'SRV-2024-001',
      equipoId: 'demo-eq-id',
      equipoSnapshot: { codigoInterno: 'TRP-EXT-001', descripcion: 'Trampa Exterior 01', ubicacion: 'Perímetro' },
      tipoIntervencion: 'desinsectacion',
      tecnicoId: tecnicoId,
      tecnicoSnapshot: { displayName: tecnicoName, email: '' },
      estado: 'asignada',
      empresaId: empresaId,
      trabajoRealizado: '',
      fechaInicio: serverTimestamp(),
    };
    await addDoc(collection(db, 'intervenciones'), intData)
      .catch(handlePermissionError('intervenciones', 'create', intData));
  }

  return true;
}
