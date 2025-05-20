
import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { NavigationProvider } from '@/context/NavigationContext';

interface ContextProviderFallbackProps {
  children: React.ReactNode;
}

/**
 * A wrapper component that provides context fallbacks when components 
 * are used outside their normal provider hierarchy
 */
const ContextProviderFallback: React.FC<ContextProviderFallbackProps> = ({ children }) => {
  // This component ensures that any component using our custom hooks
  // will have access to the required providers even if they're used
  // outside the normal app hierarchy (like in storybook or tests)
  return (
    <AuthProvider>
      <NavigationProvider>
        {children}
      </NavigationProvider>
    </AuthProvider>
  );
};

export default ContextProviderFallback;
