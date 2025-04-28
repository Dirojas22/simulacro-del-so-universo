
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTr3s } from "./Tr3sContext";
import { X, Minus, Terminal, Calculator, FileText, File, Settings } from "lucide-react";
import { Rnd } from "react-rnd";

export const Tr3sVentana = () => {
  const { state, cerrarApp, activarApp } = useTr3s();
  
  const renderContenido = (appId: string) => {
    switch (appId) {
      case 'terminal':
        return (
          <div className="bg-black text-green-400 p-4 h-full font-mono">
            <p>TR3S Terminal v1.0</p>
            <p>$ _</p>
          </div>
        );
      case 'calculadora':
        return (
          <div className="bg-zinc-900 h-full flex flex-col p-4">
            <div className="bg-zinc-800 p-4 mb-4 rounded text-right text-xl">0</div>
            <div className="grid grid-cols-4 gap-2">
              {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
                <button
                  key={btn}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg p-3"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        );
      case 'notas':
        return (
          <div className="h-full p-4 bg-zinc-900">
            <textarea 
              className="w-full h-full bg-zinc-800 border border-zinc-700 rounded p-4 text-white resize-none" 
              placeholder="Escribe tus notas aquí..."
            />
          </div>
        );
      case 'archivos':
        return (
          <div className="h-full bg-zinc-900 p-4">
            <div className="flex items-center gap-2 mb-4">
              <button className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-sm">Inicio</button>
              <button className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-sm">Documentos</button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {['Documentos', 'Imágenes', 'Música', 'Videos'].map((folder) => (
                <div key={folder} className="flex flex-col items-center">
                  <div className="bg-zinc-800 p-3 rounded">
                    <File size={24} />
                  </div>
                  <span className="text-xs mt-1">{folder}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'ajustes':
        return (
          <div className="h-full bg-zinc-900 p-4">
            <h2 className="text-lg mb-4">Ajustes del Sistema</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Tema Oscuro</span>
                <div className="w-10 h-5 bg-violet-600 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-0.5"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Notificaciones</span>
                <div className="w-10 h-5 bg-violet-600 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-0.5"></div>
                </div>
              </div>
              <div>
                <span>Volumen</span>
                <div className="w-full h-2 bg-zinc-700 rounded-full mt-2">
                  <div className="w-3/4 h-2 bg-violet-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>App no encontrada</div>;
    }
  };
  
  const getIcono = (tipo: string) => {
    switch (tipo) {
      case 'terminal':
        return <Terminal size={18} className="text-white" />;
      case 'file-text':
        return <FileText size={18} className="text-white" />;
      case 'calculator':
        return <Calculator size={18} className="text-white" />;
      case 'settings':
        return <Settings size={18} className="text-white" />;
      case 'file':
        return <File size={18} className="text-white" />;
      default:
        return <File size={18} className="text-white" />;
    }
  };

  return (
    <>
      {state.aplicaciones.map((app) => (
        app.abierta && (
          <Rnd
            key={app.id}
            default={{
              x: 100,
              y: 50,
              width: 500,
              height: 400
            }}
            minWidth={300}
            minHeight={200}
            bounds="parent"
            dragHandleClassName="app-draghandle"
            className={`rounded-lg overflow-hidden shadow-2xl ${app.activa ? 'z-10' : 'z-0'}`}
            onMouseDown={() => activarApp(app.id)}
          >
            <div className="flex flex-col h-full">
              <div 
                className={`app-draghandle flex items-center justify-between px-4 py-2 ${
                  app.activa 
                    ? 'bg-gradient-to-r from-cyan-500/80 to-purple-500/80' 
                    : 'bg-zinc-700/70'
                }`}
              >
                <div className="flex items-center gap-2">
                  {getIcono(app.icono)}
                  <span className="text-sm font-medium">{app.nombre}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="w-5 h-5 flex items-center justify-center rounded-full bg-zinc-600 hover:bg-zinc-500"
                  >
                    <Minus size={12} />
                  </button>
                  <button 
                    className="w-5 h-5 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500"
                    onClick={() => cerrarApp(app.id)}
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
              <div className="flex-grow bg-zinc-800 text-white overflow-auto">
                {renderContenido(app.id)}
              </div>
            </div>
          </Rnd>
        )
      ))}
    </>
  );
};
