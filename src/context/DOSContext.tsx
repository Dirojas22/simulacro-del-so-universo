import React, { createContext, useContext, useReducer } from "react";

// Interfaces
interface Usuario {
  id: string;
  nombre: string;
  password?: string;
  iniciales: string;
  rol: string;
}

interface EstadoRed {
  conectado: boolean;
  tipo?: string;
}

interface EstadoBateria {
  nivel: number;
  cargando: boolean;
}

interface RecursosSistema {
  cpuUsada: number;
  memoriaUsada: number;
  memoriaTotal: number;
  discoUsado: number;
  discoTotal: number;
}

interface Proceso {
  id: number;
  nombre: string;
  cpu: number;
  memoria: number;
  estado: 'activo' | 'esperando' | 'bloqueado' | 'terminado';
  quantum: number;
  prioridad: number;
  tiempoEjecucion: number;
  tiempoEspera: number;
}

interface Evento {
  id: number;
  tipo: string;
  descripcion: string;
  proceso?: number;
  timestamp: Date;
}

interface Aplicacion {
  id: string;
  nombre: string;
  icono: string;
  componente: string;
  activo: boolean;
  esMinimizado: boolean;
}

interface DOSState {
  isLoggedIn: boolean;
  usuario: Usuario;
  usuarios: Usuario[];
  aplicacionesDisponibles: Aplicacion[];
  aplicacionesAbiertas: Aplicacion[];
  recursos: RecursosSistema;
  procesos: Proceso[];
  eventos: Evento[];
  estadoRed: EstadoRed;
  estadoBateria: EstadoBateria;
  fondoActual: string;
}

// Initial state
const initialState: DOSState = {
  isLoggedIn: false,
  usuario: { id: "", nombre: "", password: "", iniciales: "", rol: "" },
  usuarios: [
    { id: "1", nombre: "admin", password: "password", iniciales: "AD", rol: "Administrador" },
    { id: "2", nombre: "invitado", password: "invitado", iniciales: "IN", rol: "Invitado" }
  ],
  aplicacionesDisponibles: [
    { id: "explorador", nombre: "Explorador de Archivos", icono: "file-text", componente: "Explorador", activo: false, esMinimizado: false },
    { id: "terminal", nombre: "Terminal", icono: "terminal", componente: "Terminal", activo: false, esMinimizado: false },
    { id: "calculadora", nombre: "Calculadora", icono: "calculator", componente: "Calculadora", activo: false, esMinimizado: false },
    { id: "monitor", nombre: "Monitor del Sistema", icono: "activity", componente: "MonitorSistema", activo: false, esMinimizado: false },
    { id: "blocnotas", nombre: "Bloc de Notas", icono: "file", componente: "BlocNotas", activo: false, esMinimizado: false },
  ],
  aplicacionesAbiertas: [],
  recursos: {
    cpuUsada: 30,
    memoriaUsada: 1500,
    memoriaTotal: 4096,
    discoUsado: 25000,
    discoTotal: 100000
  },
  procesos: [
    { id: 1, nombre: "System Idle Process", cpu: 0.1, memoria: 20, estado: "activo", quantum: 3, prioridad: 1, tiempoEjecucion: 5, tiempoEspera: 0 },
    { id: 2, nombre: "Memory Manager", cpu: 0.5, memoria: 80, estado: "activo", quantum: 3, prioridad: 2, tiempoEjecucion: 12, tiempoEspera: 1 },
    { id: 3, nombre: "Disk Manager", cpu: 0.3, memoria: 60, estado: "esperando", quantum: 2, prioridad: 3, tiempoEjecucion: 8, tiempoEspera: 3 },
    { id: 4, nombre: "Graphics Driver", cpu: 5.2, memoria: 256, estado: "activo", quantum: 4, prioridad: 2, tiempoEjecucion: 20, tiempoEspera: 2 },
    { id: 5, nombre: "Explorer.exe", cpu: 2.1, memoria: 128, estado: "activo", quantum: 3, prioridad: 3, tiempoEjecucion: 15, tiempoEspera: 1 },
    { id: 6, nombre: "Code Editor", cpu: 8.5, memoria: 512, estado: "esperando", quantum: 5, prioridad: 4, tiempoEjecucion: 30, tiempoEspera: 5 },
    { id: 7, nombre: "Web Browser", cpu: 12.3, memoria: 384, estado: "activo", quantum: 4, prioridad: 3, tiempoEjecucion: 25, tiempoEspera: 3 },
    { id: 8, nombre: "Media Player", cpu: 3.8, memoria: 192, estado: "bloqueado", quantum: 2, prioridad: 2, tiempoEjecucion: 18, tiempoEspera: 6 }
  ],
  eventos: [],
  estadoRed: {
    conectado: true,
    tipo: "Ethernet"
  },
  estadoBateria: {
    nivel: 75,
    cargando: false
  },
  fondoActual: "https://images.unsplash.com/photo-1618005212493-422fbb8ce044"
};

// Types for actions
type DOSAction =
  | { type: "INICIAR_SESION", payload: { usuario: string; password?: string } }
  | { type: "CERRAR_SESION" }
  | { type: "ABRIR_APP", payload: string }
  | { type: "CERRAR_APP", payload: string }
  | { type: "MINIMIZAR_APP", payload: string }
  | { type: "ACTIVAR_APP", payload: string }
  | { type: "ACTUALIZAR_QUANTUM", payload: { id: number; quantum: number } }
  | { type: "ACTUALIZAR_PROCESO", payload: { id: number; cambios: Partial<Proceso> } }
  | { type: "TERMINAR_PROCESO", payload: number }
  | { type: "TOGGLE_WIFI" };

