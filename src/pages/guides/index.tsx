
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Bookmark, ArrowRight, FileText, Book, Shield, Scale, PieChart, Building, Users } from 'lucide-react';

const GuidesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Sample guide categories with icons
  const categories = [
    { name: 'Constitutional Law', icon: Shield, color: 'text-blue-500' },
    { name: 'Corporate Law', icon: Building, color: 'text-indigo-500' },
    { name: 'Criminal Law', icon: Scale, color: 'text-red-500' },
    { name: 'Family Law', icon: Users, color: 'text-green-500' },
    { name: 'Tax Law', icon: PieChart, color: 'text-amber-500' },
    { name: 'Legal Documentation', icon: FileText, color: 'text-purple-500' },
  ];
  
  // Sample guides
  const guides = [
    {
      id: 1,
      title: 'Filing a PIL in India: Complete Step-by-Step Guide',
      description: 'Learn how to draft and file a Public Interest Litigation in India with our comprehensive guide for legal practitioners and individuals.',
      category: 'Constitutional Law',
      level: 'Advanced',
      steps: 12,
      timeToComplete: '60 min',
      updatedAt: 'April 2, 2025',
      image: 'https://images.unsplash.com/photo-1593115057322-e94b77572f20?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Understanding the GST Framework for Small Businesses',
      description: 'A practical guide to GST compliance, filing returns, and managing input tax credits for small business owners in India.',
      category: 'Tax Law',
      level: 'Intermediate',
      steps: 8,
      timeToComplete: '45 min',
      updatedAt: 'March 25, 2025',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Drafting an Effective Legal Notice: Templates and Best Practices',
      description: 'Learn how to draft legally sound notices for various purposes with ready-to-use templates and professional tips.',
      category: 'Legal Documentation',
      level: 'Beginner',
      steps: 6,
      timeToComplete: '30 min',
      updatedAt: 'March 18, 2025',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      title: 'Incorporating a Private Limited Company in India',
      description: 'A step-by-step guide to company formation, from name reservation to obtaining necessary registrations and licenses.',
      category: 'Corporate Law',
      level: 'Intermediate',
      steps: 10,
      timeToComplete: '50 min',
      updatedAt: 'March 12, 2025',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      title: 'Filing an FIR: Process, Rights and Follow-up Actions',
      description: 'Everything you need to know about filing a First Information Report with the police in India and tracking its progress.',
      category: 'Criminal Law',
      level: 'Beginner',
      steps: 7,
      timeToComplete: '35 min',
      updatedAt: 'March 5, 2025',
      image: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      title: 'Mutual Consent Divorce: Documentation and Procedure',
      description: 'A comprehensive guide to obtaining divorce by mutual consent in India, covering documentation requirements and court procedures.',
      category: 'Family Law',
      level: 'Intermediate',
      steps: 9,
      timeToComplete: '40 min',
      updatedAt: 'February 28, 2025',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
  ];
  
  const filteredGuides = searchQuery 
    ? guides.filter(guide => 
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : guides;
  
  // Function to get badge color based on level
  const getLevelBadgeColor = (level) => {
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
  const getCategoryIcon = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    if (category) {
      const IconComponent = category.icon;
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
          
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for guides..."
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Categories Section */}
        {!searchQuery && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map(category => (
                <div 
                  key={category.name}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:border-legal-accent dark:hover:border-legal-accent transition-colors cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3 ${category.color.replace('text-', 'text-')}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Featured Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {searchQuery ? `Search Results (${filteredGuides.length})` : 'All Guides'}
          </h2>
          
          {searchQuery && filteredGuides.length === 0 ? null : (
            <Link to="/guides" className="text-legal-accent hover:underline text-sm font-medium flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        
        {/* Guides Grid */}
        {searchQuery && filteredGuides.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              No guides found
            </h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any guides matching "{searchQuery}"
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map(guide => (
              <Link 
                to={`/guides/${guide.id}`} 
                key={guide.id}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
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
              </Link>
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
