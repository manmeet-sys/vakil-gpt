
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Toaster } from 'sonner';
import OptimizedAppLayout from './components/OptimizedAppLayout';

import AdvancedAISearchPage from './pages/advanced-ai-search';
import ContractDraftingPage from './pages/contract-drafting';
import NotFound from './pages/NotFound';
import PdfAnalyzer from './components/PdfAnalyzer';
import { ThemeProvider } from './components/ThemeProvider';
import Index from './pages/Index';
import './App.css';

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vakil-theme">
      <Helmet>
        <title>VakilGPT - AI-Powered Legal Tools</title>
        <meta name="description" content="AI-powered legal assistance for Indian lawyers" />
      </Helmet>
      
      <Toaster position="top-center" />
      
      <Router>
        <Routes>
          <Route path="/" element={<OptimizedAppLayout><Index /></OptimizedAppLayout>} />
          <Route path="/contract-drafting" element={<OptimizedAppLayout><ContractDraftingPage /></OptimizedAppLayout>} />
          <Route path="/advanced-ai-search" element={<OptimizedAppLayout><AdvancedAISearchPage /></OptimizedAppLayout>} />
          <Route path="/legal-document-analyzer" element={<OptimizedAppLayout><PdfAnalyzer /></OptimizedAppLayout>} />
          <Route path="*" element={<OptimizedAppLayout><NotFound /></OptimizedAppLayout>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
