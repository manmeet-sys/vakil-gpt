
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// Replace with your actual Clerk publishable key
// For development, we'll provide a fallback value
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder_key';

// In production, we should still enforce having a valid key
if (!PUBLISHABLE_KEY.startsWith('pk_') && process.env.NODE_ENV === 'production') {
  throw new Error("Missing or invalid Clerk Publishable Key. Please set the VITE_CLERK_PUBLISHABLE_KEY environment variable.");
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
