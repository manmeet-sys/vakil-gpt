
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavigationItem, resourceNavigationItems } from './NavigationItems';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuGroup, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface DesktopNavigationProps {
  items: NavigationItem[];
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ items }) => {
  return (
    <nav className="hidden md:flex items-center space-x-6 ml-8">
      {items.map((item) => {
        const IconComponent = item.icon;
        return (
          <Link 
            key={item.name}
            to={item.path} 
            className={cn(
              "text-sm font-medium flex items-center gap-1.5 transition-colors", 
              item.current
                ? "text-legal-accent dark:text-legal-accent" 
                : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            )}
          >
            <IconComponent className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-sm font-medium flex items-center gap-1.5 transition-colors text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
            Resources
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <DropdownMenuGroup>
            {resourceNavigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <DropdownMenuItem key={item.name} asChild className="flex items-center">
                  <Link to={item.path} className="w-full cursor-pointer">
                    <IconComponent className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default DesktopNavigation;
