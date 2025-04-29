
import React, { createContext, useContext, useReducer, useState, ReactNode } from "react";

interface Tr3sApp {
  id: string;
  nombre: string;
  icono: string;
  abierta: boolean;
  activa: boolean;
}

interface Tr3sState {
  aplicaciones: Tr3sApp[];
  appActiva: string | null;
  fondoPantalla: string;
  notas: string;
}

type Tr3sAction = 
  | { type: 'ABRIR_APP', payload: string }
  | { type: 'CERRAR_APP', payload: string }
  | { type: 'ACTIVAR_APP', payload: string }
  | { type: 'CAMBIAR_FONDO', payload: string }
  | { type: 'GUARDAR_NOTAS', payload: string };

const initialState: Tr3sState = {
  aplicaciones: [
    { id: 'archivos', nombre: 'Archivos', icono: 'file', abierta: false, activa: false },
    { id: 'notas', nombre: 'Notas', icono: 'file-text', abierta: false, activa: false },
    { id: 'calculadora', nombre: 'Calculadora', icono: 'calculator', abierta: false, activa: false },
    { id: 'terminal', nombre: 'Terminal', icono: 'terminal', abierta: false, activa: false },
    { id: 'ajustes', nombre: 'Ajustes', icono: 'settings', abierta: false, activa: false },
    { id: 'navegador', nombre: 'Navegador', icono: 'globe', abierta: false, activa: false },
    { id: 'manual', nombre: 'Manual', icono: 'book', abierta: false, activa: false },
    { id: 'monitor', nombre: 'Monitor', icono: 'activity', abierta: false, activa: false },
  ],
  appActiva: null,
  fondoPantalla: 'gradient',
  notas: ''
};

const tr3sReducer = (state: Tr3sState, action: Tr3sAction): Tr3sState => {
  switch (action.type) {
    case 'ABRIR_APP':
      return {
        ...state,
        aplicaciones: state.aplicaciones.map(app => 
          app.id === action.payload
            ? { ...app, abierta: true, activa: true }
            : { ...app, activa: false }
        ),
        appActiva: action.payload
      };
    case 'CERRAR_APP':
      return {
        ...state,
        aplicaciones: state.aplicaciones.map(app => 
          app.id === action.payload
            ? { ...app, abierta: false, activa: false }
            : app
        ),
        appActiva: state.aplicaciones.find(app => app.abierta && app.id !== action.payload)?.id || null
      };
    case 'ACTIVAR_APP':
      return {
        ...state,
        aplicaciones: state.aplicaciones.map(app => 
          app.id === action.payload
            ? { ...app, activa: true }
            : { ...app, activa: false }
        ),
        appActiva: action.payload
      };
    case 'CAMBIAR_FONDO':
      return {
        ...state,
        fondoPantalla: action.payload
      };
    case 'GUARDAR_NOTAS':
      return {
        ...state,
        notas: action.payload
      };
    default:
      return state;
  }
};

interface Tr3sContextType {
  state: Tr3sState;
  abrirApp: (id: string) => void;
  cerrarApp: (id: string) => void;
  activarApp: (id: string) => void;
  cambiarFondo: (fondo: string) => void;
  guardarNotas: (texto: string) => void;
}

const Tr3sContext = createContext<Tr3sContextType | undefined>(undefined);

export const Tr3sProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(tr3sReducer, initialState);

  const abrirApp = (id: string) => {
    dispatch({ type: 'ABRIR_APP', payload: id });
  };

  const cerrarApp = (id: string) => {
    dispatch({ type: 'CERRAR_APP', payload: id });
  };

  const activarApp = (id: string) => {
    dispatch({ type: 'ACTIVAR_APP', payload: id });
  };

  const cambiarFondo = (fondo: string) => {
    dispatch({ type: 'CAMBIAR_FONDO', payload: fondo });
  };

  const guardarNotas = (texto: string) => {
    dispatch({ type: 'GUARDAR_NOTAS', payload: texto });
  };

  return (
    <Tr3sContext.Provider value={{ state, abrirApp, cerrarApp, activarApp, cambiarFondo, guardarNotas }}>
      {children}
    </Tr3sContext.Provider>
  );
};

export const useTr3s = () => {
  const context = useContext(Tr3sContext);
  if (!context) {
    throw new Error('useTr3s debe usarse dentro de un Tr3sProvider');
  }
  return context;
};
