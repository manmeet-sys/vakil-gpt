
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Eye, 
  Download, 
  Edit3, 
  Star, 
  Clock, 
  TrendingUp, 
  FileText,
  Copy,
  Share2
} from 'lucide-react';
import { LegalTemplate } from '@/types/template';
import { toast } from 'sonner';

interface TemplatePreviewModalProps {
  template: LegalTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: LegalTemplate, customizedContent?: string) => void;
}

const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onUseTemplate
}) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
  const [customizedContent, setCustomizedContent] = useState('');

  React.useEffect(() => {
    if (template) {
      setCustomizedContent(template.content);
      setPlaceholderValues(
        Object.keys(template.placeholders).reduce((acc, key) => ({
          ...acc,
          [key]: ''
        }), {})
      );
    }
  }, [template]);

  const handlePlaceholderChange = (key: string, value: string) => {
    setPlaceholderValues(prev => ({ ...prev, [key]: value }));
    
    // Update customized content with placeholder values
    let updatedContent = template?.content || '';
    Object.entries({ ...placeholderValues, [key]: value }).forEach(([placeholder, val]) => {
      const regex = new RegExp(`\\[${placeholder}\\]`, 'g');
      updatedContent = updatedContent.replace(regex, val || `[${placeholder}]`);
    });
    setCustomizedContent(updatedContent);
  };

  const handleUseTemplate = () => {
    if (template) {
      onUseTemplate(template, customizedContent);
      onClose();
      toast.success('Template loaded successfully!');
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(customizedContent);
    toast.success('Content copied to clipboard!');
  };

  const handleDownload = () => {
    if (template) {
      const blob = new Blob([customizedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.title.replace(/\s+/g, '_').toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Template downloaded!');
    }
  };

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {template.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{template.category}</Badge>
                <Badge variant="outline">{template.complexity}</Badge>
                {template.isFeatured && (
                  <Badge variant="default" className="bg-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {template.metadata.usage_count} uses
              </div>
              {template.metadata.estimatedTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {template.metadata.estimatedTime}
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[400px] w-full border rounded-md p-4">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {customizedContent}
                </pre>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="customize" className="flex-1 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
                <div>
                  <h4 className="font-medium mb-3">Fill Template Fields</h4>
                  <ScrollArea className="h-[350px]">
                    <div className="space-y-3">
                      {Object.keys(template.placeholders).map(placeholder => (
                        <div key={placeholder} className="space-y-1">
                          <Label htmlFor={placeholder} className="text-sm font-medium">
                            {placeholder.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </Label>
                          <Input
                            id={placeholder}
                            value={placeholderValues[placeholder] || ''}
                            onChange={(e) => handlePlaceholderChange(placeholder, e.target.value)}
                            placeholder={`Enter ${placeholder.toLowerCase()}`}
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Live Preview</h4>
                  <ScrollArea className="h-[350px] border rounded-md p-3">
                    <pre className="whitespace-pre-wrap text-xs font-mono">
                      {customizedContent}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="flex-1 overflow-hidden">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Template Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{template.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subcategory:</span>
                        <span>{template.subcategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Complexity:</span>
                        <span>{template.complexity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Jurisdiction:</span>
                        <span>{template.jurisdiction.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Metadata</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Version:</span>
                        <span>{template.metadata.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span>{template.metadata.lastUpdated}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Author:</span>
                        <span>{template.metadata.author}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopyContent}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleUseTemplate}>
              <Edit3 className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewModal;
