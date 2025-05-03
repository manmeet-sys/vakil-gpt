
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'sonner';
import { NavigationProvider } from './context/NavigationContext';

// Import pages for main navigation
import ToolsPage from './pages/tools';
import ChatPage from './pages/chat';
import KnowledgePage from './pages/knowledge';
import PracticeAreasPage from './pages/practice-areas';

// Import advocate tool pages
import LegalDocumentDraftingPage from './pages/legal-document-drafting';
import CaseLawResearchPage from './pages/case-law-research';
import CourtFilingPage from './pages/court-filing';
import AdvancedAIAnalysisPage from './pages/advanced-ai-analysis';

// Import NotFound page
import NotFoundPage from './pages/NotFound';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vakil-ui-theme">
      <Toaster position="bottom-right" />
      <Router>
        <NavigationProvider>
          <Routes>
            {/* Main navigation routes */}
            <Route path="/" element={<Navigate to="/tools" replace />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/practice-areas" element={<PracticeAreasPage />} />
            
            {/* Advocate Tool routes */}
            <Route path="/legal-document-drafting" element={<LegalDocumentDraftingPage />} />
            <Route path="/contract-drafting" element={<Navigate to="/legal-document-drafting" replace />} />
            <Route path="/case-law-research" element={<CaseLawResearchPage />} />
            <Route path="/court-filing" element={<CourtFilingPage />} />
            <Route path="/advanced-ai-analysis" element={<AdvancedAIAnalysisPage />} />
            
            {/* Category-specific routes */}
            <Route path="/civil-law" element={<Navigate to="/practice-areas" replace />} />
            <Route path="/criminal-law" element={<Navigate to="/practice-areas" replace />} />
            <Route path="/corporate-law" element={<Navigate to="/practice-areas" replace />} />
            <Route path="/family-law" element={<Navigate to="/practice-areas" replace />} />
            <Route path="/matrimonial-law" element={<Navigate to="/practice-areas" replace />} />
            <Route path="/real-estate-law" element={<Navigate to="/practice-areas" replace />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </NavigationProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
