
import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      <header className="border-b border-gray-200 dark:border-zinc-700/50 py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">VakilGPT</h1>
        </div>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex flex-col py-6 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
