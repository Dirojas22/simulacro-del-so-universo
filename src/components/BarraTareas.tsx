import React, { useState, useEffect, useRef } from "react";
import { useDOS } from "@/context/DOSContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Power, Wifi, Battery, Volume2, ChevronUp, ChevronDown, Settings } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const BarraTareas: React.FC = () => {
  const { state, dispatch } = useDOS();
  const [startMenuVisible, setStartMenuVisible] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [volume, setVolume] = useState(50);
  const startMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    const handleClickOutside = (event: MouseEvent) => {
      if (startMenuRef.current && !startMenuRef.current.contains(event.target as Node)) {
        setStartMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleStartMenu = () => {
    setStartMenuVisible(!startMenuVisible);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(event.target.value));
  };

  const getBatteryIcon = () => {
    if (state.estadoBateria.cargando) {
      return <Battery className="h-4 w-4 text-green-500" />;
    }
    if (state.estadoBateria.nivel > 50) {
      return <Battery className="h-4 w-4 text-green-500" />;
    } else if (state.estadoBateria.nivel > 20) {
      return <Battery className="h-4 w-4 text-yellow-500" />;
    } else {
      return <Battery className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-10 bg-blue-900 text-white flex items-center justify-between z-50">
      <div className="flex items-center space-x-1">
        <button
          onClick={() => toggleStartMenu()}
          className={`px-4 py-1 flex items-center gap-2 focus:outline-none ${
            startMenuVisible
              ? "bg-gradient-to-r from-blue-700 to-blue-900"
              : "hover:bg-blue-800"
          }`}
        >
          <Power size={16} className="text-white" />
        </button>

        {startMenuVisible && (
          <div ref={startMenuRef} className="absolute bottom-10 left-0 bg-gray-800 text-white rounded-md shadow-lg overflow-hidden z-50">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Menu de inicio</h3>
              <ul>
                {state.aplicaciones.map((app) => (
                  <li key={app.id} className="hover:bg-gray-700 p-2 rounded-md cursor-pointer">
                    {app.nombre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Taskbar Icons */}
        <div className="flex items-center space-x-2 ml-2">
          {state.aplicaciones.filter(app => app.abierta).map(app => (
            <button
              key={app.id}
              className={`px-3 py-1 rounded hover:bg-blue-800 focus:outline-none ${app.activa ? 'bg-blue-700' : ''}`}
              onClick={() => dispatch({ type: 'ACTIVAR_APP', payload: app.id })}
            >
              {app.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4 px-4">
        {/* System Tray */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center">
              <Wifi className="h-4 w-4" />
              {getBatteryIcon()}
              <Volume2 className="h-4 w-4" />
              <span>{format(dateTime, 'HH:mm', { locale: es })}</span>
              <span className="ml-1">{format(dateTime, 'dd/MM/yyyy', { locale: es })}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ajustes rápidos</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center justify-between">
              Volumen
              <div className="flex items-center space-x-2">
                <ChevronDown className="h-4 w-4" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20"
                />
                <ChevronUp className="h-4 w-4" />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Ajustes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Apagar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
