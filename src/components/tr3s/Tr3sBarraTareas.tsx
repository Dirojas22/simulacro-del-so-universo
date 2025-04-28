
import React, { useState, useEffect } from "react";
import { useTr3s } from "./Tr3sContext";
import { 
  Terminal, 
  FileText, 
  Calculator, 
  Settings, 
  File, 
  Globe, 
  BookOpen,
  Volume2,
  Wifi,
  BatteryMedium,
  BatteryCharging
} from "lucide-react";
import { useHardwareStatus } from "@/hooks/useHardwareStatus";

export const Tr3sBarraTareas = () => {
  const { state, abrirApp, activarApp } = useTr3s();
  const { battery, network } = useHardwareStatus();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [volume, setVolume] = useState(70);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      
      <div className="flex-1 flex justify-end items-center gap-3">
        <div className="flex items-center bg-white/10 rounded-full px-2 py-1">
          <Volume2 size={14} className="mr-1" />
          <div className="w-12 h-1.5 bg-white/20 rounded-full">
            <div 
              className="h-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
              style={{ width: `${volume}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center bg-white/10 rounded-full px-2 py-1">
          {network.online ? 
            <Wifi size={14} className="text-cyan-400" /> : 
            <Wifi size={14} className="text-gray-400" />
          }
        </div>
        
        <div className="flex items-center bg-white/10 rounded-full px-2 py-1">
          {battery.charging ? 
            <BatteryCharging size={14} className="text-green-400" /> : 
            <BatteryMedium size={14} className={battery.level > 20 ? "text-cyan-400" : "text-red-400"} />
          }
          <span className="text-xs ml-1">{battery.level}%</span>
        </div>

        <button 
          onClick={() => abrirApp('ajustes')}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all"
        >
          <Settings size={16} />
        </button>
        
        <div className="flex flex-col items-end text-xs">
          <div className="text-white/80">{formatDate(currentTime)}</div>
          <div className="bg-white/10 rounded-full px-2 py-0.5">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};
