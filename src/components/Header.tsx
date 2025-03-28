
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
  GraduationCap,
  Menu,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="py-4 px-4 border-b border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <AnimatedLogo />
        </Link>
        
        {/* Desktop Navigation */}
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
        
        {/* Mobile Hamburger Menu */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white hidden lg:flex">
            Sign Up
          </Button>
          
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] max-w-xs p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <AnimatedLogo />
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetClose>
                </div>
                
                <div className="flex-1 overflow-auto py-4">
                  <div className="flex flex-col space-y-1 px-2">
                    <SheetClose asChild>
                      <Link to="/" className="flex items-center rounded-md px-4 py-3 text-sm font-medium hover:bg-muted">
                        Home
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/chat" className="flex items-center rounded-md px-4 py-3 text-sm font-medium hover:bg-muted">
                        Chat
                      </Link>
                    </SheetClose>
                    
                    <div className="pt-2 pb-1">
                      <p className="px-4 text-xs font-semibold text-muted-foreground">Legal Tools</p>
                    </div>
                    
                    <SheetClose asChild>
                      <Link to="/legal-document-analyzer" className="flex items-center rounded-md px-4 py-3 text-sm font-medium hover:bg-muted">
                        <ScrollText className="mr-2 h-4 w-4" />
                        Document Analyzer
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/case-law-research" className="flex items-center rounded-md px-4 py-3 text-sm font-medium hover:bg-muted">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Case Law Research
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/compliance-assistance" className="flex items-center rounded-md px-4 py-3 text-sm font-medium hover:bg-muted">
                        <ClipboardCheck className="mr-2 h-4 w-4" />
                        Compliance Assistance
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/legal-risk-assessment" className="flex items-center rounded-md px-4 py-3 text-sm font-medium hover:bg-muted">
                        <Shield className="mr-2 h-4 w-4" />
                        Risk Assessment
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/legal-due-diligence" className="flex items-center rounded-md px-4 py-3 text-sm font-medium hover:bg-muted">
                        <Scale className="mr-2 h-4 w-4" />
                        Due Diligence
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/legal-education" className="flex items-center rounded-md px-4 py-3 text-sm font-medium hover:bg-muted">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Legal Education
                      </Link>
                    </SheetClose>
                    
                    <div className="pt-2 pb-1">
                      <p className="px-4 text-xs font-semibold text-muted-foreground">More</p>
                    </div>
                    
                    <SheetClose asChild>
                      <a href="#features" className="flex items-center rounded-md px-4 py-3 text-sm font-medium hover:bg-muted">
                        Features
                      </a>
                    </SheetClose>
                    <SheetClose asChild>
                      <a href="#benefits" className="flex items-center rounded-md px-4 py-3 text-sm font-medium hover:bg-muted">
                        Benefits
                      </a>
                    </SheetClose>
                  </div>
                </div>
                
                <div className="p-4 border-t border-border">
                  <Button className="w-full bg-legal-accent hover:bg-legal-accent/90 text-white">
                    Sign Up
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
