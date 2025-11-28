

import { Alarma, Equipo, Intervencion, PlanMantenimiento, User } from '@/lib/types';
import { subDays, addDays, subHours, subMonths, addMonths, startOfToday, addHours } from 'date-fns';

const now = new Date();

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@maintwise.com',
    displayName: 'Admin User',
    role: 'admin',
    empresaId: 'empresa-1',
    activo: true,
    photoURL: 'https://picsum.photos/seed/user1/100/100',
    notificaciones: {
      habilitadas: true,
      fcmTokens: [],
      preferencias: {
        alarmasCriticas: true,
        asignacionTareas: true,
        aprobacionesPendientes: true,
        reportesDiarios: true,
      }
    },
    metadata: {
      createdAt: subDays(now, 365),
      updatedAt: subDays(now, 1),
      lastLogin: subHours(now, 2),
      createdBy: 'user-1',
    },
  },
  {
    id: 'user-2',
    email: 'supervisor@maintwise.com',
    displayName: 'Supervisor Sam',
    role: 'supervisor',
    empresaId: 'empresa-1',
    activo: true,
    photoURL: 'https://picsum.photos/seed/user2/100/100',
     notificaciones: {
      habilitadas: true,
      fcmTokens: [],
      preferencias: {
        alarmasCriticas: true,
        asignacionTareas: true,
        aprobacionesPendientes: true,
        reportesDiarios: false,
      }
    },
     metadata: {
      createdAt: subDays(now, 200),
      updatedAt: subDays(now, 2),
      lastLogin: subHours(now, 5),
      createdBy: 'user-1',
    },
  },
  {
    id: 'user-3',
    email: 'tech@maintwise.com',
    displayName: 'Juan Técnico',
    role: 'tecnico',
    empresaId: 'empresa-1',
    activo: true,
    photoURL: 'https://picsum.photos/seed/user3/100/100',
    notificaciones: {
      habilitadas: true,
      fcmTokens: [],
      preferencias: {
        alarmasCriticas: true,
        asignacionTareas: true,
        aprobacionesPendientes: false,
        reportesDiarios: false,
      }
    },
     metadata: {
      createdAt: subDays(now, 150),
      updatedAt: subDays(now, 3),
      lastLogin: subHours(now, 8),
      createdBy: 'user-2',
    },
  },
];


export const mockPlanesMantenimiento: PlanMantenimiento[] = [
    {
        id: 'plan-1',
        nombrePlan: 'Revisión Mensual de Motores',
        descripcion: 'Plan de mantenimiento preventivo para motores eléctricos trifásicos.',
        aplicabilidad: { tipo: 'tipo_equipo', tipoEquipo: ['motor'] },
        frecuencia: { tipo: 'meses', valor: 1 },
        checklistTareas: [
            { id: 't1', orden: 1, descripcion: 'Inspección visual de carcasa y ventilador.', esObligatoria: true },
            { id: 't2', orden: 2, descripcion: 'Medición de corriente en vacío.', esObligatoria: true },
            { id: 't3', orden: 3, descripcion: 'Chequeo de vibraciones y ruido anómalo.', esObligatoria: true },
            { id: 't4', orden: 4, descripcion: 'Limpieza de aletas de refrigeración.', esObligatoria: false },
        ],
        activo: true,
        empresaId: 'empresa-1',
        configuracionAlarmas: { anticipacionDias: 7, severidadPredeterminada: 'media', notificarSupervisor: true, notificarTecnicos: false },
        metadata: { createdAt: subDays(now, 180), updatedAt: subDays(now, 10), createdBy: 'user-1' },
    },
    {
        id: 'plan-2',
        nombrePlan: 'Mantenimiento Semestral de UPS',
        descripcion: 'Verificación de baterías y funcionamiento de sistemas de alimentación ininterrumpida.',
        aplicabilidad: { tipo: 'tipo_equipo', tipoEquipo: ['ups'] },
        frecuencia: { tipo: 'meses', valor: 6 },
        checklistTareas: [
            { id: 'ups-t1', orden: 1, descripcion: 'Test de baterías en carga.', esObligatoria: true },
            { id: 'ups-t2', orden: 2, descripcion: 'Inspección de conexiones y limpieza interna.', esObligatoria: true },
        ],
        activo: true,
        empresaId: 'empresa-1',
        configuracionAlarmas: { anticipacionDias: 15, severidadPredeterminada: 'media', notificarSupervisor: true, notificarTecnicos: true },
        metadata: { createdAt: subDays(now, 250), updatedAt: subDays(now, 5), createdBy: 'user-2' },
    },
    {
        id: 'plan-3',
        nombrePlan: 'Inspección Anual de Tableros Eléctricos',
        descripcion: 'Reapriete de borneras y termografía.',
        aplicabilidad: { tipo: 'tipo_equipo', tipoEquipo: ['tablero_electrico'] },
        frecuencia: { tipo: 'meses', valor: 12 },
        checklistTareas: [
            { id: 'tbl-t1', orden: 1, descripcion: 'Inspección termográfica de contactores y protecciones.', esObligatoria: true },
            { id: 'tbl-t2', orden: 2, descripcion: 'Reapriete de todas las borneras de potencia.', esObligatoria: true },
        ],
        activo: true,
        empresaId: 'empresa-1',
        configuracionAlarmas: { anticipacionDias: 30, severidadPredeterminada: 'alta', notificarSupervisor: true, notificarTecnicos: false },
        metadata: { createdAt: subDays(now, 400), updatedAt: subDays(now, 15), createdBy: 'user-1' },
    }
];

