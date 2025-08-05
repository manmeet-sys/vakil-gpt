import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const LegalBriefGenerationPage = () => {
  const [caseTitle, setCaseTitle] = useState("");
  const [briefType, setBriefType] = useState("");
  const [factualBackground, setFactualBackground] = useState("");
  const [legalIssues, setLegalIssues] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState("");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!caseTitle || !briefType || !factualBackground || !legalIssues) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate a legal brief.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate brief generation
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      const mockBrief = `
LEGAL BRIEF

Case: ${caseTitle}
Brief Type: ${briefType}
Date: ${new Date().toLocaleDateString()}

I. FACTUAL BACKGROUND

${factualBackground}

II. LEGAL ISSUES PRESENTED

${legalIssues}

III. ARGUMENT

A. Standard of Review
The court should apply [relevant standard] when reviewing this matter.

B. Legal Analysis
Based on the facts presented and applicable law, the following arguments support our position:

1. First Argument
   [Legal precedent and reasoning]

2. Second Argument
   [Supporting case law and statutory interpretation]

3. Third Argument
   [Policy considerations and practical implications]

IV. CONCLUSION

For the foregoing reasons, this Court should [requested relief/ruling].

Respectfully submitted,

[Attorney Name]
[Bar Number]
[Date]
      `;
      
      setGeneratedBrief(mockBrief);
      toast({
        title: "Brief Generated",
        description: "Legal brief has been successfully generated.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate legal brief. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedBrief], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${caseTitle.replace(/\s+/g, "_")}_brief.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded",
      description: "Legal brief has been downloaded successfully.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Legal Brief Generation</h1>
        <p className="text-muted-foreground">
          Generate professional legal briefs using AI assistance. Provide case details and let our system create structured legal arguments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Brief Details
            </CardTitle>
            <CardDescription>
              Enter case information and key details for brief generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Case Title *</label>
              <Input
                placeholder="e.g., Smith v. Jones"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Brief Type *</label>
              <Select value={briefType} onValueChange={setBriefType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brief type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="motion">Motion Brief</SelectItem>
                  <SelectItem value="appellate">Appellate Brief</SelectItem>
                  <SelectItem value="response">Response Brief</SelectItem>
                  <SelectItem value="reply">Reply Brief</SelectItem>
                  <SelectItem value="memorandum">Legal Memorandum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Factual Background *</label>
              <Textarea
                placeholder="Provide a summary of the key facts relevant to your case..."
                value={factualBackground}
                onChange={(e) => setFactualBackground(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Legal Issues *</label>
              <Textarea
                placeholder="Outline the main legal questions or issues to be addressed..."
                value={legalIssues}
                onChange={(e) => setLegalIssues(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>Generating Brief...</>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Legal Brief
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Brief
            </CardTitle>
            <CardDescription>
              Review and download your AI-generated legal brief
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedBrief ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg max-h-[400px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {generatedBrief}
                  </pre>
                </div>
                <Button onClick={handleDownload} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Brief
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generated brief will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalBriefGenerationPage;