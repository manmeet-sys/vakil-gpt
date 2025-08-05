import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Wand2, Eye, History } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  fields: string[];
}

interface DocumentVersion {
  id: string;
  version: number;
  timestamp: string;
  changes: string;
}

const LegalDocumentDraftingPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [formFields, setFormFields] = useState<{[key: string]: string}>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState("");
  const [versions] = useState<DocumentVersion[]>([
    { id: "1", version: 1, timestamp: "2024-01-15 10:30", changes: "Initial draft created" },
    { id: "2", version: 2, timestamp: "2024-01-15 11:45", changes: "Updated liability clauses" },
    { id: "3", version: 3, timestamp: "2024-01-15 14:20", changes: "Added termination provisions" }
  ]);

  const { toast } = useToast();

  const documentTemplates: DocumentTemplate[] = [
    {
      id: "legal-notice",
      name: "Legal Notice",
      category: "Notices",
      description: "Standard legal notice template for various purposes",
      fields: ["recipient", "subject", "grounds", "demands"]
    },
    {
      id: "power-of-attorney",
      name: "Power of Attorney",
      category: "Authorization",
      description: "General power of attorney document",
      fields: ["principal", "agent", "powers", "duration"]
    },
    {
      id: "affidavit",
      name: "Affidavit",
      category: "Sworn Statements",
      description: "General affidavit template",
      fields: ["deponent", "facts", "purpose", "verification"]
    },
    {
      id: "cease-desist",
      name: "Cease and Desist Letter",
      category: "Notices",
      description: "Template for cease and desist communications",
      fields: ["recipient", "violation", "demands", "consequences"]
    },
    {
      id: "demand-letter",
      name: "Demand Letter",
      category: "Correspondence",
      description: "Template for formal demand letters",
      fields: ["debtor", "amount", "basis", "deadline"]
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = documentTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setDocumentTitle(template.name);
      // Reset form fields
      const newFields: {[key: string]: string} = {};
      template.fields.forEach(field => {
        newFields[field] = "";
      });
      setFormFields(newFields);
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || !documentTitle) {
      toast({
        title: "Missing Information",
        description: "Please select a template and fill in the required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      
      const template = documentTemplates.find(t => t.id === selectedTemplate);
      let mockDocument = "";

      switch (selectedTemplate) {
        case "legal-notice":
          mockDocument = `
LEGAL NOTICE

To: ${formFields.recipient || "[Recipient Name]"}

Subject: ${formFields.subject || "[Subject of Notice]"}

Dear Sir/Madam,

This notice is served upon you under the provisions of law regarding ${formFields.subject || "[matter]"}.

TAKE NOTICE that ${formFields.grounds || "[legal grounds and facts]"}.

YOU ARE HEREBY CALLED UPON to ${formFields.demands || "[specific demands]"} within 15 days of receipt of this notice, failing which appropriate legal proceedings will be initiated against you.

TAKE FURTHER NOTICE that this notice is being served upon you to give you an opportunity to resolve the matter amicably and avoid unnecessary litigation.

Date: ${new Date().toLocaleDateString()}

[Your Name]
[Your Designation]
[Address]
          `;
          break;
        
        case "power-of-attorney":
          mockDocument = `
POWER OF ATTORNEY

I, ${formFields.principal || "[Principal Name]"}, son/daughter of [Father's Name], aged [Age] years, resident of [Address], do hereby nominate, constitute and appoint ${formFields.agent || "[Agent Name]"}, son/daughter of [Father's Name], aged [Age] years, resident of [Address], as my true and lawful attorney.

POWERS GRANTED:
${formFields.powers || "[Specific powers being granted]"}

DURATION:
This Power of Attorney shall remain in force for ${formFields.duration || "[duration]"} unless revoked earlier.

IN WITNESS WHEREOF, I have executed this Power of Attorney on ${new Date().toLocaleDateString()}.

Principal: ____________________
${formFields.principal || "[Principal Name]"}

Witnesses:
1. ____________________
2. ____________________
          `;
          break;
        
        default:
          mockDocument = `
${documentTitle.toUpperCase()}

Date: ${new Date().toLocaleDateString()}

[Generated document content based on template: ${template?.name}]

${Object.entries(formFields).map(([key, value]) => 
  `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value || `[${key}]`}`
).join('\n')}

[Standard clauses and legal provisions would be included here based on the selected template]

Signature: ____________________
Date: ____________________
          `;
      }
      
      setGeneratedDocument(mockDocument);
      toast({
        title: "Document Generated",
        description: "Legal document has been successfully generated.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedDocument], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${documentTitle.replace(/\s+/g, "_")}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded",
      description: "Document has been downloaded successfully.",
    });
  };

  const selectedTemplateObj = documentTemplates.find(t => t.id === selectedTemplate);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Legal Document Drafting</h1>
        <p className="text-muted-foreground">
          Create professional legal documents using AI-powered templates. Choose from various document types and customize as needed.
        </p>
      </div>

      <Tabs defaultValue="draft" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="draft">Draft Document</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="versions">Version History</TabsTrigger>
        </TabsList>

        <TabsContent value="draft" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Document Templates
                </CardTitle>
                <CardDescription>
                  Choose from available legal document templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document template" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex flex-col">
                          <span>{template.name}</span>
                          <span className="text-xs text-muted-foreground">{template.category}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedTemplateObj && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{selectedTemplateObj.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedTemplateObj.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedTemplateObj && (
              <Card>
                <CardHeader>
                  <CardTitle>Document Details</CardTitle>
                  <CardDescription>
                    Fill in the required information for your document
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Document Title</label>
                    <Input
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      placeholder="Enter document title"
                    />
                  </div>

                  {selectedTemplateObj.fields.map(field => (
                    <div key={field}>
                      <label className="text-sm font-medium mb-2 block capitalize">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <Textarea
                        value={formFields[field] || ""}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        placeholder={`Enter ${field}`}
                        className="min-h-[80px]"
                      />
                    </div>
                  ))}

                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>Generating Document...</>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Document
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Document
              </CardTitle>
              <CardDescription>
                Review your generated legal document
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedDocument ? (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg max-h-[600px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {generatedDocument}
                    </pre>
                  </div>
                  <Button onClick={handleDownload} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Generated document will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Document Preview
              </CardTitle>
              <CardDescription>
                Preview your document before finalizing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedDocument ? (
                <div className="bg-white border rounded-lg p-8 shadow-sm">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedDocument}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No document to preview. Generate a document first.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Version History
              </CardTitle>
              <CardDescription>
                Track changes and manage document versions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {versions.map(version => (
                  <div key={version.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Version {version.version}</div>
                      <div className="text-sm text-muted-foreground">
                        {version.timestamp} - {version.changes}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Restore</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalDocumentDraftingPage;