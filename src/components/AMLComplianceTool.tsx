
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CircleHelp, Search, Shield, Upload, Loader2, FileText, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getGeminiResponse } from './GeminiProIntegration';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  risk: 'low' | 'medium' | 'high' | 'none';
}

interface ComplianceResult {
  score: number;
  findings: {
    high: Array<{ issue: string; recommendation: string }>;
    medium: Array<{ issue: string; recommendation: string }>;
    low: Array<{ issue: string; recommendation: string }>;
    passed: Array<{ area: string; notes: string }>;
  };
  summary: string;
  nextSteps: string[];
}

const AMLComplianceTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState('customer');
  const [customerData, setCustomerData] = useState({
    entityName: '',
    entityType: '',
    registrationNumber: '',
    registrationCountry: '',
    operatingCountries: '',
    businessDescription: '',
    annualRevenue: '',
    establishedDate: '',
    website: '',
  });
  
  const [beneficialOwners, setBeneficialOwners] = useState([
    { name: '', nationality: '', ownership: '', politicalExposure: 'no', idVerified: false }
  ]);
  
  const [transactionPatterns, setTransactionPatterns] = useState({
    highRiskCountries: false,
    largeTransactions: false,
    irregularPatterns: false,
    unverifiedSources: false,
    cashIntensive: false,
    cryptoTransactions: false,
    details: ''
  });
  
  const [documents, setDocuments] = useState({
    idDocuments: false,
    addressProof: false,
    businessRegistration: false,
    financialStatements: false,
    ownershipStructure: false,
    details: ''
  });
  
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [complianceResult, setComplianceResult] = useState<ComplianceResult | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [apiProvider, setApiProvider] = useState<'deepseek' | 'gemini'>('gemini');
  const { toast } = useToast();
  
  // Load API key on component mount
  useEffect(() => {
    const storedApiProvider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
    setApiProvider(storedApiProvider);
    const storedApiKey = localStorage.getItem(`${storedApiProvider}ApiKey`) || (storedApiProvider === 'gemini' ? 'AIzaSyCpX8FmPojP3E4dDqsmi0EtRjDKXGh9SBc' : '');
    setApiKey(storedApiKey);
  }, []);
  
  const handleCustomerChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleBeneficialOwnerChange = (index: number, field: string, value: any) => {
    setBeneficialOwners(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  
  const addBeneficialOwner = () => {
    setBeneficialOwners(prev => [
      ...prev, 
      { name: '', nationality: '', ownership: '', politicalExposure: 'no', idVerified: false }
    ]);
  };
  
  const removeBeneficialOwner = (index: number) => {
    if (beneficialOwners.length > 1) {
      setBeneficialOwners(prev => prev.filter((_, i) => i !== index));
    }
  };
  
  const handleTransactionChange = (field: string, value: any) => {
    setTransactionPatterns(prev => ({ ...prev, [field]: value }));
  };
  
  const handleDocumentsChange = (field: string, value: any) => {
    setDocuments(prev => ({ ...prev, [field]: value }));
  };
  
  const generateComplianceReport = async () => {
    if (!customerData.entityName || !customerData.entityType) {
      toast({
        title: "Missing Information",
        description: "Please provide at least entity name and type",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Generate AI-based compliance analysis
      const prompt = `You are an AML/KYC compliance specialist. Based on the following information, provide a detailed compliance risk assessment with scores, findings, and recommendations.
      
      ENTITY INFORMATION:
      - Name: ${customerData.entityName}
      - Type: ${customerData.entityType}
      - Registration Number: ${customerData.registrationNumber || "Not provided"}
      - Registration Country: ${customerData.registrationCountry || "Not provided"}
      - Operating Countries: ${customerData.operatingCountries || "Not provided"}
      - Business Description: ${customerData.businessDescription || "Not provided"}
      - Annual Revenue: ${customerData.annualRevenue || "Not provided"}
      - Established Date: ${customerData.establishedDate || "Not provided"}
      - Website: ${customerData.website || "Not provided"}
      
      BENEFICIAL OWNERS:
      ${beneficialOwners.map((owner, i) => (
        `Owner ${i+1}:
        - Name: ${owner.name || "Not provided"}
        - Nationality: ${owner.nationality || "Not provided"}
        - Ownership Percentage: ${owner.ownership || "Not provided"}
        - Politically Exposed: ${owner.politicalExposure}
        - ID Verified: ${owner.idVerified ? "Yes" : "No"}`
      )).join("\n\n")}
      
      TRANSACTION PATTERNS:
      - High-Risk Countries Transactions: ${transactionPatterns.highRiskCountries ? "Yes" : "No"}
      - Large/Unusual Transactions: ${transactionPatterns.largeTransactions ? "Yes" : "No"}
      - Irregular Patterns: ${transactionPatterns.irregularPatterns ? "Yes" : "No"}
      - Unverified Sources of Funds: ${transactionPatterns.unverifiedSources ? "Yes" : "No"}
      - Cash-Intensive Business: ${transactionPatterns.cashIntensive ? "Yes" : "No"}
      - Cryptocurrency Transactions: ${transactionPatterns.cryptoTransactions ? "Yes" : "No"}
      - Details: ${transactionPatterns.details || "Not provided"}
      
      DOCUMENTATION STATUS:
      - ID Documents: ${documents.idDocuments ? "Provided" : "Not provided"}
      - Address Proof: ${documents.addressProof ? "Provided" : "Not provided"}
      - Business Registration: ${documents.businessRegistration ? "Provided" : "Not provided"}
      - Financial Statements: ${documents.financialStatements ? "Provided" : "Not provided"}
      - Ownership Structure: ${documents.ownershipStructure ? "Provided" : "Not provided"}
      - Details: ${documents.details || "Not provided"}
      
      ADDITIONAL NOTES:
      ${additionalNotes || "None provided"}
      
      Please provide:
      1. A compliance risk score from 0-100 (where 0 is highest risk and 100 is fully compliant)
      2. Detailed findings categorized by risk level (high, medium, low, passed)
      3. A summary of the compliance status
      4. Recommended next steps
      
      Format your response as a structured JSON object with these fields.`;
      
      const aiResponse = await getGeminiResponse(prompt, apiKey);
      
      // Parse the JSON response if possible
      try {
        // Extract JSON from the response if it contains text
        const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                           aiResponse.match(/```\n([\s\S]*?)\n```/) || 
                           aiResponse.match(/{[\s\S]*?}/);
                           
        const jsonStr = jsonMatch ? jsonMatch[0].replace(/```json\n|```\n|```/g, '') : aiResponse;
        const parsedResponse = JSON.parse(jsonStr);
        
        setComplianceResult(parsedResponse);
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        
        // Create a manually formatted result
        const manualResult: ComplianceResult = {
          score: calculateRiskScore(),
          findings: {
            high: extractIssues(aiResponse, "high"),
            medium: extractIssues(aiResponse, "medium"),
            low: extractIssues(aiResponse, "low"),
            passed: extractPassed(aiResponse)
          },
          summary: aiResponse.substring(0, 500) + "...",
          nextSteps: extractNextSteps(aiResponse)
        };
        
        setComplianceResult(manualResult);
      }
      
      setActiveTab('results');
      
      toast({
        title: "Analysis Complete",
        description: "AML/KYC compliance assessment has been generated",
      });
    } catch (error) {
      console.error("Error generating compliance report:", error);
      toast({
        title: "Error",
        description: "Failed to generate compliance report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const calculateRiskScore = (): number => {
    let score = 75; // Start with a moderate score
    
    // Deduct for missing core information
    if (!customerData.entityName) score -= 10;
    if (!customerData.registrationNumber) score -= 5;
    if (!customerData.registrationCountry) score -= 5;
    
    // Deduct for high risk transactions
    if (transactionPatterns.highRiskCountries) score -= 15;
    if (transactionPatterns.largeTransactions) score -= 10;
    if (transactionPatterns.irregularPatterns) score -= 15;
    if (transactionPatterns.unverifiedSources) score -= 20;
    if (transactionPatterns.cashIntensive) score -= 10;
    if (transactionPatterns.cryptoTransactions) score -= 8;
    
    // Deduct for missing documents
    if (!documents.idDocuments) score -= 10;
    if (!documents.addressProof) score -= 5;
    if (!documents.businessRegistration) score -= 10;
    if (!documents.financialStatements) score -= 5;
    if (!documents.ownershipStructure) score -= 10;
    
    // Check beneficial owners
    for (const owner of beneficialOwners) {
      if (!owner.name) score -= 5;
      if (owner.politicalExposure === 'yes') score -= 15;
      if (!owner.idVerified) score -= 10;
    }
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  };
  
  const extractIssues = (text: string, risk: string): Array<{ issue: string; recommendation: string }> => {
    const issues = [];
    const regex = new RegExp(`(${risk} risk|${risk.toUpperCase()} RISK)[:\\s]+(.*?)(?=\\n|$)`, 'gi');
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      issues.push({
        issue: match[2].trim(),
        recommendation: "Address this compliance issue promptly."
      });
    }
    
    // If no matches found, make a default entry
    if (issues.length === 0 && risk === 'high') {
      if (transactionPatterns.highRiskCountries || transactionPatterns.unverifiedSources) {
        issues.push({
          issue: "High risk transactions detected",
          recommendation: "Conduct enhanced due diligence on transactions."
        });
      }
    }
    
    return issues;
  };
  
  const extractPassed = (text: string): Array<{ area: string; notes: string }> => {
    const passed = [];
    const areas = ["Documentation", "Identity Verification", "Screening", "Risk Assessment"];
    
    for (const area of areas) {
      if (text.includes(`${area} passed`) || text.includes(`${area}: Compliant`)) {
        passed.push({
          area,
          notes: "Meets compliance requirements"
        });
      }
    }
    
    // Add default passed items based on provided information
    if (documents.idDocuments && documents.addressProof && passed.length === 0) {
      passed.push({
        area: "Basic Documentation",
        notes: "Core identity documents have been provided"
      });
    }
    
    return passed;
  };
  
  const extractNextSteps = (text: string): string[] => {
    const stepsRegex = /(?:next steps|recommendations|recommended actions)(?::|include|are)?\s*((?:[-•].*?(?:\n|$))+)/i;
    const match = text.match(stepsRegex);
    
    if (match && match[1]) {
      return match[1].split(/[-•]/).filter(s => s.trim()).map(s => s.trim());
    }
    
    // Default next steps if none found
    return [
      "Complete any missing documentation",
      "Verify the identity of all beneficial owners",
      "Implement ongoing monitoring for high-risk indicators"
    ];
  };
  
  const getRiskColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };
  
  const getRiskLabel = (score: number): string => {
    if (score >= 80) return "Low Risk";
    if (score >= 60) return "Medium Risk";
    return "High Risk";
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="customer">
            <FileText className="mr-2 h-4 w-4" />
            Entity Information
          </TabsTrigger>
          <TabsTrigger value="stakeholders">
            <FileText className="mr-2 h-4 w-4" />
            Beneficial Owners
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <Search className="mr-2 h-4 w-4" />
            Risk Assessment
          </TabsTrigger>
          <TabsTrigger value="results">
            <Shield className="mr-2 h-4 w-4" />
            Compliance Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="customer">
          <Card>
            <CardHeader>
              <CardTitle>Entity Information</CardTitle>
              <CardDescription>
                Enter basic information about the entity for KYC verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="entityName">Entity Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="entityName" 
                    value={customerData.entityName}
                    onChange={(e) => handleCustomerChange('entityName', e.target.value)}
                    placeholder="Legal entity name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="entityType">Entity Type <span className="text-red-500">*</span></Label>
                  <Select 
                    value={customerData.entityType} 
                    onValueChange={(value) => handleCustomerChange('entityType', value)}
                  >
                    <SelectTrigger id="entityType">
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="soleProprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="llc">Limited Liability Company (LLC)</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="nonprofit">Non-Profit Organization</SelectItem>
                      <SelectItem value="trust">Trust</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input 
                    id="registrationNumber" 
                    value={customerData.registrationNumber}
                    onChange={(e) => handleCustomerChange('registrationNumber', e.target.value)}
                    placeholder="Business registration number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registrationCountry">Country of Registration</Label>
                  <Input 
                    id="registrationCountry" 
                    value={customerData.registrationCountry}
                    onChange={(e) => handleCustomerChange('registrationCountry', e.target.value)}
                    placeholder="Country where entity is registered"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="operatingCountries">Countries of Operation</Label>
                  <Input 
                    id="operatingCountries" 
                    value={customerData.operatingCountries}
                    onChange={(e) => handleCustomerChange('operatingCountries', e.target.value)}
                    placeholder="Countries where business operates"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="annualRevenue">Annual Revenue</Label>
                  <Input 
                    id="annualRevenue" 
                    value={customerData.annualRevenue}
                    onChange={(e) => handleCustomerChange('annualRevenue', e.target.value)}
                    placeholder="Approximate annual revenue"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="establishedDate">Date Established</Label>
                  <Input 
                    id="establishedDate" 
                    value={customerData.establishedDate}
                    onChange={(e) => handleCustomerChange('establishedDate', e.target.value)}
                    placeholder="When was the entity established"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    value={customerData.website}
                    onChange={(e) => handleCustomerChange('website', e.target.value)}
                    placeholder="Entity website URL"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessDescription">Business Description</Label>
                <Textarea 
                  id="businessDescription" 
                  value={customerData.businessDescription}
                  onChange={(e) => handleCustomerChange('businessDescription', e.target.value)}
                  placeholder="Describe the business activities and services"
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setActiveTab('stakeholders')}>
                  Next: Beneficial Owners
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stakeholders">
          <Card>
            <CardHeader>
              <CardTitle>Beneficial Owners</CardTitle>
              <CardDescription>
                List all individuals who own or control the entity (25% or more ownership)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {beneficialOwners.map((owner, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Beneficial Owner {index + 1}</h3>
                    {beneficialOwners.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeBeneficialOwner(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${index}`}>Full Name</Label>
                      <Input 
                        id={`name-${index}`} 
                        value={owner.name}
                        onChange={(e) => handleBeneficialOwnerChange(index, 'name', e.target.value)}
                        placeholder="Full legal name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`nationality-${index}`}>Nationality</Label>
                      <Input 
                        id={`nationality-${index}`} 
                        value={owner.nationality}
                        onChange={(e) => handleBeneficialOwnerChange(index, 'nationality', e.target.value)}
                        placeholder="Country of citizenship"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`ownership-${index}`}>Ownership Percentage</Label>
                      <Input 
                        id={`ownership-${index}`} 
                        value={owner.ownership}
                        onChange={(e) => handleBeneficialOwnerChange(index, 'ownership', e.target.value)}
                        placeholder="% of ownership"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`pep-${index}`}>Politically Exposed Person (PEP)</Label>
                      <RadioGroup 
                        id={`pep-${index}`}
                        value={owner.politicalExposure}
                        onValueChange={(value) => handleBeneficialOwnerChange(index, 'politicalExposure', value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id={`pep-no-${index}`} />
                          <Label htmlFor={`pep-no-${index}`}>No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id={`pep-yes-${index}`} />
                          <Label htmlFor={`pep-yes-${index}`}>Yes</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`verified-${index}`} 
                          checked={owner.idVerified}
                          onCheckedChange={(checked) => handleBeneficialOwnerChange(index, 'idVerified', checked)}
                        />
                        <Label htmlFor={`verified-${index}`}>Identity verified with government ID</Label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={addBeneficialOwner} className="w-full">
                Add Another Beneficial Owner
              </Button>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab('customer')}>
                  Previous: Entity Information
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('transactions')}>
                  Next: Risk Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Risk Indicators</CardTitle>
                <CardDescription>
                  Select all that apply to the entity's financial activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="highRiskCountries" 
                      checked={transactionPatterns.highRiskCountries}
                      onCheckedChange={(checked) => handleTransactionChange('highRiskCountries', checked)}
                    />
                    <Label htmlFor="highRiskCountries">Transactions with high-risk countries</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="largeTransactions" 
                      checked={transactionPatterns.largeTransactions}
                      onCheckedChange={(checked) => handleTransactionChange('largeTransactions', checked)}
                    />
                    <Label htmlFor="largeTransactions">Large or unusual transaction patterns</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="irregularPatterns" 
                      checked={transactionPatterns.irregularPatterns}
                      onCheckedChange={(checked) => handleTransactionChange('irregularPatterns', checked)}
                    />
                    <Label htmlFor="irregularPatterns">Irregular transaction patterns</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="unverifiedSources" 
                      checked={transactionPatterns.unverifiedSources}
                      onCheckedChange={(checked) => handleTransactionChange('unverifiedSources', checked)}
                    />
                    <Label htmlFor="unverifiedSources">Unverified sources of funds</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="cashIntensive" 
                      checked={transactionPatterns.cashIntensive}
                      onCheckedChange={(checked) => handleTransactionChange('cashIntensive', checked)}
                    />
                    <Label htmlFor="cashIntensive">Cash-intensive business</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="cryptoTransactions" 
                      checked={transactionPatterns.cryptoTransactions}
                      onCheckedChange={(checked) => handleTransactionChange('cryptoTransactions', checked)}
                    />
                    <Label htmlFor="cryptoTransactions">Cryptocurrency transactions</Label>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="transactionDetails">Additional Transaction Details</Label>
                  <Textarea 
                    id="transactionDetails" 
                    value={transactionPatterns.details}
                    onChange={(e) => handleTransactionChange('details', e.target.value)}
                    placeholder="Provide any additional details about transaction patterns"
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Documentation & Additional Information</CardTitle>
                <CardDescription>
                  Indicate which verification documents have been collected
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="idDocuments" 
                      checked={documents.idDocuments}
                      onCheckedChange={(checked) => handleDocumentsChange('idDocuments', checked)}
                    />
                    <Label htmlFor="idDocuments">Government-issued ID documents</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="addressProof" 
                      checked={documents.addressProof}
                      onCheckedChange={(checked) => handleDocumentsChange('addressProof', checked)}
                    />
                    <Label htmlFor="addressProof">Proof of address</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="businessRegistration" 
                      checked={documents.businessRegistration}
                      onCheckedChange={(checked) => handleDocumentsChange('businessRegistration', checked)}
                    />
                    <Label htmlFor="businessRegistration">Business registration documents</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="financialStatements" 
                      checked={documents.financialStatements}
                      onCheckedChange={(checked) => handleDocumentsChange('financialStatements', checked)}
                    />
                    <Label htmlFor="financialStatements">Financial statements</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ownershipStructure" 
                      checked={documents.ownershipStructure}
                      onCheckedChange={(checked) => handleDocumentsChange('ownershipStructure', checked)}
                    />
                    <Label htmlFor="ownershipStructure">Ownership structure documentation</Label>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="documentDetails">Document Details</Label>
                  <Textarea 
                    id="documentDetails" 
                    value={documents.details}
                    onChange={(e) => handleDocumentsChange('details', e.target.value)}
                    placeholder="Notes about provided documentation"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea 
                    id="additionalNotes" 
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Any additional information relevant for compliance assessment"
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="md:col-span-2 flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('stakeholders')}>
                Previous: Beneficial Owners
              </Button>
              <Button 
                onClick={generateComplianceReport}
                disabled={isAnalyzing || !customerData.entityName || !customerData.entityType}
                className="ml-auto"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Generate Compliance Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          {!complianceResult ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Compliance Report Generated</h3>
                <p className="text-muted-foreground mb-4">
                  Complete the entity information and risk assessment, then generate a report to see results.
                </p>
                <Button variant="outline" onClick={() => setActiveTab('customer')}>
                  Go to Entity Information
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>AML/KYC Compliance Report</CardTitle>
                  <CardDescription>
                    {customerData.entityName} ({customerData.entityType})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Compliance Score</h3>
                      <span className={`font-bold text-lg ${getRiskColor(complianceResult.score)}`}>
                        {complianceResult.score}/100 ({getRiskLabel(complianceResult.score)})
                      </span>
                    </div>
                    <Progress 
                      value={complianceResult.score} 
                      className="h-3" 
                      indicatorClassName={complianceResult.score >= 80 ? "bg-green-500" : complianceResult.score >= 60 ? "bg-yellow-500" : "bg-red-500"}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Summary</h3>
                    <p className="text-muted-foreground">
                      {complianceResult.summary}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {complianceResult.findings.high.length > 0 && (
                      <div>
                        <h3 className="font-medium text-red-600 flex items-center mb-2">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          High Risk Findings
                        </h3>
                        <ul className="space-y-2">
                          {complianceResult.findings.high.map((finding, i) => (
                            <li key={i} className="border-l-2 border-red-600 pl-3 py-1">
                              <p className="font-medium">{finding.issue}</p>
                              <p className="text-sm text-muted-foreground">{finding.recommendation}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {complianceResult.findings.medium.length > 0 && (
                      <div>
                        <h3 className="font-medium text-yellow-600 flex items-center mb-2">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Medium Risk Findings
                        </h3>
                        <ul className="space-y-2">
                          {complianceResult.findings.medium.map((finding, i) => (
                            <li key={i} className="border-l-2 border-yellow-600 pl-3 py-1">
                              <p className="font-medium">{finding.issue}</p>
                              <p className="text-sm text-muted-foreground">{finding.recommendation}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {complianceResult.findings.low.length > 0 && (
                      <div>
                        <h3 className="font-medium text-blue-600 flex items-center mb-2">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Low Risk Findings
                        </h3>
                        <ul className="space-y-2">
                          {complianceResult.findings.low.map((finding, i) => (
                            <li key={i} className="border-l-2 border-blue-600 pl-3 py-1">
                              <p className="font-medium">{finding.issue}</p>
                              <p className="text-sm text-muted-foreground">{finding.recommendation}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {complianceResult.findings.passed.length > 0 && (
                      <div>
                        <h3 className="font-medium text-green-600 flex items-center mb-2">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Compliant Areas
                        </h3>
                        <ul className="space-y-2">
                          {complianceResult.findings.passed.map((finding, i) => (
                            <li key={i} className="border-l-2 border-green-600 pl-3 py-1">
                              <p className="font-medium">{finding.area}</p>
                              <p className="text-sm text-muted-foreground">{finding.notes}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {complianceResult.nextSteps.map((step, i) => (
                      <li key={i} className="flex items-start">
                        <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 h-5 w-5 mr-3 mt-0.5 text-xs font-medium">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('transactions')}>
                  Back to Risk Assessment
                </Button>
                
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AMLComplianceTool;
