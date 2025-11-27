
import type { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'admin' | 'supervisor' | 'tecnico_senior' | 'tecnico';
  permissions?: {
    equipos: {
      crear: boolean;
      leer: boolean;
      modificar: boolean;
      eliminar: boolean;
    };
    intervenciones: {
      crear: boolean;
      leerTodas: boolean;
      leerPropias: boolean;
      modificar: boolean;
      aprobar: boolean;
    };
    alarmas: {
      crear: boolean;
      modificar: boolean;
      reasignar: boolean;
    };
    usuarios: {
      crear: boolean;
      modificar: boolean;
      eliminar: boolean;
    };
  };
  empresaId: string;
  activo: boolean;
  perfilTecnico?: {
    especialidades: string[];
    turno: 'mañana' | 'tarde' | 'noche' | 'rotativo';
    zonasAsignadas: string[];
    nivelExperiencia: 'junior' | 'intermedio' | 'senior';
    certificaciones: string[];
    disponibilidadEmergencias: boolean;
  };
  perfilSupervisor?: {
    equiposSupervisa: string[];
    tecnicosACargo: string[];
    sectoresResponsable: string[];
  };
  notificaciones: {
    habilitadas: boolean;
    fcmTokens: string[];
    preferencias: {
      alarmasCriticas: boolean;
      asignacionTareas: boolean;
      aprobacionesPendientes: boolean;
      reportesDiarios: boolean;
      horaReporteDiario?: string;
    };
  };
  estadisticas?: {
    intervencionesCompletadas: number;
    tiempoPromedioIntervencion: number;
    calificacionPromedio: number;
    alarmasGeneradas: number;
    alarmasResueltas: number;
  };
  telefono?: string;
  photoURL?: string;
  metadata: {
    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
    lastLogin?: Date | Timestamp;
    createdBy: string;
  };
}

export interface Empresa {
  id: string;
  razonSocial: string;
  nombreComercial?: string;
  cuit?: string;
  estructura: {
    plantas: Array<{
      id: string;
      nombre: string;
      direccion: string;
      coordenadasGPS?: { lat: number; lng: number };
      sectores: Array<{
        id: string;
        nombre: string;
        supervisorId?: string;
      }>;
    }>;
  };
  configuracion: {
    horariosOperacion: {
      inicio: string;
      fin: string;
      diasLaborables: number[];
    };
    aprobaciones: {
      requiereAprobacionSupervisor: boolean;
      tipoIntervencionesRequierenAprobacion: string[];
      aprobarAutomaticamenteDespuesDe?: number;
    };
    alarmas: {
      anticipacionDiasPredeterminada: number;
      severidadPredeterminada: 'baja' | 'media' | 'alta';
      escalarDespuesDeHoras: number;
      notificarSupervisoresCriticas: boolean;
    };
    tecnicos: {
      permitirCierreDirecto: boolean;
      tiempoMaximoIntervencionSinAlerta: number;
      requiereGPSEnIntervenciones: boolean;
      permitirOfflineSync: boolean;
    };
  };
  suscripcion: {
    plan: 'basico' | 'profesional' | 'empresarial';
    fechaInicio: Date | Timestamp;
    fechaVencimiento: Date | Timestamp;
    activa: boolean;
    limites: {
      usuariosMax: number;
      equiposMax: number;
      almacenamientoGB: number;
      intervencionesMes: number;
    };
    uso: {
      usuariosActuales: number;
      equiposActuales: number;
      almacenamientoUsadoGB: number;
      intervencionesMesActual: number;
    };
  };
  activa: boolean;
  metadata: {
    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
    createdBy: string;
  };
}

