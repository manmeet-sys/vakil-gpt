
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AppLayout from '@/components/AppLayout';
import ChatInterface from '@/components/ChatInterface';
import BackButton from '@/components/BackButton';

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
        <h1 className="text-3xl font-bold mb-6">AI Legal Chat</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Chat with our AI legal assistant about Indian law, legal procedures, and get answers to your legal questions.
        </p>
        <div className="h-[calc(100vh-250px)] min-h-[500px]">
          <ChatInterface />
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatPage;
