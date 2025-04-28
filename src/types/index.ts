export interface Proceso {
  id: number;
  nombre: string;
  estado: "activo" | "bloqueado" | "esperando" | "terminado";
  memoria: number;
  cpu: number;
  quantum: number;
  prioridad: number;
  tiempoEjecucion: number;
  tiempoEspera: number;
}

export interface RecursosSistema {
  memoriaTotal: number;
  memoriaUsada: number;
  cpuTotal: number;
  cpuUsada: number;
  discoTotal: number;
  discoUsado: number;
}

export interface EventoSistema {
  id: number;
  tipo: 'info' | 'error' | 'interbloqueo' | 'exclusionMutua' | 'inanicion';
  descripcion: string;
  timestamp: Date;
  proceso?: number;
}

export interface Aplicacion {
  id: string;
  nombre: string;
  icono: string;
  componente: string;
  esMinimizado: boolean;
  activo: boolean;
}

export interface EstadoRed {
  conectado: boolean;
  tipo?: string;
}

export interface EstadoBateria {
  nivel: number;
  cargando: boolean;
}

export interface Usuario {
  id: number;
  nombre: string;
  password: string;
  avatar: string;
}
