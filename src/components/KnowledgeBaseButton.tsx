
import React from 'react';
import { Book, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KnowledgeBaseButtonProps {
  className?: string;
}

const KnowledgeBaseButton = ({ className }: KnowledgeBaseButtonProps) => {
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`text-xs flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors ${className || ''}`}
            onClick={() => navigate('/knowledge')}
          >
            <Book className="h-3 w-3" />
            Knowledge Base
            <Info className="h-3 w-3 ml-1 text-gray-400 dark:text-gray-500" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Access your custom legal knowledge repository</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default KnowledgeBaseButton;
