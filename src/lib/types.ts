export interface User {
  id: string; // UID de Firebase Auth
  email: string;
  displayName: string;
  role: 'admin' | 'supervisor' | 'tecnico';
  empresaId: string; // Multi-tenancy
  activo: boolean;
  telefono?: string;
  photoURL?: string;
  notificacionesHabilitadas: boolean;
  fcmTokens: string[]; // Para push notifications
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastLogin?: Date;
  };
}

export interface Equipo {
  id: string;
  codigoInterno: string; // Ej: "TBL-PLT1-001"
  descripcion: string;
  tipoEquipo: 'tablero_electrico' | 'motor' | 'bomba' | 'ups' | 'transformador' | 'otro';
  fabricante?: string;
  modelo?: string;
  numeroSerie?: string;
  
  ubicacion: {
    planta: string;
    sector: string;
    edificio?: string;
    piso?: string;
    coordenadasGPS?: {
      lat: number;
      lng: number;
    };
  };
  
  estadoActual: 'operativo' | 'fuera_de_servicio' | 'en_reparacion' | 'en_mantenimiento';
  
  fechaInstalacion?: Date;
  garantiaHasta?: Date;
  
  qrCodeId: string; // UUID único para QR
  qrCodeURL?: string; // URL del QR generado
  
  caracteristicasTecnicas?: {
    potencia?: string;
    voltaje?: string;
    corriente?: string;
    [key: string]: any;
  };
  
  planesAsociados: string[]; // IDs de planes de mantenimiento
  
  proximoMantenimiento?: {
    planId: string;
    fechaProgramada: Date;
    tipoIntervencion: string;
  };
  
  empresaId: string;
  
  estadisticas: {
    totalIntervenciones: number;
    ultimaIntervencion?: Date;
    horasOperacion?: number;
    numeroAlarmas: number;
  };
  
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string; // User ID
  };
}

export interface PlanMantenimiento {
  id: string;
  nombrePlan: string;
  descripcion: string;
  
  aplicabilidad: {
    tipo: 'tipo_equipo' | 'equipo_especifico' | 'todos';
    tipoEquipo?: string[];
    equipoIds?: string[];
  };
  
  frecuencia: {
    tipo: 'dias' | 'horas_funcionamiento' | 'intervenciones' | 'meses';
    valor: number;
    toleranciaDias?: number; // Para anticipar alarmas
  };
  
  checklistTareas: Array<{
    id: string;
    orden: number;
    descripcion: string;
    esObligatoria: boolean;
    tiempoEstimadoMinutos?: number;
    categoria?: 'inspeccion' | 'limpieza' | 'ajuste' | 'medicion' | 'reemplazo';
    requiereFoto?: boolean;
  }>;
  
  repuestosRecomendados?: Array<{
    descripcion: string;
    codigoInterno?: string;
    cantidadEstimada: number;
  }>;
  
  documentosAdjuntos?: Array<{
    nombre: string;
    url: string;
    tipo: string;
  }>;
  
  activo: boolean;
  empresaId: string;
  
  configuracionAlarmas: {
    anticipacionDias: number; // Días antes de generar alarma
    severidadPredeterminada: 'baja' | 'media' | 'alta';
    notificarSupervisor: boolean;
    notificarTecnicos: boolean;
  };
  
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  };
}

export interface Intervencion {
  id: string;
  numeroIntervencion: string; // Ej: "INT-2024-00123"
  
  equipoId: string;
  equipoSnapshot: { // Denormalización para historial
    codigoInterno: string;
    descripcion: string;
    ubicacion: string;
  };
  
  planMantenimientoId?: string;
  
  tipoIntervencion: 'correctivo' | 'preventivo' | 'predictivo' | 'inspeccion' | 'instalacion';
  
  prioridad: 'baja' | 'normal' | 'alta' | 'urgente';
  
  tecnicoId: string;
  tecnicoSnapshot: {
    displayName: string;
    email: string;
  };
  
  fechaInicio: Date;
  fechaFin?: Date;
  duracionMinutos?: number;
  
  descripcionProblema?: string; // Para correctivos
  trabajoRealizado: string;
  
  checklistResultado?: Array<{
    tareaId: string;
    descripcion: string;
    estado: 'completado' | 'pendiente' | 'no_aplica' | 'fallo';
    observaciones?: string;
    evidenciaFoto?: string;
  }>;
  
  repuestosUtilizados: Array<{
    descripcion: string;
    codigoInterno?: string;
    cantidad: number;
    unidad: string;
  }>;
  
  medicionesRealizadas?: Array<{
    tipo: string;
    valor: number;
    unidad: string;
    estado: 'normal' | 'fuera_rango';
  }>;
  
  fotosAdjuntas?: Array<{
    url: string;
    descripcion?: string;
    timestamp: Date;
  }>;
  
  documentosAdjuntos?: Array<{
    nombre: string;
    url: string;
    tipo: string;
  }>;
  
  estadoEquipoDespues: 'operativo' | 'fuera_de_servicio' | 'en_reparacion';
  
  requiereSegimiento: boolean;
  fechaSeguimiento?: Date;
  
  firmaDigital?: {
    tecnico: string; // URL o base64
    cliente?: string;
    supervisor?: string;
  };
  
  estadoCierre: 'abierta' | 'cerrada' | 'pendiente_aprobacion' | 'rechazada' | 'requiere_info';
  
  aprobacionSupervisor?: {
    supervisorId: string;
    fecha: Date;
    comentarios?: string;
    aprobado: boolean;
  };
  
  costoEstimado?: {
    manoObra: number;
    repuestos: number;
    total: number;
    moneda: string;
  };
  
  empresaId: string;
  
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    ubicacionGPS?: {
      lat: number;
      lng: number;
    };
  };
}

export interface Alarma {
  id: string;
  numeroAlarma: string; // Ej: "ALR-2024-00456"
  
  equipoId: string;
  equipoSnapshot: {
    codigoInterno: string;
    descripcion: string;
    ubicacion: string;
  };
  
  planMantenimientoId?: string;
  
  tipoAlarma: 
    | 'proximo_mantenimiento'
    | 'mantenimiento_vencido'
    | 'equipo_fuera_servicio'
    | 'fallo_detectado'
    | 'umbral_excedido'
    | 'inspeccion_requerida';
  
  titulo: string;
  mensaje: string;
  
  severidad: 'baja' | 'media' | 'alta' | 'critica';
  
  fechaGeneracion: Date;
  fechaLimiteAtencion?: Date;
  
  estado: 'pendiente' | 'en_progreso' | 'resuelta' | 'cancelada' | 'escalada';
  
  asignadoA?: string; // User ID del responsable
  
  intervencionAsociada?: string; // ID de intervención que la resolvió
  
  accionesRealizadas?: Array<{
    fecha: Date;
    usuarioId: string;
    accion: string;
    comentario?: string;
  }>;
  
  notificacionesEnviadas?: Array<{
    fecha: Date;
    destinatarios: string[];
    metodo: 'push' | 'email' | 'sms';
    exitosa: boolean;
  }>;
  
  generadoPor: 'sistema' | 'supervisor' | 'tecnico' | 'sensor';
  
  escalamiento?: {
    nivel: number;
    fechaEscalamiento: Date;
    supervisorNotificado: string;
  };
  
  empresaId: string;
  
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
    resolvedBy?: string;
  };
}
