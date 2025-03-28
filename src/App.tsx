
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
            <Route path="/legal-document-analyzer" element={<LegalDocumentAnalyzerPage />} />
            <Route path="/case-law-research" element={<CaseLawResearchPage />} />
            <Route path="/compliance-assistance" element={<ComplianceAssistancePage />} />
            <Route path="/legal-risk-assessment" element={<LegalRiskAssessmentPage />} />
            <Route path="/legal-due-diligence" element={<LegalDueDiligencePage />} />
            <Route path="/legal-education" element={<LegalEducationPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
