import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import { 
  Proceso, 
  RecursosSistema, 
  EventoSistema, 
  Aplicacion,
  EstadoRed,
  EstadoBateria,
  Usuario
} from "@/types";
import { useSystemResources } from "@/hooks/useSystemResources";

// Estado inicial del sistema
interface DOSState {
  procesos: Proceso[];
  recursos: RecursosSistema;
  eventos: EventoSistema[];
  aplicacionesAbiertas: Aplicacion[];
  aplicacionActiva: string | null;
  estadoRed: EstadoRed;
  estadoBateria: EstadoBateria;
  volumen: number;
  isLoggedIn: boolean;
  fondoActual: string;
  usuarioActual: Usuario | null;
  usuarios: Usuario[];
}

// Acciones disponibles
type DOSAction = 
  | { type: 'INICIAR_PROCESO', payload: Proceso }
  | { type: 'TERMINAR_PROCESO', payload: number }
  | { type: 'BLOQUEAR_PROCESO', payload: number }
  | { type: 'ACTUALIZAR_QUANTUM', payload: { id: number, quantum: number } }
  | { type: 'ACTUALIZAR_PROCESO', payload: { id: number, cambios: Partial<Proceso> } }
  | { type: 'REGISTRAR_EVENTO', payload: Omit<EventoSistema, 'id' | 'timestamp'> }
  | { type: 'ACTUALIZAR_RECURSOS', payload: Partial<RecursosSistema> }
  | { type: 'ABRIR_APLICACION', payload: Aplicacion }
  | { type: 'CERRAR_APLICACION', payload: string }
  | { type: 'MINIMIZAR_APLICACION', payload: string }
  | { type: 'MAXIMIZAR_APLICACION', payload: string }
  | { type: 'ACTIVAR_APLICACION', payload: string }
  | { type: 'ACTUALIZAR_RED', payload: EstadoRed }
  | { type: 'ACTUALIZAR_BATERIA', payload: EstadoBateria }
  | { type: 'ACTUALIZAR_VOLUMEN', payload: number }
  | { type: 'LOGIN', payload?: Usuario }
  | { type: 'LOGOUT' }
  | { type: 'CAMBIAR_FONDO', payload: string };

// Aplicaciones disponibles en el sistema
const aplicacionesDisponibles: Omit<Aplicacion, 'esMinimizado' | 'activo'>[] = [
  { id: 'calculadora', nombre: 'Calculadora', icono: 'calculator', componente: 'Calculadora' },
  { id: 'editor', nombre: 'Editor de Texto', icono: 'file-text', componente: 'Editor' },
  { id: 'hoja-calculo', nombre: 'Hoja de Cálculo', icono: 'file-spreadsheet', componente: 'HojaCalculo' },
  { id: 'paint', nombre: 'Paint', icono: 'paint-bucket', componente: 'Paint' },
  { id: 'navegador', nombre: 'Navegador', icono: 'chrome', componente: 'Navegador' },
  { id: 'sistema', nombre: 'Monitor del Sistema', icono: 'monitor', componente: 'MonitorSistema' },
  { id: 'manual', nombre: 'Manual de Usuario', icono: 'manual', componente: 'ManualUsuario' },
  { id: 'galeria', nombre: 'Galería', icono: 'gallery', componente: 'Galeria' },
  { id: 'maquina-virtual', nombre: 'Máquina Virtual', icono: 'monitor', componente: 'MaquinaVirtual' },
];

// Categorías de fondos de pantalla
const categorias = [
  { id: "tecnologia", nombre: "Tecnología" },
  { id: "naturaleza", nombre: "Naturaleza" },
  { id: "abstracto", nombre: "Abstracto" },
  { id: "minimalista", nombre: "Minimalista" }
];

