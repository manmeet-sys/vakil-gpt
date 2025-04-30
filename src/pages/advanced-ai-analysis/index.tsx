
import React from 'react';
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, BookOpen, Scale } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OutcomePredictor from '@/components/ai-analysis/OutcomePredictor';
import ArgumentBuilder from '@/components/ai-analysis/ArgumentBuilder';

const AdvancedAIAnalysisPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('outcome-predictor');
  
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
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Advanced AI Legal Analysis</h1>
        </div>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex flex-col py-6 px-4 overflow-hidden">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center">
              <Brain className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-2">
              Advanced Legal Analysis & Strategy
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl mx-auto">
              Leverage AI-powered tools to predict case outcomes and build strong legal arguments based on Indian law, 
              including statutory provisions, Supreme Court and High Court precedents, and legal principles
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-6">
              <TabsTrigger value="outcome-predictor" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                <span>Outcome Predictor</span>
              </TabsTrigger>
              <TabsTrigger value="argument-builder" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Argument Builder</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="outcome-predictor">
              <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm p-6">
                <OutcomePredictor />
              </div>
            </TabsContent>
            
            <TabsContent value="argument-builder">
              <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm p-6">
                <ArgumentBuilder />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdvancedAIAnalysisPage;
