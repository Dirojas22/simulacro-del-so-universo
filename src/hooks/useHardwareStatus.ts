
import { useState, useEffect } from 'react';

interface BatteryStatus {
  level: number;
  charging: boolean;
}

interface NetworkStatus {
  online: boolean;
  type?: string;
}

export function useHardwareStatus() {
  const [battery, setBattery] = useState<BatteryStatus>({ level: 100, charging: false });
  const [network, setNetwork] = useState<NetworkStatus>({ online: navigator.onLine });

  // Monitorear estado de la batería
  useEffect(() => {
    let batteryManager: any;

    const updateBatteryStatus = (bm: any) => {
      setBattery({
        level: Math.floor(bm.level * 100),
        charging: bm.charging
      });
    };

    const setupBattery = async () => {
      try {
        // @ts-ignore - La API Battery no está en los tipos de TypeScript
        if ('getBattery' in navigator) {
          // @ts-ignore
          batteryManager = await navigator.getBattery();
          updateBatteryStatus(batteryManager);

          batteryManager.addEventListener('levelchange', () => 
            updateBatteryStatus(batteryManager)
          );
          batteryManager.addEventListener('chargingchange', () => 
            updateBatteryStatus(batteryManager)
          );
        } else {
          // Valores simulados si no está disponible la API
          console.log('API de Batería no disponible. Usando valores simulados.');
          setBattery({ level: 75, charging: true });
        }
      } catch (error) {
        console.error('Error al acceder a la información de la batería:', error);
        setBattery({ level: 80, charging: false });
      }
    };

    setupBattery();

    return () => {
      if (batteryManager) {
        batteryManager.removeEventListener('levelchange', updateBatteryStatus);
        batteryManager.removeEventListener('chargingchange', updateBatteryStatus);
      }
    };
  }, []);

  // Monitorear estado de la red
  useEffect(() => {
    const handleOnline = () => {
      setNetwork({ online: true, type: 'WiFi' });
    };

    const handleOffline = () => {
      setNetwork({ online: false });
    };

    // Inicializar estado
    setNetwork({ online: navigator.onLine, type: navigator.onLine ? 'WiFi' : undefined });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { battery, network };
}
