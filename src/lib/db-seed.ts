
'use client';

import { collection, addDoc, getDocs, query, limit, serverTimestamp, setDoc, doc, where } from 'firebase/firestore';
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
  let primerEquipoId: string | null = null;
  const equiposSnap = await getDocs(query(collection(db, 'equipos'), where('empresaId', '==', empresaId), limit(1)))
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
    const eqRef = await addDoc(collection(db, 'equipos'), eq1)
      .catch(handlePermissionError('equipos', 'create', eq1));
    primerEquipoId = eqRef.id;
  } else {
    primerEquipoId = equiposSnap.docs[0].id;
  }

  // 3. Insumos
  const insumosSnap = await getDocs(query(collection(db, 'insumos'), limit(1)))
    .catch(handlePermissionError('insumos', 'list'));

  if (insumosSnap.empty) {
    const chemicals = [
      { internalCode: 'M01', type: 'chemical', name: 'Deltametrina 2.5', activeIngredient: 'Deltametrina', registration: 'SENASA 3421', toxicity: 'Clase II', empresaId },
      { internalCode: 'M02', type: 'chemical', name: 'Gel Cucarachicida Max', activeIngredient: 'Imidacloprid', registration: 'SENASA 9928', toxicity: 'Clase IV', empresaId },
    ];
    for (const chem of chemicals) {
      await addDoc(collection(db, 'insumos'), chem)
        .catch(handlePermissionError('insumos', 'create', chem));
    }
  }

  // 4. Intervención
  const intSnap = await getDocs(query(collection(db, 'intervenciones'), where('empresaId', '==', empresaId), limit(1)))
    .catch(handlePermissionError('intervenciones', 'list'));

  if (intSnap.empty && primerEquipoId) {
    const equipoDatos = { codigoInterno: 'MOT-PLT1-001', descripcion: 'Motor Principal de Línea 1', ubicacion: { planta: 'Planta Principal', sector: 'Producción' } };
    const ubicacionStr = equipoDatos.ubicacion ? `${equipoDatos.ubicacion.planta} - ${equipoDatos.ubicacion.sector}` : '—';
    const intData = {
      vertical: 'maintenance',
      locked: false,
      token: Math.random().toString(36).substring(2, 15),
      numeroIntervencion: `INT-${Date.now().toString().slice(-6)}`,
      equipoId: primerEquipoId,
      equipoSnapshot: { codigoInterno: equipoDatos.codigoInterno || '—', descripcion: equipoDatos.descripcion || '—', ubicacion: ubicacionStr },
      tipoIntervencion: 'preventivo',
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

  // 5. Alarmas (si no hay ninguna)
  const alarmasSnap = await getDocs(query(collection(db, 'alarmas'), limit(1)))
    .catch(handlePermissionError('alarmas', 'list'));

  if (alarmasSnap.empty) {
    const equiposRef = await getDocs(query(collection(db, 'equipos'), where('empresaId', '==', empresaId), limit(1)));
    const primerEquipo = equiposRef.docs[0];
    if (primerEquipo) {
      const eqData = primerEquipo.data();
      const alarmaData = {
        titulo: 'Temperatura elevada en motor',
        equipoId: primerEquipo.id,
        equipoSnapshot: {
          codigoInterno: eqData.codigoInterno || '—',
          descripcion: eqData.descripcion || '—',
          ubicacion: eqData.ubicacion ? `${eqData.ubicacion.planta} - ${eqData.ubicacion.sector}` : '—',
        },
        severidad: 'alta',
        estado: 'pendiente',
        tipoAlarma: 'sensibilidad',
        numeroAlarma: `ALM-${Date.now().toString().slice(-6)}`,
        mensaje: 'Sensor de temperatura reporta valor por encima del umbral configurado.',
        fechaGeneracion: serverTimestamp(),
        empresaId,
      };
      await addDoc(collection(db, 'alarmas'), alarmaData)
        .catch(handlePermissionError('alarmas', 'create', alarmaData));
    }
  }

  // 6. Planes de mantenimiento
  const planesSnap = await getDocs(query(collection(db, 'planes'), limit(1)))
    .catch(handlePermissionError('planes', 'list'));

  if (planesSnap.empty) {
    const planes = [
      { nombrePlan: 'Mantenimiento Preventivo Mensual', frecuencia: { valor: 1, tipo: 'mes' } },
      { nombrePlan: 'Mantenimiento Preventivo Bimensual', frecuencia: { valor: 2, tipo: 'mes' } },
      { nombrePlan: 'Fumigación Mensual', frecuencia: { valor: 1, tipo: 'mes' } },
      { nombrePlan: 'Fumigación Trimestral', frecuencia: { valor: 3, tipo: 'mes' } },
    ];
    for (const plan of planes) {
      await addDoc(collection(db, 'planes'), plan)
        .catch(handlePermissionError('planes', 'create', plan));
    }
  }

  return true;
}
