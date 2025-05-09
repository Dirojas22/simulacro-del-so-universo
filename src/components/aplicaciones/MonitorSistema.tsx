
import React, { useState, useEffect } from "react";
import { useDOS } from "@/context/DOSContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, AlertTriangle, Check } from "lucide-react";

const MonitorSistema: React.FC = () => {
  const { state, dispatch } = useDOS();
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [valorRefresh, setValorRefresh] = useState(0);
  
  // Actualizar los valores cada 2 segundos para simular un sistema más dinámico
  useEffect(() => {
    const interval = setInterval(() => {
      setValorRefresh(prev => prev + 1);
      
      // Simular cambios aleatorios en los procesos
      state.procesos.forEach(proceso => {
        if (proceso.estado === 'activo') {
          const cpuDelta = Math.random() * 4 - 1.5; // -1.5 a +2.5
          const memoriaDelta = Math.floor(Math.random() * 8) - 3; // -3 a +5
          
          dispatch({
            type: "ACTUALIZAR_PROCESO",
            payload: {
              id: proceso.id,
              cambios: {
                cpu: Math.max(0.1, Math.min(proceso.cpu + cpuDelta, 100)),
                memoria: Math.max(1, Math.min(proceso.memoria + memoriaDelta, 512))
              }
            }
          });
        }
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  // Función para actualizar el quantum de un proceso
  const actualizarQuantum = (id: number, nuevoQuantum: number) => {
    dispatch({
      type: "ACTUALIZAR_QUANTUM",
      payload: { id, quantum: nuevoQuantum }
    });
  };
  
  // Cambiar prioridad de un proceso
  const cambiarPrioridad = (id: number, nuevaPrioridad: number) => {
    dispatch({
      type: "ACTUALIZAR_PROCESO",
      payload: {
        id,
        cambios: { prioridad: nuevaPrioridad }
      }
    });
  };
  
  // Función para obtener un color basado en el valor de carga (rojo = alto, verde = bajo)
  const getColorForValue = (value: number, max: number = 100, invertir: boolean = false): string => {
    const percentage = (value / max) * 100;
    
    if (invertir) {
      if (percentage < 30) return "text-red-500";
      if (percentage < 70) return "text-yellow-500";
      return "text-green-500";
    } else {
      if (percentage > 70) return "text-red-500";
      if (percentage > 30) return "text-yellow-500";
      return "text-green-500";
    }
  };

  // Función para obtener un valor aleatorio basado en otro valor (para hacer que los detalles parezcan dinámicos)
  const getRelatedRandomValue = (baseValue: number, factor: number, min: number, max: number): number => {
    const random = (Math.random() * factor) - (factor / 2);
    return Math.max(min, Math.min(max, baseValue + random));
  };
  
  return (
    <div className="h-full flex flex-col p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Monitor del Sistema</h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Actualizando datos en tiempo real</span>
          <Activity className="h-4 w-4 text-green-500 animate-pulse" />
        </div>
      </div>
      
      <Tabs defaultValue="recursos" className="flex-1">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="recursos">Recursos</TabsTrigger>
          <TabsTrigger value="procesos">Procesos</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
        </TabsList>
        
        {/* Tab de Recursos */}
        <TabsContent value="recursos" className="h-full">
          <div className="grid gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Memoria</h3>
              <div className="flex items-center justify-between mb-2">
                <span>Uso de memoria:</span>
                <span className={getColorForValue(state.recursos.memoriaUsada, state.recursos.memoriaTotal)}>
                  {state.recursos.memoriaUsada.toFixed(0)} MB / {state.recursos.memoriaTotal} MB
                </span>
              </div>
              <Progress 
                value={(state.recursos.memoriaUsada / state.recursos.memoriaTotal) * 100} 
                className="h-2"
              />
              
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-gray-600">Memoria caché:</p>
                  <p className="font-medium">{Math.floor(state.recursos.memoriaUsada * 0.15).toFixed(0)} MB</p>
                </div>
                <div>
                  <p className="text-gray-600">Memoria disponible:</p>
                  <p className="font-medium">{(state.recursos.memoriaTotal - state.recursos.memoriaUsada).toFixed(0)} MB</p>
                </div>
                <div>
                  <p className="text-gray-600">Memoria en uso por sistema:</p>
                  <p className="font-medium">{Math.floor(state.recursos.memoriaUsada * 0.4).toFixed(0)} MB</p>
                </div>
                <div>
                  <p className="text-gray-600">Memoria en uso por aplicaciones:</p>
                  <p className="font-medium">{Math.floor(state.recursos.memoriaUsada * 0.6).toFixed(0)} MB</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">CPU</h3>
              <div className="flex items-center justify-between mb-2">
                <span>Uso de CPU:</span>
                <span className={getColorForValue(state.recursos.cpuUsada)}>{state.recursos.cpuUsada.toFixed(1)}%</span>
              </div>
              <Progress 
                value={state.recursos.cpuUsada} 
                className="h-2"
              />
              
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-gray-600">Núcleos:</p>
                  <p className="font-medium">4 núcleos / 8 hilos</p>
                </div>
                <div>
                  <p className="text-gray-600">Frecuencia:</p>
                  <p className="font-medium">{(2.8 + Math.random() * 0.5).toFixed(2)} GHz</p>
                </div>
                <div>
                  <p className="text-gray-600">Procesos:</p>
                  <p className="font-medium">{state.procesos.filter(p => p.estado === 'activo').length} activos</p>
                </div>
                <div>
                  <p className="text-gray-600">Temperatura:</p>
                  <p className={`font-medium ${getColorForValue(40 + (state.recursos.cpuUsada / 2), 100)}`}>
                    {Math.floor(40 + (state.recursos.cpuUsada / 2))}°C
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Disco</h3>
              <div className="flex items-center justify-between mb-2">
                <span>Uso de disco:</span>
                <span>{(state.recursos.discoUsado / 1024).toFixed(2)} GB / {(state.recursos.discoTotal / 1024).toFixed(2)} GB</span>
              </div>
              <Progress 
                value={(state.recursos.discoUsado / state.recursos.discoTotal) * 100} 
                className="h-2"
              />
              
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-gray-600">Velocidad de lectura:</p>
                  <p className="font-medium">{(50 + Math.random() * 70).toFixed(1)} MB/s</p>
                </div>
                <div>
                  <p className="text-gray-600">Velocidad de escritura:</p>
                  <p className="font-medium">{(30 + Math.random() * 50).toFixed(1)} MB/s</p>
                </div>
                <div>
                  <p className="text-gray-600">Tiempo de acceso:</p>
                  <p className="font-medium">{(5 + Math.random() * 20).toFixed(1)} ms</p>
                </div>
                <div>
                  <p className="text-gray-600">Tipo:</p>
                  <p className="font-medium">SSD NVMe</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Red</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-3 w-3 rounded-full ${state.estadoRed.conectado ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Estado: {state.estadoRed.conectado ? "Conectado" : "Desconectado"}</span>
              </div>
              
              {state.estadoRed.conectado && (
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <div>
                    <p className="text-gray-600">Tipo de conexión:</p>
                    <p className="font-medium">{state.estadoRed.tipo || "WiFi"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Velocidad de descarga:</p>
                    <p className="font-medium">{(15 + Math.random() * 85).toFixed(1)} Mbps</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Velocidad de subida:</p>
                    <p className="font-medium">{(5 + Math.random() * 15).toFixed(1)} Mbps</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Latencia:</p>
                    <p className="font-medium">{Math.floor(20 + Math.random() * 40)} ms</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Batería</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-3 w-3 rounded-full ${state.estadoBateria.cargando ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                <span>Estado: {state.estadoBateria.cargando ? "Cargando" : "Descargando"}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span>Nivel:</span>
                <span className={getColorForValue(state.estadoBateria.nivel, 100, true)}>{state.estadoBateria.nivel}%</span>
              </div>
              <Progress 
                value={state.estadoBateria.nivel} 
                className="h-2"
              />
              
              {state.estadoBateria.cargando ? (
                <p className="text-sm text-gray-600 mt-2">Tiempo estimado para carga completa: {Math.floor(30 + Math.random() * 60)} minutos</p>
              ) : (
                <p className="text-sm text-gray-600 mt-2">Tiempo restante estimado: {Math.floor(1 + Math.random() * 4)} horas {Math.floor(Math.random() * 60)} minutos</p>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Tab de Procesos */}
        <TabsContent value="procesos" className="h-full overflow-auto">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 items-center">
                <h3 className="text-lg font-semibold">Procesos activos: </h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {state.procesos.filter(p => p.estado !== 'terminado').length}
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  onClick={() => setMostrarDetalle(!mostrarDetalle)}
                >
                  {mostrarDetalle ? "Ocultar detalles" : "Mostrar detalles"}
                </button>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>CPU</TableHead>
                  <TableHead>Memoria</TableHead>
                  <TableHead>Quantum</TableHead>
                  {mostrarDetalle && (
                    <>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>T. Ejecución</TableHead>
                      <TableHead>T. Espera</TableHead>
                      <TableHead>I/O</TableHead>
                      <TableHead>Hilos</TableHead>
                    </>
                  )}
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.procesos.map((proceso) => (
                  <TableRow key={proceso.id} className={proceso.estado === 'terminado' ? 'opacity-50' : ''}>
                    <TableCell>{proceso.id}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {proceso.estado === 'activo' && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                        )}
                        {proceso.nombre}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span 
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                          ${proceso.estado === 'activo' ? 'bg-green-100 text-green-800' :
                            proceso.estado === 'bloqueado' ? 'bg-red-100 text-red-800' :
                            proceso.estado === 'esperando' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {proceso.estado === 'activo' && <Check className="h-3 w-3" />}
                        {proceso.estado === 'bloqueado' && <AlertTriangle className="h-3 w-3" />}
                        {proceso.estado === 'esperando' && <Activity className="h-3 w-3" />}
                        {proceso.estado}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Progress value={proceso.cpu} className="h-1.5 w-16" />
                        <span className={`${getColorForValue(proceso.cpu)}`}>{proceso.cpu.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Progress value={(proceso.memoria / 512) * 100} className="h-1.5 w-16" />
                        <span>{proceso.memoria} MB</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <select 
                        value={proceso.quantum}
                        onChange={(e) => actualizarQuantum(proceso.id, parseInt(e.target.value))}
                        className="p-1 border rounded"
                        disabled={proceso.estado === 'terminado'}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </TableCell>
                    {mostrarDetalle && (
                      <>
                        <TableCell>
                          <select 
                            value={proceso.prioridad}
                            onChange={(e) => cambiarPrioridad(proceso.id, parseInt(e.target.value))}
                            className="p-1 border rounded"
                            disabled={proceso.estado === 'terminado'}
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </TableCell>
                        <TableCell>{proceso.tiempoEjecucion}s</TableCell>
                        <TableCell>{proceso.tiempoEspera}s</TableCell>
                        <TableCell>
                          {Math.floor(getRelatedRandomValue(proceso.cpu, 20, 0, 100))}%
                        </TableCell>
                        <TableCell>
                          {Math.max(1, Math.floor(proceso.memoria / 32))}
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      {proceso.estado !== 'terminado' && (
                        <button
                          className="text-xs px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded"
                          onClick={() => dispatch({ type: 'TERMINAR_PROCESO', payload: proceso.id })}
                        >
                          Terminar
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* Tab de Eventos */}
        <TabsContent value="eventos" className="h-full overflow-auto">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Registro de Eventos</h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Proceso</TableHead>
                  <TableHead>Marca de tiempo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.eventos.slice().reverse().map((evento) => {
                  const proceso = evento.proceso 
                    ? state.procesos.find(p => p.id === evento.proceso) 
                    : undefined;
                  
                  return (
                    <TableRow key={evento.id}>
                      <TableCell>{evento.id}</TableCell>
                      <TableCell>
                        <span 
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                            ${evento.tipo === 'interbloqueo' ? 'bg-red-100 text-red-800' :
                              evento.tipo === 'exclusionMutua' ? 'bg-blue-100 text-blue-800' :
                              evento.tipo === 'inanicion' ? 'bg-orange-100 text-orange-800' :
                              evento.tipo === 'error' ? 'bg-red-100 text-red-800' :
                              'bg-green-100 text-green-800'
                            }`}
                        >
                          {evento.tipo}
                        </span>
                      </TableCell>
                      <TableCell>{evento.descripcion}</TableCell>
                      <TableCell>{proceso ? proceso.nombre : '-'}</TableCell>
                      <TableCell>
                        {evento.timestamp.toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitorSistema;
