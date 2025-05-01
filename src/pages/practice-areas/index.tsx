
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gavel, Scale, Briefcase, Heart, Home, ArrowRight, BookOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const PracticeArea = ({ title, description, icon, path, features, delay }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: isMobile ? 0.1 : delay }}
    >
      <Card className="overflow-hidden border border-gray-200/60 dark:border-gray-800/60 bg-white dark:bg-zinc-800/70 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <CardHeader>
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-2">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="text-sm space-y-1.5 text-gray-600 dark:text-gray-300">
            {features.slice(0, isMobile ? 2 : 4).map((feature, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{feature}</span>
              </li>
            ))}
            {isMobile && features.length > 2 && (
              <li className="text-xs text-muted-foreground italic">
                +{features.length - 2} more features
              </li>
            )}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate(path)} 
            className="w-full group"
            variant="outline"
          >
            <span>Explore {isMobile ? '' : title + ' Tools'}</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const PracticeAreasPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const practiceAreas = [
    {
      title: "Criminal Law",
      description: "Specialized tools for criminal defense and prosecution under BNS, BNSS, and BSA codes",
      icon: <Gavel className="h-5 w-5 text-blue-600" />,
      path: "/criminal-law",
      features: [
        "BNS Code navigation and comparison with IPC",
        "Sentencing prediction and analysis",
        "Plea bargaining strategy assistance",
        "Criminal case law research and analysis"
      ]
    },
    {
      title: "Civil Law",
      description: "Tools for civil litigation including cause of action analysis and relief generation",
      icon: <Scale className="h-5 w-5 text-blue-600" />,
      path: "/civil-law",
      features: [
        "Cause of action analysis and element verification",
        "Limitation period calculation with exceptions",
        "Civil relief and prayer clause generation",
        "Precedent search and analysis for civil cases"
      ]
    },
    {
      title: "Corporate Law",
      description: "Company formation, due diligence, and compliance management tools",
      icon: <Briefcase className="h-5 w-5 text-blue-600" />,
      path: "/corporate-law",
      features: [
        "Entity formation and document generation",
        "M&A due diligence with customizable checklists",
        "Corporate compliance calendar and reminders",
        "Contract analysis and risk identification"
      ]
    },
    {
      title: "Family Law",
      description: "Maintenance calculation, custody analysis, and family law document generation",
      icon: <Heart className="h-5 w-5 text-blue-600" />,
      path: "/family-law",
      features: [
        "Maintenance and alimony calculation tools",
        "Custody rights analysis with welfare considerations",
        "Family settlement document drafting",
        "Matrimonial property division assistance"
      ]
    },
    {
      title: "Real Estate Law",
      description: "Title search, RERA compliance, and property document generation tools",
      icon: <Home className="h-5 w-5 text-blue-600" />,
      path: "/real-estate-law",
      features: [
        "Title search and ownership verification",
        "RERA compliance for projects and agreements",
        "Property document generation and review",
        "Real estate due diligence checklists"
      ]
    },
    {
      title: "Advanced Legal Research",
      description: "Case law research, statute tracking, and legal analysis tools",
      icon: <Search className="h-5 w-5 text-blue-600" />,
      path: "/case-law-research",
      features: [
        "Multi-jurisdictional case law search",
        "Statute and amendment tracking",
        "Legal principle and ratio extraction",
        "AI-powered case outcome prediction"
      ]
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
      
      <main className="flex-1 flex flex-col py-4 px-3 md:py-6 md:px-4">
        <div className="w-full max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-6 md:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-blue-600 mx-auto" />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-2">
              Practice-Specific Legal Tools
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl mx-auto px-4">
              {isMobile ? "Specialized tools for different legal practice areas" : 
                "VakilGPT provides specialized tools for different practice areas of Indian law to enhance your legal practice"}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0">
            {practiceAreas.map((area, index) => (
              <PracticeArea 
                key={index}
                {...area}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PracticeAreasPage;
