
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// Get the publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// For development convenience, we'll create a simple way to bypass Clerk authentication
// when a valid key isn't available
const isDevelopment = import.meta.env.DEV;
const useClerkMock = isDevelopment && (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'pk_test_placeholder_key');

// Simple mock of Clerk's authentication context for development
const MockClerkProvider = ({ children }) => {
  return <>{children}</>;
};

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    {useClerkMock ? (
      // Use the mock provider in development when no valid key is present
      <MockClerkProvider>
        <App />
      </MockClerkProvider>
    ) : (
      // Use the real ClerkProvider when a valid key is available
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    )}
  </React.StrictMode>
);
