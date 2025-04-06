
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
        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 bg-legal-light/80 dark:bg-legal-slate/80 backdrop-blur-sm">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-legal-slate dark:text-legal-light" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-legal-slate dark:text-legal-light" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-legal-light dark:bg-legal-slate border border-legal-border dark:border-legal-muted/30 rounded-xl shadow-apple">
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer hover:bg-legal-light dark:hover:bg-legal-info/20 rounded-md my-0.5 text-sf-body">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer hover:bg-legal-light dark:hover:bg-legal-info/20 rounded-md my-0.5 text-sf-body">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer hover:bg-legal-light dark:hover:bg-legal-info/20 rounded-md my-0.5 text-sf-body">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
