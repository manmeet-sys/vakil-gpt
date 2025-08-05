import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Search, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PdfUploader from "@/components/PdfUploader";

const LegalDocumentAnalyzerPage = () => {
  const [analysisText, setAnalysisText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!analysisText.trim()) {
      toast({
        title: "No Content",
        description: "Please enter text or upload a document to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setAnalysis(`
**Document Analysis Results:**

**Document Type:** Legal Contract
**Key Provisions Identified:**
- Payment terms and conditions
- Liability clauses
- Termination provisions
- Dispute resolution mechanisms

**Risk Assessment:**
- Medium risk level detected
- Recommended review of liability limitations
- Consider adding force majeure clause

**Compliance Notes:**
- Document appears to comply with standard legal requirements
- Suggest review by qualified legal counsel for jurisdiction-specific requirements
      `);
      
      toast({
        title: "Analysis Complete",
        description: "Document analysis has been completed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (files: File[], extractedText?: string) => {
    setUploadedDocuments(files);
    if (extractedText) {
      setAnalysisText(extractedText);
      toast({
        title: "File Uploaded",
        description: "Document content has been extracted and is ready for analysis.",
      });
    }
  };

  const handleRemoveDocument = (index: number) => {
    const newDocuments = uploadedDocuments.filter((_, i) => i !== index);
    setUploadedDocuments(newDocuments);
    if (newDocuments.length === 0) {
      setAnalysisText("");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Legal Document Analyzer</h1>
        <p className="text-muted-foreground">
          Upload or paste legal documents for AI-powered analysis, risk assessment, and compliance checking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Document Input
            </CardTitle>
            <CardDescription>
              Upload a PDF document or paste text content for analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PdfUploader 
              onUpload={handleFileUpload}
              onRemove={handleRemoveDocument}
              documents={uploadedDocuments}
            />
            
            <div className="relative">
              <Textarea
                placeholder="Paste your legal document text here..."
                value={analysisText}
                onChange={(e) => setAnalysisText(e.target.value)}
                className="min-h-[300px]"
              />
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !analysisText.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>Analyzing...</>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze Document
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Analysis Results
            </CardTitle>
            <CardDescription>
              AI-powered insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analysis results will appear here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalDocumentAnalyzerPage;