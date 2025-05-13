
import { useState, useEffect } from 'react';
import { App } from '@capacitor/app';
import { DeviceService } from '@/services/device';

interface DeviceState {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isWeb: boolean;
  platform: string;
  isOnline: boolean;
  appVersion?: string;
  appBuild?: string;
}

export function useDevice() {
  const [deviceState, setDeviceState] = useState<DeviceState>({
    isMobile: DeviceService.isMobile(),
    isIOS: DeviceService.isIOS(),
    isAndroid: DeviceService.isAndroid(),
    isWeb: DeviceService.isWeb(),
    platform: DeviceService.getPlatform(),
    isOnline: navigator.onLine
  });
  
  const [appInfo, setAppInfo] = useState<{
    version?: string;
    build?: string;
  }>({});

  useEffect(() => {
    // Get app info if running on mobile
    if (deviceState.isMobile) {
      App.getInfo().then(info => {
        setAppInfo({
          version: info.version,
          build: info.build
        });
        
        setDeviceState(prev => ({
          ...prev,
          appVersion: info.version,
          appBuild: info.build
        }));
      }).catch(error => {
        console.error('Error getting app info:', error);
      });
    }
    
    // Monitor online/offline status
    const handleOnline = () => {
      setDeviceState(prev => ({ ...prev, isOnline: true }));
    };
    
    const handleOffline = () => {
      setDeviceState(prev => ({ ...prev, isOnline: false }));
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [deviceState.isMobile]);
  
  return deviceState;
}
