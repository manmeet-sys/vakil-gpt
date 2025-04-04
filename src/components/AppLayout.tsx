
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import BackButton from './BackButton';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      <header className="border-b border-gray-200 dark:border-zinc-700/50 py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">VakilGPT</h1>
            <span className="text-orange-500 text-xs font-medium">IN</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6 ml-8">
            <Link to="/tools" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Tools
            </Link>
            <Link to="/chat" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Legal Chat
            </Link>
            <Link to="/knowledge" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Knowledge
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            to="/user-profile" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 flex flex-col py-6 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
