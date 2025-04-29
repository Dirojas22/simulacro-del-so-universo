
import React, { useState, useEffect } from "react";
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
  const [memoryStats, setMemoryStats] = useState({
    cache: 0,
    available: 0,
    system: 0,
    apps: 0
  });
  const [diskStats, setDiskStats] = useState({
    system: 0,
    apps: 0,
    docs: 0
  });

  // Actualizar estadísticas de memoria y disco dinámicamente
  useEffect(() => {
    const updateIntervalId = setInterval(() => {
      // Calcular estadísticas de memoria con pequeñas variaciones
      const cacheRatio = 0.3 + Math.random() * 0.05;
      const availableBytes = (resources.memory.total - resources.memory.used) * 1024 * 1024;
      const systemRatio = 0.4 + Math.random() * 0.05;
      const appsRatio = 0.6 - Math.random() * 0.05;
      
      setMemoryStats({
        cache: resources.memory.used * cacheRatio * 1024 * 1024,
        available: availableBytes,
        system: resources.memory.used * systemRatio * 1024 * 1024,
        apps: resources.memory.used * appsRatio * 1024 * 1024
      });
      
      // Calcular estadísticas de disco con pequeñas variaciones
      const systemRatioDisk = 0.2 + Math.random() * 0.02;
      const appsRatioDisk = 0.5 + Math.random() * 0.03;
      const docsRatioDisk = 0.3 - Math.random() * 0.01;
      
      setDiskStats({
        system: resources.disk.used * systemRatioDisk * 1024,
        apps: resources.disk.used * appsRatioDisk * 1024,
        docs: resources.disk.used * docsRatioDisk * 1024
      });
      
    }, 3000);
    
    return () => clearInterval(updateIntervalId);
  }, [resources.memory.total, resources.memory.used, resources.disk.used]);

  // Función para formatear bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Función para obtener hora actual
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Actualizar la hora cada minuto
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setSelectedTime(getCurrentTime());
    }, 60000);
    
    return () => clearInterval(timeInterval);
  }, []);

  // Opciones de fondo de pantalla
  const fondos = [
    { id: 'gradient', nombre: 'Degradado', color: 'from-indigo-800 via-purple-800 to-violet-900' },
    { id: 'dark', nombre: 'Oscuro', color: 'from-gray-900 via-gray-800 to-gray-900' },
    { id: 'blue', nombre: 'Azul', color: 'from-blue-800 via-blue-700 to-indigo-900' },
    { id: 'green', nombre: 'Verde', color: 'from-green-800 via-emerald-700 to-teal-900' },
  ];

  return (
    <div className={`w-full h-full p-4 overflow-auto ${state.temaOscuro ? 'text-gray-200' : 'text-white'}`}>
      <h2 className="text-xl font-bold mb-4">Ajustes del Sistema</h2>
      
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
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(resources.memory.used / resources.memory.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-xs text-white/70 mt-4">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Procesos en ejecución</span>
                  <span>{Math.floor(8 + Math.random() * 4)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Memoria caché</span>
                  <span>{formatBytes(memoryStats.cache)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Memoria disponible</span>
                  <span>{formatBytes(memoryStats.available)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Memoria sistema</span>
                  <span>{formatBytes(memoryStats.system)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Memoria aplicaciones</span>
                  <span>{formatBytes(memoryStats.apps)}</span>
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
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${(resources.disk.used / resources.disk.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-xs text-white/70 mt-4">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Sistema</span>
                  <span>{formatBytes(diskStats.system)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Aplicaciones</span>
                  <span>{formatBytes(diskStats.apps)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Documentos</span>
                  <span>{formatBytes(diskStats.docs)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Velocidad de lectura</span>
                  <span>{Math.floor(150 + Math.random() * 70)} MB/s</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Velocidad de escritura</span>
                  <span>{Math.floor(100 + Math.random() * 50)} MB/s</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-white/5 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Estadísticas del sistema</h4>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-black/20 p-3 rounded-lg">
                <p className="font-medium mb-2">CPU</p>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Utilización</span>
                  <span>{resources.cpu.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Temperatura</span>
                  <span>{Math.floor(40 + resources.cpu / 2)}°C</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Frecuencia</span>
                  <span>{(2.8 + Math.random() * 0.4).toFixed(2)} GHz</span>
                </div>
              </div>
              
              <div className="bg-black/20 p-3 rounded-lg">
                <p className="font-medium mb-2">Rendimiento</p>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Tiempo de arranque</span>
                  <span>{Math.floor(10 + Math.random() * 5)} s</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Tiempo activo</span>
                  <span>{Math.floor(Math.random() * 24)} h {Math.floor(Math.random() * 60)} min</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Versión del sistema</span>
                  <span>TR3S 1.0.4</span>
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
