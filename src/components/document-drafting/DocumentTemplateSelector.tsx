
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Search, Star, Clock, ArrowUp, ArrowDown, Filter, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LegalTemplate } from '@/types/template';
import { templateService, TEMPLATE_CATEGORIES } from '@/services/templateService';
import EnhancedTemplateSelector from './EnhancedTemplateSelector';
import TemplatePreviewModal from './TemplatePreviewModal';

interface DocumentTemplateSelectorProps {
  onSelect: (templateId: string) => void;
}

const DocumentTemplateSelector: React.FC<DocumentTemplateSelectorProps> = ({ onSelect }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<LegalTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [recentlyUsed, setRecentlyUsed] = useState<LegalTemplate[]>([]);

  // Load recently used templates from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recentlyUsedTemplates');
      if (saved) {
        setRecentlyUsed(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse recently used templates', e);
      localStorage.removeItem('recentlyUsedTemplates');
    }
  }, []);

  const handleTemplateSelect = useCallback(async (template: LegalTemplate) => {
    try {
      // Update recently used templates
      const updatedRecent = [
        template, 
        ...recentlyUsed.filter(t => t.id !== template.id)
      ].slice(0, 5);
      
      setRecentlyUsed(updatedRecent);
      localStorage.setItem('recentlyUsedTemplates', JSON.stringify(updatedRecent));
      
      // Show preview modal
      setSelectedTemplate(template);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Error selecting template:', error);
      toast.error('Failed to select template');
    }
  }, [recentlyUsed]);

  const handleUseTemplate = useCallback((template: LegalTemplate, customizedContent?: string) => {
    onSelect(template.id);
    toast.success(`Using template: ${template.title}`);
  }, [onSelect]);

  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-4">
      {/* Recently Used Section */}
      {recentlyUsed.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" /> 
              Recently Used Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <AnimatePresence>
                {recentlyUsed.map((template) => (
                  <motion.div
                    key={`recent-${template.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 border rounded-md hover:bg-muted cursor-pointer group relative flex items-center justify-between"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm flex items-center justify-between">
                        <span>{template.title}</span>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {template.complexity}
                          </Badge>
                          {template.isFeatured && (
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{template.description}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">{template.category}</Badge>
                        {template.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(template);
                        setIsPreviewOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Template Selector */}
      <EnhancedTemplateSelector onSelect={handleTemplateSelect} />

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        template={selectedTemplate}
        isOpen={isPreviewOpen}
        onClose={handlePreviewClose}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  );
};

export default DocumentTemplateSelector;
