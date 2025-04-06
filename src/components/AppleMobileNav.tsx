
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, BookOpen, Scale, Shield, Gavel, CheckCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const navigationItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Document Analysis", path: "/legal-document-analyzer", icon: BookOpen },
  { name: "Case Law Research", path: "/case-law-research", icon: Gavel },
  { name: "Compliance", path: "/compliance-assistance", icon: Shield },
  { name: "Risk Assessment", path: "/legal-risk-assessment", icon: Scale },
  { name: "Due Diligence", path: "/legal-due-diligence", icon: CheckCircle },
];

export default function AppleMobileNav() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (!isMobile) return null;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 right-4 z-50 rounded-full bg-legal-light/80 dark:bg-legal-slate/80 shadow-apple backdrop-blur-md border border-legal-border dark:border-legal-muted/20 h-10 w-10"
        >
          <Menu className="h-5 w-5 text-legal-slate dark:text-legal-light" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-0 max-h-[90vh] bg-legal-light dark:bg-legal-slate border-t border-legal-border dark:border-legal-muted/20">
        <div className="px-4 py-3 border-b border-legal-border dark:border-legal-muted/20 flex justify-between items-center">
          <h2 className="text-sf-headline text-legal-slate dark:text-legal-light font-semibold flex items-center">
            Menu
            <span className="ml-2 text-xs font-medium bg-legal-accent/10 dark:bg-legal-accent/30 text-legal-accent dark:text-legal-light px-1.5 py-0.5 rounded-full">BETA</span>
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9" 
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5 text-legal-slate dark:text-legal-light" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        <div className="overflow-y-auto">
          <div className="p-4 space-y-1">
            {navigationItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-xl transition-colors text-sm ${
                  location.pathname === item.path
                    ? "bg-legal-accent/10 text-legal-accent dark:bg-legal-accent/30 dark:text-legal-light"
                    : "text-legal-slate dark:text-legal-light hover:bg-legal-light dark:hover:bg-legal-info/20"
                }`}
                onClick={() => setOpen(false)}
              >
                <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="text-sf-body font-medium truncate">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
          <div className="p-4 border-t border-legal-border dark:border-legal-muted/20 flex justify-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
