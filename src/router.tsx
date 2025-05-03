
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import RootLayout from './components/RootLayout';
import NotFound from './pages/NotFound';

// Import pages
import Index from './pages/Index';
import Tools from './pages/tools/index';
import EnhancedLegalCalculator from './components/EnhancedLegalCalculator';
import PracticeAreasPage from './pages/practice-areas/index';

// Create router with all routes
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <AppLayout><NotFound /></AppLayout>,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: 'tools',
        element: <Tools />
      },
      {
        path: 'legal-calculator',
        element: <EnhancedLegalCalculator />
      },
      {
        path: 'legal-document-drafting',
        element: <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Legal Document Drafting</h1>
          <p className="text-muted-foreground mb-4">Draft legal documents with ease using our AI-powered tools.</p>
          <div className="p-8 border rounded-lg bg-muted/20">
            <p className="text-center text-muted-foreground">Tool content is being loaded...</p>
          </div>
        </div>
      },
      {
        path: 'chat',
        element: <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Legal Chat</h1>
          <p className="text-muted-foreground mb-4">Chat with our AI legal assistant.</p>
          <div className="p-8 border rounded-lg bg-muted/20">
            <p className="text-center text-muted-foreground">Chat interface is loading...</p>
          </div>
        </div>
      },
      {
        path: 'knowledge',
        element: <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Knowledge Base</h1>
          <p className="text-muted-foreground mb-4">Access legal knowledge and resources.</p>
          <div className="p-8 border rounded-lg bg-muted/20">
            <p className="text-center text-muted-foreground">Knowledge base is loading...</p>
          </div>
        </div>
      },
      {
        path: 'practice-areas/*',
        element: <PracticeAreasPage />
      }
    ]
  }
]);
