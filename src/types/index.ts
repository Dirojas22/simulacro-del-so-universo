
// Definición de tipos para el simulador de SO DOS

// Tipo para procesos del sistema
export interface Proceso {
  id: number;
  nombre: string;
  estado: 'activo' | 'bloqueado' | 'terminado' | 'esperando';
  memoria: number; // en MB
  cpu: number; // porcentaje de uso
  quantum: number; // unidades de tiempo
  prioridad: number;
  tiempoEjecucion: number;
  tiempoEspera: number;
}

// Tipo para recursos del sistema
export interface RecursosSistema {
  memoriaTotal: number;
  memoriaUsada: number;
  cpuTotal: number;
  cpuUsada: number;
  discoTotal: number;
  discoUsado: number;
}

// Tipo para eventos del sistema
export interface EventoSistema {
  id: number;
  tipo: 'interbloqueo' | 'exclusionMutua' | 'inanicion' | 'info';
  descripcion: string;
  proceso?: number;
  timestamp: Date;
}

// Tipo para aplicaciones
export interface Aplicacion {
  id: string;
  nombre: string;
  icono: string;
  componente: string;
  esMinimizado: boolean;
  activo: boolean;
}

// Tipo para estado de la red
export interface EstadoRed {
  conectado: boolean;
  tipo?: string;
}

// Tipo para estado de la batería
export interface EstadoBateria {
  nivel: number;
  cargando: boolean;
}

// Tipo para usuarios del sistema
export interface Usuario {
  id: number;
  nombre: string;
  password: string;
  avatar: string;
}