export interface Equipo {
  id: string;
  codigoInterno: string;
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
  fechaInstalacion?: Date | Timestamp;
  garantiaHasta?: Date | Timestamp;
  qrCodeId: string;
  qrCodeURL?: string;
  caracteristicasTecnicas?: {
    potencia?: string;
    voltaje?: string;
    corriente?: string;
    [key: string]: any;
  };
  planesAsociados: string[];
  proximoMantenimiento?: {
    planId: string;
    fechaProgramada: Date | Timestamp;
    tipoIntervencion: string;
  };
  empresaId: string;
  estadisticas: {
    totalIntervenciones: number;
    ultimaIntervencion?: Date | Timestamp;
    horasOperacion?: number;
    numeroAlarmas: number;
  };
  metadata: {
    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
    createdBy: string;
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
    toleranciaDias?: number;
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
    anticipacionDias: number;
    severidadPredeterminada: 'baja' | 'media' | 'alta';
    notificarSupervisor: boolean;
    notificarTecnicos: boolean;
  };
  metadata: {
    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
    createdBy: string;
  };
}

export interface Intervencion {
  id: string;
  numeroIntervencion: string;
  equipoId: string;
  equipoSnapshot: {
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
  fechaInicio: Date | Timestamp;
  fechaFin?: Date | Timestamp;
  duracionMinutos?: number;
  descripcionProblema?: string;
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
    timestamp: Date | Timestamp;
  }>;
  documentosAdjuntos?: Array<{
    nombre: string;
    url: string;
    tipo: string;
  }>;
  estadoEquipoDespues: 'operativo' | 'fuera_de_servicio' | 'en_reparacion';
  requiereSegimiento: boolean;
  fechaSeguimiento?: Date | Timestamp;
  firmaDigital?: {
    tecnico: string;
    cliente?: string;
    supervisor?: string;
  };
  estadoCierre: 'abierta' | 'cerrada' | 'pendiente_aprobacion' | 'rechazada' | 'requiere_info';
  aprobacionSupervisor?: {
    supervisorId: string;
    fecha: Date | Timestamp;
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
    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
    ubicacionGPS?: {
      lat: number;
      lng: number;
    };
  };
}

export interface Alarma {
  id: string;
  numeroAlarma: string;
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
  fechaGeneracion: Date | Timestamp;
  fechaLimiteAtencion?: Date | Timestamp;
  estado: 'pendiente' | 'en_progreso' | 'resuelta' | 'cancelada' | 'escalada';
  asignadoA?: string;
  intervencionAsociada?: string;
  accionesRealizadas?: Array<{
    fecha: Date | Timestamp;
    usuarioId: string;
    accion: string;
    comentario?: string;
  }>;
  notificacionesEnviadas?: Array<{
    fecha: Date | Timestamp;
    destinatarios: string[];
    metodo: 'push' | 'email' | 'sms';
    exitosa: boolean;
  }>;
  generadoPor: 'sistema' | 'supervisor' | 'tecnico' | 'sensor';
  escalamiento?: {
    nivel: number;
    fechaEscalamiento: Date | Timestamp;
    supervisorNotificado: string;
  };
  empresaId: string;
  metadata: {
    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
    resolvedAt?: Date | Timestamp;
    resolvedBy?: string;
  };
}

export interface AsignacionTarea {
    id: string;
    tipo: 'intervencion_programada' | 'alarma' | 'emergencia';
    equipoId: string;
    equipoSnapshot: {
      codigoInterno: string;
      descripcion: string;
      ubicacion: string;
    };
    tecnicoAsignadoId: string;
    supervisorId: string;
    fechaAsignacion: Date | Timestamp;
    fechaLimite: Date | Timestamp;
    prioridad: 'baja' | 'normal' | 'alta' | 'urgente';
    estado: 'pendiente' | 'aceptada' | 'en_progreso' | 'completada' | 'rechazada';
    motivoRechazo?: string;
    intervencionId?: string;
    alarmaId?: string;
    empresaId: string;
    metadata: {
      createdAt: Date | Timestamp;
      updatedAt: Date | Timestamp;
      aceptadaAt?: Date | Timestamp;
      completadaAt?: Date | Timestamp;
    };
}
