
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

// Implemented tool pages
import LegalBriefGenerationPage from "./pages/legal-brief-generation";
import StatuteTrackerPage from "./pages/statute-tracker";
import ContractDraftingPage from "./pages/contract-drafting";
import StartupToolkitPage from "./pages/startup-toolkit";
import PleaBargainPage from "./pages/plea-bargain";
import ESignaturePage from "./pages/e-signature";
import GdprCompliancePage from "./pages/gdpr-compliance";
import LitigationPredictionPage from "./pages/litigation-prediction";
import TaxCompliancePage from "./pages/tax-compliance";
import BillingTrackingPage from "./pages/billing-tracking";
import IPProtectionPage from "./pages/ip-protection";
import SentencingPredictorPage from "./pages/sentencing-predictor";
import AMLCompliancePage from "./pages/aml-compliance";
import MADueDiligencePage from "./pages/m&a-due-diligence";
import FinancialObligationsPage from "./pages/financial-obligations";
import FraudDetectorPage from "./pages/fraud-detector";

// New tools added
import UserProfilePage from "./pages/user-profile";
import CourtFilingPage from "./pages/court-filing";
import DeadlineManagementPage from "./pages/deadline-management";

import NotFound from "./pages/NotFound";

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
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    // You might want to show a loading state here
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
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
                <ProtectedRoute>
                  <ToolsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/chat" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />
              
              <Route path="/legal-document-analyzer" element={
                <ProtectedRoute>
                  <LegalDocumentAnalyzerPage />
                </ProtectedRoute>
              } />
              
              <Route path="/legal-brief-generation" element={
                <ProtectedRoute>
                  <LegalBriefGenerationPage />
                </ProtectedRoute>
              } />
              
              <Route path="/knowledge" element={
                <ProtectedRoute>
                  <KnowledgePage />
                </ProtectedRoute>
              } />
              
              <Route path="/case-law-research" element={
                <ProtectedRoute>
                  <CaseLawResearchPage />
                </ProtectedRoute>
              } />
              
              <Route path="/statute-tracker" element={
                <ProtectedRoute>
                  <StatuteTrackerPage />
                </ProtectedRoute>
              } />
              
              <Route path="/contract-drafting" element={
                <ProtectedRoute>
                  <ContractDraftingPage />
                </ProtectedRoute>
              } />
              
              <Route path="/compliance-assistance" element={
                <ProtectedRoute>
                  <ComplianceAssistancePage />
                </ProtectedRoute>
              } />
              
              <Route path="/gdpr-compliance" element={
                <ProtectedRoute>
                  <GdprCompliancePage />
                </ProtectedRoute>
              } />
              
              <Route path="/aml-compliance" element={
                <ProtectedRoute>
                  <AMLCompliancePage />
                </ProtectedRoute>
              } />
              
              <Route path="/legal-risk-assessment" element={
                <ProtectedRoute>
                  <LegalRiskAssessmentPage />
                </ProtectedRoute>
              } />
              
              <Route path="/litigation-prediction" element={
                <ProtectedRoute>
                  <LitigationPredictionPage />
                </ProtectedRoute>
              } />
              
              <Route path="/legal-due-diligence" element={
                <ProtectedRoute>
                  <LegalDueDiligencePage />
                </ProtectedRoute>
              } />
              
              <Route path="/startup-toolkit" element={
                <ProtectedRoute>
                  <StartupToolkitPage />
                </ProtectedRoute>
              } />
              
              <Route path="/m&a-due-diligence" element={
                <ProtectedRoute>
                  <MADueDiligencePage />
                </ProtectedRoute>
              } />
              
              <Route path="/ip-protection" element={
                <ProtectedRoute>
                  <IPProtectionPage />
                </ProtectedRoute>
              } />
              
              <Route path="/billing-tracking" element={
                <ProtectedRoute>
                  <BillingTrackingPage />
                </ProtectedRoute>
              } />
              
              <Route path="/financial-obligations" element={
                <ProtectedRoute>
                  <FinancialObligationsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/fraud-detector" element={
                <ProtectedRoute>
                  <FraudDetectorPage />
                </ProtectedRoute>
              } />
              
              <Route path="/legal-education" element={
                <ProtectedRoute>
                  <LegalEducationPage />
                </ProtectedRoute>
              } />
              
              <Route path="/e-signature" element={
                <ProtectedRoute>
                  <ESignaturePage />
                </ProtectedRoute>
              } />
              
              <Route path="/plea-bargain" element={
                <ProtectedRoute>
                  <PleaBargainPage />
                </ProtectedRoute>
              } />
              
              <Route path="/tax-compliance" element={
                <ProtectedRoute>
                  <TaxCompliancePage />
                </ProtectedRoute>
              } />
              
              <Route path="/sentencing-predictor" element={
                <ProtectedRoute>
                  <SentencingPredictorPage />
                </ProtectedRoute>
              } />
              
              {/* New tool pages */}
              <Route path="/user-profile" element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="/court-filing" element={
                <ProtectedRoute>
                  <CourtFilingPage />
                </ProtectedRoute>
              } />
              
              <Route path="/deadline-management" element={
                <ProtectedRoute>
                  <DeadlineManagementPage />
                </ProtectedRoute>
              } />
              
              <Route path="/virtual-assistant" element={
                <ProtectedRoute>
                  <PlaceholderToolPage />
                </ProtectedRoute>
              } />
              
              <Route path="/regulatory-reporting" element={
                <ProtectedRoute>
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
