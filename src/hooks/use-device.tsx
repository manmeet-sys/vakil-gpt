
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
  connectionType: 'wifi' | 'cellular' | 'none';
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
    isOnline: navigator.onLine,
    connectionType: DeviceService.getNetworkConnectionType()
  });
  
  const [appInfo, setAppInfo] = useState<{
    version?: string;
    build?: string;
  }>({});

  useEffect(() => {
    // Get app info if running on mobile
    if (deviceState.isMobile) {
      const getAppInfo = async () => {
        try {
          const info = await App.getInfo();
          setAppInfo({
            version: info.version,
            build: info.build
          });
          
          setDeviceState(prev => ({
            ...prev,
            appVersion: info.version,
            appBuild: info.build
          }));
        } catch (error) {
          console.error('Error getting app info:', error);
        }
      };
      
      getAppInfo();
    }
    
    // Monitor online/offline status
    const handleOnline = () => {
      setDeviceState(prev => ({ 
        ...prev, 
        isOnline: true,
        connectionType: DeviceService.getNetworkConnectionType()
      }));
    };
    
    const handleOffline = () => {
      setDeviceState(prev => ({ 
        ...prev, 
        isOnline: false,
        connectionType: 'none' 
      }));
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connection type periodically (simplified for this example)
    const connectionChecker = setInterval(() => {
      if (navigator.onLine) {
        setDeviceState(prev => ({
          ...prev,
          connectionType: DeviceService.getNetworkConnectionType()
        }));
      }
    }, 30000); // Check every 30 seconds
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(connectionChecker);
    };
  }, [deviceState.isMobile]);
  
  return deviceState;
}
