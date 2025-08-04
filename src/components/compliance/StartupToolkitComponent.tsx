import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Briefcase, Loader2, Download, Save, FolderOpen, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface Draft {
  id: string;
  title: string;
  date: string;
  tab: string;
  entityType: string;
  query: string;
  results: string | null;
}

const StartupToolkitComponent = () => {
  const [selectedTab, setSelectedTab] = useState('entity-formation');
  const [query, setQuery] = useState('');
  const [entityType, setEntityType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftTitle, setDraftTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDraftsDialog, setShowDraftsDialog] = useState(false);

  const { toast } = useToast();

  // Load saved drafts from localStorage on component mount
  useEffect(() => {
    const savedDrafts = localStorage.getItem('startup-toolkit-drafts');
    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }
  }, []);

  // Save drafts to localStorage whenever drafts change
  useEffect(() => {
    localStorage.setItem('startup-toolkit-drafts', JSON.stringify(drafts));
  }, [drafts]);

  const handleSubmit = async () => {
    if (!query.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter your legal question or requirement.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      let response = "";
      switch (selectedTab) {
        case 'entity-formation':
          response = generateEntityFormationResponse();
          break;
        case 'compliance':
          response = generateComplianceResponse();
          break;
        case 'funding':
          response = generateFundingResponse();
          break;
        case 'ip-protection':
          response = generateIPResponse();
          break;
        default:
          response = "General startup legal guidance response.";
      }

      setResults(response);
      toast({
        title: "Legal Guidance Generated",
        description: "Your startup legal guidance is ready."
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating the legal guidance.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateEntityFormationResponse = () => {
    return `# Entity Formation Guidance for Indian Startups

## Recommended Entity Structure: ${entityType || 'Private Limited Company'}

### Key Advantages:
- Limited liability protection for founders
- Easier to raise funding from investors
- Professional credibility and trust
- Perpetual succession
- Transferable shares

### Formation Process:
1. **Name Reservation**: Apply for name availability through MCA portal
2. **Digital Signature Certificate (DSC)**: Obtain DSC for all directors
3. **Director Identification Number (DIN)**: Apply for DIN for all directors
4. **Incorporation Documents**: Prepare and file incorporation documents
5. **Certificate of Incorporation**: Receive from ROC

### Required Documents:
- PAN cards of all directors and shareholders
- Address proof of registered office
- Rental agreement or ownership documents
- Memorandum and Articles of Association
- Declaration by directors

### Compliance Requirements:
- Annual filing of financial statements
- Board meetings and resolutions
- Maintenance of statutory registers
- ROC compliance and filings

### Estimated Costs:
- Government fees: ₹4,000 - ₹8,000
- Professional fees: ₹10,000 - ₹25,000
- Total estimated cost: ₹15,000 - ₹35,000

### Timeline: 10-15 working days

For specific guidance based on your startup's unique requirements, consult with a qualified company secretary or corporate lawyer.`;
  };

  const generateComplianceResponse = () => {
    return `# Startup Compliance Framework for India

## Essential Compliance Areas:

### 1. Corporate Compliance
- **Companies Act 2013** compliance
- Board meeting requirements (minimum 4 per year)
- Annual General Meeting (AGM) within 6 months of financial year end
- Filing of annual returns (Form MGT-7)
- Financial statement filing (Form AOC-4)

### 2. Tax Compliance
- **GST Registration** (if turnover > ₹20 lakhs for services/₹40 lakhs for goods)
- **Income Tax** returns and advance tax payments
- **TDS compliance** for employee salaries and vendor payments
- **Professional Tax** registration (state-specific)

### 3. Labor Law Compliance
- **Provident Fund (PF)** registration (if employees > 20)
- **Employee State Insurance (ESI)** (if employees > 10)
- **Shops and Establishment** Act registration
- **Contract Labor Act** compliance (if using contractors)

### 4. Industry-Specific Compliance
- **FEMA compliance** for foreign investments
- **RBI regulations** for fintech startups
- **SEBI regulations** for investment platforms
- **Data protection** compliance (upcoming DPDP Act)

### 5. Intellectual Property
- **Trademark registration** for brand protection
- **Copyright protection** for creative works
- **Patent filing** for innovative products/processes

### Compliance Calendar:
- Monthly: GST returns, TDS returns
- Quarterly: Income tax advance tax, PF/ESI returns
- Annual: Income tax returns, ROC filings, audit compliance

### Recommended Tools:
- Company secretary services for ROC compliance
- CA services for tax compliance
- HR compliance software for labor law compliance
- Legal advisory for ongoing compliance monitoring`;
  };

  const generateFundingResponse = () => {
    return `# Startup Funding Guidance for India

## Funding Stages and Options:

### 1. Pre-Seed/Bootstrap Stage
- **Personal savings** and founder contributions
- **Friends and Family** funding
- **Crowdfunding** platforms (Ketto, Wishberry)
- **Government grants** and schemes

### 2. Seed Stage
- **Angel investors** and angel networks
- **Seed funds** and micro VCs
- **Incubators and accelerators**
- **Government seed funding** schemes

### 3. Series A and Beyond
- **Venture Capital** firms
- **Private Equity** investors
- **Strategic investors**
- **Debt financing** options

## Key Legal Considerations:

### Documentation Required:
- **Pitch deck** and business plan
- **Financial projections** and models
- **Due diligence** documents
- **Term sheet** negotiations
- **Shareholders agreement**
- **Investment agreement**

### Valuation Methods:
- Discounted Cash Flow (DCF)
- Comparable company analysis
- Precedent transaction analysis
- Risk-adjusted return expectations

### FEMA Compliance:
- **Automatic route** vs government approval
- **Sectoral caps** and restrictions
- **Pricing guidelines** for share valuation
- **Reporting requirements** to RBI

### Exit Strategy Planning:
- IPO readiness requirements
- Strategic acquisition preparation
- Buyback provisions
- Drag-along and tag-along rights

### Tax Implications:
- **Capital gains** treatment for investors
- **Employee stock option** plans (ESOPs)
- **Angel tax** considerations
- **Section 56(2)(viib)** compliance

Consult with a securities lawyer and chartered accountant for specific funding documentation and compliance requirements.`;
  };

  const generateIPResponse = () => {
    return `# Intellectual Property Protection for Indian Startups

## Types of IP Protection:

### 1. Trademarks
- **Protection**: Brand names, logos, taglines
- **Duration**: 10 years (renewable)
- **Process**: Search → Apply → Examination → Registration
- **Cost**: ₹4,500 - ₹9,000 per class

### 2. Copyrights
- **Protection**: Original creative works (software, content)
- **Duration**: Lifetime + 60 years
- **Process**: Automatic upon creation, registration optional
- **Cost**: ₹500 - ₹2,000

### 3. Patents
- **Protection**: Inventions and innovative processes
- **Duration**: 20 years
- **Process**: Search → Draft → File → Examination → Grant
- **Cost**: ₹8,000 - ₹1,60,000 (depending on entity size)

### 4. Trade Secrets
- **Protection**: Confidential business information
- **Duration**: Indefinite (while secret)
- **Process**: Internal policies and NDAs

## IP Strategy for Startups:

### Immediate Actions:
1. **Domain name** registration and social media handles
2. **Trademark search** and application filing
3. **Copyright** registration for key creative assets
4. **Non-disclosure agreements** (NDAs) with employees/partners

### Documentation:
- **IP assignment** agreements with employees
- **Work for hire** agreements with contractors
- **Invention disclosure** processes
- **IP licensing** agreements

### International Protection:
- **Madrid Protocol** for international trademarks
- **PCT filing** for international patents
- **Berne Convention** for copyright protection

### IP Monetization:
- **Licensing** strategies
- **IP as collateral** for funding
- **IP valuation** for business transactions

### Common Mistakes:
- Delaying trademark registration
- Not securing IP assignments from co-founders
- Inadequate trade secret protection
- Ignoring competitor IP landscape

Budget 2-5% of funding for IP protection and management in early stages.`;
  };

  const saveDraft = () => {
    if (!draftTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your draft.",
        variant: "destructive"
      });
      return;
    }

    const newDraft: Draft = {
      id: Date.now().toString(),
      title: draftTitle,
      date: new Date().toISOString(),
      tab: selectedTab,
      entityType,
      query,
      results
    };

    setDrafts(prev => [newDraft, ...prev]);
    setShowSaveDialog(false);
    setDraftTitle('');
    
    toast({
      title: "Draft Saved",
      description: "Your legal guidance has been saved to drafts."
    });
  };

  const loadDraft = (draft: Draft) => {
    setSelectedTab(draft.tab);
    setEntityType(draft.entityType);
    setQuery(draft.query);
    setResults(draft.results);
    setShowDraftsDialog(false);

    toast({
      title: "Draft Loaded",
      description: "Your saved draft has been loaded."
    });
  };

  const deleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Draft Deleted",
      description: "The draft has been removed."
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
              <Briefcase className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Indian Startup Legal Toolkit</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Comprehensive legal guidance for startups in India covering entity formation, compliance, funding, and IP protection.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Startup Legal Assistant</span>
            <div className="flex gap-2">
              <Dialog open={showDraftsDialog} onOpenChange={setShowDraftsDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Saved Drafts ({drafts.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Saved Drafts</DialogTitle>
                    <DialogDescription>
                      Load or delete your saved legal guidance drafts
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    {drafts.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No saved drafts</p>
                    ) : (
                      drafts.map((draft) => (
                        <div key={draft.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{draft.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(draft.date).toLocaleDateString()} • {draft.tab}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => loadDraft(draft)}>Load</Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => deleteDraft(draft.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {results && (
                <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Draft</DialogTitle>
                      <DialogDescription>
                        Enter a title for your legal guidance draft
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="draft-title">Draft Title</Label>
                        <Input
                          id="draft-title"
                          placeholder="e.g., Private Limited Company Formation Guide"
                          value={draftTitle}
                          onChange={(e) => setDraftTitle(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={saveDraft}>Save Draft</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            Get AI-powered legal guidance for your startup journey in India
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="entity-formation">Entity Formation</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="funding">Funding</TabsTrigger>
              <TabsTrigger value="ip-protection">IP Protection</TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              {selectedTab === 'entity-formation' && (
                <div>
                  <Label htmlFor="entity-type">Preferred Entity Type</Label>
                  <Select value={entityType} onValueChange={setEntityType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private-limited">Private Limited Company</SelectItem>
                      <SelectItem value="llp">Limited Liability Partnership (LLP)</SelectItem>
                      <SelectItem value="partnership">Partnership Firm</SelectItem>
                      <SelectItem value="proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="section8">Section 8 Company (Non-Profit)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="query">Legal Question or Requirement</Label>
                <Textarea
                  id="query"
                  placeholder={`Ask your ${selectedTab.replace('-', ' ')} related legal question here...`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <Button onClick={handleSubmit} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Legal Guidance...
                  </>
                ) : (
                  <>
                    <Briefcase className="mr-2 h-4 w-4" />
                    Get Legal Guidance
                  </>
                )}
              </Button>
            </div>
          </Tabs>

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Legal Guidance</CardTitle>
                  <CardDescription>
                    AI-generated legal guidance for Indian startups
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">{results}</pre>
                  </div>
                  
                  <div className="flex gap-2 mt-6 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupToolkitComponent;