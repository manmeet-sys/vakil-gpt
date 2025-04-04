
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HelmetProvider } from 'react-helmet-async';
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

// Auth pages
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tools" element={<ToolsPage />} />
              
              {/* Auth routes */}
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/legal-document-analyzer" element={<LegalDocumentAnalyzerPage />} />
              <Route path="/legal-brief-generation" element={<LegalBriefGenerationPage />} />
              
              <Route path="/knowledge" element={<KnowledgePage />} />
              <Route path="/case-law-research" element={<CaseLawResearchPage />} />
              <Route path="/statute-tracker" element={<StatuteTrackerPage />} />
              
              <Route path="/contract-drafting" element={<ContractDraftingPage />} />
              <Route path="/compliance-assistance" element={<ComplianceAssistancePage />} />
              <Route path="/gdpr-compliance" element={<GdprCompliancePage />} />
              <Route path="/aml-compliance" element={<AMLCompliancePage />} />
              
              <Route path="/legal-risk-assessment" element={<LegalRiskAssessmentPage />} />
              <Route path="/litigation-prediction" element={<LitigationPredictionPage />} />
              <Route path="/legal-due-diligence" element={<LegalDueDiligencePage />} />
              
              <Route path="/startup-toolkit" element={<StartupToolkitPage />} />
              <Route path="/m&a-due-diligence" element={<MADueDiligencePage />} />
              <Route path="/ip-protection" element={<IPProtectionPage />} />
              
              <Route path="/billing-tracking" element={<BillingTrackingPage />} />
              <Route path="/financial-obligations" element={<FinancialObligationsPage />} />
              <Route path="/fraud-detector" element={<FraudDetectorPage />} />
              
              <Route path="/legal-education" element={<LegalEducationPage />} />
              <Route path="/e-signature" element={<ESignaturePage />} />
              <Route path="/plea-bargain" element={<PleaBargainPage />} />
              <Route path="/tax-compliance" element={<TaxCompliancePage />} />
              <Route path="/sentencing-predictor" element={<SentencingPredictorPage />} />
              
              {/* New tool pages */}
              <Route path="/user-profile" element={<UserProfilePage />} />
              <Route path="/court-filing" element={<CourtFilingPage />} />
              <Route path="/deadline-management" element={<DeadlineManagementPage />} />
              
              <Route path="/virtual-assistant" element={<PlaceholderToolPage />} />
              <Route path="/regulatory-reporting" element={<PlaceholderToolPage />} />
              
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
