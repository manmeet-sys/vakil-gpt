
import React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full w-9 h-9 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500 dark:text-amber-300" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-600 dark:text-indigo-300" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg pointer-events-auto z-50 w-40 p-1">
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md py-2 my-0.5 text-sm font-medium pointer-events-auto ${theme === 'light' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : ''}`}
        >
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="flex items-center w-full"
          >
            <Sun className="h-4 w-4 mr-2 text-amber-500" />
            Light
          </motion.div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md py-2 my-0.5 text-sm font-medium pointer-events-auto ${theme === 'dark' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : ''}`}
        >
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="flex items-center w-full"
          >
            <Moon className="h-4 w-4 mr-2 text-indigo-500" />
            Dark
          </motion.div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md py-2 my-0.5 text-sm font-medium pointer-events-auto ${theme === 'system' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : ''}`}
        >
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="flex items-center w-full"
          >
            <Laptop className="h-4 w-4 mr-2 text-gray-500" />
            System
          </motion.div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
