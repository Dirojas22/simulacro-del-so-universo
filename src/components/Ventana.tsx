
import React, { useState } from "react";
import { useDOS } from "@/context/DOSContext";
import { Rnd } from "react-rnd";
import Aplicaciones from "./aplicaciones/index";
import { Minus, X, Maximize2, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";

interface VentanaProps {
  app: {
    id: string;
    nombre: string;
    icono: string;
    componente: string;
    activo: boolean;
  };
}

const Ventana: React.FC<VentanaProps> = ({ app }) => {
  const { cerrarAplicacion, minimizarAplicacion, activarAplicacion } = useDOS();
  const [tamaño, setTamaño] = useState({ width: 800, height: 600 });
  const [posicion, setPosicion] = useState({
    x: window.innerWidth / 2 - 400,
    y: window.innerHeight / 2 - 300,
  });
  const [isMaximized, setIsMaximized] = useState(false);
  const [prevSize, setPrevSize] = useState({ width: 800, height: 600, x: window.innerWidth / 2 - 400, y: window.innerHeight / 2 - 300 });

  // Renderizar componente de aplicación dinámicamente
  const renderComponente = () => {
    // @ts-ignore - Manejamos dinámicamente los componentes
    const ComponenteApp = Aplicaciones[app.componente];
    return ComponenteApp ? <ComponenteApp /> : <div>Aplicación no encontrada</div>;
  };

  // Manejar maximización
  const handleMaximize = () => {
    if (!isMaximized) {
      // Guardar tamaño y posición actuales
      setPrevSize({
        width: tamaño.width,
        height: tamaño.height,
        x: posicion.x,
        y: posicion.y
      });
      
      // Maximizar
      setTamaño({ width: window.innerWidth, height: window.innerHeight - 48 });
      setPosicion({ x: 0, y: 0 });
      setIsMaximized(true);
    } else {
      // Restaurar tamaño y posición anteriores
      setTamaño({ width: prevSize.width, height: prevSize.height });
      setPosicion({ x: prevSize.x, y: prevSize.y });
      setIsMaximized(false);
    }
    
    // Activar la aplicación
    activarAplicacion(app.id);
  };

  return (
    <Rnd
      size={{ width: tamaño.width, height: tamaño.height }}
      position={{ x: posicion.x, y: posicion.y }}
      onDragStop={(e, d) => {
        setPosicion({ x: d.x, y: d.y });
        activarAplicacion(app.id);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setTamaño({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
        setPosicion(position);
        activarAplicacion(app.id);
        setIsMaximized(false);
      }}
      dragHandleClassName="ventana-barra"
      bounds="parent"
      minWidth={400}
      minHeight={300}
      disableDragging={isMaximized}
      className={`rounded-lg shadow-2xl overflow-hidden ${
        app.activo ? "z-10" : "z-0"
      } transition-shadow`}
      onMouseDown={() => activarAplicacion(app.id)}
      style={{
        transition: 'box-shadow 0.3s ease'
      }}
    >
      {/* Barra de título */}
      <div 
        className={`ventana-barra flex items-center justify-between px-3 py-2 ${
          app.activo 
            ? "bg-gradient-to-r from-dos-blue to-dos-dark-blue" 
            : "bg-gray-600"
        }`}
      >
        <div className="flex items-center">
          <span className="font-semibold text-white">{app.nombre}</span>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
            className="w-6 h-6 flex items-center justify-center rounded"
            onClick={() => minimizarAplicacion(app.id)}
          >
            <Minus size={16} className="text-white" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
            className="w-6 h-6 flex items-center justify-center rounded"
            onClick={handleMaximize}
          >
            {isMaximized ? 
              <Minimize2 size={16} className="text-white" /> : 
              <Maximize2 size={16} className="text-white" />
            }
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,0,0,0.6)" }}
            className="w-6 h-6 flex items-center justify-center rounded"
            onClick={() => cerrarAplicacion(app.id)}
          >
            <X size={16} className="text-white" />
          </motion.button>
        </div>
      </div>

      {/* Contenido de la aplicación */}
      <div className="h-[calc(100%-40px)] overflow-auto bg-white text-black">
        {renderComponente()}
      </div>
    </Rnd>
  );
};

export default Ventana;
