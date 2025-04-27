
import React, { useState } from "react";
import { useDOS } from "@/context/DOSContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const MonitorSistema: React.FC = () => {
  const { state, dispatch } = useDOS();
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  
  // Función para actualizar el quantum de un proceso
  const actualizarQuantum = (id: number, nuevoQuantum: number) => {
    dispatch({
      type: "ACTUALIZAR_QUANTUM",
      payload: { id, quantum: nuevoQuantum }
    });
  };
  
  return (
    <div className="h-full flex flex-col p-4 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Monitor del Sistema</h2>
      
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
                <span>{state.recursos.memoriaUsada} MB / {state.recursos.memoriaTotal} MB</span>
              </div>
              <Progress 
                value={(state.recursos.memoriaUsada / state.recursos.memoriaTotal) * 100} 
                className="h-2"
              />
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">CPU</h3>
              <div className="flex items-center justify-between mb-2">
                <span>Uso de CPU:</span>
                <span>{state.recursos.cpuUsada}%</span>
              </div>
              <Progress 
                value={state.recursos.cpuUsada} 
                className="h-2"
              />
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
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Red</h3>
              <p>Estado: {state.estadoRed.conectado ? "Conectado" : "Desconectado"}</p>
              {state.estadoRed.conectado && state.estadoRed.tipo && (
                <p>Tipo de conexión: {state.estadoRed.tipo}</p>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Batería</h3>
              <p>Nivel: {state.estadoBateria.nivel}%</p>
              <p>Estado: {state.estadoBateria.cargando ? "Cargando" : "Descargando"}</p>
              <Progress 
                value={state.estadoBateria.nivel} 
                className="h-2 mt-2"
              />
            </div>
          </div>
        </TabsContent>
        
        {/* Tab de Procesos */}
        <TabsContent value="procesos" className="h-full overflow-auto">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Lista de Procesos</h3>
              <button 
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setMostrarDetalle(!mostrarDetalle)}
              >
                {mostrarDetalle ? "Ocultar detalles" : "Mostrar detalles"}
              </button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
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
                    </>
                  )}
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.procesos.map((proceso) => (
                  <TableRow key={proceso.id}>
                    <TableCell>{proceso.id}</TableCell>
                    <TableCell>{proceso.nombre}</TableCell>
                    <TableCell>
                      <span 
                        className={
                          proceso.estado === 'activo' ? 'text-green-600' :
                          proceso.estado === 'bloqueado' ? 'text-red-600' :
                          proceso.estado === 'esperando' ? 'text-yellow-600' :
                          'text-gray-600'
                        }
                      >
                        {proceso.estado}
                      </span>
                    </TableCell>
                    <TableCell>{proceso.cpu}%</TableCell>
                    <TableCell>{proceso.memoria} MB</TableCell>
                    <TableCell>
                      <select 
                        value={proceso.quantum}
                        onChange={(e) => actualizarQuantum(proceso.id, parseInt(e.target.value))}
                        className="p-1 border rounded"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </TableCell>
                    {mostrarDetalle && (
                      <>
                        <TableCell>{proceso.prioridad}</TableCell>
                        <TableCell>{proceso.tiempoEjecucion}</TableCell>
                        <TableCell>{proceso.tiempoEspera}</TableCell>
                      </>
                    )}
                    <TableCell>
                      {proceso.estado !== 'terminado' && (
                        <button
                          className="text-sm text-red-600 hover:underline"
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
                          className={
                            evento.tipo === 'interbloqueo' ? 'text-red-600' :
                            evento.tipo === 'exclusionMutua' ? 'text-blue-600' :
                            evento.tipo === 'inanicion' ? 'text-orange-600' :
                            'text-gray-600'
                          }
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
