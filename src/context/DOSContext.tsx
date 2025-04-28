
import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Aplicacion, Proceso, RecursosSistema, EventoSistema, EstadoRed, EstadoBateria, Usuario } from "@/types";
import { useSystemResources } from "@/hooks/useSystemResources";

// Define el tipo para el estado del contexto
interface DOSState {
  isLoggedIn: boolean;
  username: string;
  fondoActual: string;
  aplicacionesAbiertas: Aplicacion[];
  aplicacionesDisponibles: Aplicacion[];
  procesosSistema: Proceso[];
  recursos: RecursosSistema;
  eventos: EventoSistema[];
  estadoRed: EstadoRed;
  estadoBateria: EstadoBateria;
  usuarios: Usuario[];
  volumen: number;
}

// Define el tipo para las acciones del reducer
type DOSAction =
  | { type: "LOGIN"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CAMBIAR_FONDO"; payload: string }
  | { type: "ABRIR_APLICACION"; payload: Aplicacion }
  | { type: "CERRAR_APLICACION"; payload: string }
  | { type: "MINIMIZAR_APLICACION"; payload: string }
  | { type: "ACTIVAR_APLICACION"; payload: string }
  | { type: "ACTUALIZAR_PROCESOS" }
  | { type: "TERMINAR_PROCESO"; payload: number }
  | { type: "ACTUALIZAR_QUANTUM"; payload: { id: number; quantum: number } }
  | { type: "ACTUALIZAR_PROCESO"; payload: { id: number; cambios: Partial<Proceso> } }
  | { type: "ACTUALIZAR_VOLUMEN"; payload: number };

// Estado inicial del contexto
const initialState: DOSState = {
  isLoggedIn: false,
  username: "",
  fondoActual: "url('/fondos/fondo-windows-xp.jpg')",
  aplicacionesAbiertas: [],
  aplicacionesDisponibles: [
    { id: "calculadora", nombre: "Calculadora", icono: "calculator", componente: "Calculadora", activo: false, esMinimizado: false },
    { id: "editor", nombre: "Editor de Texto", icono: "file-text", componente: "Editor", activo: false, esMinimizado: false },
    { id: "hojaCalculo", nombre: "Hoja de Cálculo", icono: "file-spreadsheet", componente: "HojaCalculo", activo: false, esMinimizado: false },
    { id: "paint", nombre: "Paint", icono: "paint-bucket", componente: "Paint", activo: false, esMinimizado: false },
    { id: "navegador", nombre: "Navegador Web", icono: "chrome", componente: "Navegador", activo: false, esMinimizado: false },
    { id: "monitorSistema", nombre: "Monitor del Sistema", icono: "monitor", componente: "MonitorSistema", activo: false, esMinimizado: false },
    { id: "manualUsuario", nombre: "Manual de Usuario", icono: "gallery-horizontal", componente: "ManualUsuario", activo: false, esMinimizado: false },
    { id: "galeria", nombre: "Galería de Imágenes", icono: "gallery-horizontal", componente: "Galeria", activo: false, esMinimizado: false },
  ],
  procesosSistema: [
    { id: 1, nombre: "Sistema", estado: "activo", memoria: 256, cpu: 10, quantum: 5, prioridad: 1, tiempoEjecucion: 100, tiempoEspera: 10, pid: 4 },
    { id: 2, nombre: "Kernel", estado: "activo", memoria: 128, cpu: 5, quantum: 3, prioridad: 2, tiempoEjecucion: 50, tiempoEspera: 5, pid: 0 },
  ],
  recursos: {
    memoriaTotal: 8192,
    memoriaUsada: 2048,
    cpuTotal: 100,
    cpuUsada: 15,
    discoTotal: 1024 * 100, // 100 GB en MB
    discoUsado: 1024 * 35,  // 35 GB en MB
  },
  eventos: [
    { id: 1, tipo: "info", descripcion: "Sistema iniciado correctamente", timestamp: new Date(), proceso: undefined },
    { id: 2, tipo: "info", descripcion: "Servicios del sistema cargados", timestamp: new Date(), proceso: 1 },
  ],
  estadoRed: {
    conectado: true,
    tipo: "WiFi"
  },
  estadoBateria: {
    nivel: 85,
    cargando: true
  },
  usuarios: [
    { id: 1, nombre: "admin", password: "admin", avatar: "https://ui-avatars.com/api/?name=Admin&background=random" },
    { id: 2, nombre: "user", password: "user", avatar: "https://ui-avatars.com/api/?name=User&background=random" },
  ],
  volumen: 50,
};

// Function to generate a unique PID
const generatePID = (existingPIDs: number[]): number => {
  let pid;
  do {
    pid = Math.floor(Math.random() * 9000) + 1000; // Generate PID between 1000-9999
  } while (existingPIDs.includes(pid));
  return pid;
};

// Function to map application state to process state
const mapAppStateToProcessState = (appState: boolean): "activo" | "bloqueado" | "esperando" | "terminado" => {
  if (appState) return "activo";
  return "terminado";
};

// Function to generate a random process for an application
const generarProcesoDesdApp = (app: Aplicacion, existingPIDs: number[]): Proceso => ({
  id: Math.floor(Math.random() * 10000),
  pid: generatePID(existingPIDs),
  nombre: `${app.nombre}.exe`,
  estado: "activo",
  memoria: Math.floor(Math.random() * 150) + 50, // 50-200 MB
  cpu: Math.floor(Math.random() * 10) + 5, // 5-15%
  quantum: Math.floor(Math.random() * 5) + 1,
  prioridad: Math.floor(Math.random() * 3) + 1,
  tiempoEjecucion: Math.floor(Math.random() * 100),
  tiempoEspera: 0,
  appId: app.id,
});

// Function to generate a random process
const generarProceso = (
  nombre: string, 
  estado: "activo" | "bloqueado" | "esperando" | "terminado" = "activo",
  existingPIDs: number[] = []
): Proceso => ({
  id: Math.floor(Math.random() * 10000),
  pid: generatePID(existingPIDs),
  nombre,
  estado,
  memoria: Math.floor(Math.random() * 500) + 100,
  cpu: Math.floor(Math.random() * 30) + 5,
  quantum: Math.floor(Math.random() * 10) + 1,
  prioridad: Math.floor(Math.random() * 10) + 1,
  tiempoEjecucion: Math.floor(Math.random() * 100),
  tiempoEspera: Math.floor(Math.random() * 20),
});

// Crea el contexto
const DOSContext = createContext<{
  state: DOSState;
  dispatch: React.Dispatch<DOSAction>;
  abrirAplicacion: (id: string) => void;
  cerrarAplicacion: (id: string) => void;
  minimizarAplicacion: (id: string) => void;
  activarAplicacion: (id: string) => void;
} | undefined>(undefined);

// Función para reproducir sonidos
const reproducirSonido = (tipo: 'click' | 'error' | 'notification') => {
  const audio = new Audio();
  switch (tipo) {
    case 'click':
      audio.src = '/sonidos/click.mp3';
      break;
    case 'error':
      audio.src = '/sonidos/error.mp3';
      break;
    case 'notification':
      audio.src = '/sonidos/notification.mp3';
      break;
  }
  audio.play().catch(e => console.log("Error reproduciendo sonido:", e));
};

// El reducer que maneja las acciones
const dosReducer = (state: DOSState, action: DOSAction): DOSState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isLoggedIn: true, username: action.payload };
    case "LOGOUT":
      return { ...state, isLoggedIn: false, username: "" };
    case "CAMBIAR_FONDO":
      return { ...state, fondoActual: action.payload };
    case "ABRIR_APLICACION": {
      const app = action.payload;
      if (state.aplicacionesAbiertas.find((a) => a.id === app.id)) {
        toast("La aplicación ya está abierta.");
        return state;
      }
      
      // Añadir la aplicación a las abiertas
      const appActualizada = { ...app, activo: true, esMinimizado: false };
      const nuevasAppsAbiertas = [...state.aplicacionesAbiertas, appActualizada];
      
      // Crear un nuevo proceso para la aplicación
      const existingPIDs = state.procesosSistema.map(p => p.pid!).filter(Boolean);
      const nuevoProceso = generarProcesoDesdApp(app, existingPIDs);
      
      // Añadir evento
      const nuevoEvento = {
        id: state.eventos.length + 1,
        tipo: 'info' as const,
        descripcion: `Aplicación ${app.nombre} iniciada`,
        timestamp: new Date(),
        proceso: nuevoProceso.id
      };

      toast(`Abriendo ${app.nombre}...`);
      setTimeout(() => reproducirSonido('notification'), 300);
      
      // Actualizar recursos del sistema
      const nuevaMemoriaUsada = Math.min(state.recursos.memoriaTotal, state.recursos.memoriaUsada + nuevoProceso.memoria);
      const nuevaCpuUsada = Math.min(100, state.recursos.cpuUsada + nuevoProceso.cpu);
      
      return { 
        ...state, 
        aplicacionesAbiertas: nuevasAppsAbiertas,
        procesosSistema: [...state.procesosSistema, nuevoProceso],
        eventos: [...state.eventos, nuevoEvento],
        recursos: {
          ...state.recursos,
          memoriaUsada: nuevaMemoriaUsada,
          cpuUsada: nuevaCpuUsada
        }
      };
    }
    case "CERRAR_APLICACION": {
      const id = action.payload;
      
      // Buscar la aplicación a cerrar
      const appACerrar = state.aplicacionesAbiertas.find(app => app.id === id);
      if (!appACerrar) {
        return state;
      }
      
      // Remover la aplicación de las abiertas
      const nuevasAppsAbiertas = state.aplicacionesAbiertas.filter((app) => app.id !== id);
      
      // Buscar y actualizar el proceso asociado
      const procesoACerrar = state.procesosSistema.find(p => p.appId === id);
      if (procesoACerrar) {
        // Crear evento de cierre
        const nuevoEvento = {
          id: state.eventos.length + 1,
          tipo: 'info' as const,
          descripcion: `Aplicación ${appACerrar.nombre} cerrada`,
          timestamp: new Date(),
          proceso: procesoACerrar.id
        };
        
        // Actualizar recursos del sistema
        const nuevaMemoriaUsada = Math.max(384, state.recursos.memoriaUsada - procesoACerrar.memoria);
        const nuevaCpuUsada = Math.max(15, state.recursos.cpuUsada - procesoACerrar.cpu);
        
        // Actualizar procesos
        const nuevosProcesos = state.procesosSistema.filter(p => p.id !== procesoACerrar.id);
        
        toast(`Cerrando ${appACerrar.nombre}...`);
        reproducirSonido('click');
        
        return {
          ...state,
          aplicacionesAbiertas: nuevasAppsAbiertas,
          procesosSistema: nuevosProcesos,
          eventos: [...state.eventos, nuevoEvento],
          recursos: {
            ...state.recursos,
            memoriaUsada: nuevaMemoriaUsada,
            cpuUsada: nuevaCpuUsada
          }
        };
      }
      
      toast(`Cerrando aplicación...`);
      return { ...state, aplicacionesAbiertas: nuevasAppsAbiertas };
    }
    case "MINIMIZAR_APLICACION": {
      const id = action.payload;
      const nuevasAplicaciones = state.aplicacionesAbiertas.map((app) =>
        app.id === id ? { ...app, esMinimizado: !app.esMinimizado } : app
      );
      return { ...state, aplicacionesAbiertas: nuevasAplicaciones };
    }
    case "ACTIVAR_APLICACION": {
      const id = action.payload;
      const nuevasAplicaciones = state.aplicacionesAbiertas.map((app) => ({
        ...app,
        activo: app.id === id,
      }));
      return { ...state, aplicacionesAbiertas: nuevasAplicaciones };
    }
    case "ACTUALIZAR_PROCESOS": {
      const existingPIDs = state.procesosSistema.map(p => p.pid!).filter(Boolean);
      
      // Mantener procesos del sistema
      const procesosDeSistema = state.procesosSistema.filter(p => 
        p.nombre === "Sistema" || p.nombre === "Kernel"
      );
      
      // Crear nuevos procesos para las aplicaciones abiertas
      const procesosDeAplicaciones = state.aplicacionesAbiertas.map(app => {
        const proceso = generarProcesoDesdApp(app, existingPIDs);
        existingPIDs.push(proceso.pid!);
        return proceso;
      });
      
      return {
        ...state,
        procesosSistema: [...procesosDeSistema, ...procesosDeAplicaciones],
        recursos: {
          ...state.recursos,
          memoriaUsada: Math.max(384, procesosDeSistema.reduce((acc, p) => acc + p.memoria, 0) + 
            procesosDeAplicaciones.reduce((acc, p) => acc + p.memoria, 0)),
          cpuUsada: Math.max(15, procesosDeSistema.reduce((acc, p) => acc + p.cpu, 0) + 
            procesosDeAplicaciones.reduce((acc, p) => acc + p.cpu, 0))
        }
      };
    }
    case "TERMINAR_PROCESO": {
      const procesoId = action.payload;
      
      // Find the process to terminate
      const procesoATerminar = state.procesosSistema.find(p => p.id === procesoId);
      if (!procesoATerminar) {
        return state;
      }
      
      // Crear evento de terminación
      const nuevoEvento = {
        id: state.eventos.length + 1,
        tipo: 'info' as const,
        descripcion: `Proceso ${procesoATerminar.nombre} terminado`,
        timestamp: new Date(),
        proceso: procesoATerminar.id
      };
      
      // Actualizar recursos del sistema
      const nuevaMemoriaUsada = Math.max(384, state.recursos.memoriaUsada - procesoATerminar.memoria);
      const nuevaCpuUsada = Math.max(15, state.recursos.cpuUsada - procesoATerminar.cpu);
      
      // If it's a system process or not found, just remove it from processes
      if (procesoATerminar.nombre === "Sistema" || procesoATerminar.nombre === "Kernel") {
        toast.error("No se puede terminar un proceso del sistema");
        reproducirSonido('error');
        return state;
      }
      
      // Play sound effect
      reproducirSonido('click');
      
      // If it's an application process, also close the application
      if (procesoATerminar.appId) {
        const nuevasAppsAbiertas = state.aplicacionesAbiertas.filter(app => app.id !== procesoATerminar.appId);
        toast(`Proceso ${procesoATerminar.nombre} terminado`);
        
        return {
          ...state,
          procesosSistema: state.procesosSistema.filter(p => p.id !== procesoId),
          aplicacionesAbiertas: nuevasAppsAbiertas,
          eventos: [...state.eventos, nuevoEvento],
          recursos: {
            ...state.recursos,
            memoriaUsada: nuevaMemoriaUsada,
            cpuUsada: nuevaCpuUsada
          }
        };
      }
      
      // For non-app processes
      toast(`Proceso ${procesoATerminar.nombre} terminado`);
      return {
        ...state,
        procesosSistema: state.procesosSistema.filter(p => p.id !== procesoId),
        eventos: [...state.eventos, nuevoEvento],
        recursos: {
          ...state.recursos,
          memoriaUsada: nuevaMemoriaUsada,
          cpuUsada: nuevaCpuUsada
        }
      };
    }
    case "ACTUALIZAR_QUANTUM": {
      const { id, quantum } = action.payload;
      return {
        ...state,
        procesosSistema: state.procesosSistema.map(proceso =>
          proceso.id === id ? { ...proceso, quantum } : proceso
        )
      };
    }
    case "ACTUALIZAR_PROCESO": {
      const { id, cambios } = action.payload;
      
      const procesoActualizado = state.procesosSistema.find(p => p.id === id);
      if (!procesoActualizado) return state;
      
      // Check if CPU usage is high and alert if necessary
      if (cambios.cpu && cambios.cpu > 80) {
        toast.warning(`¡El proceso ${procesoActualizado.nombre} está usando mucha CPU (${Math.floor(cambios.cpu)}%)!`);
        reproducirSonido('error');
      }
      
      // Check if memory usage is high and alert if necessary
      if (cambios.memoria && cambios.memoria > 400) {
        toast.warning(`¡El proceso ${procesoActualizado.nombre} está usando mucha memoria (${cambios.memoria} MB)!`);
      }
      
      return {
        ...state,
        procesosSistema: state.procesosSistema.map(proceso =>
          proceso.id === id ? { ...proceso, ...cambios } : proceso
        )
      };
    }
    case "ACTUALIZAR_VOLUMEN": {
      return { ...state, volumen: action.payload };
    }
    default:
      return state;
  }
};

