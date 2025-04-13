
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Bookmark, ArrowRight, FileText, Book, Shield, Scale, PieChart, Building, Users } from 'lucide-react';
import { GuideService } from '@/services/guideService';
import { Skeleton } from '@/components/ui/skeleton';

interface Guide {
  id: number;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: number;
  timeToComplete: string;
  updatedAt: string;
  image: string;
}

interface Category {
  name: string;
  icon: string;
  color: string;
}

const GuidesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [guides, setGuides] = useState<Guide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [guides, categories] = await Promise.all([
        GuideService.getAllGuides(),
        GuideService.getCategories()
      ]);
      
      setGuides(guides);
      setCategories(categories);
    } catch (error) {
      console.error("Error loading guides data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      await fetchData();
      return;
    }
    
    setIsLoading(true);
    try {
      const results = await GuideService.searchGuides(searchQuery);
      setGuides(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCategoryClick = async (categoryName: string) => {
    setIsLoading(true);
    try {
      const results = await GuideService.getGuidesByCategory(categoryName);
      setGuides(results);
      setSearchQuery(`Category: ${categoryName}`);
    } catch (error) {
      console.error("Category filter error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewGuide = (guide: Guide) => {
    // Track user engagement
    GuideService.trackGuideView(guide);
    // Navigate to guide details
    navigate(`/guides/${guide.id}`);
  };
  
  const filteredGuides = searchQuery && searchQuery.startsWith("Category:")
    ? guides 
    : searchQuery 
      ? guides.filter(guide => 
          guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guide.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : guides;
  
  // Function to get badge color based on level
  const getLevelBadgeColor = (level: string) => {
    switch(level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Function to get category icon
  const getCategoryIcon = (categoryName: string) => {
    // Map icon strings to actual components
    const iconMap: Record<string, any> = {
      Shield,
      Building,
      Scale,
      Users,
      PieChart,
      FileText,
      Book
    };
    
    const category = categories.find(cat => cat.name === categoryName);
    if (category) {
      const IconComponent = iconMap[category.icon] || Book;
      return <IconComponent className={`h-4 w-4 ${category.color}`} />;
    }
    return <Book className="h-4 w-4 text-gray-500" />;
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Legal Guides | VakilGPT</title>
        <meta name="description" content="Comprehensive step-by-step guides on various legal processes and procedures in India" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Legal Guides & Tutorials
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Step-by-step instructions for navigating common legal processes and procedures in India
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for guides..."
              className="pl-10"
              value={searchQuery.startsWith("Category:") ? "" : searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        {/* Categories Section */}
        {!searchQuery && !isLoading && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map(category => {
                const IconComponent = {
                  Shield,
                  Building,
                  Scale,
                  Users,
                  PieChart,
                  FileText,
                  Book
                }[category.icon] || Book;
                
                return (
                  <div 
                    key={category.name}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:border-legal-accent dark:hover:border-legal-accent transition-colors cursor-pointer"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className={`w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3 ${category.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {category.name}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Featured Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {searchQuery && searchQuery.startsWith("Category:") ? (
              `Guides: ${searchQuery.replace("Category: ", "")}`
            ) : searchQuery ? (
              `Search Results (${filteredGuides.length})`
            ) : (
              'All Guides'
            )}
          </h2>
          
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearchQuery('');
                fetchData();
              }}
            >
              Clear Filter
            </Button>
          )}
        </div>
        
        {/* Guides Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                <Skeleton className="w-full h-48" />
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              No guides found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery.startsWith("Category:") ? (
                `We couldn't find any guides in the category "${searchQuery.replace("Category: ", "")}"`
              ) : (
                `We couldn't find any guides matching "${searchQuery}"`
              )}
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              fetchData();
            }}>
              View All Guides
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map(guide => (
              <div 
                key={guide.id}
                onClick={() => handleViewGuide(guide)}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={guide.image} 
                    alt={guide.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 p-3 backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 flex items-center gap-2">
                    {getCategoryIcon(guide.category)}
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {guide.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getLevelBadgeColor(guide.level)}>
                      {guide.level}
                    </Badge>
                    <div className="flex items-center text-gray-500 text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      {guide.steps} steps
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-legal-accent dark:group-hover:text-legal-accent transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {guide.description}
                  </p>
                  <div className="flex items-center justify-between text-gray-500 text-sm">
                    <div className="flex items-center">
                      <Bookmark className="h-4 w-4 mr-1" />
                      {guide.timeToComplete}
                    </div>
                    <span className="text-xs">
                      Updated: {guide.updatedAt}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-legal-accent/10 to-blue-500/10 rounded-xl p-8 border border-legal-accent/20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Need More Personalized Help?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our AI legal assistant can provide customized guidance for your specific legal needs.
              Try our interactive chat interface for instant legal assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-legal-accent hover:bg-legal-accent/90">
                <Link to="/chat">
                  Try Legal Chat <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/tools">
                  Explore Legal Tools
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default GuidesPage;
