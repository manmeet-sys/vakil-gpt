
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Link, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import DesktopNavigation from './navigation/DesktopNavigation';
import MobileNavigation from './navigation/MobileNavigation';
import AuthButtons from './navigation/AuthButtons';
import { useNavigation } from '@/context/NavigationContext';

// This is a compatibility wrapper that redirects to our new navigation structure
const Header: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/reset-password';
  
  return (
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
        
        <DesktopNavigation />
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
        
        <div className="md:hidden">
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
};

export default Header;
