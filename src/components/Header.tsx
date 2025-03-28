
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedLogo from './AnimatedLogo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  ChevronDown, 
  BookOpen, 
  ScrollText, 
  Scale, 
  Shield, 
  ClipboardCheck, 
  GraduationCap 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="py-4 px-4 border-b border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <AnimatedLogo />
        </Link>
        
        <nav className="hidden lg:flex items-center space-x-6">
          <Link to="/" className="text-legal-slate dark:text-white/90 hover:text-legal-accent transition-colors">
            Home
          </Link>
          <Link to="/chat" className="text-legal-slate dark:text-white/90 hover:text-legal-accent transition-colors">
            Chat
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center text-legal-slate dark:text-white/90 hover:text-legal-accent transition-colors">
              Legal Tools <ChevronDown className="h-4 w-4 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/legal-document-analyzer" className="flex items-center gap-2">
                  <ScrollText className="h-4 w-4" />
                  Document Analyzer
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/case-law-research" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Case Law Research
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/compliance-assistance" className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Compliance Assistance
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/legal-risk-assessment" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Risk Assessment
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/legal-due-diligence" className="flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Due Diligence
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/legal-education" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Legal Education
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
