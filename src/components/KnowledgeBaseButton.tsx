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
  onInsert?: (text: string) => void;
}

const KnowledgeBaseButton = ({ className, onInsert }: KnowledgeBaseButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onInsert) {
      // If onInsert is provided, use it to insert a reference
      onInsert(" [Reference from knowledge base] ");
    } else {
      // Otherwise navigate to the knowledge page
      navigate('/knowledge');
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`text-xs flex items-center gap-1 ${className || ''}`}
            onClick={handleClick}
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
