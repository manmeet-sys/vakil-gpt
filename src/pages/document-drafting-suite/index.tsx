import React, { useState } from 'react';
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Wand2, Layers, Scroll, Download, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';
import DocumentTemplateSelector from '@/components/document-drafting/DocumentTemplateSelector';
import PromptBasedGenerator from '@/components/document-drafting/PromptBasedGenerator';

interface ContractDetails {
  contractType: string;
  partyA: string;
  partyAType: string;
  partyB: string;
  partyBType: string;
  jurisdiction: string;
  effectiveDate: string;
  purpose: string;
  keyTerms: string;
}

const DocumentDraftingSuitePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // Template-based drafting state
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [documentText, setDocumentText] = useState('');
  
  // Contract drafting state
  const [contractDetails, setContractDetails] = useState<ContractDetails>({
    contractType: '',
    partyA: '',
    partyAType: '',
    partyB: '',
    partyBType: '',
    jurisdiction: '',
    effectiveDate: '',
    purpose: '',
    keyTerms: ''
  });
  const [draftContract, setDraftContract] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // AI prompt-based generation state
  const [promptText, setPromptText] = useState('');
  const [aiGeneratedDoc, setAiGeneratedDoc] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  
  const [activeTab, setActiveTab] = useState('templates');

  const contractTypes = [
    'Service Agreement',
    'Employment Contract',
    'Sales Agreement',
    'Partnership Agreement',
    'Lease Agreement',
    'Non-Disclosure Agreement',
    'License Agreement',
    'Consulting Agreement',
    'Distribution Agreement',
    'Supply Agreement'
  ];

  const partyTypes = [
    'Individual',
    'Private Limited Company',
    'Public Limited Company',
    'Partnership Firm',
    'Limited Liability Partnership',
    'Sole Proprietorship',
    'Government Entity',
    'Trust',
    'Society',
    'Cooperative Society'
  ];

  const jurisdictions = [
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
    'Gurgaon',
    'Noida'
  ];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    // In a real implementation, this would load the template content
    setDocumentText(`Template ${templateId} loaded. You can now customize this document...`);
  };

  const handleContractInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContractDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateContract = async () => {
    // Validate required fields
    const requiredFields = ['contractType', 'partyA', 'partyB', 'jurisdiction', 'purpose'];
    const missingFields = requiredFields.filter(field => !contractDetails[field as keyof ContractDetails]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const systemPrompt = `You are VakilGPT, an expert in Indian contract law. Generate a comprehensive ${contractDetails.contractType} between ${contractDetails.partyA} (${contractDetails.partyAType}) and ${contractDetails.partyB} (${contractDetails.partyBType}).

Contract Details:
- Type: ${contractDetails.contractType}
- Jurisdiction: ${contractDetails.jurisdiction}
- Effective Date: ${contractDetails.effectiveDate || 'To be filled'}
- Purpose: ${contractDetails.purpose}
- Key Terms: ${contractDetails.keyTerms}

Please create a complete, legally sound contract that includes:
1. Proper title and parties section
2. Recitals and background
3. Definitions section
4. Main operative clauses
5. Payment/consideration terms
6. Representations and warranties
7. Termination clauses
8. Dispute resolution (arbitration clause as per Indian Arbitration Act)
9. Governing law clause (Indian law)
10. Standard boilerplate clauses
11. Signature blocks

Ensure the contract complies with Indian Contract Act 1872 and other relevant Indian laws. Use proper legal language and formatting.`;

      const contractText = await getOpenAIResponse(systemPrompt, {
        model: 'gpt-4o',
        temperature: 0.1,
        maxTokens: 4000
      });

      setDraftContract(contractText);
      toast({
        title: "Contract Generated",
        description: "Your contract has been generated successfully using AI",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "There was an error generating your contract. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiPromptGeneration = async () => {
    if (!promptText.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description of the document you want to generate",
        variant: "destructive"
      });
      return;
    }

    setIsAiGenerating(true);
    try {
      const systemPrompt = `You are VakilGPT, an expert legal document drafter specializing in Indian law. Based on the following prompt, generate a comprehensive legal document that complies with Indian legal standards and practices:

"${promptText}"

Please create a well-structured document that includes:
1. Proper legal formatting and language
2. Relevant clauses and provisions
3. Compliance with applicable Indian laws
4. Professional legal terminology
5. Appropriate signatures and execution blocks
6. Any necessary disclaimers or notices

Ensure the document is practical, legally sound, and ready for review by legal professionals.`;

      const generatedDoc = await getOpenAIResponse(systemPrompt, {
        model: 'gpt-4o',
        temperature: 0.2,
        maxTokens: 3500
      });

      setAiGeneratedDoc(generatedDoc);
      toast({
        title: "Document Generated",
        description: "Your document has been generated successfully using AI",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "There was an error generating your document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const downloadDocument = (content: string, filename: string) => {
    if (!content) {
      toast({
        title: "No Content",
        description: "No document content to download",
        variant: "destructive"
      });
      return;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: `${filename} has been downloaded`,
    });
  };

  const copyToClipboard = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: `${type} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background transition-colors duration-300">
      <header className="border-b border-border py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')} 
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Document Drafting Suite</h1>
          </div>
        </div>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex flex-col items-center py-6 px-4">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              AI-Powered Legal Document Creation
            </h2>
            <p className="text-muted-foreground">
              Create professional legal documents using templates, AI prompts, or custom contract generation
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="contracts" className="flex items-center gap-2">
                <Scroll className="w-4 h-4" />
                Contracts
              </TabsTrigger>
              <TabsTrigger value="ai-generate" className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                AI Generator
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" />
                    Document Templates
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Browse and customize professional legal document templates
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Mock template cards for demonstration */}
                    {[
                      { id: '1', title: 'Service Agreement', category: 'Commercial' },
                      { id: '2', title: 'Employment Contract', category: 'HR' },
                      { id: '3', title: 'NDA Template', category: 'Legal' },
                      { id: '4', title: 'Lease Agreement', category: 'Property' },
                      { id: '5', title: 'Partnership Deed', category: 'Corporate' },
                      { id: '6', title: 'Power of Attorney', category: 'Legal' }
                    ].map((template) => (
                      <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleTemplateSelect(template.id)}>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{template.title}</h3>
                          <p className="text-sm text-muted-foreground">{template.category}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {documentText && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Document Editor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      value={documentText}
                      onChange={(e) => setDocumentText(e.target.value)}
                      className="h-96 resize-none bg-muted border-border font-mono text-sm"
                      placeholder="Your document content will appear here..."
                    />
                  </CardContent>
                  <CardFooter className="flex gap-2 justify-end border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(documentText, 'Document')}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      onClick={() => downloadDocument(documentText, 'legal-document')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="contracts" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scroll className="w-5 h-5 text-primary" />
                    Contract Generator
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Generate customized contracts using AI based on Indian contract law
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contractType">Contract Type</Label>
                      <Select value={contractDetails.contractType} onValueChange={(value) => setContractDetails(prev => ({...prev, contractType: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select contract type" />
                        </SelectTrigger>
                        <SelectContent>
                          {contractTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="jurisdiction">Jurisdiction</Label>
                      <Select value={contractDetails.jurisdiction} onValueChange={(value) => setContractDetails(prev => ({...prev, jurisdiction: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select jurisdiction" />
                        </SelectTrigger>
                        <SelectContent>
                          {jurisdictions.map(jurisdiction => (
                            <SelectItem key={jurisdiction} value={jurisdiction}>{jurisdiction}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="partyA">First Party Name</Label>
                      <Input
                        id="partyA"
                        name="partyA"
                        value={contractDetails.partyA}
                        onChange={handleContractInputChange}
                        placeholder="Enter first party name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="partyAType">First Party Type</Label>
                      <Select value={contractDetails.partyAType} onValueChange={(value) => setContractDetails(prev => ({...prev, partyAType: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select party type" />
                        </SelectTrigger>
                        <SelectContent>
                          {partyTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="partyB">Second Party Name</Label>
                      <Input
                        id="partyB"
                        name="partyB"
                        value={contractDetails.partyB}
                        onChange={handleContractInputChange}
                        placeholder="Enter second party name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="partyBType">Second Party Type</Label>
                      <Select value={contractDetails.partyBType} onValueChange={(value) => setContractDetails(prev => ({...prev, partyBType: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select party type" />
                        </SelectTrigger>
                        <SelectContent>
                          {partyTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="effectiveDate">Effective Date</Label>
                      <Input
                        id="effectiveDate"
                        name="effectiveDate"
                        type="date"
                        value={contractDetails.effectiveDate}
                        onChange={handleContractInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="purpose">Purpose/Objective</Label>
                    <Textarea
                      id="purpose"
                      name="purpose"
                      value={contractDetails.purpose}
                      onChange={handleContractInputChange}
                      placeholder="Describe the purpose and objective of this contract..."
                      className="h-24"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="keyTerms">Key Terms & Conditions</Label>
                    <Textarea
                      id="keyTerms"
                      name="keyTerms"
                      value={contractDetails.keyTerms}
                      onChange={handleContractInputChange}
                      placeholder="Enter key terms, payment details, duration, deliverables, etc..."
                      className="h-32"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={generateContract}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>Generating Contract...</>
                    ) : (
                      <>
                        <Scroll className="mr-2 h-4 w-4" />
                        Generate Contract
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              {draftContract && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Generated Contract</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      value={draftContract}
                      onChange={(e) => setDraftContract(e.target.value)}
                      className="h-96 resize-none bg-muted border-border font-mono text-sm"
                    />
                  </CardContent>
                  <CardFooter className="flex gap-2 justify-end border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(draftContract, 'Contract')}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      onClick={() => downloadDocument(draftContract, `${contractDetails.contractType.toLowerCase().replace(/\s+/g, '-')}-contract`)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Contract
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="ai-generate" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-primary" />
                    AI Document Generator
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Describe any legal document you need and our AI will generate it for you
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">Document Description</Label>
                    <Textarea
                      id="prompt"
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder="e.g., 'Create a non-disclosure agreement for a tech startup hiring freelance developers', 'Draft a rental agreement for a commercial property in Mumbai', 'Generate a partnership deed for a consulting firm'..."
                      className="h-32"
                    />
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Pro Tips:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Be specific about the type of document you need</li>
                      <li>• Include jurisdiction (e.g., "for use in Delhi")</li>
                      <li>• Mention key parties or stakeholders involved</li>
                      <li>• Include any specific terms or requirements</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleAiPromptGeneration}
                    disabled={isAiGenerating}
                    className="w-full"
                  >
                    {isAiGenerating ? (
                      <>Generating Document...</>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Document
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              {aiGeneratedDoc && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>AI Generated Document</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      value={aiGeneratedDoc}
                      onChange={(e) => setAiGeneratedDoc(e.target.value)}
                      className="h-96 resize-none bg-muted border-border font-mono text-sm"
                    />
                  </CardContent>
                  <CardFooter className="flex gap-2 justify-end border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(aiGeneratedDoc, 'Document')}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      onClick={() => downloadDocument(aiGeneratedDoc, 'ai-generated-document')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DocumentDraftingSuitePage;