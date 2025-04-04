
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// Get the Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if we're in development and missing a valid key
const isDevelopment = process.env.NODE_ENV !== 'production';
const hasValidKey = PUBLISHABLE_KEY && PUBLISHABLE_KEY.startsWith('pk_') && PUBLISHABLE_KEY !== 'pk_test_placeholder_key';

// In production, we should still enforce having a valid key
if (!hasValidKey && !isDevelopment) {
  throw new Error("Missing or invalid Clerk Publishable Key. Please set the VITE_CLERK_PUBLISHABLE_KEY environment variable.");
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);

// Create a mock auth provider for development when no valid key is present
const MockClerkProvider = ({ children }: { children: React.ReactNode }) => {
  // This is only for development to bypass Clerk's key requirement
  return <>{children}</>;
};

root.render(
  <React.StrictMode>
    {hasValidKey ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      <MockClerkProvider>
        <App useMockAuth={true} />
      </MockClerkProvider>
    )}
  </React.StrictMode>
);
