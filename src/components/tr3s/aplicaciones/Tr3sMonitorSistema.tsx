
import React, { useState, useEffect } from "react";
import { useSystemResources } from "../../../hooks/useSystemResources";
import { Activity, HardDrive, Cpu, MemoryStick, BarChart, Clock } from "lucide-react";

export const Tr3sMonitorSistema = () => {
  const { resources, updateResources } = useSystemResources();
  const [procesos, setProcesos] = useState([
    { id: 1, nombre: "sistema.sys", cpu: 2.3, memoria: 45, estado: "activo" },
    { id: 2, nombre: "tr3s_kernel.exe", cpu: 1.5, memoria: 128, estado: "activo" },
    { id: 3, nombre: "interfaz_grafica.exe", cpu: 3.2, memoria: 256, estado: "activo" },
    { id: 4, nombre: "gestor_archivos.exe", cpu: 0.8, memoria: 64, estado: "activo" },
    { id: 5, nombre: "actualizador.exe", cpu: 0.2, memoria: 32, estado: "espera" }
  ]);
  const [tiempoActivo, setTiempoActivo] = useState({ horas: 1, minutos: 23 });
  const [vistaActual, setVistaActual] = useState('general');

  // Actualizar tiempo activo
  useEffect(() => {
    const timer = setInterval(() => {
      setTiempoActivo(prev => {
        let minutos = prev.minutos + 1;
        let horas = prev.horas;
        
        if (minutos >= 60) {
          minutos = 0;
          horas += 1;
        }
        
        return { horas, minutos };
      });
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Simular cambios en los recursos del sistema
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Actualizar uso de CPU y memoria de procesos
      setProcesos(prev => prev.map(proceso => ({
        ...proceso,
        cpu: Math.max(0.1, Math.min(proceso.cpu + (Math.random() * 0.6 - 0.3), 8)),
        memoria: Math.max(8, Math.min(proceso.memoria + Math.floor(Math.random() * 10 - 5), 
          proceso.nombre === "interfaz_grafica.exe" ? 300 : 200))
      })));
      
      // Simular un cambio aleatorio en los recursos del sistema
      updateResources(Math.random() * 5 - 2.5, Math.floor(Math.random() * 50 - 25));
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [updateResources]);

  // Calcular porcentajes
  const memoriaPorcentaje = (resources.memory.used / resources.memory.total) * 100;
  const discoPorcentaje = (resources.disk.used / resources.disk.total) * 100;

  const renderBarraProgreso = (valor: number, colorClase: string = "bg-cyan-400") => (
    <div className="w-full h-1.5 bg-zinc-700 rounded-full mt-1 mb-2">
      <div 
        className={`h-1.5 ${colorClase} rounded-full`}
        style={{ width: `${Math.max(0, Math.min(100, valor))}%` }}
      />
    </div>
  );

  return (
    <div className="bg-zinc-900 text-white h-full p-4 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
          <Activity size={18} />
          Monitor del Sistema TR3S
        </h2>
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <Clock size={12} />
          Tiempo activo: {tiempoActivo.horas}h {tiempoActivo.minutos}min
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button 
          className={`px-3 py-1 text-sm rounded ${vistaActual === 'general' ? 'bg-cyan-600' : 'bg-zinc-800'}`}
          onClick={() => setVistaActual('general')}
        >
          General
        </button>
        <button 
          className={`px-3 py-1 text-sm rounded ${vistaActual === 'procesos' ? 'bg-cyan-600' : 'bg-zinc-800'}`}
          onClick={() => setVistaActual('procesos')}
        >
          Procesos
        </button>
        <button 
          className={`px-3 py-1 text-sm rounded ${vistaActual === 'rendimiento' ? 'bg-cyan-600' : 'bg-zinc-800'}`}
          onClick={() => setVistaActual('rendimiento')}
        >
          Rendimiento
        </button>
      </div>

      {vistaActual === 'general' && (
        <div className="space-y-4">
          {/* Sección CPU */}
          <div className="bg-zinc-800 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-cyan-400" />
                <h3 className="text-sm font-medium">CPU</h3>
              </div>
              <span className="text-xl font-mono">{resources.cpu.toFixed(1)}%</span>
            </div>
            {renderBarraProgreso(resources.cpu, "bg-green-500")}
            <div className="grid grid-cols-2 text-xs text-gray-400">
              <div>Procesos: {procesos.filter(p => p.estado === "activo").length}</div>
              <div>Frecuencia: 3.2 GHz</div>
            </div>
          </div>

          {/* Sección Memoria */}
          <div className="bg-zinc-800 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MemoryStick size={16} className="text-purple-400" />
                <h3 className="text-sm font-medium">Memoria</h3>
              </div>
              <span className="text-xl font-mono">{Math.round(memoriaPorcentaje)}%</span>
            </div>
            {renderBarraProgreso(memoriaPorcentaje, "bg-purple-500")}
            <div className="text-xs text-gray-400">
              <div>En uso: {(resources.memory.used / 1024).toFixed(2)} GB / {(resources.memory.total / 1024).toFixed(2)} GB</div>
              <div className="flex justify-between mt-1">
                <span>Física: {(resources.memory.used * 0.8 / 1024).toFixed(2)} GB</span>
                <span>Virtual: {(resources.memory.used * 0.2 / 1024).toFixed(2)} GB</span>
              </div>
            </div>
          </div>

          {/* Sección Disco */}
          <div className="bg-zinc-800 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive size={16} className="text-blue-400" />
                <h3 className="text-sm font-medium">Disco</h3>
              </div>
              <span className="text-xl font-mono">{Math.round(discoPorcentaje)}%</span>
            </div>
            {renderBarraProgreso(discoPorcentaje, "bg-blue-500")}
            <div className="text-xs text-gray-400">
              <div>Espacio: {(resources.disk.used / 1024).toFixed(2)} GB / {(resources.disk.total / 1024).toFixed(2)} GB</div>
              <div className="flex justify-between mt-1">
                <span>Sistema: 45.6 GB</span>
                <span>Usuario: {((resources.disk.used - 45600) / 1024).toFixed(2)} GB</span>
              </div>
            </div>
          </div>

          {/* Estadísticas generales */}
          <div className="bg-zinc-800 p-3 rounded-lg">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <BarChart size={16} className="text-yellow-400" />
              Estadísticas del sistema
            </h3>
            <table className="w-full text-xs">
              <tbody>
                <tr className="border-b border-zinc-700">
                  <td className="py-1 text-gray-400">Núcleos CPU</td>
                  <td className="py-1">4 físicos / 8 lógicos</td>
                </tr>
                <tr className="border-b border-zinc-700">
                  <td className="py-1 text-gray-400">Velocidad memoria</td>
                  <td className="py-1">3200 MHz</td>
                </tr>
                <tr className="border-b border-zinc-700">
                  <td className="py-1 text-gray-400">Tipo de almacenamiento</td>
                  <td className="py-1">SSD NVMe</td>
                </tr>
                <tr className="border-b border-zinc-700">
                  <td className="py-1 text-gray-400">Versión del sistema</td>
                  <td className="py-1">TR3S OS 1.0.0</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-400">Última actualización</td>
                  <td className="py-1">13-04-2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {vistaActual === 'procesos' && (
        <div className="bg-zinc-800 p-3 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Procesos en ejecución</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-left">
                <tr className="border-b border-zinc-700">
                  <th className="p-2">ID</th>
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Estado</th>
                  <th className="p-2">CPU %</th>
                  <th className="p-2">Memoria (MB)</th>
                </tr>
              </thead>
              <tbody>
                {procesos.map(proceso => (
                  <tr key={proceso.id} className="border-b border-zinc-700">
                    <td className="p-2">{proceso.id}</td>
                    <td className="p-2">{proceso.nombre}</td>
                    <td className="p-2">
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        proceso.estado === "activo" ? "bg-green-900 text-green-300" : 
                        proceso.estado === "espera" ? "bg-yellow-900 text-yellow-300" :
                        "bg-red-900 text-red-300"
                      }`}>
                        {proceso.estado}
                      </span>
                    </td>
                    <td className="p-2">{proceso.cpu.toFixed(1)}%</td>
                    <td className="p-2">{proceso.memoria} MB</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {vistaActual === 'rendimiento' && (
        <div className="space-y-4">
          <div className="bg-zinc-800 p-3 rounded-lg">
            <h3 className="text-sm font-medium mb-3">Uso de CPU en tiempo real</h3>
            <div className="h-32 flex items-end justify-between">
              {[...Array(20)].map((_, i) => {
                const altura = 10 + Math.random() * 90;
                return (
                  <div 
                    key={i}
                    style={{ height: `${altura}%` }}
                    className={`w-2 ${altura > 70 ? 'bg-red-500' : altura > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>0s</span>
              <span>10s</span>
              <span>20s</span>
              <span>30s</span>
              <span>40s</span>
              <span>50s</span>
              <span>60s</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800 p-3 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Temperatura CPU</h3>
              <div className="text-center">
                <span className="text-2xl font-mono">
                  {Math.floor(40 + resources.cpu / 2)}°C
                </span>
                {renderBarraProgreso((40 + resources.cpu / 2) * 1.2, "bg-red-500")}
              </div>
            </div>

            <div className="bg-zinc-800 p-3 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Velocidad lectura/escritura</h3>
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-zinc-700">
                    <td className="py-1 text-gray-400">Lectura</td>
                    <td className="py-1">{Math.floor(150 + Math.random() * 100)} MB/s</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-400">Escritura</td>
                    <td className="py-1">{Math.floor(100 + Math.random() * 80)} MB/s</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
