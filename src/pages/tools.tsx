
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Scale, 
  Search,
  Gavel,
  Heart,
  Home,
  Briefcase,
  BookOpen
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimatedLogo from '@/components/AnimatedLogo';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import AllTools from '@/components/AllTools';

const ToolsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const savedScrollPosition = sessionStorage.getItem('scroll_/tools');
    if (savedScrollPosition && location.state?.fromTool) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
      }, 100);
    }
  }, [location]);
  
  const navigateToTool = (path: string) => {
    sessionStorage.setItem('scroll_/tools', window.scrollY.toString());
    navigate(path, { state: { fromTool: false } });
  };

  // Set up practice area tools as a featured category
  const featuredPracticeAreas = [
    { 
      name: 'All Areas', 
      icon: BookOpen, 
      path: '/practice-areas',
      badge: 'Overview'
    },
    { 
      name: 'Criminal', 
      icon: Gavel, 
      path: '/criminal-law',
      badge: 'Popular'
    },
    { 
      name: 'Civil', 
      icon: Scale, 
      path: '/civil-law' 
    },
    { 
      name: 'Corporate', 
      icon: Briefcase, 
      path: '/corporate-law' 
    },
    { 
      name: 'Family', 
      icon: Heart, 
      path: '/family-law' 
    },
    { 
      name: 'Real Estate', 
      icon: Home, 
      path: '/real-estate-law',
      badge: 'New' 
    }
  ];

  return (
    <AppLayout>
      <Helmet>
        <title>Indian Legal Tools | VakilGPT</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        {/* Hero section with search */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 md:p-5 rounded-xl shadow-sm">
            <div className="text-center md:text-left">
              <h1 className="text-xl md:text-2xl font-bold text-legal-slate dark:text-white mb-1 tracking-tight">
                Indian Legal Tools
              </h1>
              <p className="text-legal-muted dark:text-gray-300 text-sm">
                Specialized tools for legal practitioners
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Input
                  type="text"
                  placeholder="Search tools..."
                  className="pl-4 pr-10 py-2 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <AnimatedLogo className="hidden md:block" />
            </div>
          </div>
        </motion.div>

        {/* Featured Practice Areas - Compact Grid */}
        {!searchTerm && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-3 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-full bg-blue-600/10 flex items-center justify-center">
                  <Scale className="h-4 w-4 text-blue-600" />
                </div>
                <h2 className="text-base font-medium text-legal-slate dark:text-white">Practice Areas</h2>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {featuredPracticeAreas.map((area) => (
                  <Button
                    key={area.path}
                    variant="outline"
                    className="h-auto py-2 px-2 flex flex-col items-center justify-center gap-1 text-center"
                    onClick={() => navigateToTool(area.path)}
                  >
                    <div className="h-7 w-7 rounded-full bg-blue-600/10 flex items-center justify-center">
                      <area.icon className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium">{area.name}</span>
                    {area.badge && (
                      <Badge variant="outline" className={`text-[10px] py-0 h-4 ${
                        area.badge === 'New' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        area.badge === 'Popular' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        {area.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* All Tools Component */}
        {searchTerm ? (
          <div className="text-center p-8">
            <p className="text-lg text-muted-foreground">Search functionality coming soon.</p>
            <Button className="mt-4" onClick={() => setSearchTerm('')}>Clear Search</Button>
          </div>
        ) : (
          <AllTools />
        )}
      </div>
    </AppLayout>
  );
};

export default ToolsPage;
