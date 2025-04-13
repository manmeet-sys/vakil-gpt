
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AppLayout from '@/components/AppLayout';
import ChatInterface from '@/components/ChatInterface';

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
      <div className="container mx-auto px-4 py-6 mt-16">
        <div className="max-w-5xl mx-auto bg-white dark:bg-legal-slate/20 rounded-xl shadow-elegant overflow-hidden border border-legal-border dark:border-legal-slate/20 mt-4">
          <div className="p-4 bg-legal-accent/5 border-b border-legal-border dark:border-legal-slate/20 flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm font-medium text-legal-slate dark:text-white/90 ml-2">VakilGPT Chat Interface</span>
          </div>
          <div className="h-[calc(100vh-200px)] min-h-[500px]">
            <ChatInterface />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatPage;
