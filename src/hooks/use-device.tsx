
import * as React from "react";
import { useIsMobile } from "./use-mobile";

interface DeviceContextProps {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  platform: 'web' | 'android' | 'ios' | 'unknown';
  isOnline: boolean;
}

const DeviceContext = React.createContext<DeviceContextProps>({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isTouch: false,
  isLandscape: true,
  isPortrait: false,
  platform: 'web',
  isOnline: true,
});

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  const [windowWidth, setWindowWidth] = React.useState<number | undefined>(undefined);
  const [orientation, setOrientation] = React.useState<"landscape" | "portrait">("landscape");
  const [isTouch, setIsTouch] = React.useState<boolean>(false);
  const [platform, setPlatform] = React.useState<'web' | 'android' | 'ios' | 'unknown'>('web');
  const [isOnline, setIsOnline] = React.useState<boolean>(true);
  
  React.useEffect(() => {
    const detectPlatform = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (/android/i.test(userAgent)) {
        return 'android';
      } else if (/iphone|ipad|ipod/i.test(userAgent)) {
        return 'ios';
      } else {
        return 'web';
      }
    };

    setPlatform(detectPlatform());
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setOrientation(window.innerWidth > window.innerHeight ? "landscape" : "portrait");
    };

    // Check if device has touch capabilities
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    // Check online status
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    handleOnlineStatus();
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Handle orientation change on mobile devices
    if (typeof window.matchMedia === 'function') {
      const mediaQuery = window.matchMedia("(orientation: portrait)");
      
      const handleOrientationChange = (e: MediaQueryListEvent) => {
        setOrientation(e.matches ? "portrait" : "landscape");
      };
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleOrientationChange);
      } else {
        // Fallback for older browsers
        window.addEventListener('resize', handleResize);
      }
      
      return () => {
        window.removeEventListener('online', handleOnlineStatus);
        window.removeEventListener('offline', handleOnlineStatus);
        
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", handleOrientationChange);
        } else {
          window.removeEventListener('resize', handleResize);
        }
        window.removeEventListener('resize', handleResize);
      };
    }
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Device type detection
  const isTablet = windowWidth !== undefined && windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth !== undefined && windowWidth >= 1024;
  
  const value = {
    isMobile,
    isTablet,
    isDesktop,
    isTouch,
    isLandscape: orientation === "landscape",
    isPortrait: orientation === "portrait",
    platform,
    isOnline
  };
  
  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
};

export function useDevice(): DeviceContextProps {
  const context = React.useContext(DeviceContext);
  return context;
}
