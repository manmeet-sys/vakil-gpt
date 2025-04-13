
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, User, LogOut, Settings, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import ShareButton from './ShareButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, userProfile, signOut, isAuthenticated } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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

  // Close menu when location changes
  useEffect(() => {
    closeMenu();
  }, [location]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const userInitials = userProfile?.full_name 
    ? getInitials(userProfile.full_name) 
    : user?.email 
      ? user.email.substring(0, 2).toUpperCase() 
      : 'U';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-legal-slate/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center">
              <img src="/lovable-uploads/a29a46c2-eb0a-4daa-9390-3f070e0b6202.png" alt="VakilGPT Logo" className="h-8 mr-2" />
              <div className="flex items-center">
                <span className="text-xl font-bold text-legal-slate dark:text-white">
                  Vakil<span className="text-legal-accent">GPT</span>
                </span>
                <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800 font-bold">
                  BETA
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-3 py-2 text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent transition-colors">
              Home
            </Link>
            <Link to="/chat" className="px-3 py-2 text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent transition-colors">
              Chat
            </Link>
            <Link to="/tools" className="px-3 py-2 text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent transition-colors">
              Tools
            </Link>
            <Link to="/knowledge" className="px-3 py-2 text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent transition-colors">
              Knowledge
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Language Switcher */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-legal-slate dark:text-white/90"
            >
              <Globe className="h-5 w-5" />
            </Button>
            
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-legal-slate dark:text-white/90"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {/* User Menu or Auth Buttons */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userProfile?.avatar_url || ''} alt={userProfile?.full_name || 'User'} />
                      <AvatarFallback className="bg-legal-accent/10 text-legal-accent">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {userProfile?.full_name || user?.email || 'My Account'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/user-profile" className="w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="w-full cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-500 focus:text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" className="text-legal-slate dark:text-white/90">
                <User className="h-5 w-5" />
                <span className="ml-2">Profile</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-legal-slate dark:text-white/90"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-legal-slate border-t border-legal-border dark:border-legal-slate/20 p-4">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="px-3 py-2 text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent transition-colors">
              Home
            </Link>
            <Link to="/chat" className="px-3 py-2 text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent transition-colors">
              Chat
            </Link>
            <Link to="/tools" className="px-3 py-2 text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent transition-colors">
              Tools
            </Link>
            <Link to="/knowledge" className="px-3 py-2 text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent transition-colors">
              Knowledge
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
