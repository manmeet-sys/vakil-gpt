
import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedLogo from './AnimatedLogo';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/80 backdrop-blur-sm shadow-elegant dark:bg-legal-slate/90' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <AnimatedLogo className="z-10" />
          
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6 font-medium text-sm">
              <a href="#features" className="text-legal-slate hover:text-legal-accent transition-colors">Features</a>
              <a href="#benefits" className="text-legal-slate hover:text-legal-accent transition-colors">Benefits</a>
              <a href="#demo" className="text-legal-slate hover:text-legal-accent transition-colors">Try It</a>
            </nav>
            
            <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white">
              Get Started
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden z-10 p-2 focus:outline-none" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-legal-slate" />
            ) : (
              <Menu className="w-6 h-6 text-legal-slate" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-white dark:bg-legal-slate flex flex-col justify-center items-center md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col items-center space-y-8 text-lg font-medium">
          <a 
            href="#features" 
            className="text-legal-slate hover:text-legal-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="#benefits" 
            className="text-legal-slate hover:text-legal-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Benefits
          </a>
          <a 
            href="#demo" 
            className="text-legal-slate hover:text-legal-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Try It
          </a>
          <Button 
            className="bg-legal-accent hover:bg-legal-accent/90 text-white mt-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
