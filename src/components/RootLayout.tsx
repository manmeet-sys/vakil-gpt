
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useNavigation } from '@/context/NavigationContext';
import AppLayout from './AppLayout';

/**
 * RootLayout component that wraps all routes
 * This component exists inside the Router context and can safely use hooks like useLocation
 */
const RootLayout = () => {
  const location = useLocation();
  const { setCurrentPath } = useNavigation();
  
  // Update the navigation context with the current path
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname, setCurrentPath]);

  return (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <Toaster position="top-center" richColors closeButton />
    </>
  );
};

export default RootLayout;
