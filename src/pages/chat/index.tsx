
import React from 'react';
import { useTheme } from "@/components/ThemeProvider";
import ChatInterface from '@/components/ChatInterface';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ChatPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
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
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">PrecedentAI Legal Assistant</h1>
        </div>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex flex-col items-center py-6 px-4 overflow-hidden">
        <div className="w-full max-w-4xl mb-4">
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Your AI-powered legal assistant with document analysis capabilities
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Ask legal questions, upload documents, or generate legal analyses based on Indian law
            </p>
          </div>
        </div>
        <div className="w-full max-w-4xl">
          <ChatInterface className="w-full h-[calc(100vh-12rem)]" />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
