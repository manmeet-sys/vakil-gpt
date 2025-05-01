
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Search, Star, Clock, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filteredTemplates, setFilteredTemplates] = useState<Record<string, Template[]>>(templates);
  const [starred, setStarred] = useState<string[]>([]);
  
  // Load starred templates
  useEffect(() => {
    try {
      const savedStarred = localStorage.getItem('starredTemplates');
      if (savedStarred) {
        setStarred(JSON.parse(savedStarred));
      }
    } catch (e) {
      console.error('Failed to parse starred templates', e);
      localStorage.removeItem('starredTemplates');
    }
  }, []);

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

  // Toggle star status of a template
  const toggleStar = useCallback((templateId: string) => {
    setStarred(prev => {
      const isCurrentlyStarred = prev.includes(templateId);
      let newStarred: string[];
      
      if (isCurrentlyStarred) {
        newStarred = prev.filter(id => id !== templateId);
        toast.info('Template removed from favorites');
      } else {
        newStarred = [...prev, templateId];
        toast.success('Template added to favorites');
      }
      
      try {
        localStorage.setItem('starredTemplates', JSON.stringify(newStarred));
      } catch (e) {
        console.error('Failed to save starred templates', e);
      }
      
      return newStarred;
    });
  }, []);

  // Filter templates based on category, search term and sort order
  useEffect(() => {
    // First filter by category and search term
    let filtered: Record<string, Template[]> = {};
    
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
    
    // Then sort each category
    Object.keys(filtered).forEach(category => {
      filtered[category] = filtered[category].sort((a, b) => {
        const aIsStarred = starred.includes(a.id);
        const bIsStarred = starred.includes(b.id);
        
        // Starred items always come first
        if (aIsStarred && !bIsStarred) return -1;
        if (!aIsStarred && bIsStarred) return 1;
        
        // Then sort by name
        if (sortOrder === "asc") {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      });
    });
    
    setFilteredTemplates(filtered);
  }, [selectedCategory, searchTerm, templates, sortOrder, starred]);

  const handleSelectTemplate = useCallback((templateId: string) => {
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
  }, [onSelect, recentlyUsed, templates]);

  // Calculate the total number of templates that match the current filters
  const totalResults = useMemo(() => {
    return Object.values(filteredTemplates).reduce((sum, templates) => sum + templates.length, 0);
  }, [filteredTemplates]);

  const toggleSortOrder = () => {
    setSortOrder(current => current === "asc" ? "desc" : "asc");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Select a Template</CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            {totalResults} Templates
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 transition-all duration-200 border-gray-200 focus:border-blue-300 dark:border-gray-700 dark:focus:border-blue-600"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="space-y-2 flex-grow">
              <label htmlFor="template-category" className="text-sm font-medium">Category</label>
              <Select 
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger id="template-category" className="border-gray-200 dark:border-gray-700">
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
            
            <Button 
              variant="outline" 
              size="sm"
              className="mt-6 flex items-center gap-1"
              onClick={toggleSortOrder}
            >
              <Filter className="h-3.5 w-3.5 mr-1" />
              Sort
              {sortOrder === "asc" ? (
                <ArrowUp className="h-3.5 w-3.5" />
              ) : (
                <ArrowDown className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>

          {recentlyUsed.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-500" /> 
                Recently Used
              </h3>
              <div className="grid gap-2">
                <AnimatePresence>
                  {recentlyUsed.map((template) => (
                    <motion.div
                      key={`recent-${template.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-3 border rounded-md hover:bg-muted cursor-pointer group relative"
                      onClick={() => handleSelectTemplate(template.id)}
                    >
                      <div className="font-medium text-sm flex items-center justify-between">
                        <span>{template.title}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0 h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(template.id);
                          }}
                        >
                          <Star 
                            className={`h-4 w-4 ${starred.includes(template.id) 
                              ? 'text-yellow-500 fill-yellow-500' 
                              : 'text-gray-400'}`} 
                          />
                          <span className="sr-only">
                            {starred.includes(template.id) ? 'Unstar' : 'Star'} template
                          </span>
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">{template.description}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium mb-2 block">Available Templates</label>
            <ScrollArea className="h-[300px] border rounded-md">
              <div className="p-4 space-y-4">
                {Object.keys(filteredTemplates).length === 0 ? (
                  <div className="text-sm text-center text-gray-500 py-8">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Search className="h-8 w-8 text-gray-400" />
                      <p>No templates found matching your criteria</p>
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  </div>
                ) : (
                  Object.keys(filteredTemplates).map((category) => (
                    <div key={category} className="space-y-2">
                      <h3 className="text-sm font-medium first-letter:uppercase">{category}</h3>
                      <div className="grid gap-2">
                        <AnimatePresence>
                          {filteredTemplates[category].map((template) => (
                            <motion.div
                              key={template.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="p-3 border rounded-md hover:bg-muted cursor-pointer group relative"
                              onClick={() => handleSelectTemplate(template.id)}
                            >
                              <div className="font-medium text-sm flex items-center justify-between">
                                <span>
                                  {template.title}
                                  {starred.includes(template.id) && (
                                    <Star className="inline-block ml-1.5 h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                                  )}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0 h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStar(template.id);
                                  }}
                                >
                                  <Star 
                                    className={`h-4 w-4 ${starred.includes(template.id) 
                                      ? 'text-yellow-500 fill-yellow-500' 
                                      : 'text-gray-400'}`} 
                                  />
                                  <span className="sr-only">
                                    {starred.includes(template.id) ? 'Unstar' : 'Star'} template
                                  </span>
                                </Button>
                              </div>
                              <div className="text-xs text-muted-foreground">{template.description}</div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
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