export const mockEquipos: Equipo[] = [
  {
    id: 'eq-1',
    codigoInterno: 'MOT-PLT1-001',
    descripcion: 'Motor Principal de Línea 1',
    tipoEquipo: 'motor',
    fabricante: 'Siemens',
    modelo: '1LE1003-1BB2',
    numeroSerie: 'SN-12345ABC',
    ubicacion: { planta: 'Planta Principal', sector: 'Producción' },
    estadoActual: 'operativo',
    fechaInstalacion: subDays(now, 500),
    garantiaHasta: subDays(addMonths(now, 24), 500),
    qrCodeId: 'qr-mot-plt1-001',
    planesAsociados: ['plan-1'],
    proximoMantenimiento: { planId: 'plan-1', fechaProgramada: addDays(now, 10), tipoIntervencion: 'preventivo' },
    empresaId: 'empresa-1',
    estadisticas: { totalIntervenciones: 15, ultimaIntervencion: subMonths(now, 1), numeroAlarmas: 2 },
    metadata: { createdAt: subDays(now, 500), updatedAt: subDays(now, 1), createdBy: 'user-1' },
    caracteristicasTecnicas: { potencia: '5.5 kW', voltaje: '380V', corriente: '11.5A' },
  },
  {
    id: 'eq-2',
    codigoInterno: 'BOM-SCT2-003',
    descripcion: 'Bomba de Refrigeración Torre 2',
    tipoEquipo: 'bomba',
    fabricante: 'Grundfos',
    modelo: 'CR 10-5',
    numeroSerie: 'SN-67890DEF',
    ubicacion: { planta: 'Planta Principal', sector: 'Refrigeración' },
    estadoActual: 'en_mantenimiento',
    fechaInstalacion: subDays(now, 800),
    qrCodeId: 'qr-bom-sct2-003',
    planesAsociados: [],
    proximoMantenimiento: undefined,
    empresaId: 'empresa-1',
    estadisticas: { totalIntervenciones: 25, ultimaIntervencion: subDays(now, 1), numeroAlarmas: 5 },
    metadata: { createdAt: subDays(now, 800), updatedAt: subDays(now, 1), createdBy: 'user-1' },
    caracteristicasTecnicas: { potencia: '3 kW', voltaje: '380V' },
  },
  {
    id: 'eq-3',
    codigoInterno: 'UPS-SRV-001',
    descripcion: 'UPS Sala de Servidores',
    tipoEquipo: 'ups',
    fabricante: 'APC',
    modelo: 'Smart-UPS 3000',
    numeroSerie: 'SN-APC123XYZ',
    ubicacion: { planta: 'Oficinas Centrales', sector: 'Data Center' },
    estadoActual: 'operativo',
    fechaInstalacion: subDays(now, 300),
    qrCodeId: 'qr-ups-srv-001',
    planesAsociados: ['plan-2'],
    proximoMantenimiento: { planId: 'plan-2', fechaProgramada: addDays(now, 5), tipoIntervencion: 'preventivo' },
    empresaId: 'empresa-1',
    estadisticas: { totalIntervenciones: 5, ultimaIntervencion: subMonths(now, 5), numeroAlarmas: 1 },
    metadata: { createdAt: subDays(now, 300), updatedAt: subDays(now, 10), createdBy: 'user-2' },
    caracteristicasTecnicas: { potencia: '2700W / 3000VA' },
  },
  {
    id: 'eq-4',
    codigoInterno: 'TBL-TALLER-01',
    descripcion: 'Tablero Eléctrico General de Taller',
    tipoEquipo: 'tablero_electrico',
    ubicacion: { planta: 'Planta Principal', sector: 'Taller' },
    estadoActual: 'fuera_de_servicio',
    fechaInstalacion: subDays(now, 1200),
    qrCodeId: 'qr-tbl-taller-01',
    planesAsociados: ['plan-3'],
    proximoMantenimiento: undefined,
    empresaId: 'empresa-1',
    estadisticas: { totalIntervenciones: 42, ultimaIntervencion: subDays(now, 200), numeroAlarmas: 12 },
    metadata: { createdAt: subDays(now, 1200), updatedAt: subDays(now, 200), createdBy: 'user-1' },
  },
];

