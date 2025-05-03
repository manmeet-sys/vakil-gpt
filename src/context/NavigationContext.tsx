
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { mainNavigationItems, resourceNavigationItems } from '@/components/navigation/NavigationItems';
import { useIsMobile } from '@/hooks/use-mobile';
import type { NavigationItem, ResourceNavigationItem } from '@/components/navigation/NavigationItems';

interface NavigationContextType {
  mainItems: NavigationItem[];
  resourceItems: ResourceNavigationItem[];
  currentPath: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isMobile: boolean;
  setCurrentPath: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  // Initialize with a default path instead of using useLocation immediately
  const [currentPath, setCurrentPath] = useState('/');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Try to use useLocation only if we're inside a Router context
  try {
    const location = useLocation();
    
    // Update currentPath when location changes
    useEffect(() => {
      setCurrentPath(location.pathname);
      setIsMobileMenuOpen(false);
    }, [location.pathname]);
  } catch (error) {
    // If useLocation fails, we're outside the Router context
    // This is expected during the initial render
    console.log("NavigationProvider: Router context not available yet");
  }
  
  // Close mobile menu when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  // Get navigation items with current status applied
  const items = mainNavigationItems(currentPath);

  return (
    <NavigationContext.Provider 
      value={{ 
        mainItems: items, 
        resourceItems: resourceNavigationItems, 
        currentPath,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isMobile,
        setCurrentPath
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  
  return context;
}