const fondosDisponibles = {
  tecnologia: [
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1484950763426-56b5bf172dbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80",
    "https://images.unsplash.com/photo-1607252650355-f7fd0460b37b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  ],
  naturaleza: [
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2274&q=80",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2275&q=80",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  ],
  abstracto: [
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80",
    "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80",
    "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  ],
  minimalista: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80",
    "https://images.unsplash.com/photo-1496347646636-ea47f7d6b37b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=2094&q=80",
    "https://images.unsplash.com/photo-1498550744921-75f79806b8a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
  ]
};

// Lista de usuarios predefinidos
const usuariosDisponibles: Usuario[] = [
  { 
    id: 1, 
    nombre: 'Administrador', 
    password: '0000', 
    avatar: 'https://ui-avatars.com/api/?name=Administrador&background=random' 
  },
  { 
    id: 2, 
    nombre: 'Usuario', 
    password: '0000', 
    avatar: 'https://ui-avatars.com/api/?name=Usuario&background=random' 
  },
  { 
    id: 3, 
    nombre: 'Invitado', 
    password: '', 
    avatar: 'https://ui-avatars.com/api/?name=Invitado&background=random' 
  },
];

// Estado inicial
const initialState: DOSState = {
  procesos: [
    { id: 1, nombre: 'Sistema', estado: 'activo', memoria: 128, cpu: 5, quantum: 5, prioridad: 1, tiempoEjecucion: 0, tiempoEspera: 0 },
    { id: 2, nombre: 'Gestor de Ventanas', estado: 'activo', memoria: 64, cpu: 3, quantum: 3, prioridad: 2, tiempoEjecucion: 0, tiempoEspera: 0 },
    { id: 3, nombre: 'Servicio de Red', estado: 'activo', memoria: 32, cpu: 1, quantum: 2, prioridad: 3, tiempoEjecucion: 0, tiempoEspera: 0 },
    { id: 4, nombre: 'Gestor de Archivos', estado: 'activo', memoria: 48, cpu: 2, quantum: 2, prioridad: 3, tiempoEjecucion: 0, tiempoEspera: 0 },
    { id: 5, nombre: 'Monitor de Recursos', estado: 'activo', memoria: 24, cpu: 1, quantum: 1, prioridad: 4, tiempoEjecucion: 0, tiempoEspera: 0 },
    { id: 6, nombre: 'Servicio de Audio', estado: 'activo', memoria: 16, cpu: 1, quantum: 1, prioridad: 4, tiempoEjecucion: 0, tiempoEspera: 0 },
    { id: 7, nombre: 'Antivirus', estado: 'activo', memoria: 42, cpu: 2, quantum: 2, prioridad: 5, tiempoEjecucion: 0, tiempoEspera: 0 },
    { id: 8, nombre: 'Indexador', estado: 'activo', memoria: 18, cpu: 1, quantum: 1, prioridad: 6, tiempoEjecucion: 0, tiempoEspera: 0 },
    { id: 9, nombre: 'Actualizador', estado: 'esperando', memoria: 22, cpu: 0, quantum: 3, prioridad: 7, tiempoEjecucion: 0, tiempoEspera: 10 },
    { id: 10, nombre: 'Programador de Tareas', estado: 'activo', memoria: 14, cpu: 1, quantum: 1, prioridad: 5, tiempoEjecucion: 0, tiempoEspera: 0 },
  ],
  recursos: {
    memoriaTotal: 8192, // 8 GB en MB
    memoriaUsada: 408,
    cpuTotal: 100,
    cpuUsada: 17,
    discoTotal: 512000, // 500 GB en MB
    discoUsado: 128000,
  },
  eventos: [
    { 
      id: 1, 
      tipo: 'info', 
      descripcion: 'Sistema iniciado correctamente', 
      timestamp: new Date() 
    },
  ],
  aplicacionesAbiertas: [],
  aplicacionActiva: null,
  estadoRed: {
    conectado: false,
  },
  estadoBateria: {
    nivel: 100,
    cargando: false,
  },
  volumen: 50,
  isLoggedIn: false,
  fondoActual: fondosDisponibles.tecnologia[0],
  usuarioActual: null,
  usuarios: usuariosDisponibles,
};

// Reductor para manejar las acciones
const dosReducer = (state: DOSState, action: DOSAction): DOSState => {
  switch (action.type) {
    case 'INICIAR_PROCESO':
      return {
        ...state,
        procesos: [...state.procesos, action.payload],
        recursos: {
          ...state.recursos,
          memoriaUsada: state.recursos.memoriaUsada + action.payload.memoria,
          cpuUsada: state.recursos.cpuUsada + action.payload.cpu,
        },
      };
    
    case 'TERMINAR_PROCESO': {
      const proceso = state.procesos.find(p => p.id === action.payload);
      if (!proceso) return state;
      
      // Find the associated application
      const appProceso = state.aplicacionesAbiertas.find(app => app.nombre === proceso.nombre);
      
      return {
        ...state,
        procesos: state.procesos.map(p => 
          p.id === action.payload ? { ...p, estado: 'terminado', cpu: 0 } : p
        ),
        recursos: {
          ...state.recursos,
          memoriaUsada: state.recursos.memoriaUsada - proceso.memoria,
          cpuUsada: Math.max(0, state.recursos.cpuUsada - proceso.cpu),
        },
        // Close the associated application if found
        aplicacionesAbiertas: appProceso 
          ? state.aplicacionesAbiertas.filter(app => app.id !== appProceso.id)
          : state.aplicacionesAbiertas,
        aplicacionActiva: appProceso?.id === state.aplicacionActiva 
          ? null 
          : state.aplicacionActiva
      };
    }
    
    case 'BLOQUEAR_PROCESO': {
      const proceso = state.procesos.find(p => p.id === action.payload);
      if (!proceso || proceso.estado !== 'activo') return state;
      
      return {
        ...state,
        procesos: state.procesos.map(p => 
          p.id === action.payload ? { ...p, estado: 'bloqueado' } : p
        ),
      };
    }
    
    case 'ACTUALIZAR_QUANTUM':
      return {
        ...state,
        procesos: state.procesos.map(p => 
          p.id === action.payload.id ? { ...p, quantum: action.payload.quantum } : p
        ),
      };
    
    case 'ACTUALIZAR_PROCESO': {
      return {
        ...state,
        procesos: state.procesos.map((proceso) => {
          if (proceso.id === action.payload.id) {
            // Ensure estado stays within the allowed types
            let cambios = {...action.payload.cambios};
            if (cambios.estado && !['activo', 'bloqueado', 'esperando', 'terminado'].includes(cambios.estado as string)) {
              cambios.estado = proceso.estado; // Keep the original estado if invalid
            }
            
            return { ...proceso, ...cambios };
          }
          return proceso;
        })
      };
    }
    
    case 'REGISTRAR_EVENTO':
      return {
        ...state,
        eventos: [
          ...state.eventos,
          {
            id: state.eventos.length + 1,
            ...action.payload,
            timestamp: new Date(),
          }
        ],
      };
    
    case 'ACTUALIZAR_RECURSOS':
      return {
        ...state,
        recursos: {
          ...state.recursos,
          ...action.payload,
        },
      };
    
    case 'ABRIR_APLICACION': {
      // If the application is already open, just activate it
      if (state.aplicacionesAbiertas.some(app => app.id === action.payload.id)) {
        return {
          ...state,
          aplicacionesAbiertas: state.aplicacionesAbiertas.map(app => 
            app.id === action.payload.id 
              ? { ...app, esMinimizado: false, activo: true }
              : { ...app, activo: false }
          ),
          aplicacionActiva: action.payload.id,
        };
      }
      
      // Create a new process ID
      const nuevoProcesoId = Math.max(...state.procesos.map(p => p.id), 0) + 1;
      
      // Create a new process for the application
      const nuevoProceso = {
        id: nuevoProcesoId,
        nombre: action.payload.nombre,
        estado: 'activo',
        memoria: Math.floor(Math.random() * 50) + 20, // 20-70 MB
        cpu: Math.floor(Math.random() * 5) + 1, // 1-5%
        quantum: 2,
        prioridad: 5,
        tiempoEjecucion: 0,
        tiempoEspera: 0,
      };
      
      return {
        ...state,
        aplicacionesAbiertas: [
          ...state.aplicacionesAbiertas.map(app => ({ ...app, activo: false })),
          { ...action.payload, esMinimizado: false, activo: true }
        ],
        aplicacionActiva: action.payload.id,
        procesos: [...state.procesos, nuevoProceso],
        recursos: {
          ...state.recursos,
          memoriaUsada: state.recursos.memoriaUsada + nuevoProceso.memoria,
          cpuUsada: state.recursos.cpuUsada + nuevoProceso.cpu,
        },
      };
    }
    
    case 'CERRAR_APLICACION':
      return {
        ...state,
        aplicacionesAbiertas: state.aplicacionesAbiertas.filter(app => app.id !== action.payload),
        aplicacionActiva: state.aplicacionActiva === action.payload 
          ? (state.aplicacionesAbiertas.length > 1 
            ? state.aplicacionesAbiertas.find(app => app.id !== action.payload)?.id || null 
            : null) 
          : state.aplicacionActiva,
      };
    
    case 'MINIMIZAR_APLICACION':
      return {
        ...state,
        aplicacionesAbiertas: state.aplicacionesAbiertas.map(app => 
          app.id === action.payload ? { ...app, esMinimizado: true, activo: false } : app
        ),
        aplicacionActiva: state.aplicacionActiva === action.payload 
          ? null 
          : state.aplicacionActiva,
      };
    
    case 'MAXIMIZAR_APLICACION':
      return {
        ...state,
        aplicacionesAbiertas: state.aplicacionesAbiertas.map(app => 
          app.id === action.payload ? { ...app, esMinimizado: false } : app
        ),
      };
    
    case 'ACTIVAR_APLICACION':
      return {
        ...state,
        aplicacionesAbiertas: state.aplicacionesAbiertas.map(app => 
          app.id === action.payload ? { ...app, activo: true, esMinimizado: false } : { ...app, activo: false }
        ),
        aplicacionActiva: action.payload,
      };
    
    case 'ACTUALIZAR_RED':
      return {
        ...state,
        estadoRed: action.payload,
      };
    
    case 'ACTUALIZAR_BATERIA':
      return {
        ...state,
        estadoBateria: action.payload,
      };
    
    case 'ACTUALIZAR_VOLUMEN':
      return {
        ...state,
        volumen: action.payload,
      };
    
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        usuarioActual: action.payload || state.usuarios[0],
        eventos: [
          ...state.eventos,
          {
            id: state.eventos.length + 1,
            tipo: 'info',
            descripcion: `Inicio de sesión: ${action.payload?.nombre || state.usuarios[0].nombre}`,
            timestamp: new Date(),
          }
        ],
      };
    
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        usuarioActual: null,
        aplicacionesAbiertas: [],
        aplicacionActiva: null,
        eventos: [
          ...state.eventos,
          {
            id: state.eventos.length + 1,
            tipo: 'info',
            descripcion: `Cierre de sesión: ${state.usuarioActual?.nombre || 'Usuario'}`,
            timestamp: new Date(),
          }
        ],
      };
    
    case 'CAMBIAR_FONDO':
      return {
        ...state,
        fondoActual: action.payload,
        eventos: [
          ...state.eventos,
          {
            id: state.eventos.length + 1,
            tipo: 'info',
            descripcion: 'Fondo de pantalla cambiado',
            timestamp: new Date(),
          }
        ],
      };
    
    default:
      return state;
  }
};

