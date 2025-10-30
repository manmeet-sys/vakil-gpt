import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Wand2, Loader2, Sparkles, Scale, FileCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";

interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  example: string;
}

const LegalDocumentDraftingPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [briefDescription, setBriefDescription] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState("");
  const { toast } = useToast();

  const documentTemplates: DocumentTemplate[] = [
    // Notices & Correspondence
    { id: "legal-notice", name: "Legal Notice", category: "Notices", description: "Formal legal notice under various laws", example: "Legal notice for recovery of dues, breach of contract, defamation" },
    { id: "demand-letter", name: "Demand Letter", category: "Notices", description: "Formal demand for payment or action", example: "Payment demand, property possession demand" },
    { id: "cease-desist", name: "Cease and Desist", category: "Notices", description: "Notice to stop unlawful activity", example: "Trademark infringement, copyright violation" },
    { id: "eviction-notice", name: "Eviction Notice", category: "Notices", description: "Notice to vacate premises", example: "Tenant eviction, illegal occupation" },
    
    // Affidavits & Declarations
    { id: "affidavit", name: "General Affidavit", category: "Affidavits", description: "Sworn statement of facts", example: "Name change, address proof, income affidavit" },
    { id: "self-declaration", name: "Self Declaration", category: "Affidavits", description: "Personal declaration under oath", example: "Self-employment, residence, character" },
    { id: "undertaking", name: "Undertaking", category: "Affidavits", description: "Written promise or commitment", example: "Court undertaking, business undertaking" },
    
    // Authorization Documents
    { id: "power-of-attorney", name: "Power of Attorney", category: "Authorization", description: "Authority to act on behalf", example: "General POA, Special POA, property matters" },
    { id: "authorization-letter", name: "Authorization Letter", category: "Authorization", description: "Permission to act or collect", example: "Document collection, representation" },
    { id: "consent-letter", name: "Consent Letter", category: "Authorization", description: "Written consent for an action", example: "Travel consent, medical consent" },
    
    // Property Documents
    { id: "sale-deed", name: "Sale Deed", category: "Property", description: "Property sale agreement", example: "Land sale, flat sale, vehicle sale" },
    { id: "gift-deed", name: "Gift Deed", category: "Property", description: "Transfer of property as gift", example: "Property gift to family member" },
    { id: "will-testament", name: "Will/Testament", category: "Property", description: "Testamentary disposition of property", example: "Property distribution after death" },
    { id: "partition-deed", name: "Partition Deed", category: "Property", description: "Division of joint property", example: "Family property partition" },
    
    // Court Documents
    { id: "petition", name: "Petition", category: "Court Documents", description: "Formal request to court", example: "Writ petition, civil petition" },
    { id: "complaint", name: "Complaint/FIR", category: "Court Documents", description: "Criminal or civil complaint", example: "Police complaint, consumer complaint" },
    { id: "reply-notice", name: "Reply to Legal Notice", category: "Court Documents", description: "Response to legal notice", example: "Rebuttal to allegations" },
    { id: "bail-application", name: "Bail Application", category: "Court Documents", description: "Application for bail", example: "Anticipatory bail, regular bail" },
    
    // Business Documents
    { id: "board-resolution", name: "Board Resolution", category: "Business", description: "Company board decision", example: "Director appointment, loan approval" },
    { id: "shareholders-resolution", name: "Shareholders Resolution", category: "Business", description: "Shareholder meeting decision", example: "Capital increase, director removal" },
    { id: "trademark-application", name: "Trademark Application", category: "Business", description: "Trademark registration documents", example: "Brand name, logo registration" },
    
    // Family Law Documents
    { id: "divorce-petition", name: "Divorce Petition", category: "Family Law", description: "Petition for dissolution of marriage", example: "Mutual consent, contested divorce" },
    { id: "maintenance-petition", name: "Maintenance Petition", category: "Family Law", description: "Claim for maintenance", example: "Wife maintenance, child support" },
    { id: "adoption-deed", name: "Adoption Deed", category: "Family Law", description: "Legal adoption document", example: "Child adoption agreement" },
    
    // Employment Documents
    { id: "appointment-letter", name: "Appointment Letter", category: "Employment", description: "Job offer and terms", example: "Employment offer with terms" },
    { id: "resignation-letter", name: "Resignation Letter", category: "Employment", description: "Employment termination by employee", example: "Professional resignation" },
    { id: "termination-letter", name: "Termination Letter", category: "Employment", description: "Employment termination by employer", example: "Employee dismissal notice" },
    
    // Financial Documents
    { id: "promissory-note", name: "Promissory Note", category: "Financial", description: "Promise to pay money", example: "Loan acknowledgment" },
    { id: "guarantee-deed", name: "Guarantee Deed", category: "Financial", description: "Guarantee for payment/performance", example: "Loan guarantee, contract guarantee" },
    { id: "indemnity-bond", name: "Indemnity Bond", category: "Financial", description: "Protection against loss", example: "Security indemnity" },
  ];

  const jurisdictions = [
    { value: "delhi", label: "Delhi High Court" },
    { value: "mumbai", label: "Bombay High Court" },
    { value: "bangalore", label: "Karnataka High Court" },
    { value: "chennai", label: "Madras High Court" },
    { value: "kolkata", label: "Calcutta High Court" },
    { value: "supreme", label: "Supreme Court of India" },
  ];

  const categories = Array.from(new Set(documentTemplates.map(t => t.category)));

  const handleGenerate = async () => {
    if (!selectedTemplate || !briefDescription) {
      toast({
        title: "Missing Information",
        description: "Please select a document type and provide details.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const template = documentTemplates.find(t => t.id === selectedTemplate);
      const jurisdictionName = jurisdictions.find(j => j.value === jurisdiction)?.label || "General Indian Law";
      
      const prompt = `Draft a comprehensive ${template?.name} under ${jurisdictionName} jurisdiction with the following details: ${briefDescription}. 

Ensure the document:
- Follows proper legal format and structure
- Includes all necessary legal provisions and clauses
- Complies with relevant Indian laws and regulations
- Contains proper legal terminology and citations
- Is ready for immediate use with only party details to be filled
- Includes verification/attestation clauses where required
- References applicable acts and sections

Make it detailed, professional, and legally sound.`;

      const { data, error } = await supabase.functions.invoke('enhanced-legal-ai', {
        body: {
          query: prompt,
          legalArea: template?.category || "General",
          jurisdiction: jurisdictionName,
          analysisType: "document_drafting"
        }
      });

      if (error) throw error;

      setGeneratedDocument(data.answer);
      toast({
        title: "Document Generated",
        description: "AI has successfully drafted your legal document.",
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const template = documentTemplates.find(t => t.id === selectedTemplate);
    const file = new Blob([generatedDocument], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${template?.name.replace(/\s+/g, "_")}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded",
      description: "Document has been downloaded successfully.",
    });
  };

  const selectedTemplateObj = documentTemplates.find(t => t.id === selectedTemplate);
  const filteredTemplates = (category: string) => 
    documentTemplates.filter(t => t.category === category);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Legal Document Drafting
          </h1>
          <p className="text-muted-foreground text-lg">
            Generate any Indian legal document with AI. 30+ templates covering all major legal areas - just describe what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  Select Document Type
                </CardTitle>
                <CardDescription>
                  Choose from 30+ legal document templates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue={categories[0]} className="w-full">
                  <TabsList className="grid grid-cols-3 h-auto">
                    {categories.slice(0, 3).map(cat => (
                      <TabsTrigger key={cat} value={cat} className="text-xs">
                        {cat}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {categories.map(category => (
                    <TabsContent key={category} value={category} className="mt-4">
                      <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2">
                        {filteredTemplates(category).map(template => (
                          <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={`text-left p-3 rounded-lg border transition-all ${
                              selectedTemplate === template.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="font-medium text-sm">{template.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {template.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                {selectedTemplateObj && (
                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedTemplateObj.category}</Badge>
                      <span className="font-medium text-sm">{selectedTemplateObj.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Example: {selectedTemplateObj.example}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Document Details
                </CardTitle>
                <CardDescription>
                  Provide brief details - AI handles everything else
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Jurisdiction (Optional)</label>
                  <Select value={jurisdiction} onValueChange={setJurisdiction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      {jurisdictions.map(j => (
                        <SelectItem key={j.value} value={j.value}>
                          {j.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Brief Description *</label>
                  <Textarea
                    placeholder="Example: Legal notice to tenant for non-payment of rent for 3 months (₹30,000/month). Property at Mumbai. Demanding payment within 15 days."
                    value={briefDescription}
                    onChange={(e) => setBriefDescription(e.target.value)}
                    className="min-h-[160px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Just provide key facts - AI will create a complete, legally formatted document with all necessary clauses.
                  </p>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !selectedTemplate}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Drafting Document...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Complete Document
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Generated Document
              </CardTitle>
              <CardDescription>
                AI-drafted legal document ready to use
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedDocument ? (
                <div className="space-y-4">
                  <div className="bg-card border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                      {generatedDocument}
                    </pre>
                  </div>
                  <Button onClick={handleDownload} className="w-full" size="lg">
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                  <div className="text-center space-y-4">
                    <FileText className="h-16 w-16 mx-auto opacity-20" />
                    <div>
                      <p className="font-medium">No document generated yet</p>
                      <p className="text-sm mt-2">Select a template and provide details</p>
                      <p className="text-xs text-muted-foreground mt-4 max-w-md mx-auto">
                        AI will draft a complete, legally sound document with proper formatting, clauses, and citations
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default LegalDocumentDraftingPage;
