import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Grid, 
  List, 
  Star,
  ArrowRight,
  FileText,
  MessageSquare,
  Scale,
  Shield,
  BarChart2,
  Briefcase,
  Calculator,
  CalendarClock,
  IndianRupee,
  BookOpen,
  PenLine,
  Gavel,
  FileSearch,
  AlertTriangle,
  Handshake,
  Sparkles,
  TrendingUp,
  Brain,
  Zap
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const ToolsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favoriteTools');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toolCategories = [
    { id: 'all', name: 'All Tools' },
    { id: 'practice', name: 'Practice Tools' },
    { id: 'ai', name: 'AI Assistant' },
    { id: 'research', name: 'Research' },
    { id: 'compliance', name: 'Compliance' },
    { id: 'business', name: 'Business' },
    { id: 'financial', name: 'Financial' }
  ];

  const allTools = [
    {
      id: 'billing-tracking',
      title: 'Billing Tracking',
      description: 'Track billable hours, generate invoices, and manage client billing efficiently.',
      category: 'practice',
      icon: <IndianRupee className="h-5 w-5" />,
      path: '/billing-tracking',
      badge: 'Popular',
      isPopular: true
    },
    {
      id: 'case-management',
      title: 'Case Management',
      description: 'Organize cases, track deadlines, and manage client information.',
      category: 'practice',
      icon: <FileText className="h-5 w-5" />,
      path: '/court-filing',
      badge: null,
      isPopular: false
    },
    {
      id: 'deadline-management',
      title: 'Deadline Management',
      description: 'Never miss important legal deadlines with smart reminders.',
      category: 'practice',
      icon: <CalendarClock className="h-5 w-5" />,
      path: '/deadline-management',
      badge: 'New',
      isPopular: false
    },
    {
      id: 'document-drafting',
      title: 'Document Drafting',
      description: 'Create professional legal documents with AI assistance.',
      category: 'practice',
      icon: <PenLine className="h-5 w-5" />,
      path: '/legal-document-drafting',
      badge: 'New',
      isPopular: false
    },
    {
      id: 'legal-chat',
      title: 'Legal Chat Bot',
      description: '24/7 AI-powered legal assistance for quick consultations.',
      category: 'ai',
      icon: <MessageSquare className="h-5 w-5" />,
      path: '/chat',
      badge: 'OpenAI',
      isPopular: true
    },
    {
      id: 'document-analyzer',
      title: 'Document Analyzer',
      description: 'AI-powered analysis of legal documents and contracts.',
      category: 'ai',
      icon: <FileSearch className="h-5 w-5" />,
      path: '/legal-document-analyzer',
      badge: 'OpenAI',
      isPopular: true
    },
    {
      id: 'brief-generation',
      title: 'Brief Generation',
      description: 'Generate comprehensive legal briefs with AI assistance.',
      category: 'ai',
      icon: <BookOpen className="h-5 w-5" />,
      path: '/legal-brief-generation',
      badge: 'OpenAI',
      isPopular: false
    },
    {
      id: 'case-law-research',
      title: 'Case Law Research',
      description: 'Search and analyze Indian case law and precedents.',
      category: 'research',
      icon: <Scale className="h-5 w-5" />,
      path: '/case-law-research',
      badge: 'OpenAI',
      isPopular: true
    },
    {
      id: 'statute-tracker',
      title: 'Statute Tracker',
      description: 'Track changes in Indian statutes and legal updates.',
      category: 'research',
      icon: <BookOpen className="h-5 w-5" />,
      path: '/statute-tracker',
      badge: 'Updated',
      isPopular: false
    },
    {
      id: 'knowledge-base',
      title: 'Legal Knowledge Base',
      description: 'Access comprehensive Indian legal knowledge repository.',
      category: 'research',
      icon: <BookOpen className="h-5 w-5" />,
      path: '/knowledge',
      badge: null,
      isPopular: false
    },
    {
      id: 'contract-drafting',
      title: 'Contract Drafting',
      description: 'Create legally compliant contracts with AI guidance.',
      category: 'compliance',
      icon: <FileText className="h-5 w-5" />,
      path: '/contract-drafting',
      badge: 'OpenAI',
      isPopular: false
    },
    {
      id: 'gdpr-compliance',
      title: 'DPDP Compliance',
      description: 'Ensure compliance with Data Protection laws in India.',
      category: 'compliance',
      icon: <Shield className="h-5 w-5" />,
      path: '/gdpr-compliance',
      badge: 'Critical',
      isPopular: true
    },
    {
      id: 'aml-compliance',
      title: 'AML Compliance',
      description: 'Anti-Money Laundering compliance tools and monitoring.',
      category: 'compliance',
      icon: <AlertTriangle className="h-5 w-5" />,
      path: '/aml-compliance',
      badge: null,
      isPopular: false
    },
    {
      id: 'litigation-prediction',
      title: 'Litigation Prediction',
      description: 'Predict case outcomes using AI and historical data.',
      category: 'ai',
      icon: <BarChart2 className="h-5 w-5" />,
      path: '/litigation-prediction',
      badge: 'OpenAI',
      isPopular: false
    },
    {
      id: 'plea-bargain',
      title: 'Plea Bargain Assistant',
      description: 'Navigate plea bargaining under Indian criminal law.',
      category: 'ai',
      icon: <Gavel className="h-5 w-5" />,
      path: '/plea-bargain',
      badge: 'OpenAI',
      isPopular: false
    },
    {
      id: 'sentencing-predictor',
      title: 'Sentencing Predictor',
      description: 'Analyze potential sentences under Indian criminal codes.',
      category: 'ai',
      icon: <Scale className="h-5 w-5" />,
      path: '/sentencing-predictor',
      badge: 'OpenAI',
      isPopular: false
    },
    {
      id: 'startup-toolkit',
      title: 'Startup Toolkit',
      description: 'Complete legal toolkit for Indian startups and businesses.',
      category: 'business',
      icon: <Briefcase className="h-5 w-5" />,
      path: '/startup-toolkit',
      badge: 'OpenAI',
      isPopular: true
    },
    {
      id: 'ma-due-diligence',
      title: 'M&A Due Diligence',
      description: 'Comprehensive due diligence for mergers and acquisitions.',
      category: 'business',
      icon: <Handshake className="h-5 w-5" />,
      path: '/m&a-due-diligence',
      badge: 'OpenAI',
      isPopular: false
    },
    {
      id: 'ip-protection',
      title: 'IP Protection',
      description: 'Protect intellectual property rights in India.',
      category: 'business',
      icon: <Shield className="h-5 w-5" />,
      path: '/ip-protection',
      badge: 'OpenAI',
      isPopular: false
    },
    {
      id: 'financial-obligations',
      title: 'Financial Obligations',
      description: 'Track and manage financial legal obligations.',
      category: 'financial',
      icon: <Calculator className="h-5 w-5" />,
      path: '/financial-obligations',
      badge: null,
      isPopular: false
    },
    {
      id: 'fraud-detector',
      title: 'Financial Fraud Detector',
      description: 'AI-powered detection of financial fraud patterns.',
      category: 'financial',
      icon: <AlertTriangle className="h-5 w-5" />,
      path: '/fraud-detector',
      badge: 'OpenAI',
      isPopular: false
    },
    {
      id: 'tax-compliance',
      title: 'Tax Compliance',
      description: 'Ensure compliance with Indian tax regulations.',
      category: 'financial',
      icon: <Calculator className="h-5 w-5" />,
      path: '/tax-compliance',
      badge: 'OpenAI',
      isPopular: false
    }
  ];

  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (toolId: string) => {
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteTools', JSON.stringify(newFavorites));
  };

  const handleToolClick = (path: string, toolTitle: string) => {
    const recentTools = JSON.parse(localStorage.getItem('recentlyViewedTools') || '[]');
    const updatedRecent = [toolTitle, ...recentTools.filter((t: string) => t !== toolTitle)].slice(0, 5);
    localStorage.setItem('recentlyViewedTools', JSON.stringify(updatedRecent));
    navigate(path);
  };

  const getBadgeVariant = (badge: string | null) => {
    if (!badge) return '';
    
    switch (badge.toLowerCase()) {
      case 'new':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'popular':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'updated':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'openai':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Legal Tools | VakilGPT</title>
        <meta name="description" content="Comprehensive suite of AI-powered legal tools for Indian legal professionals" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header with Stats */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Brain className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Legal Suite</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Legal Tools <span className="text-primary">Arsenal</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
              Advanced AI-powered legal tools designed for Indian legal professionals
            </p>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-primary">{allTools.length}+</div>
              <div className="text-sm text-muted-foreground">Legal Tools</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground">AI-Powered</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Indian Law</div>
            </Card>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-gradient-to-r from-card via-card/50 to-card border rounded-2xl p-8 mb-8 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col gap-6">
            {/* Search Section */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold mb-2">Find Your Perfect Legal Tool</h3>
              <p className="text-muted-foreground text-sm">Search through our comprehensive collection of AI-powered legal tools</p>
            </div>
            
            <div className="relative max-w-2xl mx-auto w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="e.g., case law research, contract analysis, compliance..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-12 text-base rounded-xl border-border/50 focus:border-primary/50 shadow-sm"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  ×
                </Button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {toolCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "rounded-full transition-all duration-200",
                      selectedCategory === category.id 
                        ? "shadow-md scale-105" 
                        : "hover:scale-105"
                    )}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* View Mode & Filter Info */}
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {filteredTools.length} of {allTools.length} tools
                </div>
                <div className="flex gap-1 border rounded-lg p-1 bg-background/50">
                  <Button
                    variant={viewMode === 'grid' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${selectedCategory}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
            )}
          >
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="group"
              >
                <Card className={cn(
                  "h-full group cursor-pointer border-border/50 overflow-hidden",
                  "hover:shadow-xl hover:shadow-primary/5 transition-all duration-300",
                  "hover:border-primary/30 hover:scale-[1.02]",
                  "bg-gradient-to-br from-card via-card to-card/50"
                )}>
                  <CardHeader className="pb-3 relative">
                    {/* AI Badge for AI-powered tools */}
                    {tool.badge === 'OpenAI' && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          "bg-gradient-to-br from-primary/10 to-primary/5",
                          "group-hover:from-primary/20 group-hover:to-primary/10",
                          "transition-all duration-300 group-hover:scale-110"
                        )}>
                          <div className="text-primary group-hover:scale-110 transition-transform">
                            {tool.icon}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                              {tool.title}
                            </CardTitle>
                          </div>
                          {tool.badge && tool.badge !== 'OpenAI' && (
                            <Badge variant="outline" className={cn("text-xs h-5", getBadgeVariant(tool.badge))}>
                              {tool.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-yellow-100 hover:text-yellow-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(tool.id);
                        }}
                      >
                        <Star className={cn(
                          "h-4 w-4 transition-all duration-200",
                          favorites.includes(tool.id) 
                            ? "fill-yellow-400 text-yellow-400 scale-110" 
                            : "text-muted-foreground hover:text-yellow-500"
                        )} />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <CardDescription className="mb-6 text-sm leading-relaxed line-clamp-3">
                      {tool.description}
                    </CardDescription>
                    
                    {/* Progress bar showing tool capability */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>AI Capability</span>
                        <span>{tool.badge === 'OpenAI' ? '95%' : '70%'}</span>
                      </div>
                      <Progress 
                        value={tool.badge === 'OpenAI' ? 95 : 70} 
                        className="h-1.5"
                      />
                    </div>
                    
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between text-primary hover:text-primary-foreground",
                        "hover:bg-primary p-3 h-auto rounded-lg",
                        "group-hover:shadow-md transition-all duration-300"
                      )}
                      onClick={() => handleToolClick(tool.path, tool.title)}
                    >
                      <span className="font-medium">Explore Tool</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* No Results */}
        {filteredTools.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tools found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}

        {/* Stats */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {filteredTools.length} of {allTools.length} tools
        </div>
      </div>
    </AppLayout>
  );
};

export default ToolsPage;