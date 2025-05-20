
import * as React from "react";
import { useIsMobile } from "./use-mobile";

interface DeviceContextProps {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
}

const DeviceContext = React.createContext<DeviceContextProps>({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isTouch: false,
  isLandscape: true,
  isPortrait: false,
});

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  const [windowWidth, setWindowWidth] = React.useState<number | undefined>(undefined);
  const [orientation, setOrientation] = React.useState<"landscape" | "portrait">("landscape");
  const [isTouch, setIsTouch] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setOrientation(window.innerWidth > window.innerHeight ? "landscape" : "portrait");
    };

    // Check if device has touch capabilities
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
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
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", handleOrientationChange);
        } else {
          window.removeEventListener('resize', handleResize);
        }
      };
    }
    
    return () => window.removeEventListener('resize', handleResize);
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
    isPortrait: orientation === "portrait"
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
