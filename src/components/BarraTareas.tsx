
import React, { useState, useEffect } from "react";
import { useDOS } from "@/context/DOSContext";
import { ChevronUp, FileText, PowerOff } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface BarraTareasProps {
  fecha: Date;
}

export const BarraTareas: React.FC<BarraTareasProps> = ({ fecha }) => {
  const { state, dispatch } = useDOS();
  const [menuInicio, setMenuInicio] = useState(false);
  const [horaActual, setHoraActual] = useState(new Date());
  
  // Actualizar hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setHoraActual(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const toggleMenu = () => {
    setMenuInicio(!menuInicio);
  };
  
  const abrirApp = (id: string) => {
    dispatch({ type: "ABRIR_APP", payload: id });
    setMenuInicio(false);
  };
  
  const activarApp = (id: string) => {
    dispatch({ type: "ACTIVAR_APP", payload: id });
  };
  
  const cerrarSesion = () => {
    dispatch({ type: "CERRAR_SESION" });
  };
  
  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-dos-blue text-white flex items-center px-2 border-t border-dos-green/30">
      <TooltipProvider>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            {/* Icono de inicio (antes era "DOS") */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={toggleMenu}
                  className={`flex items-center justify-center space-x-1 px-3 py-1.5 rounded ${
                    menuInicio ? 'bg-dos-green text-dos-dark-blue' : 'bg-dos-dark-blue hover:bg-dos-dark-blue/80'
                  }`}
                >
                  <PowerOff size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Menu de inicio</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Barra separadora */}
            <div className="h-8 w-0.5 bg-dos-green/30" />

            {/* Apps abiertas */}
            <div className="flex items-center space-x-1">
              {state.aplicacionesAbiertas.map(app => (
                <Tooltip key={app.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => activarApp(app.id)}
                      className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded ${
                        app.activo ? 'bg-dos-green text-dos-dark-blue' : 'hover:bg-dos-dark-blue'
                      }`}
                    >
                      <FileText size={16} />
                      <span>{app.nombre}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{app.nombre}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Hora y fecha */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-dos-dark-blue px-3 py-1 rounded text-sm">
                {horaActual.toLocaleTimeString()}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{fecha.toLocaleDateString()}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Menu inicio */}
        {menuInicio && (
          <div className="absolute bottom-12 left-0 w-64 bg-dos-dark-blue border border-dos-green/30 rounded-t rounded-r shadow-lg">
            <div className="p-3 border-b border-dos-green/30 flex items-center space-x-2">
              <div className="w-8 h-8 bg-dos-green rounded-full flex items-center justify-center">
                <span className="text-dos-dark-blue font-bold">{state.usuario.iniciales}</span>
              </div>
              <div>
                <p className="font-medium">{state.usuario.nombre}</p>
                <p className="text-xs text-dos-green/80">{state.usuario.rol}</p>
              </div>
            </div>

            <div className="p-2">
              {state.aplicacionesDisponibles
                .filter(app => !state.aplicacionesAbiertas.some(a => a.id === app.id))
                .map(app => (
                  <button
                    key={app.id}
                    onClick={() => abrirApp(app.id)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-dos-green hover:text-dos-dark-blue rounded transition-colors"
                  >
                    <FileText size={16} />
                    <span>{app.nombre}</span>
                  </button>
                ))
              }
            </div>
            
            <div className="border-t border-dos-green/30 p-2">
              <button 
                onClick={cerrarSesion}
                className="w-full flex items-center space-x-2 px-3 py-2 text-left text-red-400 hover:bg-red-900/30 rounded transition-colors"
              >
                <PowerOff size={16} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        )}
      </TooltipProvider>
    </div>
  );
};
