import { Timestamp } from 'firebase/firestore';

export type VerticalType = 'maintenance' | 'pest_control';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin' | 'supervisor' | 'tecnico_senior' | 'tecnico' | 'cliente';
  empresaId: string;
  activo: boolean;
  photoURL?: string;
  createdAt?: Date | Timestamp;
  lastLoginAt?: Date | Timestamp;
}

export interface Insumo {
  id: string;
  internalCode: string;
  type: 'chemical' | 'material' | 'spare_part';
  name: string;
  activeIngredient?: string;
  registration?: string;
  toxicity?: string;
  msdsUrl?: string;
  empresaId?: string;
}

export interface Consumption {
  type: 'chemical' | 'material' | 'spare_part';
  refId: string;
  name: string;
  internalCode?: string;
  qty: number;
  unit: string;
}

export interface Signature {
  image: string; // Base64
  name: string;
  dni: string;
  timestamp: string | Date | Timestamp;
}

export interface Intervencion {
  id?: string;
  vertical: VerticalType;
  locked: boolean;
  token?: string;
  numeroIntervencion: string;
  equipoId: string;
  equipoSnapshot: {
    codigoInterno: string;
    descripcion: string;
    ubicacion: string;
  };
  tipoIntervencion: string;
  tecnicoId: string;
  tecnicoSnapshot: {
    displayName: string;
    email: string;
  };
  estado: 'asignada' | 'en_progreso' | 'pausada' | 'completada_tecnico' | 'aprobada' | 'cerrada';
  empresaId: string;
  trabajoRealizado: string;
  fechaInicio: Date | Timestamp;
  closedAt?: Date | Timestamp;
  consumptions?: Consumption[];
  signature?: Signature;
  solicitante?: string;
  numeroAviso?: string;
  descripcionProblema?: string;
  evidence?: { url: string; caption?: string; uploadedAt?: string }[];
}

export interface AuditLog {
  timestamp: Date | Timestamp;
  action: string;
  userId: string;
  userName: string;
  payload?: Record<string, any>;
}

export interface Equipo {
  id?: string;
  codigoInterno: string;
  descripcion: string;
  tipoEquipo: string;
  estadoActual: 'operativo' | 'fuera_de_servicio' | 'en_reparacion' | 'en_mantenimiento';
  empresaId: string;
  ubicacion: { planta: string; sector: string };
  qrCodeId?: string;
  fabricante?: string;
  modelo?: string;
  numeroSerie?: string;
  fechaInstalacion?: Date | Timestamp | string;
  garantiaHasta?: Date | Timestamp | string;
  caracteristicasTecnicas?: Record<string, string>;
  proximoMantenimiento?: { fechaProgramada: Date | Timestamp | string };
  planesAsociados?: string[];
}

export interface Empresa {
  id: string;
  razonSocial: string;
  nombreComercial?: string;
  activa: boolean;
}

export interface PlanMantenimiento {
  id: string;
  nombrePlan: string;
  frecuencia: { valor: number; tipo: string };
}

export interface Alarma {
  id: string;
  titulo: string;
  equipoId?: string;
  severidad: string;
  estado: string;
  tipoAlarma?: string;
  fecha?: Date | Timestamp;
  numeroAlarma?: string;
  equipoSnapshot?: { codigoInterno: string; descripcion: string; ubicacion?: string };
  fechaGeneracion?: Date | Timestamp;
  fechaLimiteAtencion?: Date | Timestamp;
  generadoPor?: string;
  mensaje?: string;
  empresaId?: string;
  tecnicoAsignadoId?: string;
}