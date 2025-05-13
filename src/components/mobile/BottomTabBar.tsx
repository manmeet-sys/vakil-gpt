
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, FileText, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useDevice } from '@/hooks/use-device';

const tabs = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Tools', icon: Search, path: '/tools' },
  { name: 'Documents', icon: FileText, path: '/legal-document-drafting' },
  { name: 'Profile', icon: User, path: '/user-profile' },
];

const BottomTabBar: React.FC = () => {
  const location = useLocation();
  const { isMobile } = useDevice();
  
  // Only show on mobile devices
  if (!isMobile) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-gray-200 dark:border-gray-800 backdrop-blur-lg bg-background/90"
    >
      <nav className="flex justify-around py-2 px-1">
        {tabs.map((tab) => {
          const isActive = 
            tab.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(tab.path);
          
          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 relative",
                "transition-colors duration-200"
              )}
              aria-label={tab.name}
            >
              {isActive && (
                <motion.span
                  layoutId="active-tab-indicator"
                  className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-blue-500"
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                />
              )}
              
              <tab.icon
                className={cn(
                  "h-5 w-5 mb-1",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                )}
              />
              <span
                className={cn(
                  "text-xs",
                  isActive ? "font-medium text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                )}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default BottomTabBar;
