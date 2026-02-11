/**
 * @fileoverview Datos simulados para desarrollo.
 * TODO: Migrar estas funciones a llamadas reales de Firestore (Paso 5 del plan de migración).
 */

import { Alarma, Equipo, Intervencion, PlanMantenimiento, User, Empresa, Insumo } from '@/lib/types';
import { subDays, subHours } from 'date-fns';

const now = new Date();

export const mockInsumos: Insumo[] = [
  { id: 'ins-1', internalCode: 'M01', type: 'chemical', name: 'Deltametrina 2.5', activeIngredient: 'Deltametrina', registration: 'SENASA 3421', toxicity: 'Clase II' },
  { id: 'ins-2', internalCode: 'M02', type: 'chemical', name: 'Gel Cucarachicida Max', activeIngredient: 'Imidacloprid', registration: 'SENASA 9928', toxicity: 'Clase IV' },
  { id: 'ins-3', internalCode: 'M03', type: 'chemical', name: 'Bloque Rodenticida', activeIngredient: 'Bromadiolona', registration: 'SENASA 1122', toxicity: 'Clase III' },
];

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@maintwise.com',
    displayName: 'Admin User',
    role: 'admin',
    empresaId: 'empresa-1',
    activo: true,
    photoURL: 'https://picsum.photos/seed/user1/100/100'
  },
  {
    id: 'user-3',
    email: 'tech@maintwise.com',
    displayName: 'Juan Técnico',
    role: 'tecnico',
    empresaId: 'empresa-1',
    activo: true,
    photoURL: 'https://picsum.photos/seed/user3/100/100'
  },
];

export const mockEquipos: Equipo[] = [
  {
    id: 'eq-1',
    codigoInterno: 'MOT-PLT1-001',
    descripcion: 'Motor Principal de Línea 1',
    tipoEquipo: 'motor',
    ubicacion: { planta: 'Planta Principal', sector: 'Producción' },
    estadoActual: 'operativo',
    empresaId: 'empresa-1',
  },
  {
    id: 'eq-pest-1',
    codigoInterno: 'TRP-EXT-001',
    descripcion: 'Trampa de Roedores Exterior 01',
    tipoEquipo: 'cebadera',
    ubicacion: { planta: 'Planta Principal', sector: 'Perímetro Externo' },
    estadoActual: 'operativo',
    empresaId: 'empresa-1',
  }
];

export const mockIntervenciones: Intervencion[] = [
  {
    id: 'int-1',
    vertical: 'pest_control',
    locked: false,
    token: 'secure-token-123',
    numeroIntervencion: 'SRV-2024-001',
    numeroAviso: 'AV-9988',
    solicitante: 'Ing. Carlos Gómez',
    descripcionProblema: 'Presencia de hormigas en sector empaque.',
    equipoId: 'eq-pest-1',
    equipoSnapshot: { codigoInterno: 'TRP-EXT-001', descripcion: 'Trampa Exterior 01', ubicacion: 'Perímetro' },
    tipoIntervencion: 'desinsectacion',
    tecnicoId: 'user-3',
    tecnicoSnapshot: { displayName: 'Juan Técnico', email: 'tech@maintwise.com' },
    estado: 'en_progreso',
    empresaId: 'empresa-1',
    trabajoRealizado: 'Se procede a aplicar gel en zócalos y aberturas.',
    fechaInicio: subHours(now, 2),
    consumptions: [
        { type: 'chemical', refId: 'ins-2', name: 'Gel Cucarachicida Max', internalCode: 'M02', qty: 5, unit: 'gr', method: 'Aplicación focalizada' }
    ]
  }
];

export const mockEmpresas: Empresa[] = [
    { id: 'empresa-1', razonSocial: 'Mi Empresa S.A.', nombreComercial: 'MaintWise Demo', activa: true }
];

// TODO: Reemplazar estas funciones por llamadas reales a Firestore
export const getInsumos = async () => mockInsumos;
export const getAlarms = async () => [];
export const getAlarmById = async (id: string) => undefined;
export const getEquipos = async () => mockEquipos;
export const getEquipoById = async (id: string) => mockEquipos.find(e => e.id === id);
export const getIntervenciones = async () => mockIntervenciones;
export const getIntervencionById = async (id: string) => mockIntervenciones.find(i => i.id === id);
export const getPlanes = async () => [];
export const getEmpresas = async () => mockEmpresas;
export const getEmpresaById = async (id: string) => mockEmpresas.find(e => e.id === id);
export const getLecturasByEquipoId = async (id: string) => [];
export const getIntervencionesByEmpresaId = async (id: string) => mockIntervenciones;
export const getEquiposByEmpresaId = async (id: string) => mockEquipos;
export const getIntervencionesByEquipoId = async (id: string) => mockIntervenciones;
