
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/context/AuthContext";
import { NavigationProvider } from "@/context/NavigationContext";
import { useEffect, lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedRoute from "./components/ProtectedRoute";
import OrientationMessage from "./components/OrientationMessage";
import AnalyticsWrapper from "./components/AnalyticsWrapper";

// Eagerly loaded core components
import NotFound from "./pages/NotFound";

// Lazy loaded components
const Index = lazy(() => import("./pages/Index"));
const ChatPage = lazy(() => import("./pages/chat"));
const KnowledgePage = lazy(() => import("./pages/knowledge"));
const LegalDocumentAnalyzerPage = lazy(() => import("./pages/legal-document-analyzer"));
const CaseLawResearchPage = lazy(() => import("./pages/case-law-research"));
const ComplianceAssistancePage = lazy(() => import("./pages/compliance-assistance"));
const LegalRiskAssessmentPage = lazy(() => import("./pages/legal-risk-assessment"));
const LegalDueDiligencePage = lazy(() => import("./pages/legal-due-diligence"));
const LegalEducationPage = lazy(() => import("./pages/legal-education"));
const ToolsPage = lazy(() => import("./pages/tools"));
const SettingsPage = lazy(() => import("./pages/settings"));
const PlaceholderToolPage = lazy(() => import("./pages/placeholder-tool"));
const PrivacyPolicyPage = lazy(() => import("./pages/privacy-policy"));
const TermsOfServicePage = lazy(() => import("./pages/terms-of-service"));
const PricingPage = lazy(() => import("./pages/pricing"));
const BlogPage = lazy(() => import("./pages/blog"));
const BlogPostPage = lazy(() => import("./pages/blog/post"));
const GuidesPage = lazy(() => import("./pages/guides"));
const GuideDetailPage = lazy(() => import("./pages/guides/guide"));
const FaqPage = lazy(() => import("./pages/faq"));
const AnalyticsDashboard = lazy(() => import("./pages/analytics-dashboard"));

// Auth pages
const SignupPage = lazy(() => import("./pages/signup"));
const LoginPage = lazy(() => import("./pages/login"));
const ResetPasswordPage = lazy(() => import("./pages/reset-password"));

// Implemented tool pages
const LegalBriefGenerationPage = lazy(() => import("./pages/legal-brief-generation"));
const StatuteTrackerPage = lazy(() => import("./pages/statute-tracker"));
const ContractDraftingPage = lazy(() => import("./pages/contract-drafting"));
const StartupToolkitPage = lazy(() => import("./pages/startup-toolkit"));
const PleaBargainPage = lazy(() => import("./pages/plea-bargain"));
const ESignaturePage = lazy(() => import("./pages/e-signature"));
const GdprCompliancePage = lazy(() => import("./pages/gdpr-compliance"));
const LitigationPredictionPage = lazy(() => import("./pages/litigation-prediction"));
const TaxCompliancePage = lazy(() => import("./pages/tax-compliance"));
const BillingTrackingPage = lazy(() => import("./pages/billing-tracking"));
const IPProtectionPage = lazy(() => import("./pages/ip-protection"));
const SentencingPredictorPage = lazy(() => import("./pages/sentencing-predictor"));
const AMLCompliancePage = lazy(() => import("./pages/aml-compliance"));
const MADueDiligencePage = lazy(() => import("./pages/m&a-due-diligence"));
const FinancialObligationsPage = lazy(() => import("./pages/financial-obligations"));
const FraudDetectorPage = lazy(() => import("./pages/fraud-detector"));
const UserProfilePage = lazy(() => import("./pages/user-profile"));
const ProfileEditPage = lazy(() => import("./pages/profile-edit"));
const CourtFilingPage = lazy(() => import("./pages/court-filing"));

// Wallet pages
const TransactionHistory = lazy(() => import("./pages/wallet/transactions"));
const TopUpPage = lazy(() => import("./pages/wallet/topup"));
const DeadlineManagementPage = lazy(() => import("./pages/deadline-management"));
const CaseManagementPage = lazy(() => import("./pages/case-management"));
const LegalDocumentDraftingPage = lazy(() => import("./pages/legal-document-drafting"));
const PracticeAreasPage = lazy(() => import("./pages/practice-areas"));
const CriminalLawPage = lazy(() => import("./pages/criminal-law"));
const CivilLawPage = lazy(() => import("./pages/civil-law"));
const CorporateLawPage = lazy(() => import("./pages/corporate-law"));
const FamilyLawPage = lazy(() => import("./pages/family-law"));
const RealEstateLawPage = lazy(() => import("./pages/real-estate-law"));

// Lazy loaded components for advanced AI features
const AdvancedAIAnalysisPage = lazy(() => 
  import("./pages/advanced-ai-analysis").then(module => {
    console.log("Advanced AI Analysis page loaded");
    return module;
  })
);

// ScrollToTop component to handle scrolling to top on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <div className="w-full max-w-md space-y-4">
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-2/3 rounded-lg" />
      </div>
    </div>
  </div>
);

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
        <ThemeProvider defaultTheme="light" storageKey="vakilgpt-theme">
          <AuthProvider>
            <NavigationProvider>
              <TooltipProvider>
                <AnalyticsWrapper>
                  <ScrollToTop />
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      
                      {/* Blog Routes */}
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/blog/:id" element={<BlogPostPage />} />
                      
                      {/* Guides Routes */}
                      <Route path="/guides" element={<GuidesPage />} />
                      <Route path="/guides/:id" element={<GuideDetailPage />} />
                      
                      <Route path="/faq" element={<FaqPage />} />
                      
                      {/* Auth routes */}
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                      
                      {/* Settings Page */}
                      <Route path="/settings" element={
                        <ProtectedRoute>
                          <SettingsPage />
                        </ProtectedRoute>
                      } />
                      
                      {/* Analytics Dashboard */}
                      <Route path="/analytics-dashboard" element={
                        <ProtectedRoute>
                          <AnalyticsDashboard />
                        </ProtectedRoute>
                      } />
                      
                      {/* Protected routes - wrap all tool pages */}
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
                      
                      <Route path="/knowledge" element={
                        <ProtectedRoute>
                          <KnowledgePage />
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
                      
                      <Route path="/user-profile" element={
                        <ProtectedRoute>
                          <UserProfilePage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/profile-edit" element={
                        <ProtectedRoute>
                          <ProfileEditPage />
                        </ProtectedRoute>
                      } />
                      
                      {/* Wallet Routes */}
                      <Route path="/wallet/transactions" element={
                        <ProtectedRoute>
                          <TransactionHistory />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/wallet/topup" element={
                        <ProtectedRoute>
                          <TopUpPage />
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

                      <Route path="/case-management" element={
                        <ProtectedRoute>
                          <CaseManagementPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/legal-document-drafting" element={
                        <ProtectedRoute>
                          <LegalDocumentDraftingPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/practice-areas" element={<PracticeAreasPage />} />
                      <Route path="/criminal-law" element={<CriminalLawPage />} />
                      <Route path="/civil-law" element={<CivilLawPage />} />
                      <Route path="/corporate-law" element={<CorporateLawPage />} />
                      <Route path="/family-law" element={<FamilyLawPage />} />
                      <Route path="/real-estate-law" element={<RealEstateLawPage />} />
                      
                      {/* Add advanced AI analysis route */}
                      <Route path="/advanced-ai-analysis" element={
                        <ProtectedRoute>
                          <AdvancedAIAnalysisPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                  <Toaster />
                  <Sonner />
                  <OrientationMessage />
                </AnalyticsWrapper>
              </TooltipProvider>
            </NavigationProvider>
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
