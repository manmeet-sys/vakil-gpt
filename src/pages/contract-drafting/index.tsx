import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Wand2, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ContractClause {
  id: string;
  title: string;
  content: string;
  type: string;
}

const ContractDraftingPage = () => {
  const [contractType, setContractType] = useState("");
  const [partyOne, setPartyOne] = useState("");
  const [partyTwo, setPartyTwo] = useState("");
  const [contractPurpose, setContractPurpose] = useState("");
  const [customClauses, setCustomClauses] = useState<ContractClause[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContract, setGeneratedContract] = useState("");
  const { toast } = useToast();

  const contractTemplates = [
    { value: "service", label: "Service Agreement" },
    { value: "employment", label: "Employment Contract" },
    { value: "nda", label: "Non-Disclosure Agreement" },
    { value: "sale", label: "Sale Agreement" },
    { value: "lease", label: "Lease Agreement" },
    { value: "partnership", label: "Partnership Agreement" },
    { value: "consultant", label: "Consulting Agreement" },
    { value: "vendor", label: "Vendor Agreement" }
  ];

  const handleAddClause = () => {
    const newClause: ContractClause = {
      id: Date.now().toString(),
      title: "",
      content: "",
      type: "custom"
    };
    setCustomClauses([...customClauses, newClause]);
  };

  const handleUpdateClause = (id: string, field: string, value: string) => {
    setCustomClauses(customClauses.map(clause => 
      clause.id === id ? { ...clause, [field]: value } : clause
    ));
  };

  const handleRemoveClause = (id: string) => {
    setCustomClauses(customClauses.filter(clause => clause.id !== id));
  };

  const handleGenerate = async () => {
    if (!contractType || !partyOne || !partyTwo || !contractPurpose) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate a contract.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      const contractTypeName = contractTemplates.find(t => t.value === contractType)?.label || contractType;
      
      let customClausesText = "";
      if (customClauses.length > 0) {
        customClausesText = customClauses.map((clause, index) => 
          `${index + 8}. ${clause.title}\n${clause.content}\n`
        ).join("\n");
      }

      const mockContract = `
${contractTypeName.toUpperCase()}

This ${contractTypeName} ("Agreement") is entered into on ${new Date().toLocaleDateString()} ("Effective Date") by and between:

PARTY A: ${partyOne} ("Party A")
PARTY B: ${partyTwo} ("Party B")

RECITALS

WHEREAS, ${contractPurpose};

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:

1. PURPOSE AND SCOPE
This Agreement sets forth the terms and conditions governing ${contractPurpose.toLowerCase()}.

2. TERM
This Agreement shall commence on the Effective Date and shall continue until terminated in accordance with the provisions herein.

3. OBLIGATIONS OF PARTY A
Party A shall [specific obligations to be detailed based on contract type].

4. OBLIGATIONS OF PARTY B  
Party B shall [specific obligations to be detailed based on contract type].

5. PAYMENT TERMS
[Payment terms and conditions to be specified].

6. CONFIDENTIALITY
Each party acknowledges that it may have access to certain confidential information of the other party.

7. TERMINATION
This Agreement may be terminated by either party upon [termination conditions].

${customClausesText}

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

PARTY A: ${partyOne}

Signature: _______________________
Name: ___________________________
Title: __________________________
Date: ___________________________


PARTY B: ${partyTwo}

Signature: _______________________
Name: ___________________________
Title: __________________________
Date: ___________________________
      `;
      
      setGeneratedContract(mockContract);
      toast({
        title: "Contract Generated",
        description: "Contract has been successfully generated.",
      });
    } catch (error) {
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Contract Drafting</h1>
        <p className="text-muted-foreground">
          Generate professional legal contracts using AI assistance. Choose from templates and customize with specific clauses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Contract Details
              </CardTitle>
              <CardDescription>
                Enter the basic information for your contract
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Contract Type *</label>
                <Select value={contractType} onValueChange={setContractType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contract type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTemplates.map(template => (
                      <SelectItem key={template.value} value={template.value}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">First Party *</label>
                <Input
                  placeholder="Name of first party"
                  value={partyOne}
                  onChange={(e) => setPartyOne(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Second Party *</label>
                <Input
                  placeholder="Name of second party"
                  value={partyTwo}
                  onChange={(e) => setPartyTwo(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Contract Purpose *</label>
                <Textarea
                  placeholder="Describe the purpose and scope of this contract..."
                  value={contractPurpose}
                  onChange={(e) => setContractPurpose(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Custom Clauses
              </CardTitle>
              <CardDescription>
                Add specific clauses for your contract
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {customClauses.map((clause) => (
                <div key={clause.id} className="border rounded-lg p-4 space-y-3">
                  <Input
                    placeholder="Clause title"
                    value={clause.title}
                    onChange={(e) => handleUpdateClause(clause.id, "title", e.target.value)}
                  />
                  <Textarea
                    placeholder="Clause content"
                    value={clause.content}
                    onChange={(e) => handleUpdateClause(clause.id, "content", e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRemoveClause(clause.id)}
                  >
                    Remove Clause
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" onClick={handleAddClause} className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Custom Clause
              </Button>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>Generating Contract...</>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Contract
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Contract
            </CardTitle>
            <CardDescription>
              Review and download your AI-generated contract
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedContract ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {generatedContract}
                  </pre>
                </div>
                <Button onClick={handleDownload} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Contract
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generated contract will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractDraftingPage;