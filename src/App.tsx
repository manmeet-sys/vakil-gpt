
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'sonner';

// Import your pages
import LegalDocumentDraftingPage from './pages/legal-document-drafting';
import NotFoundPage from './pages/NotFound';
// Import other pages as needed

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vakil-ui-theme">
      <Toaster position="bottom-right" />
      <Router>
        <Routes>
          {/* Main navigation routes */}
          <Route path="/" element={<Navigate to="/legal-document-drafting" replace />} />
          
          {/* Advocate Tool routes */}
          <Route path="/legal-document-drafting" element={<LegalDocumentDraftingPage />} />
          <Route path="/contract-drafting" element={<Navigate to="/legal-document-drafting" replace />} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
