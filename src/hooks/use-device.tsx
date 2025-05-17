
import { useState, useEffect } from 'react';
import { DeviceService } from '@/services/device';

// Remove problematic dynamic import and use a more reliable approach
// that won't cause the app to break if @capacitor/app isn't available
const useAppInfo = () => {
  const [appInfo, setAppInfo] = useState<{
    version?: string;
    build?: string;
  }>({});

  useEffect(() => {
    // Only attempt to load app info if running in a native environment
    if (DeviceService.isMobile()) {
      const getAppInfo = async () => {
        try {
          // Use a safer import approach
          const { App } = await import('@capacitor/app').catch(() => ({ App: null }));
          
          if (App) {
            const info = await App.getInfo();
            setAppInfo({
              version: info.version,
              build: info.build
            });
          } else {
            console.info('Capacitor App plugin not available on this platform');
          }
        } catch (error) {
          console.warn('Error getting app info:', error);
          setAppInfo({
            version: 'unknown',
            build: 'unknown'
          });
        }
      };
      
      getAppInfo();
    }
  }, []);

  return appInfo;
};

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
  
  const appInfo = useAppInfo();
  
  useEffect(() => {
    // Update app info when it changes
    if (appInfo.version || appInfo.build) {
      setDeviceState(prev => ({
        ...prev,
        appVersion: appInfo.version,
        appBuild: appInfo.build
      }));
    }
  }, [appInfo]);
  
  useEffect(() => {
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
  }, []);
  
  return deviceState;
}
