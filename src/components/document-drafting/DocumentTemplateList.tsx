
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, Trophy } from 'lucide-react';
import { 
  getDocumentTemplates, 
  updateTemplateUsage, 
  searchTemplates, 
  filterTemplatesByCategory, 
  DocumentTemplate 
} from '@/services/documentTemplates';

type DocumentTemplateListProps = {
  onTemplateSelect: (template: DocumentTemplate) => void;
};

const DocumentTemplateList: React.FC<DocumentTemplateListProps> = ({ onTemplateSelect }) => {
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<DocumentTemplate[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'recent' | 'popular'>('all');

  // Categories for filter dropdown
  const categories = [
    { id: "all", name: "All Templates" },
    { id: "litigation", name: "Litigation" },
    { id: "contract", name: "Contracts" },
    { id: "property", name: "Property" },
    { id: "family", name: "Family Law" },
    { id: "corporate", name: "Corporate" },
    { id: "court_filing", name: "Court Filing" },
    { id: "personal", name: "Personal" },
    { id: "business", name: "Business" }
  ];

  // Load templates on component mount
  useEffect(() => {
    const loadedTemplates = getDocumentTemplates();
    setTemplates(loadedTemplates);
    setFilteredTemplates(loadedTemplates);
  }, []);

  // Apply filters and search whenever relevant states change
  useEffect(() => {
    let result = templates;
    
    // Apply category filter
    if (filter !== 'all') {
      result = filterTemplatesByCategory(filter, result);
    }
    
    // Apply search term
    if (searchTerm) {
      result = searchTemplates(searchTerm, result);
    }
    
    // Sort by view mode
    if (viewMode === 'popular') {
      result = [...result].sort((a, b) => b.popularity - a.popularity);
    } else if (viewMode === 'recent') {
      const lastUsed = JSON.parse(localStorage.getItem('lastUsedTemplates') || '{}');
      result = [...result].filter(t => lastUsed[t.id])
        .sort((a, b) => {
          const dateA = lastUsed[a.id] ? new Date(lastUsed[a.id]).getTime() : 0;
          const dateB = lastUsed[b.id] ? new Date(lastUsed[b.id]).getTime() : 0;
          return dateB - dateA;
        });
    }
    
    setFilteredTemplates(result);
  }, [filter, searchTerm, templates, viewMode]);

  const handleCategoryChange = (categoryId: string) => {
    setFilter(categoryId);
    console.log(`Category selected: ${categoryId}`);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleViewModeChange = (mode: 'all' | 'recent' | 'popular') => {
    setViewMode(mode);
  };

  // Track template usage
  const handleTemplateSelect = (template: DocumentTemplate) => {
    updateTemplateUsage(template.id);
    onTemplateSelect(template);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <Select onValueChange={handleCategoryChange} defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px] h-8 text-xs">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex space-x-1">
            <Badge 
              variant={viewMode === 'all' ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => handleViewModeChange('all')}
            >
              All
            </Badge>
            <Badge 
              variant={viewMode === 'recent' ? "default" : "outline"} 
              className="cursor-pointer flex items-center gap-1"
              onClick={() => handleViewModeChange('recent')}
            >
              <Calendar className="h-3 w-3" />
              Recent
            </Badge>
            <Badge 
              variant={viewMode === 'popular' ? "default" : "outline"} 
              className="cursor-pointer flex items-center gap-1"
              onClick={() => handleViewModeChange('popular')}
            >
              <Trophy className="h-3 w-3" />
              Popular
            </Badge>
          </div>
        </div>
      </div>
      
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-md border border-dashed">
          {searchTerm || filter !== 'all' ? 
            "No templates found matching the current filter." : 
            "No templates available."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors border-gray-200 dark:border-gray-800" 
              onClick={() => handleTemplateSelect(template)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">{template.title}</h4>
                  <div className="flex items-center gap-1">
                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded px-2 py-0.5">
                      {template.type}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span className="text-xs">{template.category}</span>
                  <span className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    {template.popularity}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentTemplateList;
