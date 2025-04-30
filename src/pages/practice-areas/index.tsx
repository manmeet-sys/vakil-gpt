
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gavel, Scale, Briefcase, Heart, Home, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from '@/components/ThemeToggle';

const PracticeAreasPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const practiceAreas = [
    {
      title: "Criminal Law",
      description: "Specialized tools for criminal defense and prosecution under BNS, BNSS, and BSA codes",
      icon: <Gavel className="h-5 w-5 text-blue-600" />,
      path: "/criminal-law"
    },
    {
      title: "Civil Law",
      description: "Tools for civil litigation including cause of action analysis and relief generation",
      icon: <Scale className="h-5 w-5 text-blue-600" />,
      path: "/civil-law"
    },
    {
      title: "Corporate Law",
      description: "Company formation, due diligence, and compliance management tools",
      icon: <Briefcase className="h-5 w-5 text-blue-600" />,
      path: "/corporate-law"
    },
    {
      title: "Family Law",
      description: "Maintenance calculation, custody analysis, and family law document generation",
      icon: <Heart className="h-5 w-5 text-blue-600" />,
      path: "/family-law"
    },
    {
      title: "Real Estate Law",
      description: "Title search, RERA compliance, and property document generation tools",
      icon: <Home className="h-5 w-5 text-blue-600" />,
      path: "/real-estate-law"
    }
  ];
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      <header className="border-b border-gray-200 dark:border-zinc-700/50 py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')} 
            className="rounded-full"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Practice Areas</h1>
        </div>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex flex-col py-6 px-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <BookOpen className="h-10 w-10 text-blue-600 mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-2">
              Practice-Specific Legal Tools
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl mx-auto">
              VakilGPT provides specialized tools for different practice areas of Indian law to enhance your legal practice
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceAreas.map((area, index) => (
              <Card 
                key={index} 
                className="overflow-hidden border border-gray-200/60 dark:border-gray-800/60 bg-white dark:bg-zinc-800/70 hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                    {area.icon}
                  </div>
                  <CardTitle>{area.title}</CardTitle>
                  <CardDescription>{area.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>AI-powered document analysis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Practice-specific document templates</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Latest law updates and key principles</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate(area.path)} 
                    className="w-full"
                    variant="outline"
                  >
                    Explore {area.title} Tools
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PracticeAreasPage;
