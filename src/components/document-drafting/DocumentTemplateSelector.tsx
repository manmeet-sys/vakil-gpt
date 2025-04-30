
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
}

interface DocumentTemplateSelectorProps {
  onSelect: (templateId: string) => void;
}

const DocumentTemplateSelector: React.FC<DocumentTemplateSelectorProps> = ({ onSelect }) => {
  // Sample template data
  const templates: Record<string, Template[]> = {
    "contracts": [
      { id: "rental", title: "Rental Agreement", category: "contracts", description: "Standard rental agreement for residential property" },
      { id: "employment", title: "Employment Contract", category: "contracts", description: "Standard employment agreement with key terms" },
      { id: "services", title: "Service Agreement", category: "contracts", description: "Agreement for provision of services" }
    ],
    "legal": [
      { id: "nda", title: "Non-Disclosure Agreement", category: "legal", description: "Protect confidential information with this NDA" },
      { id: "poa", title: "Power of Attorney", category: "legal", description: "Authorize someone to act on your behalf" },
      { id: "will", title: "Simple Will", category: "legal", description: "Basic will template for estate planning" }
    ],
    "business": [
      { id: "partnership", title: "Partnership Agreement", category: "business", description: "Agreement between business partners" },
      { id: "invoice", title: "Professional Invoice", category: "business", description: "Invoice template for business use" }
    ]
  };

  const handleSelectTemplate = (templateId: string) => {
    onSelect(templateId);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Select a Template</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="template-category" className="text-sm font-medium">Category</label>
            <Select onValueChange={(value) => console.log(value)}>
              <SelectTrigger id="template-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="contracts">Contracts</SelectItem>
                <SelectItem value="legal">Legal Documents</SelectItem>
                <SelectItem value="business">Business Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Available Templates</label>
            <ScrollArea className="h-[300px] border rounded-md">
              <div className="p-4 space-y-4">
                {Object.keys(templates).map((category) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-sm font-medium first-letter:uppercase">{category}</h3>
                    <div className="grid gap-2">
                      {templates[category].map((template) => (
                        <div
                          key={template.id}
                          className="p-3 border rounded-md hover:bg-muted cursor-pointer"
                          onClick={() => handleSelectTemplate(template.id)}
                        >
                          <div className="font-medium text-sm">{template.title}</div>
                          <div className="text-xs text-muted-foreground">{template.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentTemplateSelector;