// Crear el contexto
interface DOSContextType {
  state: DOSState;
  dispatch: React.Dispatch<DOSAction>;
  abrirAplicacion: (id: string) => void;
  cerrarAplicacion: (id: string) => void;
  minimizarAplicacion: (id: string) => void;
  activarAplicacion: (id: string) => void;
  aplicacionesDisponibles: Omit<Aplicacion, 'esMinimizado' | 'activo'>[];
}

const DOSContext = createContext<DOSContextType | undefined>(undefined);

// Proveedor del contexto
export const DOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dosReducer, initialState);
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);
  const { updateResources } = useSystemResources();
  
  // Función para abrir una aplicación
  const abrirAplicacion = (id: string) => {
    const appInfo = aplicacionesDisponibles.find(app => app.id === id);
    if (appInfo) {
      dispatch({ 
        type: 'ABRIR_APLICACION', 
        payload: { ...appInfo, esMinimizado: false, activo: true } 
      });
      
      // Registrar evento
      dispatch({
        type: 'REGISTRAR_EVENTO',
        payload: {
          tipo: 'info',
          descripcion: `Aplicación iniciada: ${appInfo.nombre}`,
        }
      });
      
      // Create a new process for the application
      const nuevoId = Math.max(...state.procesos.map(p => p.id)) + 1;
      dispatch({
        type: 'INICIAR_PROCESO',
        payload: {
          id: nuevoId,
          nombre: appInfo.nombre,
          estado: 'activo' as const,
          memoria: Math.floor(Math.random() * 50) + 20, // 20-70 MB
          cpu: Math.floor(Math.random() * 5) + 1, // 1-5%
          quantum: 2,
          prioridad: 5,
          tiempoEjecucion: 0,
          tiempoEspera: 0,
        }
      });
    }
  };
  
  // Función para cerrar una aplicación
  const cerrarAplicacion = (id: string) => {
    const app = state.aplicacionesAbiertas.find(app => app.id === id);
    if (app) {
      dispatch({ type: 'CERRAR_APLICACION', payload: id });
      
      // Registrar evento
      dispatch({
        type: 'REGISTRAR_EVENTO',
        payload: {
          tipo: 'info',
          descripcion: `Aplicación cerrada: ${app.nombre}`,
        }
      });
      
      // Terminar el proceso asociado
      const proceso = state.procesos.find(p => p.nombre === app.nombre && p.estado === 'activo');
      if (proceso) {
        dispatch({ type: 'TERMINAR_PROCESO', payload: proceso.id });
      }
    }
  };
  
  // Función para minimizar una aplicación
  const minimizarAplicacion = (id: string) => {
    dispatch({ type: 'MINIMIZAR_APLICACION', payload: id });
  };
  
  // Función para activar una aplicación
  const activarAplicacion = (id: string) => {
    dispatch({ type: 'ACTIVAR_APLICACION', payload: id });
  };
  
  // Efecto para monitorear el estado de la conexión
  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      dispatch({ 
        type: 'ACTUALIZAR_RED', 
        payload: { conectado: true, tipo: 'WiFi' } 
      });
      
      dispatch({
        type: 'REGISTRAR_EVENTO',
        payload: {
          tipo: 'info',
          descripcion: 'Conexión establecida a la red',
        }
      });
    };
    
    const handleOffline = () => {
      setOnlineStatus(false);
      dispatch({ 
        type: 'ACTUALIZAR_RED', 
        payload: { conectado: false } 
      });
      
      dispatch({
        type: 'REGISTRAR_EVENTO',
        payload: {
          tipo: 'info',
          descripcion: 'Conexión a la red perdida',
        }
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Inicializar el estado de la conexión
    dispatch({ 
      type: 'ACTUALIZAR_RED', 
      payload: { conectado: navigator.onLine, tipo: navigator.onLine ? 'WiFi' : undefined } 
    });
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Efecto para simular la batería
  useEffect(() => {
    // Solo en navegadores que soportan la API de batería
    if ('getBattery' in navigator) {
      const updateBattery = async () => {
        try {
          // @ts-ignore - La API getBattery no está en los tipos de TypeScript
          const battery = await navigator.getBattery();
          
          dispatch({
            type: 'ACTUALIZAR_BATERIA',
            payload: {
              nivel: Math.floor(battery.level * 100),
              cargando: battery.charging,
            }
          });
          
          battery.addEventListener('levelchange', () => {
            dispatch({
              type: 'ACTUALIZAR_BATERIA',
              payload: {
                nivel: Math.floor(battery.level * 100),
                cargando: battery.charging,
              }
            });
          });
          
          battery.addEventListener('chargingchange', () => {
            dispatch({
              type: 'ACTUALIZAR_BATERIA',
              payload: {
                nivel: Math.floor(battery.level * 100),
                cargando: battery.charging,
              }
            });
            
            dispatch({
              type: 'REGISTRAR_EVENTO',
              payload: {
                tipo: 'info',
                descripcion: battery.charging 
                  ? 'Batería conectada y cargando' 
                  : 'Batería desconectada, usando batería',
              }
            });
          });
        } catch (error) {
          console.error('Error al acceder a la información de la batería:', error);
          // Usar valores simulados si no podemos acceder a la API
          dispatch({
            type: 'ACTUALIZAR_BATERIA',
            payload: {
              nivel: 75,
              cargando: true,
            }
          });
        }
      };
      
      updateBattery();
    } else {
      // Simular batería si no está disponible la API
      console.log('API de Batería no disponible, usando simulación');
      dispatch({
        type: 'ACTUALIZAR_BATERIA',
        payload: {
          nivel: 80,
          cargando: true,
        }
      });
    }
  }, []);
  
  // Simular cambios en los recursos del sistema
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Simular fluctuaciones en el uso de CPU y memoria
      const cpuDelta = Math.floor(Math.random() * 5) - 2; // -2 a +2
      const memoriaDelta = Math.floor(Math.random() * 20) - 5; // -5 a +15
      
      const nuevaCpuUsada = Math.max(15, Math.min(25, state.recursos.cpuUsada + cpuDelta));
      const nuevaMemoriaUsada = Math.max(400, Math.min(600, state.recursos.memoriaUsada + memoriaDelta));
      
      dispatch({
        type: 'ACTUALIZAR_RECURSOS',
        payload: {
          cpuUsada: nuevaCpuUsada,
          memoriaUsada: nuevaMemoriaUsada,
        }
      });
      
      // Simular eventos aleatorios del sistema
      if (Math.random() < 0.05) { // 5% de probabilidad
        const tiposEvento = ['interbloqueo', 'exclusionMutua', 'inanicion'] as const;
        const tipoEvento = tiposEvento[Math.floor(Math.random() * tiposEvento.length)];
        const procesoAleatorio = state.procesos[Math.floor(Math.random() * state.procesos.length)];
        
        let descripcion = '';
        switch (tipoEvento) {
          case 'interbloqueo':
            descripcion = `Interbloqueo detectado en el proceso ${procesoAleatorio.nombre}`;
            break;
          case 'exclusionMutua':
            descripcion = `Exclusión mutua aplicada en el proceso ${procesoAleatorio.nombre}`;
            break;
          case 'inanicion':
            descripcion = `Inanición detectada en el proceso ${procesoAleatorio.nombre}`;
            break;
        }
        
        dispatch({
          type: 'REGISTRAR_EVENTO',
          payload: {
            tipo: tipoEvento,
            descripcion,
            proceso: procesoAleatorio.id,
          }
        });
        
        // Si es inanición, bloqueamos el proceso
        if (tipoEvento === 'inanicion') {
          dispatch({
            type: 'BLOQUEAR_PROCESO',
            payload: procesoAleatorio.id,
          });
        }
      }
      
      // Actualizar tiempos de ejecución y espera
      state.procesos.forEach(proceso => {
        if (proceso.estado === 'activo') {
          const nuevoTiempoEjecucion = proceso.tiempoEjecucion + 1;
          
          dispatch({
            type: 'ACTUALIZAR_PROCESO',
            payload: {
              id: proceso.id,
              cambios: {
                tiempoEjecucion: nuevoTiempoEjecucion,
                // Simular pequeñas fluctuaciones en el uso de CPU
                cpu: Math.max(0.1, Math.min(proceso.cpu + (Math.random() * 0.6 - 0.3), 100))
              }
            }
          });
          
          // Simulación básica de planificación por quantum
          if (nuevoTiempoEjecucion % proceso.quantum === 0) {
            // El proceso ha consumido su quantum, podría bloquearse
            if (Math.random() < 0.1) { // 10% de probabilidad
              dispatch({
                type: 'BLOQUEAR_PROCESO',
                payload: proceso.id,
              });
              
              dispatch({
                type: 'REGISTRAR_EVENTO',
                payload: {
                  tipo: 'info',
                  descripcion: `Proceso ${proceso.nombre} bloqueado por consumo de quantum`,
                  proceso: proceso.id,
                }
              });
            }
          }
        } else if (proceso.estado === 'esperando' || proceso.estado === 'bloqueado') {
          const nuevoTiempoEspera = proceso.tiempoEspera + 1;
          
          dispatch({
            type: 'ACTUALIZAR_PROCESO',
            payload: {
              id: proceso.id,
              cambios: {
                tiempoEspera: nuevoTiempoEspera
              }
            }
          });
          
          // Posibilidad de desbloquear procesos
          if (proceso.estado === 'bloqueado' && Math.random() < 0.2) { // 20% de probabilidad
            dispatch({
              type: 'ACTUALIZAR_PROCESO',
              payload: {
                id: proceso.id,
                cambios: {
                  estado: 'activo',
                  tiempoEspera: nuevoTiempoEspera
                }
              }
            });
            
            dispatch({
              type: 'REGISTRAR_EVENTO',
              payload: {
                tipo: 'info',
                descripcion: `Proceso ${proceso.nombre} desbloqueado`,
                proceso: proceso.id,
              }
            });
          }
        }
      });
      
    }, 3000); // Actualizar cada 3 segundos
    
    return () => clearInterval(intervalId);
  }, [state.procesos, state.recursos]);
  
  const value = {
    state,
    dispatch,
    abrirAplicacion,
    cerrarAplicacion,
    minimizarAplicacion,
    activarAplicacion,
    aplicacionesDisponibles,
  };
  
  return <DOSContext.Provider value={value}>{children}</DOSContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useDOS = () => {
  const context = useContext(DOSContext);
  if (context === undefined) {
    throw new Error('useDOS debe ser usado dentro de un DOSProvider');
  }
  return context;
};
