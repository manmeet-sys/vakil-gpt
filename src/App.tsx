
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HelmetProvider } from 'react-helmet-async';
import { useAuth, SignedIn, SignedOut } from '@clerk/clerk-react';
import Index from "./pages/Index";
import ChatPage from "./pages/chat";
import KnowledgePage from "./pages/knowledge";
import LegalDocumentAnalyzerPage from "./pages/legal-document-analyzer";
import CaseLawResearchPage from "./pages/case-law-research";
import ComplianceAssistancePage from "./pages/compliance-assistance";
import LegalRiskAssessmentPage from "./pages/legal-risk-assessment";
import LegalDueDiligencePage from "./pages/legal-due-diligence";
import LegalEducationPage from "./pages/legal-education";
import ToolsPage from "./pages/tools";
import PlaceholderToolPage from "./pages/placeholder-tool";
import AuthPage from "./pages/auth";
import SignUpPage from "./pages/auth/sign-up";
import NotFound from "./pages/NotFound";

// Import actual pages or use placeholders
import LegalBriefGenerationPage from "./pages/legal-brief-generation";
import PlaceholderStatuteTracker from "./pages/placeholder-tool";
import PlaceholderContractDrafting from "./pages/placeholder-tool";
import PlaceholderGdprCompliance from "./pages/placeholder-tool";
import PlaceholderAMLCompliance from "./pages/placeholder-tool";
import PlaceholderLitigationPrediction from "./pages/placeholder-tool";
import PlaceholderStartupToolkit from "./pages/placeholder-tool";
import PlaceholderMADueDiligence from "./pages/placeholder-tool";
import PlaceholderIPProtection from "./pages/placeholder-tool";
import PlaceholderBillingTracking from "./pages/placeholder-tool";
import PlaceholderFinancialObligations from "./pages/placeholder-tool";
import PlaceholderFraudDetector from "./pages/placeholder-tool";
import PlaceholderESignature from "./pages/placeholder-tool";
import PlaceholderPleaBargain from "./pages/placeholder-tool";
import PlaceholderTaxCompliance from "./pages/placeholder-tool";
import PlaceholderSentencingPredictor from "./pages/placeholder-tool";
import PlaceholderUserProfile from "./pages/placeholder-tool";
import PlaceholderCourtFiling from "./pages/placeholder-tool";
import PlaceholderDeadlineManagement from "./pages/placeholder-tool";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replacing cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protect routes that require authentication
const ProtectedRoute = ({ children, useMockAuth = false }: { children: React.ReactNode, useMockAuth?: boolean }) => {
  const { isSignedIn, isLoaded } = useAuth();

  // If we're using mock auth, consider the user signed in
  if (useMockAuth) {
    return <>{children}</>;
  }

  if (!isLoaded) {
    // You might want to show a loading state here
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

interface AppProps {
  useMockAuth?: boolean;
}

const App = ({ useMockAuth = false }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/sign-up" element={<SignUpPage />} />
              
              {/* Protected routes */}
              <Route path="/tools" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <ToolsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/chat" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <ChatPage />
                </ProtectedRoute>
              } />
              
              <Route path="/legal-document-analyzer" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <LegalDocumentAnalyzerPage />
                </ProtectedRoute>
              } />
              
              <Route path="/legal-brief-generation" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <LegalBriefGenerationPage />
                </ProtectedRoute>
              } />
              
              <Route path="/knowledge" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <KnowledgePage />
                </ProtectedRoute>
              } />
              
              <Route path="/case-law-research" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <CaseLawResearchPage />
                </ProtectedRoute>
              } />
              
              <Route path="/statute-tracker" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderStatuteTracker />
                </ProtectedRoute>
              } />
              
              <Route path="/contract-drafting" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderContractDrafting />
                </ProtectedRoute>
              } />
              
              <Route path="/compliance-assistance" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <ComplianceAssistancePage />
                </ProtectedRoute>
              } />
              
              <Route path="/gdpr-compliance" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderGdprCompliance />
                </ProtectedRoute>
              } />
              
              <Route path="/aml-compliance" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderAMLCompliance />
                </ProtectedRoute>
              } />
              
              <Route path="/legal-risk-assessment" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <LegalRiskAssessmentPage />
                </ProtectedRoute>
              } />
              
              <Route path="/litigation-prediction" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderLitigationPrediction />
                </ProtectedRoute>
              } />
              
              <Route path="/legal-due-diligence" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <LegalDueDiligencePage />
                </ProtectedRoute>
              } />
              
              <Route path="/startup-toolkit" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderStartupToolkit />
                </ProtectedRoute>
              } />
              
              <Route path="/m&a-due-diligence" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderMADueDiligence />
                </ProtectedRoute>
              } />
              
              <Route path="/ip-protection" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderIPProtection />
                </ProtectedRoute>
              } />
              
              <Route path="/billing-tracking" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderBillingTracking />
                </ProtectedRoute>
              } />
              
              <Route path="/financial-obligations" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderFinancialObligations />
                </ProtectedRoute>
              } />
              
              <Route path="/fraud-detector" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderFraudDetector />
                </ProtectedRoute>
              } />
              
              <Route path="/legal-education" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <LegalEducationPage />
                </ProtectedRoute>
              } />
              
              <Route path="/e-signature" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderESignature />
                </ProtectedRoute>
              } />
              
              <Route path="/plea-bargain" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderPleaBargain />
                </ProtectedRoute>
              } />
              
              <Route path="/tax-compliance" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderTaxCompliance />
                </ProtectedRoute>
              } />
              
              <Route path="/sentencing-predictor" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderSentencingPredictor />
                </ProtectedRoute>
              } />
              
              {/* New tool pages */}
              <Route path="/user-profile" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderUserProfile />
                </ProtectedRoute>
              } />
              
              <Route path="/court-filing" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderCourtFiling />
                </ProtectedRoute>
              } />
              
              <Route path="/deadline-management" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderDeadlineManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/virtual-assistant" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderToolPage />
                </ProtectedRoute>
              } />
              
              <Route path="/regulatory-reporting" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PlaceholderToolPage />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
