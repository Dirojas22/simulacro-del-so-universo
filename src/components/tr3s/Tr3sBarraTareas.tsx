
import React, { useState, useEffect } from "react";
import { useTr3s } from "./Tr3sContext";
import { Terminal, FileText, Calculator, Settings, File, Globe, BookOpen, Wifi, WifiOff, Battery, BatteryCharging, Clock } from "lucide-react";
import { useHardwareStatus } from "../../hooks/useHardwareStatus";

export const Tr3sBarraTareas = () => {
  const { state, abrirApp, activarApp, toggleWifi } = useTr3s();
  const { battery, network } = useHardwareStatus();
  const [fecha, setFecha] = useState(new Date());
  
  // Actualizar hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setFecha(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Función para obtener icono de batería
  const getBatteryIcon = () => {
    if (battery.charging) {
      return <BatteryCharging size={16} className="text-green-400" />;
    }
    if (battery.level > 80) {
      return <Battery size={16} className="text-green-400" />;
    } else if (battery.level > 40) {
      return <Battery size={16} className="text-yellow-400" />;
    } else {
      return <Battery size={16} className="text-red-400" />;
    }
  };

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
      case 'globe':
        return <Globe size={18} />;
      case 'book':
        return <BookOpen size={18} />;
      default:
        return <File size={18} />;
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 backdrop-blur-md bg-black/30 border-t border-white/10 flex items-center justify-center gap-2 px-4 z-20">
      <div className="flex-1 flex items-center gap-1">
        {state.aplicaciones.filter(app => !app.abierta).slice(0, 3).map(app => (
          <button
            key={app.id}
            onClick={() => abrirApp(app.id)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          >
            {getIcono(app.icono)}
          </button>
        ))}
      </div>
      
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
      
      <div className="flex-1 flex justify-end gap-3 items-center">
        {/* WiFi - now clickable */}
        <div 
          className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 cursor-pointer hover:bg-white/20"
          onClick={toggleWifi}
        >
          {network.online ? 
            <Wifi size={14} className="text-cyan-400" /> : 
            <WifiOff size={14} className="text-gray-400" />
          }
        </div>
        
        {/* Batería */}
        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
          {getBatteryIcon()}
          <span className="text-xs">{battery.level}%</span>
        </div>
        
        {/* Hora y fecha */}
        <div className="bg-white/10 rounded-full px-3 py-1 text-sm flex items-center">
          <Clock size={14} className="mr-1" />
          <span>
            {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <button 
          onClick={() => abrirApp('ajustes')}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all"
        >
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};
