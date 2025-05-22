
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import OptimizedAppLayout from './components/OptimizedAppLayout';
import { NavigationProvider } from './context/NavigationContext';
import { AuthProvider } from './context/AuthContext';
import AdvancedAISearchPage from './pages/advanced-ai-search';
import ContractDraftingPage from './pages/contract-drafting';
import NotFound from './pages/NotFound';
import PdfAnalyzer from './components/PdfAnalyzer';
import { ThemeProvider } from './components/ThemeProvider';
import Index from './pages/Index';
import LegalDocumentDraftingPage from './pages/legal-document-drafting';
import ToolsPage from './pages/tools';
import ChatPage from './pages/chat';
import LegalDueDiligencePage from './pages/legal-due-diligence';
import TaxCompliancePage from './pages/tax-compliance';
import SentencingPredictorPage from './pages/sentencing-predictor';
import StartupToolkitPage from './pages/startup-toolkit';
import './App.css';

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="vakil-theme">
        <Helmet>
          <title>VakilGPT - AI-Powered Legal Tools</title>
          <meta name="description" content="AI-powered legal assistance for Indian lawyers" />
        </Helmet>
        
        <Toaster position="top-center" />
        
        <Router>
          <AuthProvider>
            <NavigationProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/contract-drafting" element={<OptimizedAppLayout><ContractDraftingPage /></OptimizedAppLayout>} />
                <Route path="/advanced-ai-search" element={<OptimizedAppLayout><AdvancedAISearchPage /></OptimizedAppLayout>} />
                <Route path="/legal-document-analyzer" element={<OptimizedAppLayout><PdfAnalyzer /></OptimizedAppLayout>} />
                <Route path="/legal-document-drafting" element={<OptimizedAppLayout><LegalDocumentDraftingPage /></OptimizedAppLayout>} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/legal-due-diligence" element={<OptimizedAppLayout><LegalDueDiligencePage /></OptimizedAppLayout>} />
                <Route path="/tax-compliance" element={<TaxCompliancePage />} />
                <Route path="/sentencing-predictor" element={<SentencingPredictorPage />} />
                <Route path="/startup-toolkit" element={<StartupToolkitPage />} />
                <Route path="*" element={<OptimizedAppLayout><NotFound /></OptimizedAppLayout>} />
              </Routes>
            </NavigationProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
