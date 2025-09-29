
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { NavigationProvider } from '@/context/NavigationContext';

// Providers wrapper for testing
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vakil-gpt-theme">
        <NavigationProvider>
          {children}
        </NavigationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

// Custom render method that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';
export { screen, fireEvent } from '@testing-library/react';

// Override render method
export { customRender as render };
