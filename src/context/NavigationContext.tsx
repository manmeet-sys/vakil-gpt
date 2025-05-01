
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { mainNavigationItems, resourceNavigationItems } from '@/components/navigation/NavigationItems';
import type { NavigationItem, ResourceNavigationItem } from '@/components/navigation/NavigationItems';

interface NavigationContextType {
  mainItems: NavigationItem[];
  resourceItems: ResourceNavigationItem[];
  currentPath: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Update current path when location changes
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  // Get navigation items with current status applied
  const items = mainNavigationItems(currentPath);

  return (
    <NavigationContext.Provider 
      value={{ 
        mainItems: items, 
        resourceItems: resourceNavigationItems, 
        currentPath,
        isMobileMenuOpen,
        setIsMobileMenuOpen
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
