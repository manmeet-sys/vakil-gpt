import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from './context/AuthContext';
import { BillingProvider } from './context/BillingContext';
import { PracticeAreaToolProvider } from './components/practice-area-tools/PracticeAreaToolContext';
import { Toaster } from 'sonner';

import { UserDataProvider } from './context/UserDataContext';
import { initPerformanceMonitoring, trackNetworkPerformance } from './utils/performance-monitoring';

// Initialize performance monitoring
initPerformanceMonitoring();
trackNetworkPerformance();

function App() {
  return (
    <UserDataProvider>
      <AuthProvider>
        <BillingProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <PracticeAreaToolProvider>
              <RouterProvider router={router} />
              <Toaster position="top-center" richColors closeButton />
            </PracticeAreaToolProvider>
          </ThemeProvider>
        </BillingProvider>
      </AuthProvider>
    </UserDataProvider>
  );
}

export default App;
