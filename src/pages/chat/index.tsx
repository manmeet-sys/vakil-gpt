
import React from 'react';
import { useTheme } from "@/components/ThemeProvider";
import ChatInterface from '@/components/ChatInterface';
import { ThemeToggle } from '@/components/ThemeToggle';

const ChatPage = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      <header className="border-b border-gray-200 dark:border-zinc-700/50 py-3 px-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">PrecedentAI</h1>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex flex-col items-center py-6 px-4 overflow-hidden">
        <div className="w-full max-w-4xl">
          <ChatInterface className="w-full h-[calc(100vh-8rem)]" />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
