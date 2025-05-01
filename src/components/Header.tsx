
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, User, LogOut, Settings, ChevronDown, Book, FileText, HelpCircle, CreditCard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import ShareButton from './ShareButton';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, userProfile, signOut, isAuthenticated } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

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
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`px-3 py-2 ${
              location.pathname === '/' 
                ? 'text-legal-accent font-medium' 
                : 'text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent'
              } transition-colors`}>
              Home
            </Link>
            <Link to="/chat" className={`px-3 py-2 ${
              location.pathname === '/chat' 
                ? 'text-legal-accent font-medium' 
                : 'text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent'
              } transition-colors`}>
              Chat
            </Link>
            <Link to="/tools" className={`px-3 py-2 ${
              location.pathname === '/tools' 
                ? 'text-legal-accent font-medium' 
                : 'text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent'
              } transition-colors`}>
              Tools
            </Link>
            <Link to="/practice-areas" className={`px-3 py-2 ${
              location.pathname === '/practice-areas' 
                ? 'text-legal-accent font-medium' 
                : 'text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent'
              } transition-colors`}>
              Practice Areas
            </Link>
            <Link to="/pricing" className={`px-3 py-2 ${
              location.pathname === '/pricing' 
                ? 'text-legal-accent font-medium' 
                : 'text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent'
              } transition-colors flex items-center gap-1`}>
              Pricing
              <Badge className="ml-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-[10px] px-1.5 py-0 h-4">FREE BETA</Badge>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`px-3 py-2 ${
                  ['/blog', '/guides', '/faq'].includes(location.pathname) 
                    ? 'text-legal-accent font-medium' 
                    : 'text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent'
                  } transition-colors`}>
                  Resources
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="flex items-center">
                    <Link to="/blog" className="w-full cursor-pointer">
                      <Book className="h-4 w-4 mr-2" />
                      Blog
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="flex items-center">
                    <Link to="/guides" className="w-full cursor-pointer">
                      <FileText className="h-4 w-4 mr-2" />
                      Guides
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="flex items-center">
                    <Link to="/faq" className="w-full cursor-pointer">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      FAQ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="flex items-center">
                    <Link to="/terms-of-service" className="w-full cursor-pointer">
                      <FileText className="h-4 w-4 mr-2" />
                      Terms of Service
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="flex items-center">
                    <Link to="/privacy-policy" className="w-full cursor-pointer">
                      <Shield className="h-4 w-4 mr-2" />
                      Privacy Policy
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

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
                <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
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
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-legal-slate dark:text-white/90">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button - Hide if using AppleMobileNav */}
            {!isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-legal-slate dark:text-white/90"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Hide if using AppleMobileNav */}
      {isMenuOpen && !isMobile && (
        <div className="md:hidden bg-white dark:bg-legal-slate border-t border-legal-border dark:border-legal-slate/20 p-4">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className={`px-3 py-2 ${
              location.pathname === '/' 
                ? 'text-legal-accent font-medium' 
                : 'text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent'
              } transition-colors`}>
              Home
            </Link>
            <Link to="/chat" className={`px-3 py-2 ${
              location.pathname === '/chat' 
                ? 'text-legal-accent font-medium' 
                : 'text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent'
              } transition-colors`}>
              Chat
            </Link>
            <Link to="/tools" className={`px-3 py-2 ${
              location.pathname === '/tools' 
                ? 'text-legal-accent font-medium' 
                : 'text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent'
              } transition-colors`}>
              Tools
            </Link>
            <Link to="/practice-areas" className={`px-3 py-2 ${
              location.pathname === '/practice-areas' 
                ? 'text-legal-accent font-medium' 
                : 'text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent'
              } transition-colors`}>
              Practice Areas
            </Link>
            <Link to="/pricing" className={`px-3 py-2 ${
              location.pathname === '/pricing' 
                ? 'text-legal-accent font-medium' 
                : 'text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent'
              } transition-colors flex items-center`}>
              Pricing
              <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-[10px] px-1.5 py-0 h-4">FREE BETA</Badge>
            </Link>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 px-3 py-1">Resources</h3>
              <Link to="/blog" className={`px-3 py-2 ${
                location.pathname === '/blog' 
                  ? 'text-legal-accent font-medium' 
                  : 'text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent'
                } transition-colors flex items-center gap-2`}>
                <Book className="h-4 w-4" />
                Blog
              </Link>
              <Link to="/guides" className={`px-3 py-2 ${
                location.pathname === '/guides' 
                  ? 'text-legal-accent font-medium' 
                  : 'text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent'
                } transition-colors flex items-center gap-2`}>
                <FileText className="h-4 w-4" />
                Guides
              </Link>
              <Link to="/faq" className={`px-3 py-2 ${
                location.pathname === '/faq' 
                  ? 'text-legal-accent font-medium' 
                  : 'text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent'
                } transition-colors flex items-center gap-2`}>
                <HelpCircle className="h-4 w-4" />
                FAQ
              </Link>
              <Link to="/terms-of-service" className={`px-3 py-2 ${
                location.pathname === '/terms-of-service' 
                  ? 'text-legal-accent font-medium' 
                  : 'text-legal-slate dark:text-white/90 hover:text-legal-accent dark:hover:text-legal-accent'
                } transition-colors flex items-center gap-2`}>
                <FileText className="h-4 w-4" />
                Terms of Service
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
