
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

// Import missing page components or use PlaceholderToolPage instead
import { default as LegalBriefGenerationPage } from "./pages/placeholder-tool";
import { default as StatuteTrackerPage } from "./pages/placeholder-tool";
import { default as ContractDraftingPage } from "./pages/placeholder-tool";
import { default as GdprCompliancePage } from "./pages/placeholder-tool";
import AMLCompliancePage from "./pages/aml-compliance";
import { default as LitigationPredictionPage } from "./pages/placeholder-tool";
import { default as StartupToolkitPage } from "./pages/placeholder-tool";
import MADueDiligencePage from "./pages/m&a-due-diligence";
import IPProtectionPage from "./pages/ip-protection";
import BillingTrackingPage from "./pages/billing-tracking";
import FinancialObligationsPage from "./pages/financial-obligations";
import FraudDetectorPage from "./pages/fraud-detector";
import { default as ESignaturePage } from "./pages/placeholder-tool";
import PleaBargainPage from "./pages/plea-bargain";
import TaxCompliancePage from "./pages/tax-compliance";
import SentencingPredictorPage from "./pages/sentencing-predictor";
import { default as UserProfilePage } from "./pages/placeholder-tool";
import { default as CourtFilingPage } from "./pages/court-filing";
import { default as DeadlineManagementPage } from "./pages/deadline-management";

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
                  <StatuteTrackerPage />
                </ProtectedRoute>
              } />
              
              <Route path="/contract-drafting" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <ContractDraftingPage />
                </ProtectedRoute>
              } />
              
              <Route path="/compliance-assistance" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <ComplianceAssistancePage />
                </ProtectedRoute>
              } />
              
              <Route path="/gdpr-compliance" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <GdprCompliancePage />
                </ProtectedRoute>
              } />
              
              <Route path="/aml-compliance" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <AMLCompliancePage />
                </ProtectedRoute>
              } />
              
              <Route path="/legal-risk-assessment" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <LegalRiskAssessmentPage />
                </ProtectedRoute>
              } />
              
              <Route path="/litigation-prediction" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <LitigationPredictionPage />
                </ProtectedRoute>
              } />
              
              <Route path="/legal-due-diligence" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <LegalDueDiligencePage />
                </ProtectedRoute>
              } />
              
              <Route path="/startup-toolkit" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <StartupToolkitPage />
                </ProtectedRoute>
              } />
              
              <Route path="/m&a-due-diligence" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <MADueDiligencePage />
                </ProtectedRoute>
              } />
              
              <Route path="/ip-protection" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <IPProtectionPage />
                </ProtectedRoute>
              } />
              
              <Route path="/billing-tracking" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <BillingTrackingPage />
                </ProtectedRoute>
              } />
              
              <Route path="/financial-obligations" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <FinancialObligationsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/fraud-detector" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <FraudDetectorPage />
                </ProtectedRoute>
              } />
              
              <Route path="/legal-education" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <LegalEducationPage />
                </ProtectedRoute>
              } />
              
              <Route path="/e-signature" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <ESignaturePage />
                </ProtectedRoute>
              } />
              
              <Route path="/plea-bargain" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <PleaBargainPage />
                </ProtectedRoute>
              } />
              
              <Route path="/tax-compliance" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <TaxCompliancePage />
                </ProtectedRoute>
              } />
              
              <Route path="/sentencing-predictor" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <SentencingPredictorPage />
                </ProtectedRoute>
              } />
              
              {/* New tool pages */}
              <Route path="/user-profile" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <UserProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="/court-filing" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <CourtFilingPage />
                </ProtectedRoute>
              } />
              
              <Route path="/deadline-management" element={
                <ProtectedRoute useMockAuth={useMockAuth}>
                  <DeadlineManagementPage />
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
