
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
        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 bg-blue-light/80 dark:bg-blue-slate/80 backdrop-blur-sm">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-blue-slate dark:text-blue-light" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-slate dark:text-blue-light" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-blue-light dark:bg-blue-slate border border-blue-border dark:border-blue-muted/30 rounded-xl shadow-blue">
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer hover:bg-blue-light dark:hover:bg-blue-info/20 rounded-md my-0.5 text-sf-body">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer hover:bg-blue-light dark:hover:bg-blue-info/20 rounded-md my-0.5 text-sf-body">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer hover:bg-blue-light dark:hover:bg-blue-info/20 rounded-md my-0.5 text-sf-body">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
