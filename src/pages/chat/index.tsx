
import React from 'react';
import { useTheme } from "@/components/ThemeProvider";
import ChatInterface from '@/components/ChatInterface';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Scale } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      <header className="border-b border-gray-200 dark:border-zinc-700/50 py-3 px-4 flex items-center justify-between bg-white dark:bg-zinc-800/90 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')} 
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            <Scale className="h-5 w-5 text-blue-accent mr-2" />
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
              {isMobile ? "Legal Assistant" : "VakilGPT Legal Assistant"}
            </h1>
          </div>
        </div>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex flex-col items-center py-3 sm:py-6 px-2 sm:px-4 overflow-hidden">
        <div className="w-full max-w-4xl mb-2 sm:mb-4">
          <div className="text-center mb-3 sm:mb-6">
            <h2 className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">
              AI-powered legal assistant for Indian law
            </h2>
            {!isMobile && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Ask legal questions, upload documents, or generate analyses based on Indian law
              </p>
            )}
          </div>
        </div>
        <div className="w-full max-w-4xl h-[calc(100vh-12rem)]">
          <ChatInterface className="w-full h-full shadow-md rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700/50" />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
