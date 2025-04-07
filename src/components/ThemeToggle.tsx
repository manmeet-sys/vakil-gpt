
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 bg-legal-light/80 dark:bg-legal-slate/80 backdrop-blur-sm border border-legal-border/30 dark:border-legal-slate/30 shadow-sm">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-legal-slate dark:text-legal-light" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-legal-slate dark:text-legal-light" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-legal-slate border border-legal-border dark:border-legal-slate/20 rounded-xl shadow-elegant">
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer hover:bg-legal-light dark:hover:bg-legal-slate/40 rounded-md my-0.5 text-sm font-medium">
          <Sun className="h-4 w-4 mr-2 text-amber-500" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer hover:bg-legal-light dark:hover:bg-legal-slate/40 rounded-md my-0.5 text-sm font-medium">
          <Moon className="h-4 w-4 mr-2 text-indigo-400" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer hover:bg-legal-light dark:hover:bg-legal-slate/40 rounded-md my-0.5 text-sm font-medium">
          <svg className="h-4 w-4 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
