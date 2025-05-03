
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  MessageCircle,
  Loader2,
  FileQuestion,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PromptBasedGeneratorProps {
  onDraftGenerated: (title: string, type: string, content: string) => void;
}

const PromptBasedGenerator: React.FC<PromptBasedGeneratorProps> = ({ onDraftGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const documentTypes = [
    { id: 'agreement', name: 'Agreement' },
    { id: 'affidavit', name: 'Affidavit' },
    { id: 'legal_notice', name: 'Legal Notice' },
    { id: 'petition', name: 'Petition' },
    { id: 'application', name: 'Application' },
    { id: 'contract', name: 'Contract' },
    { id: 'letter', name: 'Legal Letter' },
    { id: 'poa', name: 'Power of Attorney' },
    { id: 'will', name: 'Will / Testament' },
    { id: 'deed', name: 'Deed' },
    { id: 'mou', name: 'MOU' },
    { id: 'undertaking', name: 'Undertaking' },
    { id: 'declaration', name: 'Declaration' },
    { id: 'complaint', name: 'Complaint' },
    { id: 'motion', name: 'Motion' },
    { id: 'custom', name: 'Custom Document' }
  ];
  
  const examplePrompts = [
    "Create a legal notice for residential tenant to pay overdue rent",
    "Draft a power of attorney for managing my property in Delhi",
    "Write an affidavit for name change from Kumar to Singh",
    "Generate a partnership agreement for a technology startup",
    "Draft a lease agreement for commercial property in Mumbai",
    "Write a settlement agreement for a motor vehicle accident"
  ];
  
  const handleGenerateDocument = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt describing the document you need');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Please enter a title for your document');
      return;
    }
    
    if (!documentType) {
      toast.error('Please select a document type');
      return;
    }
    
    setIsGenerating(true);
    setGenerationError(null);
    
    // Simulate AI generation with a delay
    // In a real implementation, this would call an API
    setTimeout(() => {
      try {
        const generatedDocument = generateMockDocument(prompt, documentType);
        onDraftGenerated(title, getDocumentTypeName(documentType), generatedDocument);
        toast.success('Document generated successfully');
        setIsGenerating(false);
      } catch (error) {
        console.error('Error generating document:', error);
        setGenerationError('Failed to generate document. Please try again.');
        toast.error('Failed to generate document');
        setIsGenerating(false);
      }
    }, 3000);
  };
  
  const getDocumentTypeName = (typeId: string) => {
    const type = documentTypes.find(t => t.id === typeId);
    return type ? type.name : 'Document';
  };

  // Mock document generation (would be replaced with actual AI in production)
  const generateMockDocument = (userPrompt: string, type: string) => {
    // Simple mock generator - this would be replaced with actual AI generation
    const currentDate = new Date().toLocaleDateString('en-IN');
    let content = '';
    
    switch (type) {
      case 'legal_notice':
        content = `LEGAL NOTICE\n\nDate: ${currentDate}\n\nFrom:\n[SENDER NAME]\n[SENDER ADDRESS]\n[CONTACT DETAILS]\n\nTo:\n[RECIPIENT NAME]\n[RECIPIENT ADDRESS]\n\nSubject: ${userPrompt.toUpperCase()}\n\nDear Sir/Madam,\n\nThis is to formally notify you that [DETAILED DESCRIPTION OF ISSUE BASED ON: ${userPrompt}].\n\nDespite several previous communications, [DESCRIPTION OF PREVIOUS ATTEMPTS TO RESOLVE].\n\nYou are hereby called upon to [SPECIFIC DEMAND OR ACTION REQUIRED] within [TIME PERIOD, e.g., 15 days] from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you, civil and/or criminal, as advised, at your risk as to costs and consequences.\n\nThis notice is being issued without prejudice to my client's rights and contentions in the matter, all of which are expressly reserved.\n\nYours truly,\n\n[ADVOCATE NAME]\nAdvocate\n[ENROLLMENT NO.]\n[CONTACT DETAILS]`;
        break;
        
      case 'affidavit':
        content = `AFFIDAVIT\n\nI, [DEPONENT NAME], son/daughter/wife of [FATHER/HUSBAND NAME], aged about [AGE] years, resident of [COMPLETE ADDRESS], do hereby solemnly affirm and declare as under:\n\n1. That I am the deponent of this affidavit and am fully conversant with the facts and circumstances related to ${userPrompt}.\n\n2. That [FACT 1 RELATED TO THE PROMPT: ${userPrompt}].\n\n3. That [FACT 2 RELATED TO THE PROMPT].\n\n4. That [FACT 3 RELATED TO THE PROMPT].\n\n5. That [FACT 4 RELATED TO THE PROMPT].\n\nVERIFICATION:\nI, the deponent above named, do hereby verify that the contents of paragraphs 1 to 5 of this affidavit are true and correct to my knowledge, no part of it is false and nothing material has been concealed therefrom.\n\nVerified at [PLACE] on this ${currentDate}.\n\n[DEPONENT SIGNATURE]\nDEPONENT`;
        break;
        
      case 'agreement':
      case 'contract':
        content = `AGREEMENT\n\nTHIS AGREEMENT is made and entered into on this ${currentDate} at [PLACE]\n\nBETWEEN\n\n[PARTY 1 NAME], [DESCRIPTION OF PARTY 1] (hereinafter referred to as the "First Party")\n\nAND\n\n[PARTY 2 NAME], [DESCRIPTION OF PARTY 2] (hereinafter referred to as the "Second Party")\n\nThe First Party and the Second Party shall hereinafter be collectively referred to as the "Parties" and individually as a "Party".\n\nWHEREAS:\n\nA. [BACKGROUND INFORMATION RELATED TO: ${userPrompt}]\n\nB. [FURTHER BACKGROUND INFORMATION]\n\nC. [PURPOSE OF THE AGREEMENT]\n\nNOW THIS AGREEMENT WITNESSETH AS FOLLOWS:\n\n1. DEFINITIONS\n   [DEFINITIONS OF IMPORTANT TERMS]\n\n2. SCOPE OF AGREEMENT\n   [DETAILED SCOPE BASED ON THE PROMPT: ${userPrompt}]\n\n3. TERM\n   This Agreement shall commence on [START DATE] and shall continue until [END DATE], unless terminated earlier in accordance with the provisions of this Agreement.\n\n4. CONSIDERATION\n   [PAYMENT TERMS OR OTHER CONSIDERATION]\n\n5. OBLIGATIONS OF THE FIRST PARTY\n   [DETAILED OBLIGATIONS]\n\n6. OBLIGATIONS OF THE SECOND PARTY\n   [DETAILED OBLIGATIONS]\n\n7. TERMINATION\n   [TERMINATION CLAUSES]\n\n8. GOVERNING LAW AND JURISDICTION\n   This Agreement shall be governed by and construed in accordance with the laws of India, and the courts at [JURISDICTION] shall have exclusive jurisdiction.\n\n9. DISPUTE RESOLUTION\n   [DISPUTE RESOLUTION MECHANISM]\n\n10. MISCELLANEOUS\n    [OTHER STANDARD CLAUSES]\n\nIN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first above written.\n\nFor [PARTY 1 NAME]\n\n_____________________\nName: [NAME]\nDesignation: [DESIGNATION]\n\nFor [PARTY 2 NAME]\n\n_____________________\nName: [NAME]\nDesignation: [DESIGNATION]\n\nWITNESSES:\n\n1. _____________________\n   Name: [WITNESS 1 NAME]\n   Address: [WITNESS 1 ADDRESS]\n\n2. _____________________\n   Name: [WITNESS 2 NAME]\n   Address: [WITNESS 2 ADDRESS]`;
        break;
        
      case 'poa':
        content = `POWER OF ATTORNEY\n\nKNOW ALL MEN BY THESE PRESENTS:\n\nTHAT I, [PRINCIPAL NAME], son/daughter of [FATHER'S NAME], aged about [AGE] years, residing at [COMPLETE ADDRESS], do hereby nominate, constitute, and appoint [ATTORNEY NAME], son/daughter of [FATHER'S NAME], aged about [AGE] years, residing at [COMPLETE ADDRESS], as my true and lawful ATTORNEY to do and execute the following acts, deeds, and things in my name and on my behalf in relation to ${userPrompt}:\n\n1. To [POWER 1].\n\n2. To [POWER 2].\n\n3. To [POWER 3].\n\n4. To [POWER 4].\n\n5. To [POWER 5].\n\nAND I HEREBY AGREE to ratify and confirm all lawful acts, deeds, and things done by my said Attorney by virtue of these presents.\n\nThis Power of Attorney shall be valid until revoked by me in writing.\n\nIN WITNESS WHEREOF I have hereunto set my hand this ${currentDate} at [PLACE].\n\n[SIGNATURE]\n(PRINCIPAL NAME)\n\nWITNESSES:\n\n1. [WITNESS 1 SIGNATURE]\n   Name: [WITNESS 1 NAME]\n   Address: [WITNESS 1 ADDRESS]\n\n2. [WITNESS 2 SIGNATURE]\n   Name: [WITNESS 2 NAME]\n   Address: [WITNESS 2 ADDRESS]`;
        break;
        
      case 'will':
        content = `LAST WILL AND TESTAMENT\n\nI, [TESTATOR NAME], son/daughter of [FATHER'S NAME], residing at [COMPLETE ADDRESS], aged about [AGE] years, do hereby revoke all my former Wills, Codicils, and Testamentary dispositions made by me at any time heretofore, and declare this to be my Last Will and Testament.\n\n1. I appoint [EXECUTOR NAME], son/daughter of [FATHER'S NAME], residing at [COMPLETE ADDRESS], to be the Executor of this my Will.\n\n2. I give, devise and bequeath all my property, both movable and immovable, of whatsoever nature and wheresoever situate, which I may be entitled to or over which I may have a disposing power at the time of my death, including any property over which I may have a general power of appointment, after payment thereout of my debts, funeral and testamentary expenses in the manner following:\n\n[SPECIFIC BEQUESTS RELATED TO: ${userPrompt}]\n\n3. I direct my Executor to pay all my just debts, funeral expenses and the expenses of administering my estate as soon after my death as practicable.\n\n4. [ADDITIONAL CLAUSES AS NEEDED]\n\nIN WITNESS WHEREOF, I have hereunto set my hand to this my Last Will and Testament, consisting of [NUMBER] pages, on this ${currentDate} at [PLACE].\n\n[SIGNATURE OF TESTATOR]\n(TESTATOR NAME)\n\nSIGNED by the above-named TESTATOR as his/her Last Will and Testament in the presence of us both present at the same time, who at his/her request and in his/her presence and in the presence of each other have hereunto subscribed our names as witnesses:\n\n1. [WITNESS 1 SIGNATURE]\n   Name: [WITNESS 1 NAME]\n   Address: [WITNESS 1 ADDRESS]\n   Occupation: [WITNESS 1 OCCUPATION]\n\n2. [WITNESS 2 SIGNATURE]\n   Name: [WITNESS 2 NAME]\n   Address: [WITNESS 2 ADDRESS]\n   Occupation: [WITNESS 2 OCCUPATION]`;
        break;
        
      default:
        content = `[DOCUMENT TITLE]\n\nDate: ${currentDate}\n\n[THIS IS A PLACEHOLDER FOR A GENERATED DOCUMENT BASED ON YOUR PROMPT: "${userPrompt}"]\n\nIn a real implementation, this content would be generated by an AI language model with specific legal expertise. The document would be properly formatted according to Indian legal standards and would include all necessary sections and clauses appropriate for a ${getDocumentTypeName(type)}.\n\nThe document would analyze your requirements from the prompt and create appropriate legal language that addresses your specific needs while ensuring compliance with relevant Indian laws and regulations.\n\n[SIGNATURE BLOCK]\n[RELEVANT PARTIES]\n[WITNESS SECTION IF APPLICABLE]`;
    }
    
    return content;
  };

  const handleUseExample = (example: string) => {
    setPrompt(example);
    const documentTypeGuess = guessDocumentType(example);
    if (documentTypeGuess) {
      setDocumentType(documentTypeGuess);
    }
  };
  
  const guessDocumentType = (promptText: string) => {
    const promptLower = promptText.toLowerCase();
    if (promptLower.includes('notice')) return 'legal_notice';
    if (promptLower.includes('power of attorney')) return 'poa';
    if (promptLower.includes('affidavit')) return 'affidavit';
    if (promptLower.includes('agreement')) return 'agreement';
    if (promptLower.includes('lease') || promptLower.includes('rental')) return 'agreement';
    if (promptLower.includes('partnership')) return 'agreement';
    if (promptLower.includes('settlement')) return 'agreement';
    return '';
  };

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-blue-500" />
          AI Document Generator
        </CardTitle>
        <CardDescription>
          Describe the legal document you need, and our AI will generate it
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="document-title">Document Title</Label>
          <Input
            id="document-title"
            placeholder="Enter a title for your document"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="document-type">Document Type</Label>
          <Select 
            value={documentType} 
            onValueChange={setDocumentType}
          >
            <SelectTrigger id="document-type">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="document-prompt">
              Describe the document you need
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <FileQuestion className="h-4 w-4" />
                    <span className="sr-only">Help</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Describe the document you need in detail. Include the purpose, 
                    parties involved, and any specific clauses you want to include.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            id="document-prompt"
            placeholder="E.g., Create a rental agreement for a 2BHK apartment in Mumbai with a rent of ₹25,000 per month and 11-month term"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleUseExample(example)}
              >
                {example.length > 30 ? `${example.substring(0, 30)}...` : example}
              </Button>
            ))}
          </div>
        </div>
        
        {generationError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{generationError}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-3">
        <Button 
          onClick={handleGenerateDocument} 
          disabled={isGenerating} 
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Generating Document...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Document
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PromptBasedGenerator;
