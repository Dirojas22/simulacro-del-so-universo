
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tr3sIconos } from "./Tr3sIconos";
import { Tr3sBarraTareas } from "./Tr3sBarraTareas";
import { Tr3sVentana } from "./Tr3sVentana";
import { Tr3sProvider, useTr3s } from "./Tr3sContext";
import { TooltipProvider } from "@/components/ui/tooltip";

const Tr3sOSContent = () => {
  const { state } = useTr3s();
  
  return (
    <div className={`h-full w-full overflow-hidden ${state.temaOscuro 
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
      : 'bg-gradient-to-br from-indigo-800 via-purple-800 to-violet-900'} text-white relative transition-colors duration-500`}>
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl font-bold text-white opacity-5 select-none">
        TR3S
      </div>
      
      <div className="w-full h-[calc(100%-40px)] relative z-10">
        <Tr3sIconos />
        <Tr3sVentana />
      </div>
      
      <Tr3sBarraTareas />
    </div>
  );
};

export const Tr3sOS = () => {
  const [cargado, setCargado] = useState(false);
  
  useEffect(() => {
    // Simulamos tiempo de carga del sistema
    const timer = setTimeout(() => {
      setCargado(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!cargado) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-7xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4"
        >
          TR3S
        </motion.div>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "60%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="h-1.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mb-4"
        />
        <p className="text-cyan-200 text-sm">Iniciando sistema...</p>
      </div>
    );
  }
  
  return (
    <Tr3sProvider>
      <TooltipProvider>
        <Tr3sOSContent />
      </TooltipProvider>
    </Tr3sProvider>
  );
};
