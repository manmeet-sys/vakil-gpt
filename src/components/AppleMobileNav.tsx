
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, BookOpen, Scale, Shield, Gavel, CheckCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ThemeToggle } from "@/components/ThemeToggle";

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
          className="fixed top-4 right-4 z-50 rounded-full bg-white/80 dark:bg-apple-dark-gray/80 shadow-apple backdrop-blur-md border border-apple-light-gray dark:border-apple-gray/20 h-10 w-10"
        >
          <Menu className="h-5 w-5 text-apple-dark-gray dark:text-white" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-0 max-h-[90vh] bg-white dark:bg-apple-dark-gray border-t border-apple-light-gray dark:border-apple-gray/20">
        <div className="px-4 py-3 border-b border-apple-light-gray dark:border-apple-gray/20 flex justify-between items-center">
          <h2 className="text-sf-headline text-apple-dark-gray dark:text-white font-semibold flex items-center">
            Menu
            <span className="ml-2 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full">BETA</span>
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-9 w-9" 
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5 text-apple-dark-gray dark:text-white" />
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
                    ? "bg-apple-blue/10 text-apple-blue"
                    : "text-apple-dark-gray dark:text-white hover:bg-apple-light-gray dark:hover:bg-apple-gray/20"
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
          <div className="p-4 border-t border-apple-light-gray dark:border-apple-gray/20 flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
