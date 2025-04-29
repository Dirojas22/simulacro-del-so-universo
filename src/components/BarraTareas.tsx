
import React, { useState } from "react";
import { useDOS } from "@/context/DOSContext";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  PowerOff, 
  Wifi,
  WifiOff
} from "lucide-react";

interface BarraTareasProps {
  fecha: Date;
}

const BarraTareas: React.FC<BarraTareasProps> = ({ fecha }) => {
  const { state, dispatch } = useDOS();
  const [showWifiMenu, setShowWifiMenu] = useState(false);

  const formatHora = (fecha: Date): string => {
    return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatFecha = (fecha: Date): string => {
    return fecha.toLocaleDateString('es-ES');
  };

  const toggleWifi = () => {
    dispatch({ type: "TOGGLE_WIFI" });
  };

  const activarAplicacion = (id: number) => {
    dispatch({ type: "ACTIVAR_APP", payload: id });
  };

  return (
    <div className="h-12 bg-dos-dark-blue/90 backdrop-blur-sm border-t border-dos-blue/50 flex items-center justify-between px-4 text-white">
      <div className="flex items-center">
        <button 
          className="h-8 w-8 flex items-center justify-center rounded hover:bg-white/10 transition-colors mr-2"
          aria-label="Apagar"
        >
          <PowerOff size={18} />
        </button>

        <div className="h-5 w-px bg-white/20 mx-2"></div>

        <Popover open={showWifiMenu} onOpenChange={setShowWifiMenu}>
          <PopoverTrigger asChild>
            <button 
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
              aria-label="WiFi"
            >
              {state.estadoRed.conectado ? (
                <Wifi size={18} />
              ) : (
                <WifiOff size={18} />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 bg-dos-dark-blue border border-dos-blue/50 text-white">
            <div className="flex flex-col space-y-2 p-2">
              <div className="flex items-center justify-between gap-4">
                <span>Estado WiFi:</span>
                <span className={state.estadoRed.conectado ? "text-green-400" : "text-red-400"}>
                  {state.estadoRed.conectado ? "Conectado" : "Desconectado"}
                </span>
              </div>
              <button
                onClick={toggleWifi}
                className={`px-3 py-1.5 rounded text-sm ${
                  state.estadoRed.conectado 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "bg-green-600 hover:bg-green-700"
                } transition-colors`}
              >
                {state.estadoRed.conectado ? "Desactivar WiFi" : "Activar WiFi"}
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-5 w-px bg-white/20 mx-2"></div>
        
        <div className="flex space-x-1">
          {state.aplicacionesAbiertas.map((app) => (
            <button
              key={app.id}
              className={`h-8 px-3 flex items-center rounded text-xs font-medium ${
                app.activa
                  ? "bg-dos-green text-dos-dark-blue"
                  : "hover:bg-white/10"
              }`}
              onClick={() => activarAplicacion(app.id)}
            >
              {app.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <div className="text-xs mr-4">{formatFecha(fecha)}</div>
        <div className="text-sm font-medium">{formatHora(fecha)}</div>
      </div>
    </div>
  );
};

export default BarraTareas;
