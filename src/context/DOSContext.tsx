import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Aplicacion, Proceso } from "@/types";
import { useSystemResources } from "@/hooks/useSystemResources";

// Define el tipo para el estado del contexto
interface DOSState {
  isLoggedIn: boolean;
  username: string;
  fondoActual: string;
  aplicacionesAbiertas: Aplicacion[];
  aplicacionesDisponibles: Aplicacion[];
  procesosSistema: Proceso[];
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
  | { type: "TERMINAR_PROCESO"; payload: number };

// Estado inicial del contexto
const initialState: DOSState = {
  isLoggedIn: false,
  username: "",
  fondoActual: "url('/fondos/fondo-windows-xp.jpg')",
  aplicacionesAbiertas: [],
  aplicacionesDisponibles: [
    { id: "calculadora", nombre: "Calculadora", icono: "calculator", componente: "Calculadora", activo: false },
    { id: "editor", nombre: "Editor de Texto", icono: "file-text", componente: "Editor", activo: false },
    { id: "hojaCalculo", nombre: "Hoja de Cálculo", icono: "file-spreadsheet", componente: "HojaCalculo", activo: false },
    { id: "paint", nombre: "Paint", icono: "paint-bucket", componente: "Paint", activo: false },
    { id: "navegador", nombre: "Navegador Web", icono: "chrome", componente: "Navegador", activo: false },
    { id: "monitorSistema", nombre: "Monitor del Sistema", icono: "monitor", componente: "MonitorSistema", activo: false },
    { id: "manualUsuario", nombre: "Manual de Usuario", icono: "manual", componente: "ManualUsuario", activo: false },
    { id: "galeria", nombre: "Galería de Imágenes", icono: "gallery", componente: "Galeria", activo: false },
  ],
  procesosSistema: [
    { id: 1, nombre: "Sistema", estado: "activo", memoria: 256, cpu: 10, quantum: 5, prioridad: 1, tiempoEjecucion: 100, tiempoEspera: 10 },
    { id: 2, nombre: "Kernel", estado: "activo", memoria: 128, cpu: 5, quantum: 3, prioridad: 2, tiempoEjecucion: 50, tiempoEspera: 5 },
  ],
};

// Function to map application state to process state
const mapAppStateToProcessState = (appState: boolean): "activo" | "bloqueado" | "esperando" | "terminado" => {
  if (appState) return "activo";
  return "terminado";
};

// Function to generate a random process
const generarProceso = (
  nombre: string, 
  estado: "activo" | "bloqueado" | "esperando" | "terminado" = "activo"
): Proceso => ({
  id: Math.floor(Math.random() * 10000),
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
      toast(`Abriendo ${app.nombre}...`);
      return { ...state, aplicacionesAbiertas: [...state.aplicacionesAbiertas, { ...app, activo: true }] };
    }
    case "CERRAR_APLICACION": {
      const id = action.payload;
      toast(`Cerrando aplicación...`);
      return { ...state, aplicacionesAbiertas: state.aplicacionesAbiertas.filter((app) => app.id !== id) };
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
      // Map open applications to processes
      const procesosDeSistema = state.procesosSistema.filter(p => 
        p.nombre.startsWith("Sistema") || p.nombre.startsWith("Kernel")
      );

      const procesosDeAplicaciones = state.aplicacionesAbiertas.map(app => 
        generarProceso(app.nombre, "activo")
      );

      return {
        ...state,
        procesosSistema: [...procesosDeSistema, ...procesosDeAplicaciones]
      };
    }
    case "TERMINAR_PROCESO": {
      const procesoId = action.payload;
      
      // Find the process to terminate
      const procesoATerminar = state.procesosSistema.find(p => p.id === procesoId);
      
      // If it's a system process or not found, just remove it from processes
      if (!procesoATerminar || procesoATerminar.nombre.startsWith("Sistema") || procesoATerminar.nombre.startsWith("Kernel")) {
        return {
          ...state,
          procesosSistema: state.procesosSistema.filter(p => p.id !== procesoId)
        };
      }
      
      // If it's an application process, also close the application
      return {
        ...state,
        procesosSistema: state.procesosSistema.filter(p => p.id !== procesoId),
        aplicacionesAbiertas: state.aplicacionesAbiertas.filter(app => app.nombre !== procesoATerminar.nombre)
      };
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
      cpuUsage: state.procesosSistema.reduce((acc, curr) => acc + curr.cpu, 0),
      memoryUsage: state.procesosSistema.reduce((acc, curr) => acc + curr.memoria, 0),
    });
  }, [state.procesosSistema, updateResources]);

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
