
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateOpenAIAnalysis } from '@/utils/aiAnalysis';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ContractDraftingFormProps {
  onGenerate: (content: string, title: string, type: string) => void;
}

const ContractDraftingForm: React.FC<ContractDraftingFormProps> = ({ onGenerate }) => {
  const [title, setTitle] = useState<string>('');
  const [contractType, setContractType] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!title || !contractType || !details) {
      toast.error("Missing Information", {
        description: "Please fill in all fields before generating the contract."
      });
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = `
        Generate a comprehensive Indian legal contract with the following details:
        
        Title: ${title}
        Type: ${contractType}
        Details: ${details}
        
        Please create a complete and legally sound contract that:
        1. Follows Indian legal standards and conventions
        2. Includes all necessary clauses and sections
        3. Uses formal legal language appropriate for Indian courts
        4. References relevant Indian laws where appropriate
        5. Is ready for use in Indian jurisdiction
        
        Format your response as the complete contract document only.
      `;

      const generatedContent = await generateOpenAIAnalysis(prompt, title);

      if (generatedContent) {
        onGenerate(generatedContent, title, contractType);
        toast.success("Contract Generated", {
          description: "Your contract has been successfully generated."
        });
      }
    } catch (error) {
      console.error("Error generating contract:", error);
      toast.error("Generation Failed", {
        description: "There was an error generating your contract. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contract Drafting Form</CardTitle>
        <CardDescription>Fill in the details to generate a legal contract</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Contract Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Employment Agreement"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contract-type">Contract Type</Label>
          <Select value={contractType} onValueChange={setContractType}>
            <SelectTrigger id="contract-type">
              <SelectValue placeholder="Select a contract type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employment">Employment Agreement</SelectItem>
              <SelectItem value="lease">Lease Agreement</SelectItem>
              <SelectItem value="sale">Sale Agreement</SelectItem>
              <SelectItem value="service">Service Agreement</SelectItem>
              <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
              <SelectItem value="partnership">Partnership Agreement</SelectItem>
              <SelectItem value="consultant">Consultancy Agreement</SelectItem>
              <SelectItem value="loan">Loan Agreement</SelectItem>
              <SelectItem value="ip">Intellectual Property License</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="details">Contract Details</Label>
          <Textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Provide specific details about the parties involved, terms, conditions, etc."
            className="min-h-[150px]"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleGenerate} 
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Contract'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContractDraftingForm;