const today = startOfToday();

export const mockIntervenciones: Intervencion[] = [
  // Intervención URGENTE para hoy
  {
    id: 'int-urgent-1',
    numeroIntervencion: 'INT-2024-00501',
    clienteSnapshot: { nombreComercial: 'Fábrica Textil La Industrial' },
    equipoId: 'eq-1',
    equipoSnapshot: { codigoInterno: 'MOT-PLT1-001', descripcion: 'Temperatura alta', ubicacion: 'Planta Central - Sala máq.' },
    tipoIntervencion: 'emergencia',
    prioridad: 'urgente',
    tecnicoId: 'user-3', // Asignado a Juan Técnico
    tecnicoSnapshot: { displayName: 'Juan Técnico', email: 'tech@maintwise.com' },
    estado: 'asignada',
    tiempos: { asignado: subHours(now, 1), programado: today },
    empresaId: 'empresa-1',
    metadata: { createdAt: subHours(now, 1), updatedAt: subHours(now, 1) },
    // legacy
    fechaInicio: subHours(now, 1),
    trabajoRealizado: '',
    estadoEquipoDespues: 'en_reparacion',
    estadoCierre: 'abierta',
    requiereSegimiento: true,
  },
  // Intervención PENDIENTE para hoy
  {
    id: 'int-pending-1',
    numeroIntervencion: 'INT-2024-00502',
    clienteSnapshot: { nombreComercial: 'Frigorífico Carnes del Sur' },
    equipoId: 'eq-4',
    equipoSnapshot: { codigoInterno: 'TBL-TALLER-01', descripcion: 'Mant. Preventivo', ubicacion: 'Depósito Norte' },
    tipoIntervencion: 'preventivo',
    prioridad: 'normal',
    tecnicoId: 'user-3', // Asignado a Juan Técnico
    tecnicoSnapshot: { displayName: 'Juan Técnico', email: 'tech@maintwise.com' },
    estado: 'asignada',
    tiempos: { asignado: subDays(now, 2), programado: addHours(today, 11) },
    empresaId: 'empresa-1',
    metadata: { createdAt: subDays(now, 2), updatedAt: subDays(now, 2) },
    // legacy
    fechaInicio: addHours(today, 11),
    trabajoRealizado: '',
    estadoEquipoDespues: 'en_reparacion',
    estadoCierre: 'abierta',
    requiereSegimiento: false,
  },
  // Intervención EN PROGRESO
  {
    id: 'int-progress-1',
    numeroIntervencion: 'INT-2024-00503',
    clienteSnapshot: { nombreComercial: 'Hospital Regional' },
    equipoId: 'eq-3',
    equipoSnapshot: { codigoInterno: 'UPS-SRV-001', descripcion: 'Inspección rutinaria', ubicacion: 'Piso 3 - Sala de servidores' },
    tipoIntervencion: 'inspeccion',
    prioridad: 'normal',
    tecnicoId: 'user-3', // Asignado a Juan Técnico
    tecnicoSnapshot: { displayName: 'Juan Técnico', email: 'tech@maintwise.com' },
    estado: 'en_progreso',
    tiempos: { asignado: subDays(now, 1), iniciado: subHours(now, 2), programado: subDays(now, 1) },
    empresaId: 'empresa-1',
    metadata: { createdAt: subDays(now, 1), updatedAt: subHours(now, 2) },
    // legacy
    fechaInicio: subHours(now, 2),
    trabajoRealizado: 'Iniciada inspección...',
    estadoEquipoDespues: 'en_mantenimiento',
    estadoCierre: 'abierta',
    requiereSegimiento: true,
  },
  // Intervención COMPLETADA hoy
  {
    id: 'int-completed-1',
    numeroIntervencion: 'INT-2024-00504',
    clienteSnapshot: { nombreComercial: 'Supermercado El Gran Ahorro' },
    equipoId: 'eq-2',
    equipoSnapshot: { codigoInterno: 'BOM-SCT2-003', descripcion: 'Bomba de agua', ubicacion: 'Sala de bombas' },
    tipoIntervencion: 'correctivo',
    prioridad: 'alta',
    tecnicoId: 'user-3', // Asignado a Juan Técnico
    tecnicoSnapshot: { displayName: 'Juan Técnico', email: 'tech@maintwise.com' },
    estado: 'completada_tecnico',
    tiempos: { 
      asignado: subHours(today, 4), 
      iniciado: subHours(today, 3), 
      finalizado: subHours(today, 2),
      duracionReal: 45
    },
    empresaId: 'empresa-1',
    metadata: { createdAt: subHours(today, 4), updatedAt: subHours(today, 2) },
     // legacy
    fechaInicio: subHours(today, 3),
    fechaFin: subHours(today, 2),
    trabajoRealizado: 'Se reemplazó sello mecánico.',
    estadoEquipoDespues: 'operativo',
    estadoCierre: 'pendiente_aprobacion',
    requiereSegimiento: false,
  },
];