// Reducer
function dosReducer(state: DOSState, action: DOSAction): DOSState {
  switch (action.type) {
    case "INICIAR_SESION": {
      const { usuario, password } = action.payload;
      const usuarioEncontrado = state.usuarios.find(
        u => u.nombre === usuario && u.password === password
      );
      
      if (usuarioEncontrado) {
        return {
          ...state,
          isLoggedIn: true,
          usuario: usuarioEncontrado
        };
      }
      return state;
    }
    
    case "CERRAR_SESION": {
      return {
        ...state,
        isLoggedIn: false,
        aplicacionesAbiertas: [],
        usuario: { id: "", nombre: "", password: "", iniciales: "", rol: "" }
      };
    }
    
    case "ABRIR_APP": {
      const appId = action.payload;
      
      // Verificar si ya está abierta
      const yaAbierta = state.aplicacionesAbiertas.some(app => app.id === appId);
      if (yaAbierta) {
        // Si está minimizada, maximizarla
        return {
          ...state,
          aplicacionesAbiertas: state.aplicacionesAbiertas.map(app => 
            app.id === appId 
              ? { ...app, esMinimizado: false, activo: true }
              : { ...app, activo: false }
          )
        };
      }
      
      // Si no está abierta, abrir la app
      const appToOpen = state.aplicacionesDisponibles.find(app => app.id === appId);
      if (appToOpen) {
        return {
          ...state,
          aplicacionesAbiertas: [
            ...state.aplicacionesAbiertas.map(app => ({ ...app, activo: false })),
            { ...appToOpen, activo: true, esMinimizado: false }
          ]
        };
      }
      
      return state;
    }
    
    case "CERRAR_APP": {
      const appId = action.payload;
      
      const nuevasApps = state.aplicacionesAbiertas.filter(app => app.id !== appId);
      
      // Si cerramos la app activa, activamos la última de la lista
      if (state.aplicacionesAbiertas.find(app => app.id === appId)?.activo && nuevasApps.length > 0) {
        nuevasApps[nuevasApps.length - 1].activo = true;
      }
      
      return {
        ...state,
        aplicacionesAbiertas: nuevasApps
      };
    }
    
    case "MINIMIZAR_APP": {
      const appId = action.payload;
      
      return {
        ...state,
        aplicacionesAbiertas: state.aplicacionesAbiertas.map(app => {
          if (app.id === appId) {
            return { ...app, esMinimizado: true, activo: false };
          }
          return app;
        })
      };
    }
    
    case "ACTIVAR_APP": {
      const appId = action.payload;
      
      return {
        ...state,
        aplicacionesAbiertas: state.aplicacionesAbiertas.map(app => {
          if (app.id === appId) {
            return { ...app, activo: true, esMinimizado: false };
          }
          return { ...app, activo: false };
        })
      };
    }
    
    case "ACTUALIZAR_QUANTUM": {
      const { id, quantum } = action.payload;
      
      return {
        ...state,
        procesos: state.procesos.map(proceso => 
          proceso.id === id ? { ...proceso, quantum } : proceso
        )
      };
    }
    
    case "ACTUALIZAR_PROCESO": {
      const { id, cambios } = action.payload;
      
      return {
        ...state,
        procesos: state.procesos.map(proceso => 
          proceso.id === id ? { ...proceso, ...cambios } : proceso
        )
      };
    }
    
    case "TERMINAR_PROCESO": {
      const procesoId = action.payload;
      
      // Registrar evento
      const proceso = state.procesos.find(p => p.id === procesoId);
      
      if (proceso) {
        const nuevoEvento = {
          id: state.eventos.length + 1,
          tipo: "terminación",
          descripcion: `Proceso ${proceso.nombre} terminado por usuario`,
          proceso: procesoId,
          timestamp: new Date()
        };
        
        return {
          ...state,
          procesos: state.procesos.map(p => 
            p.id === procesoId ? { ...p, estado: "terminado" } : p
          ),
          eventos: [...state.eventos, nuevoEvento]
        };
      }
      
      return state;
    }
    
    case "TOGGLE_WIFI": {
      const nuevoEstado = !state.estadoRed.conectado;
      
      // Registrar evento
      const nuevoEvento = {
        id: state.eventos.length + 1,
        tipo: "sistema",
        descripcion: `WiFi ${nuevoEstado ? "conectado" : "desconectado"}`,
        timestamp: new Date()
      };
      
      return {
        ...state,
        estadoRed: {
          ...state.estadoRed,
          conectado: nuevoEstado
        },
        eventos: [...state.eventos, nuevoEvento]
      };
    }
    
    default:
      return state;
  }
}

// Context
const DOSContext = createContext<{
  state: DOSState;
  dispatch: React.Dispatch<DOSAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Provider
interface DOSProviderProps {
  children: React.ReactNode;
}

const DOSProvider: React.FC<DOSProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(dosReducer, initialState);

  return (
    <DOSContext.Provider value={{ state, dispatch }}>
      {children}
    </DOSContext.Provider>
  );
};

// Hook
const useDOS = () => {
  const context = useContext(DOSContext);
  if (!context) {
    throw new Error("useDOS must be used within a DOSProvider");
  }
  return context;
};

export { DOSProvider, useDOS };
