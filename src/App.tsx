
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
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

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/tools" element={<ToolsPage />} />
            
            <Route path="/legal-document-analyzer" element={<LegalDocumentAnalyzerPage />} />
            <Route path="/case-law-research" element={<CaseLawResearchPage />} />
            <Route path="/compliance-assistance" element={<ComplianceAssistancePage />} />
            <Route path="/legal-risk-assessment" element={<LegalRiskAssessmentPage />} />
            <Route path="/legal-due-diligence" element={<LegalDueDiligencePage />} />
            <Route path="/legal-education" element={<LegalEducationPage />} />
            
            {/* Implemented tools */}
            <Route path="/legal-brief-generation" element={<LegalBriefGenerationPage />} />
            <Route path="/statute-tracker" element={<StatuteTrackerPage />} />
            <Route path="/contract-drafting" element={<ContractDraftingPage />} />
            <Route path="/startup-toolkit" element={<StartupToolkitPage />} />
            <Route path="/plea-bargain" element={<PleaBargainPage />} />
            <Route path="/e-signature" element={<ESignaturePage />} />
            <Route path="/gdpr-compliance" element={<GdprCompliancePage />} />
            <Route path="/litigation-prediction" element={<LitigationPredictionPage />} />
            <Route path="/tax-compliance" element={<TaxCompliancePage />} />
            <Route path="/billing-tracking" element={<BillingTrackingPage />} />
            <Route path="/ip-protection" element={<IPProtectionPage />} />
            <Route path="/sentencing-predictor" element={<SentencingPredictorPage />} />
            
            {/* Still using placeholder for remaining tools */}
            <Route path="/court-filing" element={<PlaceholderToolPage />} />
            <Route path="/deadline-management" element={<PlaceholderToolPage />} />
            <Route path="/virtual-assistant" element={<PlaceholderToolPage />} />
            <Route path="/aml-compliance" element={<PlaceholderToolPage />} />
            <Route path="/regulatory-reporting" element={<PlaceholderToolPage />} />
            <Route path="/m&a-due-diligence" element={<PlaceholderToolPage />} />
            <Route path="/financial-obligations" element={<PlaceholderToolPage />} />
            <Route path="/fraud-detector" element={<PlaceholderToolPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
