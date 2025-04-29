import React, { createContext, useContext, Dispatch } from "react";

export type DOSAction =
  | { type: "INICIAR_SESION"; payload: { usuario: Usuario } }
  | { type: "CERRAR_SESION" }
  | { type: "ABRIR_APP"; payload: Aplicacion }
  | { type: "CERRAR_APP"; payload: number }
  | { type: "MINIMIZAR_APP"; payload: number }
  | { type: "ACTIVAR_APP"; payload: number }
  | { type: "ACTUALIZAR_QUANTUM"; payload: { id: number; quantum: number } }
  | { type: "ACTUALIZAR_PROCESO"; payload: { id: number; cambios: Partial<Proceso> } }
  | { type: "TERMINAR_PROCESO"; payload: number }
  | { type: "TOGGLE_WIFI" };

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

export interface Aplicacion {
  id: number;
  nombre: string;
  icono: string;
  componente: React.ComponentType<any>;
  zIndex: number;
  esMinimizado: boolean;
  activa: boolean;
}

export interface Proceso {
  id: number;
  nombre: string;
  cpu: number;
  memoria: number;
  estado: "activo" | "esperando" | "bloqueado" | "terminado";
  quantum: number;
  prioridad: number;
  tiempoEjecucion: number;
  tiempoEspera: number;
}

export interface Recursos {
  cpuUsada: number;
  memoriaUsada: number;
  memoriaTotal: number;
  discoUsado: number;
  discoTotal: number;
}

export interface Evento {
  id: number;
  tipo: string;
  descripcion: string;
  proceso?: number;
  timestamp: Date;
}

export interface EstadoRed {
  conectado: boolean;
  tipo: string;
}

export interface EstadoBateria {
  nivel: number;
  cargando: boolean;
}

export interface DOSState {
  isLoggedIn: boolean;
  usuario: Usuario | null;
  aplicacionesAbiertas: Aplicacion[];
  aplicacionesDisponibles: Aplicacion[];
  procesos: Proceso[];
  recursos: Recursos;
  eventos: Evento[];
  estadoRed: EstadoRed;
  estadoBateria: EstadoBateria;
  fondoActual: string;
}

// Asegúrate de que TOGGLE_WIFI está incluido en DOSActionType
export type DOSActionType =
  | "INICIAR_SESION"
  | "CERRAR_SESION"
  | "ABRIR_APP"
  | "CERRAR_APP"
  | "MINIMIZAR_APP"
  | "ACTIVAR_APP"
  | "ACTUALIZAR_QUANTUM"
  | "ACTUALIZAR_PROCESO"
  | "TERMINAR_PROCESO"
  | "TOGGLE_WIFI";

const DOSContext = createContext<{
  state: DOSState;
  dispatch: Dispatch<DOSAction>;
}>({
  state: {
    isLoggedIn: false,
    usuario: null,
    aplicacionesAbiertas: [],
    aplicacionesDisponibles: [],
    procesos: [],
    recursos: {
      cpuUsada: 0,
      memoriaUsada: 0,
      memoriaTotal: 8192,
      discoUsado: 0,
      discoTotal: 1048576,
    },
    eventos: [],
    estadoRed: {
      conectado: true,
      tipo: "WiFi",
    },
    estadoBateria: {
      nivel: 100,
      cargando: false,
    },
    fondoActual: "",
  },
  dispatch: () => {},
});

function reducer(state: DOSState, action: DOSAction): DOSState {
  switch (action.type) {
    case "INICIAR_SESION":
      return { ...state, isLoggedIn: true, usuario: action.payload.usuario };
    case "CERRAR_SESION":
      return { ...state, isLoggedIn: false, usuario: null };
    case "ABRIR_APP":
      return {
        ...state,
        aplicacionesAbiertas: [...state.aplicacionesAbiertas, action.payload],
      };
    case "CERRAR_APP":
      return {
        ...state,
        aplicacionesAbiertas: state.aplicacionesAbiertas.filter(
          (app) => app.id !== action.payload
        ),
      };
    case "MINIMIZAR_APP":
      return {
        ...state,
        aplicacionesAbiertas: state.aplicacionesAbiertas.map((app) =>
          app.id === action.payload ? { ...app, esMinimizado: !app.esMinimizado } : app
        ),
      };
    case "ACTIVAR_APP":
      return {
        ...state,
        aplicacionesAbiertas: state.aplicacionesAbiertas.map((app) => ({
          ...app,
          activa: app.id === action.payload,
        })),
      };
    case "ACTUALIZAR_QUANTUM":
      return {
        ...state,
        procesos: state.procesos.map((proceso) =>
          proceso.id === action.payload.id
            ? { ...proceso, quantum: action.payload.quantum }
            : proceso
        ),
      };
    case "ACTUALIZAR_PROCESO":
      return {
        ...state,
        procesos: state.procesos.map((proceso) =>
          proceso.id === action.payload.id
            ? { ...proceso, ...action.payload.cambios }
            : proceso
        ),
      };
    case "TERMINAR_PROCESO":
      return {
        ...state,
        procesos: state.procesos.map((proceso) =>
          proceso.id === action.payload ? { ...proceso, estado: "terminado" } : proceso
        ),
      };
    case "TOGGLE_WIFI":
      return {
        ...state,
        estadoRed: {
          ...state.estadoRed,
          conectado: !state.estadoRed.conectado,
        },
        eventos: [
          ...state.eventos,
          {
            id: state.eventos.length + 1,
            tipo: state.estadoRed.conectado ? "error" : "info",
            descripcion: state.estadoRed.conectado
              ? "Conexión WiFi desactivada"
              : "Conexión WiFi activada",
            timestamp: new Date(),
          },
        ],
      };
    default:
      return state;
  }
}

interface DOSProviderProps {
  children: React.ReactNode;
  initialState: DOSState;
}

const DOSProvider: React.FC<DOSProviderProps> = ({ children, initialState }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <DOSContext.Provider value={{ state, dispatch }}>
      {children}
    </DOSContext.Provider>
  );
};

const useDOS = () => {
  const context = useContext(DOSContext);
  if (!context) {
    throw new Error("useDOS debe ser usado dentro de un DOSProvider");
  }
  return context;
};

export { DOSProvider, useDOS };
