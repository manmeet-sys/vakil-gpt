
import React, { useState, useEffect } from 'react';
import { useTheme } from "@/components/ThemeProvider";
import ChatInterface from '@/components/ChatInterface';

const ChatPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-legal-light dark:bg-legal-slate/90 py-10 px-4 transition-colors duration-300">
      <div className="w-full max-w-4xl mb-6 text-center">
        <h1 className="text-3xl font-bold text-legal-slate dark:text-white mb-2">PrecedentAI Legal Assistant</h1>
        <p className="text-legal-muted dark:text-gray-300">Your AI assistant specialized in Indian law, with focus on the Indian Constitution</p>
      </div>
      
      <ChatInterface className="w-full" />
    </div>
  );
};

export default ChatPage;
