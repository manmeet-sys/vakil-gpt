import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { FileContract, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/components/BackButton';
import { generateEnhancedIndianContract } from '@/components/OpenAIIntegration';

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

const ContractDraftingPage = () => {
  const { toast } = useToast();
  const [contractDetails, setContractDetails] = useState<ContractDetails>({
    contractType: '',
    partyA: '',
    partyAType: '',
    partyB: '',
    partyBType: '',
    jurisdiction: 'India',
    effectiveDate: '',
    purpose: '',
    keyTerms: '',
  });
  const [draftContract, setDraftContract] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContractDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const generateContract = async () => {
    if (!contractDetails.contractType || !contractDetails.partyA || !contractDetails.partyB) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before generating the contract.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const generatedContract = await generateEnhancedIndianContract(
        contractDetails.contractType,
        {
          partyA: contractDetails.partyA,
          partyAType: contractDetails.partyAType,
          partyB: contractDetails.partyB,
          partyBType: contractDetails.partyBType,
        },
        {
          jurisdiction: contractDetails.jurisdiction,
          effectiveDate: contractDetails.effectiveDate,
          purpose: contractDetails.purpose,
          keyTerms: contractDetails.keyTerms,
        }
      );

      setDraftContract(generatedContract);
      toast({
        title: "Contract Generated",
        description: "Your enhanced Indian legal contract has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating contract:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating the contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadContract = () => {
    if (!draftContract) {
      toast({
        title: "No Contract to Download",
        description: "Please generate a contract before attempting to download.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([draftContract], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractDetails.contractType.replace(/\s+/g, '_').toLowerCase()}_draft.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <LegalToolLayout
      title="Indian Contract Drafting Tool"
      description="Generate enhanced legal contracts tailored for Indian jurisdiction"
      icon={<FileContract className="h-6 w-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />

      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
            <CardDescription>
              Enter the details for generating an enhanced Indian legal contract.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contract-type">Contract Type</Label>
                <Input
                  id="contract-type"
                  name="contractType"
                  value={contractDetails.contractType}
                  onChange={handleInputChange}
                  placeholder="e.g., Service Agreement, NDA, Lease Agreement"
                />
              </div>
              <div>
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Select name="jurisdiction" value={contractDetails.jurisdiction} onValueChange={(value) => handleInputChange({ target: { name: 'jurisdiction', value } } as any)}>
                  <SelectTrigger id="jurisdiction">
                    <SelectValue placeholder="Select Jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    {/* Add more jurisdictions as needed */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="party-a">Party A Name</Label>
                <Input
                  id="party-a"
                  name="partyA"
                  value={contractDetails.partyA}
                  onChange={handleInputChange}
                  placeholder="Enter name of Party A"
                />
              </div>
              <div>
                <Label htmlFor="party-a-type">Party A Type</Label>
                <Input
                  id="party-a-type"
                  name="partyAType"
                  value={contractDetails.partyAType}
                  onChange={handleInputChange}
                  placeholder="e.g., Company, Individual"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="party-b">Party B Name</Label>
                <Input
                  id="party-b"
                  name="partyB"
                  value={contractDetails.partyB}
                  onChange={handleInputChange}
                  placeholder="Enter name of Party B"
                />
              </div>
              <div>
                <Label htmlFor="party-b-type">Party B Type</Label>
                <Input
                  id="party-b-type"
                  name="partyBType"
                  value={contractDetails.partyBType}
                  onChange={handleInputChange}
                  placeholder="e.g., Company, Individual"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="effective-date">Effective Date</Label>
                <Input
                  type="date"
                  id="effective-date"
                  name="effectiveDate"
                  value={contractDetails.effectiveDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="purpose">Purpose of Contract</Label>
                <Input
                  id="purpose"
                  name="purpose"
                  value={contractDetails.purpose}
                  onChange={handleInputChange}
                  placeholder="Briefly describe the contract's purpose"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="key-terms">Key Terms</Label>
              <Textarea
                id="key-terms"
                name="keyTerms"
                value={contractDetails.keyTerms}
                onChange={handleInputChange}
                placeholder="List any key terms or specific clauses to include"
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
          <CardContent>
            <Button
              onClick={generateContract}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Contract...
                </>
              ) : (
                <>
                  <FileContract className="mr-2 h-4 w-4" />
                  Generate Enhanced Contract
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {draftContract && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Contract</CardTitle>
              <CardDescription>
                Review and download the generated Indian legal contract.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <Textarea
                value={draftContract}
                readOnly
                className="min-h-[300px] resize-none"
              />
            </CardContent>
            <CardContent>
              <Button onClick={downloadContract} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Contract
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </LegalToolLayout>
  );
};

export default ContractDraftingPage;
