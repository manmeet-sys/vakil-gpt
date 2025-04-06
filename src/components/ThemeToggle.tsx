
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
        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 bg-secondary/80 backdrop-blur-sm">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-[#4A6572] dark:text-white" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-[#4A6572] dark:text-white" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-[#4A6572] border border-[#F0F0F0] dark:border-[#7F8C8D]/30 rounded-xl shadow-apple">
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer hover:bg-[#F0F0F0] dark:hover:bg-[#7F8C8D]/20 rounded-md my-0.5 text-sf-body">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer hover:bg-[#F0F0F0] dark:hover:bg-[#7F8C8D]/20 rounded-md my-0.5 text-sf-body">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer hover:bg-[#F0F0F0] dark:hover:bg-[#7F8C8D]/20 rounded-md my-0.5 text-sf-body">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
