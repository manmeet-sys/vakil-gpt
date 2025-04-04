import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { FileText, CheckCircle, AlertTriangle, Send, User, Building, Tag, FileSearch, FilePlus, FileUp } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PdfFileUpload from '@/components/PdfFileUpload';
import { extractTextFromPdf } from '@/utils/pdfExtraction';

const ContractDraftingPage = () => {
  const [activeTab, setActiveTab] = useState('review');
  const [contractType, setContractType] = useState('');
  const [contractText, setContractText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [partyA, setPartyA] = useState('');
  const [partyAType, setPartyAType] = useState('individual');
  const [partyB, setPartyB] = useState('');
  const [partyBType, setPartyBType] = useState('individual');
  const [jurisdiction, setJurisdiction] = useState('delhi');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [tags, setTags] = useState('');
  const [analysisTab, setAnalysisTab] = useState('risks');
  const [contractPurpose, setContractPurpose] = useState('');
  const [keyTerms, setKeyTerms] = useState('');
  
  const [analysis, setAnalysis] = useState<{
    risks: { issue: string; severity: 'high' | 'medium' | 'low'; description: string }[];
    suggestions: string[];
    score: number;
    parties: { name: string; type: string; concerns: string[] }[];
    indianLawReferences: { section: string; act: string; description: string }[];
  } | null>(null);
  
  const { toast } = useToast();
  
  const handlePdfUpload = async (file) => {
    if (!file) return;
    
    try {
      setIsExtractingPdf(true);
      const extractedText = await extractTextFromPdf(file);
      setContractText(extractedText);
      setPdfFile(file);
      
      toast({
        title: "PDF Extracted",
        description: `Successfully extracted text from ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Failed to extract text from the PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExtractingPdf(false);
    }
  };
  
  const handleAnalyzeContract = async () => {
    if (!contractText) {
      toast({
        title: "Text Required",
        description: "Please enter, paste, or upload a contract for analysis",
        variant: "destructive"
      });
      return;
    }
    
    if (!partyA || !partyB) {
      toast({
        title: "Party Information Required",
        description: "Please enter names for both parties",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      
      setTimeout(() => {
        // This would be replaced with actual AI analysis using Gemini or DeepSeek
        const mockAnalysis = {
          risks: [
            { 
              issue: "Ambiguous Termination Clause", 
              severity: "high" as const, 
              description: "The termination conditions are vaguely defined and may be subject to multiple interpretations under Indian Contract Act."
            },
            { 
              issue: "Missing Liability Cap", 
              severity: "medium" as const, 
              description: "No specified limit on liability which could expose parties to unlimited claims under Indian tort law."
            },
            { 
              issue: "Non-compliance with IT Act", 
              severity: "high" as const, 
              description: "Digital signature provisions do not comply with Indian Information Technology Act, 2000 requirements."
            },
            {
              issue: `${partyA} Disadvantaged in Payment Terms`,
              severity: "medium" as const,
              description: `Payment terms appear to disproportionately favor ${partyB} with extended payment windows against Indian banking norms.`
            }
          ],
          suggestions: [
            "Add specific conditions and notice periods for contract termination as per Indian Contract Act",
            "Include a liability limitation clause capping damages in accordance with Indian judicial precedents",
            "Update digital signature clauses to comply with IT Act, 2000 and Indian Evidence Act",
            "Add force majeure clause referring specifically to Indian scenarios and legal interpretations",
            `Revise payment terms to ensure fairness between ${partyA} and ${partyB} as per RBI guidelines`
          ],
          parties: [
            {
              name: partyA,
              type: partyAType,
              concerns: [
                "Exposure to unlimited liability under Indian law",
                "Unfavorable payment terms against Indian banking norms",
                "Limited termination rights against Indian Contract Act provisions"
              ]
            },
            {
              name: partyB,
              type: partyBType,
              concerns: [
                "Weak confidentiality protections under Indian IT Act",
                "Ambiguous delivery requirements against Indian Sale of Goods Act",
                "Unclear dispute resolution process against Indian Arbitration Act"
              ]
            }
          ],
          indianLawReferences: [
            {
              section: "Section 73-74",
              act: "Indian Contract Act, 1872",
              description: "Provisions regarding liquidated damages and penalty clauses need proper incorporation"
            },
            {
              section: "Section 5",
              act: "Information Technology Act, 2000",
              description: "Digital signature requirements must be updated to comply with legal standards"
            },
            {
              section: "Section 7",
              act: "Arbitration and Conciliation Act, 1996",
              description: "Dispute resolution mechanism should specify Indian arbitration proceedings"
            },
            {
              section: "Section 9",
              act: "Specific Relief Act, 1963",
              description: "Specific performance clauses need better definition under Indian law"
            }
          ],
          score: 74
        };
        
        setAnalysis(mockAnalysis);
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis Complete",
          description: "Contract analysis has been completed successfully",
        });
      }, 2500);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your contract. Please try again.",
        variant: "destructive"
      });
      setIsAnalyzing(false);
    }
  };

  const handleDraftContract = async () => {
    
    if (!contractType || !partyA || !partyB || !jurisdiction) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (contract type, parties, and jurisdiction)",
        variant: "destructive"
      });
      return;
    }
    
    setIsDrafting(true);
    
    try {
      // Simulate API call with a timeout
      setTimeout(() => {
        const today = new Date().toISOString().split('T')[0];
        
        const draftedContract = `THIS AGREEMENT ("Agreement") is made and entered into as of ${effectiveDate || today}, by and between ${partyA || "PARTY A"} ("${partyAType === 'individual' ? 'Individual' : 'Company'}") and ${partyB || "PARTY B"} ("${partyBType === 'individual' ? 'Individual' : 'Company'}").

WHEREAS, ${contractPurpose || "the parties wish to enter into this agreement for mutual benefit"};

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. SCOPE. ${keyTerms || "The parties agree to the following terms and conditions."}

2. TERM AND TERMINATION. This Agreement shall commence on the Effective Date and continue until terminated in accordance with this clause. Either party may terminate this Agreement with thirty (30) days prior written notice to the other party.

3. GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of India, specifically the jurisdiction of ${jurisdiction === 'delhi' ? 'Delhi' : jurisdiction === 'mumbai' ? 'Mumbai, Maharashtra' : jurisdiction === 'bangalore' ? 'Bangalore, Karnataka' : jurisdiction === 'chennai' ? 'Chennai, Tamil Nadu' : jurisdiction === 'kolkata' ? 'Kolkata, West Bengal' : jurisdiction} without regard to its conflict of law principles.

4. DISPUTE RESOLUTION. Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration in India in accordance with the Arbitration and Conciliation Act, 1996 as amended from time to time.

5. DIGITAL SIGNATURES. The Parties acknowledge and agree that this Agreement may be executed by electronic signature, which shall be considered as an original signature for all purposes and shall have the same force and effect as an original signature. The Parties agree that the electronic signatures appearing on this Agreement are intended to authenticate this writing and to have the same force and effect as manual signatures in compliance with the Information Technology Act, 2000.

6. FORCE MAJEURE. Neither Party shall be liable for any failure or delay in performance due to circumstances beyond its reasonable control, including but not limited to acts of God, natural disasters, pandemic, epidemic, or government restrictions.

7. LIABILITY LIMITATION. Notwithstanding anything to the contrary, the maximum aggregate liability of either Party for any and all claims arising out of or related to this Agreement shall not exceed the total amount paid or payable under this Agreement in the twelve (12) months preceding the event giving rise to the claim.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

${partyA || "PARTY A"}
________________________

${partyB || "PARTY B"}
________________________`;
        
        setContractText(draftedContract);
        setIsDrafting(false);
        
        toast({
          title: "Contract Drafted",
          description: "Your contract has been generated according to Indian law. Review and customize as needed.",
        });
      }, 3000);
    } catch (error) {
      toast({
        title: "Drafting Failed",
        description: "There was an error drafting your contract. Please try again.",
        variant: "destructive"
      });
      setIsDrafting(false);
    }
  };
  
  return (
    <LegalToolLayout
      title="Contract Drafting & Review"
      description="AI-powered Indian contract analysis and drafting tool that identifies risks, provides suggestions for improvements, and ensures your contracts follow Indian legal best practices."
      icon={<FileText className="w-6 h-6 text-white" />}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="review" className="flex items-center gap-2">
              <FileSearch className="h-4 w-4" />
              Contract Review
            </TabsTrigger>
            <TabsTrigger value="draft" className="flex items-center gap-2">
              <FilePlus className="h-4 w-4" />
              Contract Drafting
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="review">
            <Card className="bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
              <CardHeader>
                <CardTitle>Contract Review Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contract-type">Contract Type</Label>
                    <Select value={contractType} onValueChange={setContractType}>
                      <SelectTrigger id="contract-type">
                        <SelectValue placeholder="Select contract type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employment">Employment Contract</SelectItem>
                        <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
                        <SelectItem value="service">Service Agreement</SelectItem>
                        <SelectItem value="licensing">Licensing Agreement</SelectItem>
                        <SelectItem value="partnership">Partnership Agreement</SelectItem>
                        <SelectItem value="rental">Rental Agreement</SelectItem>
                        <SelectItem value="sale">Sale Deed</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="jurisdiction">Jurisdiction</Label>
                    <Select value={jurisdiction} onValueChange={setJurisdiction}>
                      <SelectTrigger id="jurisdiction">
                        <SelectValue placeholder="Select jurisdiction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="mumbai">Mumbai, Maharashtra</SelectItem>
                        <SelectItem value="bangalore">Bangalore, Karnataka</SelectItem>
                        <SelectItem value="chennai">Chennai, Tamil Nadu</SelectItem>
                        <SelectItem value="kolkata">Kolkata, West Bengal</SelectItem>
                        <SelectItem value="hyderabad">Hyderabad, Telangana</SelectItem>
                        <SelectItem value="ahmedabad">Ahmedabad, Gujarat</SelectItem>
                        <SelectItem value="pune">Pune, Maharashtra</SelectItem>
                        <SelectItem value="chandigarh">Chandigarh</SelectItem>
                        <SelectItem value="guwahati">Guwahati, Assam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="effective-date">Effective Date</Label>
                    <Input 
                      id="effective-date" 
                      type="date" 
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input 
                      id="tags" 
                      placeholder="e.g., confidential, high-priority" 
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-legal-border dark:border-legal-slate/20">
                  <h3 className="text-lg font-medium mb-3">Party Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3 p-3 rounded-md border border-legal-border dark:border-legal-slate/20">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-5 w-5 text-legal-slate dark:text-white" />
                        <h4 className="font-medium">First Party</h4>
                      </div>
                      
                      <div>
                        <Label htmlFor="party-a-name">Name</Label>
                        <Input 
                          id="party-a-name" 
                          placeholder="Full legal name" 
                          value={partyA}
                          onChange={(e) => setPartyA(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="party-a-type">Type</Label>
                        <Select value={partyAType} onValueChange={setPartyAType}>
                          <SelectTrigger id="party-a-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="corporation">Corporation</SelectItem>
                            <SelectItem value="llp">LLP</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="huf">HUF</SelectItem>
                            <SelectItem value="proprietorship">Proprietorship</SelectItem>
                            <SelectItem value="trust">Trust</SelectItem>
                            <SelectItem value="society">Society</SelectItem>
                            <SelectItem value="government">Government Entity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-3 p-3 rounded-md border border-legal-border dark:border-legal-slate/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-5 w-5 text-legal-slate dark:text-white" />
                        <h4 className="font-medium">Second Party</h4>
                      </div>
                      
                      <div>
                        <Label htmlFor="party-b-name">Name</Label>
                        <Input 
                          id="party-b-name" 
                          placeholder="Full legal name" 
                          value={partyB}
                          onChange={(e) => setPartyB(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="party-b-type">Type</Label>
                        <Select value={partyBType} onValueChange={setPartyBType}>
                          <SelectTrigger id="party-b-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="corporation">Corporation</SelectItem>
                            <SelectItem value="llp">LLP</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="huf">HUF</SelectItem>
                            <SelectItem value="proprietorship">Proprietorship</SelectItem>
                            <SelectItem value="trust">Trust</SelectItem>
                            <SelectItem value="society">Society</SelectItem>
                            <SelectItem value="government">Government Entity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <FileUp className="h-5 w-5 mr-2 text-blue-600" />
                        Upload PDF Contract
                      </h3>
                      <PdfFileUpload
                        onChange={handlePdfUpload}
                        pdfFile={pdfFile}
                      />
                      {isExtractingPdf && (
                        <div className="mt-2 text-sm text-blue-600">
                          Extracting text from PDF...
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="contract-text">Contract Text</Label>
                      <Textarea 
                        id="contract-text" 
                        placeholder="Paste your contract text here or upload a PDF above..." 
                        className="min-h-64"
                        value={contractText}
                        onChange={(e) => setContractText(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
                <Button 
                  onClick={handleAnalyzeContract}
                  disabled={isAnalyzing || isExtractingPdf}
                  className="w-full sm:w-auto"
                >
                  {isAnalyzing ? (
                    <>Analyzing Contract...</>
                  ) : (
                    <>
                      Analyze Contract
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {analysis && (
              
              <div className="space-y-6">
                <Card className="bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span>Contract Risk Assessment</span>
                      <div className="ml-auto flex items-center">
                        <span className="mr-2">Risk Score:</span>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                          analysis.score >= 80 ? 'bg-green-500' : 
                          analysis.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}>
                          {analysis.score}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={analysisTab} onValueChange={setAnalysisTab} className="w-full">
                      <TabsList className="grid grid-cols-3 w-full max-w-md">
                        <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
                        <TabsTrigger value="parties">Party Concerns</TabsTrigger>
                        <TabsTrigger value="indian-law">Indian Law</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="risks" className="space-y-4 mt-6">
                        <h3 className="text-lg font-medium mb-3">Identified Risks</h3>
                        <div className="space-y-3">
                          {analysis.risks.map((risk, index) => (
                            <div key={index} className="p-3 rounded-md border border-legal-border dark:border-legal-slate/20">
                              <div className="flex items-start">
                                <div className={`p-1.5 rounded-full ${
                                  risk.severity === 'high' ? 'bg-red-100 dark:bg-red-900/20' : 
                                  risk.severity === 'medium' ? 'bg-amber-100 dark:bg-amber-900/20' : 
                                  'bg-blue-100 dark:bg-blue-900/20'
                                } mr-3`}>
                                  <AlertTriangle className={`h-4 w-4 ${
                                    risk.severity === 'high' ? 'text-red-600 dark:text-red-400' : 
                                    risk.severity === 'medium' ? 'text-amber-600 dark:text-amber-400' : 
                                    'text-blue-600 dark:text-blue-400'
                                  }`} />
                                </div>
                                <div>
                                  <h4 className="font-medium flex items-center">
                                    {risk.issue}
                                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                      risk.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                                      risk.severity === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}>
                                      {risk.severity.toUpperCase()}
                                    </span>
                                  </h4>
                                  <p className="text-sm text-legal-muted dark:text-gray-400 mt-1">{risk.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <h3 className="text-lg font-medium mb-3 pt-4">Improvement Suggestions</h3>
                        <div className="space-y-2">
                          {analysis.suggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-start">
                              <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/20 mr-3">
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                              <p>{suggestion}</p>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="parties" className="mt-6">
                        <div className="space-y-6">
                          {analysis.parties.map((party, index) => (
                            <div key={index} className="p-4 rounded-md border border-legal-border dark:border-legal-slate/20">
                              <div className="flex items-center gap-2 mb-3">
                                {party.type === 'individual' ? (
                                  <User className="h-5 w-5 text-legal-slate dark:text-white" />
                                ) : (
                                  <Building className="h-5 w-5 text-legal-slate dark:text-white" />
                                )}
                                <h4 className="font-medium text-lg">{party.name}</h4>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                  {party.type.charAt(0).toUpperCase() + party.type.slice(1)}
                                </span>
                              </div>
                              
                              <h5 className="font-medium mb-2">Potential Concerns:</h5>
                              <ul className="space-y-1 list-disc pl-5">
                                {party.concerns.map((concern, idx) => (
                                  <li key={idx} className="text-legal-muted dark:text-gray-400">{concern}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="indian-law" className="mt-6">
                        <h3 className="text-lg font-medium mb-3">Indian Law References</h3>
                        <div className="space-y-3">
                          {analysis.indianLawReferences.map((reference, index) => (
                            <div key={index} className="p-3 rounded-md border border-legal-border dark:border-legal-slate/20">
                              <div className="flex items-start">
                                <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/20 mr-3">
                                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    {reference.section} - {reference.act}
                                  </h4>
                                  <p className="text-sm text-legal-muted dark:text-gray-400 mt-1">
                                    {reference.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
                    <Button 
                      onClick={() => {
                        // In a real implementation, this would generate an improved contract
                        toast({
                          title: "Generating Improved Contract",
                          description: "Your improved contract is being prepared...",
                        });
                        
                        setTimeout(() => {
                          const improvedContract = `THIS AGREEMENT ("Agreement") is made and entered into as of ${effectiveDate || "[DATE]"}, by and between ${partyA || "PARTY A"} ("${partyAType === 'individual' ? 'Individual' : 'Company'}") and ${partyB || "PARTY B"} ("${partyBType === 'individual' ? 'Individual' : 'Company'}").

1. TERMINATION. This Agreement may be terminated by either party upon thirty (30) days written notice to the other party in accordance with Section 39 of the Indian Contract Act, 1872.

2. LIABILITY LIMITATION. Neither party shall be liable to the other for any indirect, special, incidental, or consequential damages arising out of this Agreement, even if advised of the possibility of such damages. The total liability of either party under this Agreement shall not exceed the total amount paid or payable under this Agreement, as permitted under Indian law.

3. FORCE MAJEURE. Neither party shall be liable for any failure or delay in performance due to circumstances beyond its reasonable control, including acts of God, natural disasters, pandemic, epidemic, or government restrictions, in accordance with Indian judicial precedents.

4. PAYMENT TERMS. Payment shall be due within fifteen (15) days of receipt of invoice, complying with applicable RBI guidelines.

5. GOVERNING LAW. This Agreement shall be governed by the laws of India, and specifically the jurisdiction of ${jurisdiction === 'delhi' ? 'Delhi' : jurisdiction === 'mumbai' ? 'Mumbai, Maharashtra' : jurisdiction === 'bangalore' ? 'Bangalore, Karnataka' : jurisdiction === 'chennai' ? 'Chennai, Tamil Nadu' : 'the appropriate Indian jurisdiction'}.

6. DISPUTE RESOLUTION. Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by arbitration in accordance with the Arbitration and Conciliation Act, 1996 of India.

7. DIGITAL SIGNATURES. The parties agree that electronic signatures compliant with the Information Technology Act, 2000 shall be valid and binding.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

${partyA || "PARTY A"}
________________________

${partyB || "PARTY B"}
________________________`;
                          
                          setContractText(improvedContract);
                          
                          toast({
                            title: "Contract Generated",
                            description: "Improved contract has been generated successfully with Indian legal compliance. Review and customize as needed.",
                          });
                        }, 3000);
                      }}
                    >
                      Generate Improved Contract
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="draft">
            <Card className="bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
              <CardHeader>
                <CardTitle>Contract Drafting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="draft-contract-type">Contract Type</Label>
                    <Select value={contractType} onValueChange={setContractType}>
                      <SelectTrigger id="draft-contract-type">
                        <SelectValue placeholder="Select contract type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employment">Employment Contract</SelectItem>
                        <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
                        <SelectItem value="service">Service Agreement</SelectItem>
                        <SelectItem value="licensing">Licensing Agreement</SelectItem>
                        <SelectItem value="partnership">Partnership Agreement</SelectItem>
                        <SelectItem value="rental">Rental Agreement</SelectItem>
                        <SelectItem value="sale">Sale Deed</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="draft-jurisdiction">Jurisdiction</Label>
                    <Select value={jurisdiction} onValueChange={setJurisdiction}>
                      <SelectTrigger id="draft-jurisdiction">
                        <SelectValue placeholder="Select jurisdiction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="mumbai">Mumbai, Maharashtra</SelectItem>
                        <SelectItem value="bangalore">Bangalore, Karnataka</SelectItem>
                        <SelectItem value="chennai">Chennai, Tamil Nadu</SelectItem>
                        <SelectItem value="kolkata">Kolkata, West Bengal</SelectItem>
                        <SelectItem value="hyderabad">Hyderabad, Telangana</SelectItem>
                        <SelectItem value="ahmedabad">Ahmedabad, Gujarat</SelectItem>
                        <SelectItem value="pune">Pune, Maharashtra</SelectItem>
                        <SelectItem value="chandigarh">Chandigarh</SelectItem>
                        <SelectItem value="guwahati">Guwahati, Assam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="draft-effective-date">Effective Date</Label>
                    <Input 
                      id="draft-effective-date" 
                      type="date" 
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="draft-tags">Tags (comma separated)</Label>
                    <Input 
                      id="draft-tags" 
                      placeholder="e.g., confidential, high-priority" 
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-legal-border dark:border-legal-slate/20">
                  <h3 className="text-lg font-medium mb-3">Party Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3 p-3 rounded-md border border-legal-border dark:border-legal-slate/20">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-5 w-5 text-legal-slate dark:text-white" />
                        <h4 className="font-medium">First Party</h4>
                      </div>
                      
                      <div>
                        <Label htmlFor="draft-party-a-name">Name</Label>
                        <Input 
                          id="draft-party-a-name" 
                          placeholder="Full legal name" 
                          value={partyA}
                          onChange={(e) => setPartyA(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="draft-party-a-type">Type</Label>
                        <Select value={partyAT
