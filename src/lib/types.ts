
import { Timestamp } from 'firebase/firestore';

export type VerticalType = 'maintenance' | 'pest_control';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin' | 'supervisor' | 'tecnico_senior' | 'tecnico';
  empresaId: string;
  activo: boolean;
  photoURL?: string;
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
}

export interface Consumption {
  type: 'chemical' | 'material' | 'spare_part';
  refId: string;
  name: string;
  internalCode?: string;
  qty: number;
  unit: string;
  method?: string;
  notes?: string;
}

export interface Evidence {
  type: 'before' | 'after' | 'evidence';
  url: string;
  timestamp: Date | Timestamp;
}

export interface Signature {
  image: string; // Base64
  name: string;
  dni: string;
  timestamp: Date | Timestamp;
}

export interface Equipo {
  id: string;
  codigoInterno: string;
  descripcion: string;
  tipoEquipo: 'tablero_electrico' | 'motor' | 'bomba' | 'ups' | 'transformador' | 'cebadera' | 'trampa' | 'otro';
  ubicacion: {
    planta: string;
    sector: string;
  };
  estadoActual: 'operativo' | 'fuera_de_servicio' | 'en_reparacion' | 'en_mantenimiento';
  empresaId: string;
}

export type EstadoIntervencion = 'asignada' | 'en_progreso' | 'pausada' | 'completada_tecnico' | 'aprobada' | 'cerrada';

export interface Intervencion {
  id: string;
  vertical: VerticalType;
  locked: boolean;
  token?: string;
  closedAt?: Date | Timestamp;
  numeroIntervencion: string;
  numeroAviso?: string;
  solicitante?: string;
  descripcionProblema?: string;
  equipoId: string;
  equipoSnapshot?: {
    codigoInterno: string;
    descripcion: string;
    ubicacion: string;
  };
  tipoIntervencion: string;
  tecnicoId: string;
  tecnicoSnapshot?: {
    displayName: string;
    email: string;
  };
  estado: EstadoIntervencion;
  consumptions?: Consumption[];
  evidence?: Evidence[];
  signature?: Signature;
  empresaId: string;
  trabajoRealizado: string;
  fechaInicio: Date | Timestamp;
}