export const mockAlarmas: Alarma[] = [
    {
        id: 'al-1',
        numeroAlarma: 'ALR-2024-00456',
        equipoId: 'eq-3',
        equipoSnapshot: { codigoInterno: 'UPS-SRV-001', descripcion: 'UPS Sala de Servidores', ubicacion: 'Oficinas Centrales - Data Center'},
        tipoAlarma: 'proximo_mantenimiento',
        titulo: 'Mantenimiento Próximo de UPS',
        mensaje: 'Mantenimiento semestral para "UPS Sala de Servidores" programado en 5 días.',
        severidad: 'media',
        fechaGeneracion: subDays(now, 2),
        fechaLimiteAtencion: addDays(now, 5),
        estado: 'pendiente',
        generadoPor: 'sistema',
        empresaId: 'empresa-1',
        metadata: { createdAt: subDays(now, 2), updatedAt: subDays(now, 2) },
    },
    {
        id: 'al-2',
        numeroAlarma: 'ALR-2024-00455',
        equipoId: 'eq-4',
        equipoSnapshot: { codigoInterno: 'TBL-TALLER-01', descripcion: 'Tablero Eléctrico General de Taller', ubicacion: 'Planta Principal - Taller'},
        tipoAlarma: 'equipo_fuera_servicio',
        titulo: 'Equipo Fuera de Servicio',
        mensaje: 'El equipo TBL-TALLER-01 se encuentra fuera de servicio. Requiere intervención inmediata.',
        severidad: 'critica',
        fechaGeneracion: subDays(now, 7),
        estado: 'pendiente',
        generadoPor: 'supervisor',
        asignadoA: 'user-3',
        empresaId: 'empresa-1',
        metadata: { createdAt: subDays(now, 7), updatedAt: subDays(now, 7) },
    },
    {
        id: 'al-3',
        numeroAlarma: 'ALR-2024-00454',
        equipoId: 'eq-1',
        equipoSnapshot: { codigoInterno: 'MOT-PLT1-001', descripcion: 'Motor Principal de Línea 1', ubicacion: 'Planta Principal - Producción'},
        tipoAlarma: 'mantenimiento_vencido',
        titulo: 'Mantenimiento de Motor Vencido',
        mensaje: 'El plan de mantenimiento mensual está vencido por 2 días.',
        severidad: 'alta',
        fechaGeneracion: addMonths(subDays(now,2),-1),
        fechaLimiteAtencion: addMonths(now, -1),
        estado: 'en_progreso',
        generadoPor: 'sistema',
        asignadoA: 'user-3',
        empresaId: 'empresa-1',
        metadata: { createdAt: subDays(now, 2), updatedAt: subDays(now, 1) },
    },
];

// Mock Fetch Functions
export const getAlarms = async (): Promise<Alarma[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockAlarmas), 500));
}

export const getAlarmById = async (id: string): Promise<Alarma | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(mockAlarmas.find(a => a.id === id)), 300));
}

export const getEquipos = async (): Promise<Equipo[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockEquipos), 500));
}

export const getEquipoById = async (id: string): Promise<Equipo | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(mockEquipos.find(e => e.id === id)), 300));
}

export const getIntervenciones = async (): Promise<Intervencion[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockIntervenciones), 500));
}

export const getPlanes = async (): Promise<PlanMantenimiento[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockPlanesMantenimiento), 500));
}

export const getIntervencionesByEquipoId = async (equipoId: string): Promise<Intervencion[]> => {
  const filtered = mockIntervenciones.filter(i => i.equipoId === equipoId);
  return new Promise(resolve => setTimeout(() => resolve(filtered), 400));
}

export const getLecturasByEquipoId = async (equipoId: string): Promise<any[]> => {
    // Generate some random readings for the AI model
    const readings = Array.from({ length: 50 }, (_, i) => ({
        timestamp: subHours(now, 50 - i).toISOString(),
        temperatura: 65 + Math.random() * 15 + (i > 40 ? i - 40 : 0) * 1.5, // Simulate rising temp
        vibracion: 0.5 + Math.random() * 0.3 + (i > 45 ? (i - 45) * 0.1 : 0), // Simulate rising vibration
        corriente: 11.0 + Math.random() * 0.5,
    }));
    return new Promise(resolve => setTimeout(() => resolve(readings), 600));
}
