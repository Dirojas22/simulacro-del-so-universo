
import React, { useState, useEffect } from "react";
import { useDOS } from "@/context/DOSContext";
import { BarraTareas } from "./BarraTareas";
import Ventana from "./Ventana";
import Iconos from "./Iconos";
import Login from "./Login";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";

const Escritorio: React.FC = () => {
  const { state } = useDOS();
  const [fecha, setFecha] = useState(new Date());
  const [cargandoSistema, setCargandoSistema] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFecha(new Date());
    }, 60000);

    // Simulación de carga del sistema
    setTimeout(() => {
      setCargandoSistema(false);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  if (!state.isLoggedIn) {
    return <Login />;
  }

  if (cargandoSistema) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-dos-dark-blue">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-9xl font-bold text-white mb-8"
        >
          DOS
        </motion.div>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "60%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="h-2 bg-dos-green rounded-full"
        />
      </div>
    );
  }

  // Usando un fondo abstracto diferente
  const fondoAbstracto = "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen w-full overflow-hidden bg-dos-blue text-white relative"
      style={{ 
        backgroundImage: `url('${fondoAbstracto}')`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl font-bold text-white opacity-10 select-none">
        DOS
      </div>
      
      <div className="w-full h-[calc(100%-48px)] relative">
        {state.aplicacionesAbiertas.map((app) => (
          !app.esMinimizado && (
            <Ventana 
              key={app.id} 
              app={app} 
            />
          )
        ))}
        
        <Iconos />
      </div>
      
      <BarraTareas fecha={fecha} />
    </motion.div>
  );
};

export default Escritorio;
