
import { Alarma, Equipo, Intervencion, PlanMantenimiento, User, Empresa, Insumo } from '@/lib/types';
import { subDays, addDays, subHours, subMonths, addMonths, startOfToday, addHours } from 'date-fns';

const now = new Date();

export const mockInsumos: Insumo[] = [
  { id: 'ins-1', type: 'chemical', name: 'Deltametrina 2.5', activeIngredient: 'Deltametrina', registration: 'SENASA 3421', toxicity: 'Clase II' },
  { id: 'ins-2', type: 'chemical', name: 'Gel Cucarachicida Max', activeIngredient: 'Imidacloprid', registration: 'SENASA 9928', toxicity: 'Clase IV' },
  { id: 'ins-3', type: 'material', name: 'Bloque Rodenticida', activeIngredient: 'Bromadiolona', registration: 'SENASA 1122', toxicity: 'Clase III' },
];

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@maintwise.com',
    displayName: 'Admin User',
    role: 'admin',
    empresaId: 'empresa-1',
    activo: true,
    photoURL: 'https://picsum.photos/seed/user1/100/100',
    metadata: { createdAt: subDays(now, 365), updatedAt: subDays(now, 1), createdBy: 'user-1' },
  },
  {
    id: 'user-3',
    email: 'tech@maintwise.com',
    displayName: 'Juan Técnico',
    role: 'tecnico',
    empresaId: 'empresa-1',
    activo: true,
    photoURL: 'https://picsum.photos/seed/user3/100/100',
    metadata: { createdAt: subDays(now, 150), updatedAt: subDays(now, 3), createdBy: 'user-2' },
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
    vertical: 'maintenance',
    locked: false,
    numeroIntervencion: 'INT-2024-001',
    equipoId: 'eq-1',
    equipoSnapshot: { codigoInterno: 'MOT-PLT1-001', descripcion: 'Motor Línea 1', ubicacion: 'Producción' },
    tipoIntervencion: 'correctivo',
    tecnicoId: 'user-3',
    tecnicoSnapshot: { displayName: 'Juan Técnico', email: 'tech@maintwise.com' },
    estado: 'asignada',
    tiempos: { asignado: subHours(now, 2) },
    empresaId: 'empresa-1',
    estadoCierre: 'abierta',
    trabajoRealizado: '',
    fechaInicio: subHours(now, 2),
  }
];

export const mockEmpresas: Empresa[] = [
    { id: 'empresa-1', razonSocial: 'Mi Empresa S.A.', nombreComercial: 'MaintWise Demo', activa: true }
];

export const getInsumos = async () => mockInsumos;
export const getAlarms = async () => [];
export const getAlarmById = async (id: string) => undefined;
export const getEquipos = async () => mockEquipos;
export const getEquipoById = async (id: string) => mockEquipos.find(e => e.id === id);
export const getIntervenciones = async () => mockIntervenciones;
export const getPlanes = async () => [];
export const getEmpresas = async () => mockEmpresas;
export const getEmpresaById = async (id: string) => mockEmpresas.find(e => e.id === id);
