
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import AnimatedLogo from './AnimatedLogo';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  className?: string;
}

// Safe wrapper component to handle potential router context issues
const SafeHeader: React.FC<HeaderProps> = (props) => {
  try {
    return <Header {...props} />;
  } catch (error) {
    // Fallback simple header when outside router context
    return (
      <header className={cn(
        "sticky top-0 z-50 w-full bg-white/80 dark:bg-legal-slate/80 backdrop-blur-md border-b border-legal-border dark:border-legal-slate/20",
        props.className
      )}>
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2">
              <AnimatedLogo />
              <span className="font-bold text-lg text-legal-slate dark:text-white">LegalGPT</span>
            </a>
          </div>
          <ThemeToggle />
        </div>
      </header>
    );
  }
};

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white/80 dark:bg-legal-slate/80 backdrop-blur-md border-b border-legal-border dark:border-legal-slate/20",
        className
      )}
    >
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <AnimatedLogo />
            <span className="font-bold text-lg text-legal-slate dark:text-white">LegalGPT</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to="/"
            className={`px-3 py-2 text-sm font-medium rounded-md text-legal-slate hover:text-legal-accent dark:text-gray-200 dark:hover:text-white transition-colors ${
              location.pathname === "/" ? "bg-legal-accent/10 text-legal-accent dark:bg-legal-accent/20 dark:text-white" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/chat"
            className={`px-3 py-2 text-sm font-medium rounded-md text-legal-slate hover:text-legal-accent dark:text-gray-200 dark:hover:text-white transition-colors ${
              location.pathname === "/chat" ? "bg-legal-accent/10 text-legal-accent dark:bg-legal-accent/20 dark:text-white" : ""
            }`}
          >
            Chat
          </Link>
          <Link
            to="/tools"
            className={`px-3 py-2 text-sm font-medium rounded-md text-legal-slate hover:text-legal-accent dark:text-gray-200 dark:hover:text-white transition-colors ${
              location.pathname === "/tools" ? "bg-legal-accent/10 text-legal-accent dark:bg-legal-accent/20 dark:text-white" : ""
            }`}
          >
            Tools
          </Link>
          <Link
            to="/knowledge"
            className={`px-3 py-2 text-sm font-medium rounded-md text-legal-slate hover:text-legal-accent dark:text-gray-200 dark:hover:text-white transition-colors ${
              location.pathname === "/knowledge" ? "bg-legal-accent/10 text-legal-accent dark:bg-legal-accent/20 dark:text-white" : ""
            }`}
          >
            Knowledge
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            className="h-9 w-9 p-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Theme Toggle */}
        <div className="hidden md:flex items-center">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-16 inset-x-0 bg-white dark:bg-legal-slate border-b border-legal-border dark:border-legal-slate/20 shadow-lg"
          >
            <div className="px-4 py-2 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === "/" ? "bg-legal-accent/10 text-legal-accent dark:bg-legal-accent/20 dark:text-white" : "text-legal-slate dark:text-gray-200"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/chat"
                className={`block px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === "/chat" ? "bg-legal-accent/10 text-legal-accent dark:bg-legal-accent/20 dark:text-white" : "text-legal-slate dark:text-gray-200"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Chat
              </Link>
              <Link
                to="/tools"
                className={`block px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === "/tools" ? "bg-legal-accent/10 text-legal-accent dark:bg-legal-accent/20 dark:text-white" : "text-legal-slate dark:text-gray-200"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Tools
              </Link>
              <Link
                to="/knowledge"
                className={`block px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === "/knowledge" ? "bg-legal-accent/10 text-legal-accent dark:bg-legal-accent/20 dark:text-white" : "text-legal-slate dark:text-gray-200"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Knowledge
              </Link>
              <div className="pt-2 pb-1">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default SafeHeader;
