
import { useState, useEffect } from 'react';
import { useTr3s } from '../components/tr3s/Tr3sContext';

interface BatteryStatus {
  level: number;
  charging: boolean;
}

interface NetworkStatus {
  online: boolean;
  type?: string;
}

export function useHardwareStatus() {
  const { state } = useTr3s();
  const [battery, setBattery] = useState<BatteryStatus>({ level: 100, charging: false });
  const [network, setNetwork] = useState<NetworkStatus>({ online: state?.wifiActivo ?? true });

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

  // Actualizar estado de la red según TR3S context
  useEffect(() => {
    if (state) {
      setNetwork({
        online: state.wifiActivo,
        type: state.wifiActivo ? 'WiFi' : undefined
      });
    }
  }, [state?.wifiActivo]);

  return { battery, network };
}
