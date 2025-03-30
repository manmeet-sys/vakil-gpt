
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

// New implemented tool pages
import LegalBriefGenerationPage from "./pages/legal-brief-generation";
import StatuteTrackerPage from "./pages/statute-tracker";
import ContractDraftingPage from "./pages/contract-drafting";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            
            {/* Still using placeholder for remaining tools */}
            <Route path="/e-signature" element={<PlaceholderToolPage />} />
            <Route path="/gdpr-compliance" element={<PlaceholderToolPage />} />
            <Route path="/litigation-prediction" element={<PlaceholderToolPage />} />
            <Route path="/court-filing" element={<PlaceholderToolPage />} />
            <Route path="/deadline-management" element={<PlaceholderToolPage />} />
            <Route path="/billing-tracking" element={<PlaceholderToolPage />} />
            <Route path="/virtual-assistant" element={<PlaceholderToolPage />} />
            <Route path="/ip-protection" element={<PlaceholderToolPage />} />
            <Route path="/startup-toolkit" element={<PlaceholderToolPage />} />
            <Route path="/sentencing-predictor" element={<PlaceholderToolPage />} />
            <Route path="/plea-bargain" element={<PlaceholderToolPage />} />
            <Route path="/aml-compliance" element={<PlaceholderToolPage />} />
            <Route path="/tax-compliance" element={<PlaceholderToolPage />} />
            <Route path="/regulatory-reporting" element={<PlaceholderToolPage />} />
            <Route path="/m&a-due-diligence" element={<PlaceholderToolPage />} />
            <Route path="/financial-obligations" element={<PlaceholderToolPage />} />
            <Route path="/fraud-detector" element={<PlaceholderToolPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
