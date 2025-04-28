
import React from "react";
import { useTr3s } from "./Tr3sContext";
import { Terminal, FileText, Calculator, Settings, File, X } from "lucide-react";

export const Tr3sBarraTareas = () => {
  const { state, abrirApp, activarApp } = useTr3s();

  const getIcono = (tipo: string) => {
    switch (tipo) {
      case 'terminal':
        return <Terminal size={18} />;
      case 'file-text':
        return <FileText size={18} />;
      case 'calculator':
        return <Calculator size={18} />;
      case 'settings':
        return <Settings size={18} />;
      case 'file':
        return <File size={18} />;
      default:
        return <File size={18} />;
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 backdrop-blur-md bg-black/30 border-t border-white/10 flex items-center justify-center gap-2 px-4 z-20">
      <div className="flex-1"></div>
      
      <div className="flex gap-1">
        {state.aplicaciones.map(app => (
          app.abierta && (
            <button
              key={app.id}
              onClick={() => activarApp(app.id)}
              className={`flex items-center gap-2 h-7 px-3 rounded text-sm transition-all transform ${
                app.activa 
                  ? 'bg-gradient-to-r from-cyan-500/80 to-violet-500/80 text-white scale-105' 
                  : 'bg-white/10 hover:bg-white/20 text-white/80'
              }`}
            >
              {getIcono(app.icono)}
              <span>{app.nombre}</span>
            </button>
          )
        ))}
      </div>
      
      <div className="flex-1 flex justify-end">
        <div className="bg-white/10 rounded-full px-3 py-1 text-sm">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
