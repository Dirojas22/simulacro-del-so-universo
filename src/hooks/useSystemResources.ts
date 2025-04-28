
import { useState, useEffect } from 'react';

interface SystemResources {
  cpu: number;
  memory: {
    used: number;
    total: number;
  };
  disk: {
    used: number;
    total: number;
  };
}

// Esta función es simulada ya que el navegador no permite acceso directo a recursos del sistema
export function useSystemResources() {
  const [resources, setResources] = useState<SystemResources>({
    cpu: 15,
    memory: {
      used: 2048,
      total: 8192
    },
    disk: {
      used: 128000,
      total: 512000
    }
  });

  // Simular cambios aleatorios en los recursos
  useEffect(() => {
    const interval = setInterval(() => {
      setResources(prev => {
        // Variación aleatoria de CPU entre -2% y +2%
        const cpuDelta = Math.random() * 4 - 2;
        const newCpu = Math.max(10, Math.min(30, prev.cpu + cpuDelta));
        
        // Variación aleatoria de memoria
        const memoryDelta = Math.floor(Math.random() * 100) - 20;
        const newMemory = Math.max(
          1024, 
          Math.min(prev.memory.total - 1024, prev.memory.used + memoryDelta)
        );
        
        return {
          cpu: newCpu,
          memory: {
            ...prev.memory,
            used: newMemory
          },
          disk: prev.disk // Disco permanece relativamente estable
        };
      });
    }, 5000); // Actualizar cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return resources;
}
