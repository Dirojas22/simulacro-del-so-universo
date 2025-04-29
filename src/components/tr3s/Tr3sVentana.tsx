import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTr3s } from "./Tr3sContext";
import { X, Minus, Maximize, Maximize2, ArrowsMaximize, Minimize2 } from "lucide-react";
import { Tr3sAjustes } from "./aplicaciones/Tr3sAjustes";
import { Tr3sMonitorSistema } from "./aplicaciones/Tr3sMonitorSistema";
import Draggable from "react-draggable";
import { Rnd } from "react-rnd";

// Componente de la ventana del sistema TR3S
export const Tr3sVentana = () => {
  const { state, cerrarApp, activarApp } = useTr3s();
  const [ventanas, setVentanas] = useState<Record<string, {
    ancho: number,
    alto: number,
    x: number,
    y: number,
    maximizada: boolean,
    zIndex: number
  }>>({});

  // Contenido de la aplicación
  const getContenidoApp = (id: string) => {
    switch (id) {
      case 'calculadora':
        return <div className="p-4">Calculadora en desarrollo...</div>;
      case 'ajustes':
        return <Tr3sAjustes />;
      case 'archivos':
        return <div className="p-4">Explorador de archivos en desarrollo...</div>;
      case 'terminal':
        return (
          <div className="bg-black text-green-400 p-4 font-mono h-full">
            <div>TR3S Terminal v1.0.0</div>
            <div>Copyright (c) 2025 TR3S Systems</div>
            <div className="mt-4">
              <span className="text-blue-400">usuario@tr3s</span>:<span className="text-purple-400">~</span>$ <span className="animate-pulse">|</span>
            </div>
          </div>
        );
      case 'notas':
        return (
          <div className="p-4 h-full">
            <textarea 
              className="w-full h-full bg-transparent border border-white/20 p-2 rounded focus:outline-none focus:border-cyan-500 resize-none"
              placeholder="Escribe tus notas aquí..."
              defaultValue={state.notas}
            />
          </div>
        );
      case 'navegador':
        return (
          <div className="h-full flex flex-col">
            <div className="bg-zinc-800 p-2 flex items-center gap-2">
              <div className="flex-1 bg-zinc-700 rounded px-2 py-1 text-sm text-gray-300">https://www.tr3s.com.ve</div>
              <button className="p-1 rounded hover:bg-zinc-700">{/* Refresh icon */}</button>
            </div>
            <div className="flex-1 bg-white p-4 text-black overflow-auto">
              <h1 className="text-2xl font-bold mb-4">Bienvenido a TR3S</h1>
              <p>El sistema operativo del futuro.</p>
            </div>
          </div>
        );
      case 'monitor':
        return <Tr3sMonitorSistema />;
      case 'manual':
        return (
          <div className="p-4 overflow-auto h-full">
            <h1 className="text-xl font-bold mb-4">Manual de Usuario TR3S</h1>
            <p className="mb-4">Este es el manual de usuario del sistema operativo TR3S. A continuación encontrarás información sobre cómo utilizar las principales funciones del sistema.</p>
            
            <h2 className="text-lg font-semibold mt-4 mb-2">Navegación básica</h2>
            <p>- Haz clic en los iconos del escritorio para abrir aplicaciones.</p>
            <p>- Utiliza la barra de tareas inferior para cambiar entre aplicaciones abiertas.</p>
            <p>- Accede a los ajustes rápidos mediante los iconos de la esquina inferior derecha.</p>
            
            <h2 className="text-lg font-semibold mt-4 mb-2">Personalización</h2>
            <p>- Abre la aplicación de Ajustes para cambiar el fondo y el tema.</p>
            <p>- Puedes activar el modo oscuro desde los ajustes.</p>
            
            <h2 className="text-lg font-semibold mt-4 mb-2">Aplicaciones incluidas</h2>
            <p>- Terminal: Para ejecutar comandos avanzados.</p>
            <p>- Explorador de archivos: Para gestionar tus documentos.</p>
            <p>- Calculadora: Para operaciones matemáticas.</p>
            <p>- Monitor del Sistema: Para ver el rendimiento del sistema.</p>
            <p>- Navegador: Para acceder a Internet.</p>
            <p>- Notas: Para tomar apuntes rápidos.</p>
          </div>
        );
      default:
        return <div className="p-4">Aplicación en desarrollo...</div>;
    }
  };

  const maximizeWindow = (id: string) => {
    setVentanas(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        maximizada: !prev[id].maximizada
      }
    }));
  };

  const getInitialWindowProps = (id: string) => {
    return {
      ancho: 640,
      alto: 480,
      x: Math.random() * 200 + 50,
      y: Math.random() * 150 + 50,
      maximizada: false,
      zIndex: 1
    };
  };

  const getTitleFromId = (id: string) => {
    switch (id) {
      case 'calculadora':
        return 'Calculadora';
      case 'ajustes':
        return 'Ajustes del Sistema';
      case 'archivos':
        return 'Explorador de Archivos';
      case 'terminal':
        return 'Terminal TR3S';
      case 'notas':
        return 'Bloc de Notas';
      case 'navegador':
        return 'Navegador Web';
      case 'monitor':
        return 'Monitor del Sistema';
      case 'manual':
        return 'Manual de Usuario';
      default:
        return 'Aplicación';
    }
  };

  return (
    <AnimatePresence>
      {state.aplicaciones
        .filter(app => app.abierta)
        .map(app => {
          const ventanaProps = ventanas[app.id] || getInitialWindowProps(app.id);
          
          return (
            <motion.div 
              key={app.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                zIndex: app.activa ? 10 : 5
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute"
              style={{ zIndex: app.activa ? 10 : 5 }}
              onClick={() => activarApp(app.id)}
            >
              <Rnd
                default={{
                  x: ventanaProps.x,
                  y: ventanaProps.y,
                  width: ventanaProps.ancho,
                  height: ventanaProps.alto,
                }}
                minWidth={300}
                minHeight={200}
                bounds="parent"
                disableDragging={ventanaProps.maximizada}
                className="shadow-2xl rounded-md overflow-hidden flex flex-col bg-zinc-800 border border-white/5"
                onResizeStop={(e, dir, ref, delta, position) => {
                  setVentanas(prev => ({
                    ...prev,
                    [app.id]: {
                      ...prev[app.id],
                      ancho: ref.offsetWidth,
                      alto: ref.offsetHeight,
                      x: position.x,
                      y: position.y
                    }
                  }));
                }}
                onDragStop={(e, d) => {
                  setVentanas(prev => ({
                    ...prev,
                    [app.id]: {
                      ...prev[app.id],
                      x: d.x,
                      y: d.y
                    }
                  }));
                }}
              >
                <div className="flex items-center justify-between bg-zinc-700 h-8 px-2 border-b border-white/5 text-sm">
                  <span>{getTitleFromId(app.id)}</span>
                  <div className="flex items-center gap-1.5">
                    <button 
                      className="w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center"
                      onClick={() => {}}
                    >
                      <Minus size={14} />
                    </button>
                    <button 
                      className="w-6 h-6 rounded hover:bg-white/10 flex items-center justify-center"
                      onClick={() => maximizeWindow(app.id)}
                    >
                      {ventanaProps.maximizada ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                    <button 
                      className="w-6 h-6 rounded hover:bg-red-500 flex items-center justify-center"
                      onClick={() => cerrarApp(app.id)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 relative overflow-hidden">
                  {getContenidoApp(app.id)}
                </div>
              </Rnd>
            </motion.div>
          );
        })}
    </AnimatePresence>
  );
};
