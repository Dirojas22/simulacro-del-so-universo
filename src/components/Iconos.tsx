import React from "react";
import { useDOS } from "@/context/DOSContext";
import { 
  Calendar, 
  Clock, 
  Calculator, 
  FileText, 
  Globe, 
  PaintBucket, 
  FileSpreadsheet, 
  Database, 
  BarChart, 
  Music,
  Layout,
  Users,
  Settings,
  BookOpen,
  Images,
  FileSearch,
  MonitorSmartphone,
  Activity
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const Iconos: React.FC = () => {
  const { aplicacionesDisponibles, abrirAplicacion } = useDOS();
  
  const renderIcono = (tipo: string) => {
    switch (tipo) {
      case "calculator":
        return <Calculator size={32} className="text-amber-400" />;
      case "file-text":
        return <FileText size={32} className="text-blue-400" />;
      case "file-spreadsheet":
        return <FileSpreadsheet size={32} className="text-green-400" />;
      case "paint-bucket":
        return <PaintBucket size={32} className="text-purple-400" />;
      case "chrome":
        return <Globe size={32} className="text-red-400" />;
      case "calendar":
        return <Calendar size={32} className="text-pink-400" />;
      case "clock":
        return <Clock size={32} className="text-yellow-400" />;
      case "database":
        return <Database size={32} className="text-cyan-400" />;
      case "monitor":
        return <Activity size={32} className="text-emerald-400" />;
      case "layout":
        return <Layout size={32} className="text-indigo-400" />;
      case "users":
        return <Users size={32} className="text-orange-400" />;
      case "music":
        return <Music size={32} className="text-rose-400" />;
      case "settings":
        return <Settings size={32} className="text-gray-400" />;
      case "manual":
        return <BookOpen size={32} className="text-teal-400" />;
      case "gallery":
        return <Images size={32} className="text-violet-400" />;
      default:
        return <FileText size={32} className="text-white" />;
    }
  };
  
  return (
    <div className="fixed top-4 left-4 right-4 bottom-[52px] overflow-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {aplicacionesDisponibles.map((app) => (
          <motion.div
            key={app.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center p-2 rounded hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => abrirAplicacion(app.id)}
          >
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-dos-dark-blue to-dos-blue rounded-lg shadow-inner border border-gray-700 mb-1">
              {renderIcono(app.icono)}
            </div>
            <span className="text-white text-sm text-center font-medium shadow-sm">
              {app.nombre}
            </span>
          </motion.div>
        ))}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-dos-green hover:bg-green-400 text-black font-semibold px-6 py-2 rounded-t-lg shadow-lg transition-colors"
          >
            DOS
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="mb-2 bg-black text-white border border-gray-700" 
          side="top"
        >
          {aplicacionesDisponibles.map((app) => (
            <DropdownMenuItem 
              key={app.id}
              onClick={() => abrirAplicacion(app.id)}
              className="cursor-pointer hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="text-white">
                  {renderIcono(app.icono)}
                </div>
                <span>{app.nombre}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Iconos;
