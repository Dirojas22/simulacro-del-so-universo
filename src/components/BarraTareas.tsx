
import React, { useState, useEffect } from "react";
import { useDOS } from "@/context/DOSContext";
import { format } from "date-fns";
// Implementación manual del locale español para evitar dependencias adicionales
const es = {
  code: 'es',
  formatDistance: () => '',
  formatRelative: () => '',
  localize: {
    ordinalNumber: () => '',
    month: () => '',
    day: () => '',
    dayPeriod: () => ''
  },
  formatLong: {
    date: () => '',
    time: () => '',
    dateTime: () => ''
  },
  match: {
    ordinalNumber: () => ({ match: false, value: '' }),
    era: () => ({ match: false, value: '' }),
    quarter: () => ({ match: false, value: '' }),
    month: () => ({ match: false, value: '' }),
    day: () => ({ match: false, value: '' }),
    dayPeriod: () => ({ match: false, value: '' })
  },
  options: {
    weekStartsOn: 1,
    firstWeekContainsDate: 1
  }
};
import { 
  Wifi, WifiOff, BatteryMedium, BatteryCharging, 
  Volume2, VolumeX, VolumeIcon, Power, RefreshCcw, Moon,
  Sun, CloudRain, Thermometer, MapPin, Clock
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, 
  DropdownMenuItem, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

interface BarraTareasProps {
  fecha: Date;
}

const BarraTareas: React.FC<BarraTareasProps> = ({ fecha }) => {
  const { state, dispatch, activarAplicacion } = useDOS();
  const [volumenAnterior, setVolumenAnterior] = useState(state.volumen);
  const [mostrarDialogApagado, setMostrarDialogApagado] = useState(false);
  const [accionSistema, setAccionSistema] = useState<'apagar' | 'reiniciar' | 'suspender' | null>(null);
  const [temperatura, setTemperatura] = useState(28);
  const [condicionClima, setCondicionClima] = useState<'soleado' | 'nublado' | 'lluvioso'>('soleado');
  
  // Formatear la fecha y hora
  const horaActual = format(fecha, "HH:mm");
  const fechaActual = format(fecha, "d 'de' MMMM, yyyy");
  
  // Simular cambios de clima aleatorios
  useEffect(() => {
    const intervalo = setInterval(() => {
      // Simular cambio de temperatura (entre 24 y 32 grados)
      setTemperatura(Math.floor(24 + Math.random() * 8));
      
      // Simular cambio de condición climática
      const condiciones = ['soleado', 'nublado', 'lluvioso'];
      const indiceAleatorio = Math.floor(Math.random() * 3);
      setCondicionClima(condiciones[indiceAleatorio] as 'soleado' | 'nublado' | 'lluvioso');
    }, 60000 * 10); // Cambiar cada 10 minutos
    
    return () => clearInterval(intervalo);
  }, []);
  
  // Función que maneja el volumen actual de la página
  const getVolumenSistema = async () => {
    try {
      // Simulamos obtener el volumen real del sistema
      return state.volumen;
    } catch (error) {
      console.error("Error al obtener el volumen del sistema:", error);
      return 50;
    }
  };

  // Manejar cambio de volumen
  const handleVolumenChange = (value: number[]) => {
    dispatch({ type: "ACTUALIZAR_VOLUMEN", payload: value[0] });
    
    // Cambiar volumen real del dispositivo si estamos en un navegador
    if (typeof window !== "undefined" && window.HTMLMediaElement) {
      try {
        const audioElements = document.querySelectorAll("audio, video");
        audioElements.forEach((el) => {
          (el as HTMLMediaElement).volume = value[0] / 100;
        });
      } catch (e) {
        console.error("Error al cambiar el volumen:", e);
      }
    }
  };
  
  // Icono de volumen dinámico según el nivel
  const getVolumenIcon = () => {
    if (state.volumen === 0) {
      return <VolumeX size={16} />;
    } else if (state.volumen < 40) {
      return <VolumeIcon size={16} />;
    } else {
      return <Volume2 size={16} />;
    }
  };
  
  const handleVolumenClick = () => {
    if (state.volumen > 0) {
      setVolumenAnterior(state.volumen);
      dispatch({ type: "ACTUALIZAR_VOLUMEN", payload: 0 });
    } else {
      dispatch({ type: "ACTUALIZAR_VOLUMEN", payload: volumenAnterior || 50 });
    }
  };

  // Obtener icono del clima según la condición
  const getClimaIcon = () => {
    switch (condicionClima) {
      case 'lluvioso':
        return <CloudRain className="h-5 w-5 text-blue-400" />;
      case 'nublado':
        return <CloudRain className="h-5 w-5 text-gray-400" />;
      case 'soleado':
      default:
        return <Sun className="h-5 w-5 text-yellow-400" />;
    }
  };

  // Obtener descripción del clima
  const getClimaDescripcion = () => {
    switch (condicionClima) {
      case 'lluvioso':
        return 'Lluvioso';
      case 'nublado':
        return 'Nublado';
      case 'soleado':
      default:
        return 'Soleado';
    }
  };

  // Manejadores de eventos para acciones del sistema
  const handleApagado = () => {
    setAccionSistema('apagar');
    document.body.style.transition = "opacity 2s ease";
    document.body.style.opacity = "0";
    setTimeout(() => {
      dispatch({ type: "LOGOUT" });
      document.body.style.opacity = "1";
      setAccionSistema(null);
    }, 2000);
  };

  const handleReinicio = () => {
    setAccionSistema('reiniciar');
    document.body.style.transition = "opacity 1s ease";
    document.body.style.opacity = "0";
    setTimeout(() => {
      dispatch({ type: "LOGOUT" });
      setTimeout(() => {
        dispatch({ type: "LOGIN" });
        document.body.style.opacity = "1";
        setAccionSistema(null);
      }, 1000);
    }, 1000);
  };

  const handleSuspender = () => {
    setAccionSistema('suspender');
    document.body.style.transition = "opacity 1s ease, filter 1s ease";
    document.body.style.opacity = "0.3";
    document.body.style.filter = "blur(5px)";
    setTimeout(() => {
      document.body.style.opacity = "1";
      document.body.style.filter = "none";
      setAccionSistema(null);
    }, 2000);
  };

  // Dialog personalizado para apagado/reinicio
  const SistemaDialog = () => (
    <AnimatePresence>
      {mostrarDialogApagado && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setMostrarDialogApagado(false)}
        >
          <motion.div 
            className="bg-dos-dark-blue border border-dos-blue shadow-lg rounded-lg p-6 w-80"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-center">Control del Sistema</h3>
            
            <div className="grid grid-cols-1 gap-3">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#e53e3e" }}
                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-dos-blue text-white hover:bg-red-600 transition-colors"
                onClick={handleApagado}
              >
                <Power size={18} />
                <span>Apagar</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#3182ce" }}
                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-dos-blue text-white hover:bg-blue-600 transition-colors"
                onClick={handleReinicio}
              >
                <RefreshCcw size={18} />
                <span>Reiniciar</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#6b46c1" }}
                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-dos-blue text-white hover:bg-purple-600 transition-colors"
                onClick={handleSuspender}
              >
                <Moon size={18} />
                <span>Suspender</span>
              </motion.button>
            </div>
            
            <div className="mt-4 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-gray-400 hover:text-white"
                onClick={() => setMostrarDialogApagado(false)}
              >
                Cancelar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Animación de acciones del sistema
  const SistemaAccionOverlay = () => (
    <AnimatePresence>
      {accionSistema && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold text-white mb-4"
          >
            DOS
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-white"
          >
            {accionSistema === 'apagar' && 'Apagando el sistema...'}
            {accionSistema === 'reiniciar' && 'Reiniciando el sistema...'}
            {accionSistema === 'suspender' && 'Suspendiendo el sistema...'}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <SistemaDialog />
      <SistemaAccionOverlay />
      
      <div className="h-12 bg-dos-dark-blue text-white flex items-center justify-between px-2 border-t border-gray-600 z-50">
        {/* Botón de inicio con controles de energía */}
        <div className="flex items-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 bg-dos-green text-black font-semibold rounded hover:bg-green-400 transition-colors"
            onClick={() => setMostrarDialogApagado(true)}
          >
            DOS
          </motion.button>
          
          {/* Aplicaciones abiertas */}
          <div className="flex ml-4 space-x-1">
            {state.aplicacionesAbiertas.map((app) => (
              <motion.button
                key={app.id}
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1 rounded text-sm ${
                  app.activo ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
                } transition-colors`}
                onClick={() => activarAplicacion(app.id)}
              >
                {app.nombre}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Iconos de estado y reloj */}
        <div className="flex items-center space-x-3">
          {/* Control de volumen con mute */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-1 px-2 cursor-pointer bg-dos-blue rounded"
          >
            <div onClick={handleVolumenClick}>
              {getVolumenIcon()}
            </div>
            <div className="w-24 hidden sm:block">
              <Slider
                value={[state.volumen]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumenChange}
                className="mt-0"
              />
            </div>
            <span className="text-xs">{state.volumen}%</span>
          </motion.div>
          
          {/* Estado de WiFi */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.2 }}>
                  {state.estadoRed.conectado ? (
                    <Wifi size={16} className="text-green-400" />
                  ) : (
                    <WifiOff size={16} className="text-red-400" />
                  )}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {state.estadoRed.conectado
                    ? `Conectado a ${state.estadoRed.tipo}`
                    : "Sin conexión"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Estado de batería */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.2 }} className="flex items-center">
                  {state.estadoBateria.cargando ? (
                    <BatteryCharging size={16} className="text-green-400" />
                  ) : (
                    <BatteryMedium size={16} />
                  )}
                  <span className="ml-1 text-xs">{state.estadoBateria.nivel}%</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {state.estadoBateria.cargando
                    ? "Batería cargando"
                    : "Batería en uso"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Fecha y hora con dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="px-2 py-1 bg-dos-blue rounded text-sm font-mono cursor-pointer"
              >
                {horaActual}
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              alignOffset={-5}
              className="w-64 bg-dos-dark-blue border border-dos-blue text-white p-3 mb-3"
              sideOffset={5}
            >
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-dos-green" />
                    <h3 className="text-lg font-bold">{horaActual}</h3>
                  </div>
                  <p className="text-sm text-gray-300">{fechaActual}</p>
                </div>
                
                <DropdownMenuSeparator className="bg-gray-600" />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-red-400" />
                    <p className="text-sm">San Diego, Carabobo, Venezuela</p>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    {getClimaIcon()}
                    <div className="ml-2">
                      <p className="text-sm font-medium">{getClimaDescripcion()}</p>
                      <p className="text-xs text-gray-400">Humedad: {Math.floor(60 + Math.random() * 20)}%</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 text-red-400 mr-1" />
                    <span className="text-lg font-semibold">{temperatura}°C</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400">
                  <p>Zona horaria: UTC-4 (Hora de Venezuela)</p>
                  <p>Amanecer: 06:15 AM</p>
                  <p>Atardecer: 06:45 PM</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default BarraTareas;
