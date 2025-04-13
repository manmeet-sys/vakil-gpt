
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AppLayout from '@/components/AppLayout';
import ChatInterface from '@/components/ChatInterface';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { FileText, Zap, Database, FileUp } from 'lucide-react';

const ChatPage = () => {
  // Ensure page scrolls to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AppLayout>
      <Helmet>
        <title>AI Legal Chat | VakilGPT</title>
      </Helmet>
      <div className="container mx-auto px-4 py-6">
        <BackButton />
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden mt-4">
          {/* Browser-like top bar */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <h2 className="font-medium text-gray-700 dark:text-gray-200">VakilGPT Chat Interface</h2>
          </div>
          
          {/* Chat feature buttons */}
          <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Clear Chat
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Gemini Pro
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Legal Analysis
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Gemini Flash
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Knowledge Base
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              PDF Analysis
            </Button>
          </div>
          
          {/* Chat interface container */}
          <div className="h-[calc(100vh-350px)] min-h-[500px]">
            <ChatInterface />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatPage;
