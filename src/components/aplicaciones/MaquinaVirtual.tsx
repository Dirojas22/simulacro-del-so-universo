
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tr3sOS } from "../tr3s/Tr3sOS";
import { useToast } from "@/components/ui/use-toast";
import { Monitor, Power, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const MaquinaVirtual = () => {
  const [encendido, setEncendido] = useState(false);
  const [cargando, setCargando] = useState(false);
  const { toast } = useToast();

  const encenderVM = () => {
    setCargando(true);
    setTimeout(() => {
      setEncendido(true);
      setCargando(false);
      toast({
        title: "Máquina Virtual iniciada",
        description: "El sistema TR3S se ha iniciado correctamente.",
      });
    }, 2000);
  };

  const reiniciarVM = () => {
    setCargando(true);
    setEncendido(false);
    toast({
      title: "Reiniciando",
      description: "Reiniciando la máquina virtual...",
    });
    setTimeout(() => {
      setEncendido(true);
      setCargando(false);
      toast({
        title: "Máquina Virtual reiniciada",
        description: "El sistema TR3S se ha reiniciado correctamente.",
      });
    }, 3000);
  };

  const apagarVM = () => {
    setEncendido(false);
    toast({
      title: "Máquina Virtual apagada",
      description: "El sistema TR3S se ha apagado correctamente.",
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-900 p-4">
      <div className="flex justify-between items-center mb-4 bg-gray-800 p-2 rounded-md">
        <div className="flex items-center gap-2">
          <Monitor size={20} className="text-teal-500" />
          <h2 className="text-white font-semibold">Máquina Virtual - TR3S OS</h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={reiniciarVM} 
            disabled={!encendido || cargando}
            className="bg-gray-700 hover:bg-gray-600"
          >
            <RefreshCw size={14} className="mr-1" /> Reiniciar
          </Button>
          <Button 
            variant={encendido ? "destructive" : "default"}
            size="sm" 
            onClick={encendido ? apagarVM : encenderVM}
            disabled={cargando}
          >
            <Power size={14} className="mr-1" /> {encendido ? "Apagar" : "Encender"}
          </Button>
        </div>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center border border-gray-700 rounded-md overflow-hidden relative bg-black">
        <AnimatePresence mode="wait">
          {!encendido && !cargando && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4"
            >
              <Monitor size={80} className="text-gray-600" />
              <p className="text-gray-500">Máquina Virtual apagada</p>
              <Button 
                onClick={encenderVM} 
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                <Power size={16} className="mr-2" /> Iniciar TR3S
              </Button>
            </motion.div>
          )}
          
          {cargando && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw size={60} className="text-teal-500" />
              </motion.div>
              <p className="text-teal-400 text-lg font-medium">Iniciando TR3S OS...</p>
              <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                  className="h-full bg-gradient-to-r from-teal-400 to-purple-500"
                />
              </div>
            </motion.div>
          )}
          
          {encendido && !cargando && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <Tr3sOS />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MaquinaVirtual;