// Hook personalizado para usar el contexto
const useDOS = () => {
  const context = useContext(DOSContext);
  if (!context) {
    throw new Error("useDOS debe ser usado dentro de un DOSProvider");
  }
  return context;
};

// Provider del contexto
const DOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dosReducer, initialState);
  const { updateResources } = useSystemResources();

  useEffect(() => {
    updateResources({
      cpuUsage: state.recursos.cpuUsada,
      memoryUsage: state.recursos.memoriaUsada,
    });
  }, [state.recursos, updateResources]);

  // Actualizar valores aleatorios de los procesos activos cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      state.procesosSistema.forEach(proceso => {
        if (proceso.estado === 'activo') {
          const cpuDelta = Math.random() * 4 - 1.5; // -1.5 a +2.5
          const memoriaDelta = Math.floor(Math.random() * 8) - 3; // -3 a +5
          
          dispatch({
            type: 'ACTUALIZAR_PROCESO',
            payload: {
              id: proceso.id,
              cambios: {
                cpu: Math.max(0.1, Math.min(proceso.cpu + cpuDelta, 100)),
                memoria: Math.max(1, Math.min(proceso.memoria + memoriaDelta, 512)),
                tiempoEjecucion: proceso.tiempoEjecucion + 1
              }
            }
          });
        }
      });
      
      // Actualizar valores aleatorios para recursos del sistema
      const memoriaUsadaDelta = Math.floor(Math.random() * 100) - 40;
      const cpuUsadaDelta = Math.random() * 4 - 1.5;
      
      const nuevaMemoriaUsada = Math.max(384, Math.min(
        state.recursos.memoriaTotal * 0.9,
        state.recursos.memoriaUsada + memoriaUsadaDelta
      ));
      
      const nuevaCpuUsada = Math.max(15, Math.min(
        90,
        state.recursos.cpuUsada + cpuUsadaDelta
      ));
      
      updateResources({
        cpuUsage: nuevaCpuUsada,
        memoryUsage: nuevaMemoriaUsada
      });
      
    }, 5000);
    
    return () => clearInterval(interval);
  }, [state.procesosSistema, state.recursos, updateResources]);

  const abrirAplicacion = useCallback((id: string) => {
    const app = state.aplicacionesDisponibles.find((app) => app.id === id);
    if (app) {
      dispatch({ type: "ABRIR_APLICACION", payload: app });
    }
  }, [state.aplicacionesDisponibles, dispatch]);

  const cerrarAplicacion = useCallback((id: string) => {
    dispatch({ type: "CERRAR_APLICACION", payload: id });
  }, [dispatch]);

  const minimizarAplicacion = useCallback((id: string) => {
    dispatch({ type: "MINIMIZAR_APLICACION", payload: id });
  }, [dispatch]);

  const activarAplicacion = useCallback((id: string) => {
    dispatch({ type: "ACTIVAR_APLICACION", payload: id });
  }, [dispatch]);

  const value = { state, dispatch, abrirAplicacion, cerrarAplicacion, minimizarAplicacion, activarAplicacion };

  return <DOSContext.Provider value={value}>{children}</DOSContext.Provider>;
};

export { DOSProvider, useDOS };
