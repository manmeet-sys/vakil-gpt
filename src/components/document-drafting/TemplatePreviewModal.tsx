
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Star, 
  Clock, 
  User, 
  Calendar, 
  Download,
  Edit,
  Eye,
  TrendingUp
} from 'lucide-react';
import { LegalTemplate } from '@/types/template';
import { motion } from 'framer-motion';

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
  const [isEditing, setIsEditing] = useState(false);
  const [customContent, setCustomContent] = useState('');
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (template) {
      setCustomContent(template.content);
      // Initialize placeholder values
      const initialValues: Record<string, string> = {};
      Object.keys(template.placeholders).forEach(key => {
        initialValues[key] = template.placeholders[key] as string || '';
      });
      setPlaceholderValues(initialValues);
    }
  }, [template]);

  if (!template) return null;

  const handlePlaceholderChange = (key: string, value: string) => {
    setPlaceholderValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyPlaceholders = () => {
    let updatedContent = template.content;
    Object.entries(placeholderValues).forEach(([key, value]) => {
      const placeholder = `[${key}]`;
      updatedContent = updatedContent.replace(new RegExp(placeholder, 'g'), value);
    });
    setCustomContent(updatedContent);
  };

  const downloadTemplate = () => {
    const content = isEditing ? customContent : template.content;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold mb-2">
                {template.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {template.description}
              </DialogDescription>
            </div>
            {template.isFeatured && (
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 ml-2" />
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline">{template.category}</Badge>
            <Badge variant="outline">{template.complexity}</Badge>
            {template.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {template.metadata.author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Updated {template.metadata.lastUpdated}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {template.metadata.estimatedTime}
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {template.metadata.usage_count} uses
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 space-y-4">
          {/* Placeholder Fields */}
          {Object.keys(template.placeholders).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Template Fields</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={applyPlaceholders}
                  className="text-xs"
                >
                  Apply to Content
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-32 overflow-y-auto">
                {Object.entries(template.placeholders).map(([key, defaultValue]) => (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={key} className="text-xs">
                      {key.replace(/_/g, ' ')}
                    </Label>
                    <Input
                      id={key}
                      value={placeholderValues[key] || ''}
                      onChange={(e) => handlePlaceholderChange(key, e.target.value)}
                      placeholder={defaultValue as string}
                      className="text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Preview/Edit */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Template Content</Label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs"
                >
                  {isEditing ? (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </>
                  ) : (
                    <>
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadTemplate}
                  className="text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-64 border rounded-md">
              {isEditing ? (
                <Textarea
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  className="min-h-64 resize-none border-0"
                  placeholder="Edit template content..."
                />
              ) : (
                <div className="p-3 whitespace-pre-wrap text-sm font-mono">
                  {customContent}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="outline"
              onClick={downloadTemplate}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
          <Button
            onClick={() => {
              onUseTemplate(template, isEditing ? customContent : undefined);
              onClose();
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Use Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewModal;
