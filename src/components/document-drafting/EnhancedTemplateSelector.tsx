
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  TrendingUp, 
  Grid, 
  List,
  ChevronRight,
  Building,
  Briefcase,
  Home,
  Users,
  Scale,
  Lightbulb,
  DollarSign,
  Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { LegalTemplate, TemplateSearchFilters } from '@/types/template';
import { templateService, TEMPLATE_CATEGORIES } from '@/services/templateService';

interface EnhancedTemplateSelectorProps {
  onSelect: (template: LegalTemplate) => void;
}

const iconMap = {
  Building,
  Briefcase,
  Home,
  Users,
  Scale,
  Lightbulb,
  DollarSign,
  Calculator
};

const EnhancedTemplateSelector: React.FC<EnhancedTemplateSelectorProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [complexity, setComplexity] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('browse');
  const [templates, setTemplates] = useState<LegalTemplate[]>([]);
  const [featuredTemplates, setFeaturedTemplates] = useState<LegalTemplate[]>([]);
  const [popularTemplates, setPopularTemplates] = useState<LegalTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const filters: TemplateSearchFilters = useMemo(() => ({
    searchTerm,
    category: selectedCategory || undefined,
    subcategory: selectedSubcategory || undefined,
    complexity: complexity || undefined
  }), [searchTerm, selectedCategory, selectedSubcategory, complexity]);

  useEffect(() => {
    loadTemplates();
  }, [filters]);

  useEffect(() => {
    loadFeaturedTemplates();
    loadPopularTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const result = await templateService.searchTemplates(filters);
      setTemplates(result.templates);
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFeaturedTemplates = async () => {
    try {
      const featured = await templateService.getFeaturedTemplates(6);
      setFeaturedTemplates(featured);
    } catch (error) {
      console.error('Failed to load featured templates:', error);
    }
  };

  const loadPopularTemplates = async () => {
    try {
      const popular = await templateService.getPopularTemplates(10);
      setPopularTemplates(popular);
    } catch (error) {
      console.error('Failed to load popular templates:', error);
    }
  };

  const handleTemplateSelect = async (template: LegalTemplate) => {
    try {
      await templateService.incrementUsageCount(template.id);
      onSelect(template);
      toast.success(`Selected: ${template.title}`);
    } catch (error) {
      console.error('Error selecting template:', error);
      toast.error('Failed to select template');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setComplexity('');
  };

  const selectedCategoryData = TEMPLATE_CATEGORIES.find(cat => cat.id === selectedCategory);

  const renderTemplateCard = (template: LegalTemplate, compact: boolean = false) => (
    <motion.div
      key={template.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`cursor-pointer ${compact ? 'mb-2' : 'mb-4'}`}
      onClick={() => handleTemplateSelect(template)}
    >
      <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
        <CardContent className={compact ? 'p-3' : 'p-4'}>
          <div className="flex justify-between items-start mb-2">
            <h4 className={`font-semibold ${compact ? 'text-sm' : 'text-base'} line-clamp-2`}>
              {template.title}
            </h4>
            <div className="flex items-center gap-1 ml-2">
              <Badge variant="outline" className="text-xs">
                {template.complexity}
              </Badge>
              {template.isFeatured && (
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              )}
            </div>
          </div>
          
          <p className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'} line-clamp-2 mb-2`}>
            {template.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {template.metadata.usage_count}
              </div>
              {template.metadata.estimatedTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {template.metadata.estimatedTime}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Legal Document Templates
          </CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {templates.length} Templates
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse All</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {TEMPLATE_CATEGORIES.map(category => {
                      const IconComponent = iconMap[category.icon as keyof typeof iconMap];
                      return (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            {IconComponent && <IconComponent className="h-4 w-4" />}
                            {category.name}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {selectedCategoryData && (
                  <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select Subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Subcategories</SelectItem>
                      {selectedCategoryData.subcategories.map(sub => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Select value={complexity} onValueChange={setComplexity}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <Filter className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                  
                  <div className="flex rounded-md border">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Navigation */}
            {!selectedCategory && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {TEMPLATE_CATEGORIES.map(category => {
                  const IconComponent = iconMap[category.icon as keyof typeof iconMap];
                  return (
                    <Card
                      key={category.id}
                      className="cursor-pointer hover:shadow-md transition-all duration-200 border-l-4"
                      style={{ borderLeftColor: `var(--${category.color}-500)` }}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          {IconComponent && <IconComponent className="h-4 w-4" />}
                          <h4 className="font-medium text-sm">{category.name}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {category.subcategories.length} subcategories
                          </Badge>
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Templates List */}
            <ScrollArea className="h-[500px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No templates found matching your criteria.</p>
                  <Button variant="link" onClick={clearFilters} className="mt-2">
                    Clear filters to see all templates
                  </Button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-2'}>
                  <AnimatePresence>
                    {templates.map(template => renderTemplateCard(template, viewMode === 'list'))}
                  </AnimatePresence>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="featured" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Hand-picked templates recommended by our legal experts
            </div>
            <ScrollArea className="h-[500px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredTemplates.map(template => renderTemplateCard(template))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Most frequently used templates by the VakilGPT community
            </div>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {popularTemplates.map((template, index) => (
                  <div key={template.id} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      {renderTemplateCard(template, true)}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedTemplateSelector;
