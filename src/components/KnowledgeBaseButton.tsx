
import React from 'react';
import { Book } from 'lucide-react';
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
            className={`text-xs flex items-center gap-1 ${className || ''}`}
            onClick={() => navigate('/knowledge')}
          >
            <Book className="h-3 w-3" />
            Knowledge Base
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
