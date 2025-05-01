
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { mainNavigationItems } from './navigation/NavigationItems';
import DesktopNavigation from './navigation/DesktopNavigation';
import MobileMenu from './navigation/MobileMenu';
import AuthButtons from './navigation/AuthButtons';
import ShareButton from './ShareButton';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigationItems = mainNavigationItems(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-legal-slate/90 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-legal-slate dark:text-white">
              Vakil<span className="text-legal-accent">GPT</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <DesktopNavigation items={navigationItems} />

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-legal-slate dark:text-white/90"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {/* Share Button - Hide on mobile */}
            {!isMobile && (
              <ShareButton 
                variant="ghost" 
                className="text-legal-slate dark:text-white/90" 
                title="VakilGPT - AI-Powered Legal Assistance"
                description="Advanced legal assistance powered by artificial intelligence"
              />
            )}

            {/* User Menu or Auth Buttons */}
            <AuthButtons />
            
            {/* Mobile Menu */}
            <MobileMenu currentPath={location.pathname} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
