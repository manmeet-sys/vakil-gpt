
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Building, File, FileCheck, Landmark, FilePlus, ShieldCheck, HelpCircle, Save, Clock, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface Draft {
  id: string;
  title: string;
  date: string;
  tab: string;
  entityType: string;
  query: string;
  results: string | null;
}

const StartupToolkitTool: React.FC = () => {
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

  // Load saved drafts on component mount
  useEffect(() => {
    const savedDrafts = localStorage.getItem('startupToolkitDrafts');
    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }
  }, []);

  // Save drafts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('startupToolkitDrafts', JSON.stringify(drafts));
  }, [drafts]);

  const handleSubmit = async () => {
    try {
      setIsGenerating(true);
      setResults(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let simulatedResponse = '';
      
      switch (selectedTab) {
        case 'entity-formation':
          simulatedResponse = `## ${entityType || 'Private Limited Company'} Formation Guide
          
### Key Steps:
1. Obtain Digital Signature Certificate (DSC)
2. Apply for Director Identification Number (DIN)
3. Reserve company name through RUN (Reserve Unique Name) service
4. File SPICe+ form (INC-32) with the Registrar of Companies
5. Obtain Certificate of Incorporation
6. Apply for PAN and TAN
7. Open a current account in the company's name
8. Register for GST if applicable

### Estimated Timeline: 15-20 working days
### Estimated Cost: ₹8,000 - ₹15,000 (government fees) + professional fees

### Post-Incorporation Compliance:
- Appointment of statutory auditor
- Board meeting within 30 days of incorporation
- Preparing and filing financial statements annually`;
          break;
          
        case 'compliance':
          simulatedResponse = `## Startup Compliance Checklist for India
          
### Mandatory Annual Filings:
1. Annual Return (Form MGT-7) - within 60 days of AGM
2. Financial Statements (Form AOC-4) - within 30 days of AGM
3. Income Tax Return - by September 30th
4. GST Returns - Monthly/Quarterly

### Labor Compliances:
- Shop and Establishment Act registration
- Professional Tax registration
- ESI and PF registration (if applicable)
- Sexual Harassment policy implementation

### Industry-Specific Compliances:
- Fintech: RBI regulations, KYC policy
- Healthtech: Clinical Establishments Act, CDSCO approvals
- Edtech: UGC/AICTE guidelines (if applicable)

### Intellectual Property:
- Trademark registration for brand name and logo
- Copyright registration for original content
- Patent registration for inventions (if applicable)`;
          break;
          
        case 'funding':
          simulatedResponse = `## Startup Funding Documentation Guide
          
### Seed Funding / Angel Investment:
1. **Term Sheet** - Outlines the basic terms and conditions
2. **Shareholders' Agreement (SHA)** - Governs shareholders' rights and obligations
3. **Share Subscription Agreement (SSA)** - Details of share issuance
4. **Due Diligence Documents** - Company's legal, financial, and operational records

### Key Legal Considerations:
- **Valuation Methodology** - Usually based on DCF or comparable analysis
- **Liquidation Preference** - Typically 1x for early stages
- **Anti-Dilution Protection** - Broad-based weighted average is standard
- **Board Composition** - Investor representation on the board
- **Founder Vesting** - Usually 4-year vesting with 1-year cliff
- **Reserved Matters** - Key decisions requiring investor approval

### Tax Implications:
- Angel Tax considerations (Section 56(2)(viib) of Income Tax Act)
- Startup India recognition to avail tax benefits
- ESOP taxation for employee stock options`;
          break;
          
        case 'ip-protection':
          simulatedResponse = `## Intellectual Property Protection for Indian Startups
          
### Trademark Protection:
1. Conduct availability search on IP India portal
2. File application under appropriate class (₹4,500 per class)
3. Respond to examination reports (if any)
4. Publication in Trademark Journal
5. Registration certificate (valid for 10 years)

### Copyright Protection:
1. Automatic protection upon creation
2. Register with Copyright Office for evidentiary value
3. Application fee: ₹500-2,000 depending on work type
4. Processing time: 6-12 months

### Patent Protection:
1. File provisional application to secure priority date
2. Complete application within 12 months
3. Publication after 18 months
4. Request for examination
5. Prosecution and grant (3-5 years process)
6. Fees: ₹1,600-8,000 for filing + examination fees

### Trade Secret Protection:
1. Non-Disclosure Agreements (NDAs)
2. Employment contracts with confidentiality clauses
3. Access controls and information security policies
4. Proper documentation of trade secrets`;
          break;
          
        default:
          simulatedResponse = "Please select a category and provide details about your query.";
      }
      
      if (query) {
        simulatedResponse += `\n\n### Specific Response to Your Query:\n${query}\n\nBased on your specific question, we recommend consulting with a qualified legal professional for tailored advice on this matter.`;
      }
      
      setResults(simulatedResponse);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveDraft = () => {
    if (!draftTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your draft.",
        variant: "destructive"
      });
      return;
    }

    const newDraft: Draft = {
      id: Date.now().toString(),
      title: draftTitle,
      date: new Date().toLocaleDateString(),
      tab: selectedTab,
      entityType,
      query,
      results
    };

    setDrafts([...drafts, newDraft]);
    setShowSaveDialog(false);
    setDraftTitle('');

    toast({
      title: "Draft Saved",
      description: "Your draft has been saved successfully."
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
      description: `"${draft.title}" has been loaded successfully.`
    });
  };

  const deleteDraft = (id: string) => {
    setDrafts(drafts.filter(draft => draft.id !== id));
    
    toast({
      title: "Draft Deleted",
      description: "Your draft has been deleted."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-legal-slate">Indian Startup Legal Toolkit</CardTitle>
              <CardDescription>
                Access comprehensive legal resources for startups operating in India, covering entity formation, 
                compliance requirements, funding documentation, and intellectual property protection strategies.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setShowDraftsDialog(true)}
              >
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Saved Drafts</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-6">
              <TabsTrigger value="entity-formation" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline">Entity Formation</span>
                <span className="sm:hidden">Formation</span>
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                <span>Compliance</span>
              </TabsTrigger>
              <TabsTrigger value="funding" className="flex items-center gap-2">
                <Landmark className="h-4 w-4" />
                <span>Funding</span>
              </TabsTrigger>
              <TabsTrigger value="ip-protection" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden sm:inline">IP Protection</span>
                <span className="sm:hidden">IP</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="entity-formation" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Select value={entityType} onValueChange={setEntityType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private-limited">Private Limited Company</SelectItem>
                      <SelectItem value="llp">Limited Liability Partnership (LLP)</SelectItem>
                      <SelectItem value="opc">One Person Company (OPC)</SelectItem>
                      <SelectItem value="partnership">Partnership Firm</SelectItem>
                      <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea 
                  placeholder="Describe your business and ask specific questions about entity formation..." 
                  className="min-h-[120px]"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="compliance" className="space-y-4">
              <div className="grid gap-4">
                <Textarea 
                  placeholder="Ask about specific compliance requirements for your startup in India..." 
                  className="min-h-[120px]"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="funding" className="space-y-4">
              <div className="grid gap-4">
                <Select value={entityType} onValueChange={setEntityType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select funding stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre-seed">Pre-Seed / Angel Investment</SelectItem>
                    <SelectItem value="seed">Seed Funding</SelectItem>
                    <SelectItem value="series-a">Series A</SelectItem>
                    <SelectItem value="series-b">Series B or Later</SelectItem>
                    <SelectItem value="convertible">Convertible Notes</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea 
                  placeholder="Ask about funding documents, term sheets, or investor agreements..." 
                  className="min-h-[120px]"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="ip-protection" className="space-y-4">
              <div className="grid gap-4">
                <Select value={entityType} onValueChange={setEntityType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select IP type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trademark">Trademark</SelectItem>
                    <SelectItem value="copyright">Copyright</SelectItem>
                    <SelectItem value="patent">Patent</SelectItem>
                    <SelectItem value="trade-secret">Trade Secret</SelectItem>
                    <SelectItem value="design">Industrial Design</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea 
                  placeholder="Ask about protecting your intellectual property in India..." 
                  className="min-h-[120px]"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex gap-2">
            <Button 
              onClick={handleSubmit} 
              className="flex-1 bg-legal-accent hover:bg-legal-accent/90"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Get Legal Guidance"}
            </Button>
            {(query || results) && (
              <Button
                variant="outline"
                onClick={() => setShowSaveDialog(true)}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save Draft</span>
                <span className="sm:hidden">Save</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FilePlus className="h-5 w-5 text-legal-accent" />
                Legal Resource
              </CardTitle>
              <CardDescription>
                Generated information based on your query
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm font-sans">{results}</pre>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <HelpCircle className="h-4 w-4 mr-1" />
                This is general information, not legal advice.
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                toast({
                  title: "Resource Saved",
                  description: "Legal resource has been saved to your documents."
                });
              }}>
                Save Resource
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {/* Save Draft Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Draft</DialogTitle>
            <DialogDescription>
              Give your draft a title to save it for later reference.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter a title for your draft"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
            <Button onClick={saveDraft}>Save Draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drafts List Dialog */}
      <Dialog open={showDraftsDialog} onOpenChange={setShowDraftsDialog}>
        <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Saved Drafts</DialogTitle>
            <DialogDescription>
              View and manage your saved drafts
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {drafts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No saved drafts yet.</p>
            ) : (
              <div className="space-y-3">
                {drafts.map((draft) => (
                  <Card key={draft.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{draft.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {draft.date} • {draft.tab.replace('-', ' ')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteDraft(draft.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => loadDraft(draft)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StartupToolkitTool;

