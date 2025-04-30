
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

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

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recentlyUsed, setRecentlyUsed] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Record<string, Template[]>>(templates);

  // Load recently used templates from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recentlyUsedTemplates');
      if (saved) {
        setRecentlyUsed(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse recently used templates', e);
      // Reset if there's an error with the stored data
      localStorage.removeItem('recentlyUsedTemplates');
    }
  }, []);

  // Filter templates based on category and search term
  useEffect(() => {
    if (selectedCategory === "all" && !searchTerm) {
      setFilteredTemplates(templates);
      return;
    }

    const filtered: Record<string, Template[]> = {};
    
    Object.keys(templates).forEach(category => {
      if (selectedCategory !== "all" && category !== selectedCategory) {
        return;
      }
      
      const matchingTemplates = templates[category].filter(template => 
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (matchingTemplates.length > 0) {
        filtered[category] = matchingTemplates;
      }
    });
    
    setFilteredTemplates(filtered);
  }, [selectedCategory, searchTerm, templates]);

  const handleSelectTemplate = (templateId: string) => {
    // Find the selected template from all categories
    let selectedTemplate: Template | null = null;
    
    for (const category in templates) {
      const found = templates[category].find(t => t.id === templateId);
      if (found) {
        selectedTemplate = found;
        break;
      }
    }
    
    if (selectedTemplate) {
      try {
        // Update recently used templates
        const updatedRecent = [
          selectedTemplate, 
          ...recentlyUsed.filter(t => t.id !== templateId)
        ].slice(0, 5);
        
        setRecentlyUsed(updatedRecent);
        localStorage.setItem('recentlyUsedTemplates', JSON.stringify(updatedRecent));
        
        toast.success(`Selected template: ${selectedTemplate.title}`);
      } catch (error) {
        console.error('Error saving template selection:', error);
      }
    }
    
    onSelect(templateId);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Select a Template</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="template-category" className="text-sm font-medium">Category</label>
            <Select 
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
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

          {recentlyUsed.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Recently Used</h3>
              <div className="grid gap-2">
                {recentlyUsed.map((template) => (
                  <div
                    key={`recent-${template.id}`}
                    className="p-3 border rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => handleSelectTemplate(template.id)}
                  >
                    <div className="font-medium text-sm">{template.title}</div>
                    <div className="text-xs text-muted-foreground">{template.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium mb-2 block">Available Templates</label>
            <ScrollArea className="h-[300px] border rounded-md">
              <div className="p-4 space-y-4">
                {Object.keys(filteredTemplates).length === 0 ? (
                  <p className="text-sm text-center text-gray-500 py-8">
                    No templates found matching your criteria
                  </p>
                ) : (
                  Object.keys(filteredTemplates).map((category) => (
                    <div key={category} className="space-y-2">
                      <h3 className="text-sm font-medium first-letter:uppercase">{category}</h3>
                      <div className="grid gap-2">
                        {filteredTemplates[category].map((template) => (
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
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentTemplateSelector;
