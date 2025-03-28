
import React from 'react';
import { Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface KnowledgeBaseButtonProps {
  className?: string;
}

const KnowledgeBaseButton: React.FC<KnowledgeBaseButtonProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={`text-xs flex items-center gap-1 ${className}`}
      onClick={() => navigate('/knowledge')}
    >
      <Book className="h-3 w-3" />
      Knowledge Base
    </Button>
  );
};

export default KnowledgeBaseButton;
