
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Link, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { mainNavigationItems } from './navigation/NavigationItems';
import DesktopNavigation from './navigation/DesktopNavigation';
import MobileMenu from './navigation/MobileMenu';
import AuthButtons from './navigation/AuthButtons';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/reset-password';
  const navigationItems = mainNavigationItems(location.pathname);
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-zinc-700/50 py-3 px-4 backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-semibold text-gray-800 dark:text-white flex items-center"
            >
              VakilGPT
              <span className="text-orange-500 text-xs font-medium ml-1">IN</span>
              <Badge variant="outline" className="ml-1.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full border-blue-200 dark:border-blue-800/50">
                BETA
              </Badge>
            </motion.h1>
          </Link>
          
          <DesktopNavigation items={navigationItems} />
        </div>
        
        <div className="flex items-center gap-3">
          {isAuthPage ? (
            <Link 
              to={location.pathname === '/login' ? '/signup' : '/login'} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
            >
              <LogIn className="h-4 w-4" />
              <span>{location.pathname === '/login' ? 'Sign Up' : 'Log In'}</span>
            </Link>
          ) : (
            <AuthButtons />
          )}
          <ThemeToggle />
          
          {/* Mobile Navigation Menu */}
          <MobileMenu currentPath={location.pathname} />
        </div>
      </header>
      
      <main className="flex-1 flex flex-col py-6 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
