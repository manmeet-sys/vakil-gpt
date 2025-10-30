import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Wand2, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";

const ContractDraftingPage = () => {
  const [contractType, setContractType] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [briefDescription, setBriefDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContract, setGeneratedContract] = useState("");
  const { toast } = useToast();

  const contractTemplates = [
    { value: "service", label: "Service Agreement", desc: "Agreement for providing services" },
    { value: "employment", label: "Employment Contract", desc: "Employment terms and conditions" },
    { value: "nda", label: "Non-Disclosure Agreement", desc: "Confidentiality agreement" },
    { value: "sale", label: "Sale Agreement", desc: "Sale of goods or property" },
    { value: "lease", label: "Lease Agreement", desc: "Property rental agreement" },
    { value: "partnership", label: "Partnership Deed", desc: "Business partnership agreement" },
    { value: "loan", label: "Loan Agreement", desc: "Money lending agreement" },
    { value: "mou", label: "Memorandum of Understanding", desc: "Preliminary agreement between parties" },
    { value: "franchise", label: "Franchise Agreement", desc: "Business franchise terms" },
    { value: "distribution", label: "Distribution Agreement", desc: "Product distribution terms" },
    { value: "shareholder", label: "Shareholders Agreement", desc: "Rights and obligations of shareholders" },
    { value: "joint_venture", label: "Joint Venture Agreement", desc: "Collaborative business venture" },
    { value: "licensing", label: "Licensing Agreement", desc: "License to use IP or property" },
    { value: "consultancy", label: "Consultancy Agreement", desc: "Professional consulting services" },
    { value: "maintenance", label: "Maintenance Agreement", desc: "Service maintenance contract" },
  ];

  const jurisdictions = [
    { value: "delhi", label: "Delhi High Court" },
    { value: "mumbai", label: "Bombay High Court" },
    { value: "bangalore", label: "Karnataka High Court" },
    { value: "chennai", label: "Madras High Court" },
    { value: "kolkata", label: "Calcutta High Court" },
    { value: "supreme", label: "Supreme Court of India" },
  ];

  const handleGenerate = async () => {
    if (!contractType || !briefDescription) {
      toast({
        title: "Missing Information",
        description: "Please select a contract type and provide a brief description.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const contractTypeName = contractTemplates.find(t => t.value === contractType)?.label || contractType;
      const jurisdictionName = jurisdictions.find(j => j.value === jurisdiction)?.label || "General Indian Law";
      
      const prompt = `Draft a comprehensive ${contractTypeName} under ${jurisdictionName} jurisdiction with the following details: ${briefDescription}. 

Include all essential clauses, legal provisions, dispute resolution mechanisms, and ensure compliance with Indian Contract Act, 1872 and other relevant laws. Make it detailed and professionally formatted.`;

      const { data, error } = await supabase.functions.invoke('enhanced-legal-ai', {
        body: {
          query: prompt,
          legalArea: "Contract Law",
          jurisdiction: jurisdictionName,
          analysisType: "contract_drafting"
        }
      });

      if (error) throw error;

      setGeneratedContract(data.answer);
      toast({
        title: "Contract Generated",
        description: "AI has successfully drafted your contract.",
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedContract], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${contractType}_contract_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded",
      description: "Contract has been downloaded successfully.",
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Contract Drafting
          </h1>
          <p className="text-muted-foreground text-lg">
            Generate comprehensive legal contracts with AI assistance. Provide minimal input and get fully detailed, legally compliant contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Contract Details
                </CardTitle>
                <CardDescription>
                  Provide basic information - AI will handle the rest
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contract Type *</label>
                  <Select value={contractType} onValueChange={setContractType}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {contractTemplates.map(template => (
                        <SelectItem key={template.value} value={template.value}>
                          <div className="flex flex-col py-1">
                            <span className="font-medium">{template.label}</span>
                            <span className="text-xs text-muted-foreground">{template.desc}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Jurisdiction</label>
                  <Select value={jurisdiction} onValueChange={setJurisdiction}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select jurisdiction (optional)" />
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
                    placeholder="Example: Service agreement between Tech Solutions Pvt Ltd and ABC Corp for software development services. Project duration 6 months, payment terms monthly, confidentiality required."
                    value={briefDescription}
                    onChange={(e) => setBriefDescription(e.target.value)}
                    className="min-h-[180px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Just provide key details - AI will draft comprehensive clauses, legal provisions, and all necessary terms.
                  </p>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating Contract...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Complete Contract
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Generated Contract
              </CardTitle>
              <CardDescription>
                AI-generated comprehensive legal contract
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedContract ? (
                <div className="space-y-4">
                  <div className="bg-card border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                      {generatedContract}
                    </pre>
                  </div>
                  <Button onClick={handleDownload} className="w-full" size="lg">
                    <Download className="h-4 w-4 mr-2" />
                    Download Contract
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                  <div className="text-center space-y-4">
                    <FileText className="h-16 w-16 mx-auto opacity-20" />
                    <div>
                      <p className="font-medium">No contract generated yet</p>
                      <p className="text-sm">Fill in the details and click generate</p>
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

export default ContractDraftingPage;
