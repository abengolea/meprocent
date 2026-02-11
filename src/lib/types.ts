
import type { Timestamp } from 'firebase/firestore';

export type VerticalType = 'maintenance' | 'pest_control';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin' | 'supervisor' | 'tecnico_senior' | 'tecnico';
  empresaId: string;
  activo: boolean;
  photoURL?: string;
  metadata: {
    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
    lastLogin?: Date | Timestamp;
    createdBy: string;
  };
}

export interface Insumo {
  id: string;
  internalCode: string; // M01, M02...
  type: 'chemical' | 'material' | 'spare_part';
  name: string; // Commercial Name
  activeIngredient?: string;
  registration?: string; // SENASA Number
  toxicity?: string;
  msdsUrl?: string;
  certificateUrl?: string;
}

export interface Consumption {
  type: 'chemical' | 'material' | 'spare_part';
  refId: string;
  name: string; 
  internalCode?: string;
  qty: number;
  unit: string;
  method?: string; // For pest control: Aspersion, Gel, etc.
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
  ip?: string;
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
  token?: string; // For public client access
  closedAt?: Date | Timestamp;
  numeroIntervencion: string;
  
  // Tab 1: Request
  numeroAviso?: string;
  solicitante?: string;
  sectorSolicitante?: string;
  descripcionProblema?: string;
  
  // Tab 2: Execution
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
  operariosIntervinientes?: string[]; // IDs or names
  horaLlegada?: Date | Timestamp;
  horaSalida?: Date | Timestamp;
  
  estado: EstadoIntervencion;
  tiempos: {
    asignado: Date | Timestamp;
    iniciado?: Date | Timestamp;
    finalizado?: Date | Timestamp;
  };
  
  // Tab 3: Chemicals & Materials
  consumptions?: Consumption[];
  
  // Tab 4: Evidence
  evidence?: Evidence[];
  
  // Tab 5: Compliance
  signature?: Signature;
  
  pdfUrl?: string;
  empresaId: string;
  estadoCierre: 'abierta' | 'cerrada' | 'pendiente_aprobacion';
  trabajoRealizado: string;
  fechaInicio: Date | Timestamp;
}
