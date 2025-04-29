
import React from "react";
import { motion } from "framer-motion";
import { useTr3s } from "./Tr3sContext";
import { Terminal, FileText, Calculator, Settings, File, Globe, BookOpen, Activity } from "lucide-react";

export const Tr3sIconos = () => {
  const { state, abrirApp } = useTr3s();

  const getIcono = (tipo: string) => {
    switch (tipo) {
      case 'terminal':
        return <Terminal size={24} className="text-white" />;
      case 'file-text':
        return <FileText size={24} className="text-white" />;
      case 'calculator':
        return <Calculator size={24} className="text-white" />;
      case 'settings':
        return <Settings size={24} className="text-white" />;
      case 'file':
        return <File size={24} className="text-white" />;
      case 'globe':
        return <Globe size={24} className="text-white" />;
      case 'book':
        return <BookOpen size={24} className="text-white" />;
      case 'activity':
        return <Activity size={24} className="text-white" />;
      default:
        return <File size={24} className="text-white" />;
    }
  };

  return (
    <div className="p-4 grid grid-cols-4 gap-4">
      {state.aplicaciones.map(app => (
        <motion.div
          key={app.id}
          className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
          onClick={() => abrirApp(app.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-lg backdrop-blur-sm border border-white/10">
            {getIcono(app.icono)}
          </div>
          <span className="text-white text-xs font-medium">{app.nombre}</span>
        </motion.div>
      ))}
    </div>
  );
};
