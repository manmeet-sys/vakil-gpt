
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import NotFound from './pages/NotFound';

// Import pages
import Index from './pages/Index';
import EnhancedLegalCalculator from './components/EnhancedLegalCalculator';

// Create router with all routes
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout><Index /></AppLayout>,
    errorElement: <AppLayout><NotFound /></AppLayout>,
  },
  {
    path: '/legal-calculator',
    element: <AppLayout><EnhancedLegalCalculator /></AppLayout>,
  },
  {
    path: '/legal-document-drafting',
    element: <AppLayout><div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Legal Document Drafting</h1>
      <p className="text-muted-foreground mb-4">Draft legal documents with ease using our AI-powered tools.</p>
      <div className="p-8 border rounded-lg bg-muted/20">
        <p className="text-center text-muted-foreground">Tool content is being loaded...</p>
      </div>
    </div></AppLayout>,
  }
]);
