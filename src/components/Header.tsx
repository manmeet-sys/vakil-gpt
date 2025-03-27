
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedLogo from './AnimatedLogo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

const Header = () => {
  return (
    <header className="py-4 px-4 border-b border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <AnimatedLogo />
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-legal-slate dark:text-white/90 hover:text-legal-accent transition-colors">
            Home
          </Link>
          <Link to="/chat" className="text-legal-slate dark:text-white/90 hover:text-legal-accent transition-colors">
            Chat
          </Link>
          <a href="#features" className="text-legal-slate dark:text-white/90 hover:text-legal-accent transition-colors">
            Features
          </a>
          <a href="#benefits" className="text-legal-slate dark:text-white/90 hover:text-legal-accent transition-colors">
            Benefits
          </a>
        </nav>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white">
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
