
import React, { useState } from "react";
import { useTr3s } from "../Tr3sContext";
import { Clock, Moon, Sun, Settings, Sliders, Database, Layout, PaintBucket } from "lucide-react";
import { useSystemResources } from "../../../hooks/useSystemResources";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";

export const Tr3sAjustes = () => {
  const { state, toggleTema, cambiarFondo } = useTr3s();
  const { resources } = useSystemResources();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  // Función para formatear bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Opciones de fondo de pantalla
  const fondos = [
    { id: 'gradient', nombre: 'Degradado', color: 'from-indigo-800 via-purple-800 to-violet-900' },
    { id: 'dark', nombre: 'Oscuro', color: 'from-gray-900 via-gray-800 to-gray-900' },
    { id: 'blue', nombre: 'Azul', color: 'from-blue-800 via-blue-700 to-indigo-900' },
    { id: 'green', nombre: 'Verde', color: 'from-green-800 via-emerald-700 to-teal-900' },
  ];

  return (
    <div className="w-full h-full p-4 overflow-auto">
      <h2 className="text-xl font-bold mb-4 text-white">Ajustes del Sistema</h2>
      
      <Tabs defaultValue="apariencia" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="apariencia" className="flex items-center gap-2">
            <PaintBucket size={14} />
            <span>Apariencia</span>
          </TabsTrigger>
          <TabsTrigger value="datetime" className="flex items-center gap-2">
            <Clock size={14} />
            <span>Fecha y Hora</span>
          </TabsTrigger>
          <TabsTrigger value="sistema" className="flex items-center gap-2">
            <Sliders size={14} />
            <span>Sistema</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="apariencia" className="p-4 rounded-lg bg-black/20">
          <h3 className="text-lg font-medium mb-4">Tema</h3>
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              {state.temaOscuro ? 
                <Moon size={18} className="text-blue-300" /> : 
                <Sun size={18} className="text-yellow-300" />
              }
              <span>Modo oscuro</span>
            </div>
            <Switch 
              checked={state.temaOscuro} 
              onCheckedChange={toggleTema} 
              className="data-[state=checked]:bg-cyan-500"
            />
          </div>
          
          <h3 className="text-lg font-medium mb-4">Fondo de pantalla</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {fondos.map(fondo => (
              <div 
                key={fondo.id}
                onClick={() => cambiarFondo(fondo.id)}
                className={`cursor-pointer p-2 rounded-lg transition-all ${
                  state.fondoPantalla === fondo.id 
                    ? 'ring-2 ring-cyan-400 transform scale-105' 
                    : 'hover:bg-white/5'
                }`}
              >
                <div className={`w-full h-12 rounded bg-gradient-to-br ${fondo.color} mb-2`}></div>
                <p className="text-xs text-center">{fondo.nombre}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="datetime" className="p-4 rounded-lg bg-black/20">
          <h3 className="text-lg font-medium mb-4">Fecha y Hora</h3>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="fecha">Fecha</Label>
              <div className="mt-2 bg-white/5 p-3 rounded-lg">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="bg-black/20 rounded-md border border-white/10"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <Label htmlFor="hora">Hora</Label>
              <div className="mt-2 bg-white/5 p-3 rounded-lg">
                <input
                  id="hora"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-2 bg-black/20 border border-white/10 rounded text-white"
                />
                
                <div className="mt-4">
                  <p className="mb-2 text-sm">Zona horaria actual:</p>
                  <p className="text-sm font-mono bg-black/30 p-2 rounded">
                    {Intl.DateTimeFormat().resolvedOptions().timeZone}
                  </p>
                </div>
                
                <div className="mt-4">
                  <p className="mb-2 text-sm">Fecha y hora del sistema:</p>
                  <p className="text-sm font-mono bg-black/30 p-2 rounded">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sistema" className="p-4 rounded-lg bg-black/20">
          <h3 className="text-lg font-medium mb-4">Información del sistema</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Database size={14} />
                <span>Uso de memoria</span>
              </h4>
              
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Utilizada: {formatBytes(resources.memory.used * 1024 * 1024)}</span>
                  <span>Total: {formatBytes(resources.memory.total * 1024 * 1024)}</span>
                </div>
                <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${(resources.memory.used / resources.memory.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-xs text-white/70 mt-4">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Procesos en ejecución</span>
                  <span>12</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Memoria caché</span>
                  <span>{formatBytes(resources.memory.used * 0.3 * 1024 * 1024)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Memoria disponible</span>
                  <span>{formatBytes((resources.memory.total - resources.memory.used) * 1024 * 1024)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Layout size={14} />
                <span>Almacenamiento</span>
              </h4>
              
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Utilizado: {formatBytes(resources.disk.used * 1024)}</span>
                  <span>Total: {formatBytes(resources.disk.total * 1024)}</span>
                </div>
                <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${(resources.disk.used / resources.disk.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-xs text-white/70 mt-4">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Sistema</span>
                  <span>{formatBytes(resources.disk.used * 0.2 * 1024)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Aplicaciones</span>
                  <span>{formatBytes(resources.disk.used * 0.5 * 1024)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Documentos</span>
                  <span>{formatBytes(resources.disk.used * 0.3 * 1024)}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tr3sAjustes;
