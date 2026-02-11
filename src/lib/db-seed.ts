'use client';

import { collection, addDoc, getDocs, query, limit, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';

/**
 * Función para sembrar datos iniciales en Firestore si las colecciones están vacías.
 */
export async function seedDatabase(db: Firestore, empresaId: string, tecnicoId: string, tecnicoName: string) {
  // 1. Asegurar que la empresa exista
  await setDoc(doc(db, 'empresas', empresaId), {
    id: empresaId,
    razonSocial: empresaId === 'meprocent-admin' ? 'Meprocent Global Admin' : 'Empresa Demo S.A.',
    nombreComercial: empresaId === 'meprocent-admin' ? 'Meprocent' : 'Demo Client',
    activa: true
  }, { merge: true });

  // 2. Verificar si ya hay equipos
  const equiposSnap = await getDocs(query(collection(db, 'equipos'), limit(1)));
  if (equiposSnap.empty) {
    console.log('Sembrando equipos...');
    await addDoc(collection(db, 'equipos'), {
      codigoInterno: 'MOT-PLT1-001',
      descripcion: 'Motor Principal de Línea 1',
      tipoEquipo: 'motor',
      ubicacion: { planta: 'Planta Principal', sector: 'Producción' },
      estadoActual: 'operativo',
      empresaId: empresaId,
    });
    await addDoc(collection(db, 'equipos'), {
      codigoInterno: 'TRP-EXT-001',
      descripcion: 'Trampa de Roedores Exterior 01',
      tipoEquipo: 'cebadera',
      ubicacion: { planta: 'Planta Principal', sector: 'Perímetro Externo' },
      estadoActual: 'operativo',
      empresaId: empresaId,
    });
  }

  // 3. Verificar si hay insumos
  const insumosSnap = await getDocs(query(collection(db, 'insumos'), limit(1)));
  if (insumosSnap.empty) {
    console.log('Sembrando insumos...');
    const chemicals = [
      { internalCode: 'M01', type: 'chemical', name: 'Deltametrina 2.5', activeIngredient: 'Deltametrina', registration: 'SENASA 3421', toxicity: 'Clase II' },
      { internalCode: 'M02', type: 'chemical', name: 'Gel Cucarachicida Max', activeIngredient: 'Imidacloprid', registration: 'SENASA 9928', toxicity: 'Clase IV' },
    ];
    for (const chem of chemicals) {
      await addDoc(collection(db, 'insumos'), chem);
    }
  }

  // 4. Crear una intervención de ejemplo
  const intSnap = await getDocs(query(collection(db, 'intervenciones'), limit(1)));
  if (intSnap.empty) {
    console.log('Sembrando intervención...');
    await addDoc(collection(db, 'intervenciones'), {
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
    });
  }

  return true;
}
