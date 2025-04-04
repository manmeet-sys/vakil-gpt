
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  to = '/tools', 
  label = 'Back to Tools', 
  className = '' 
}) => {
  return (
    <Link to={to}>
      <Button 
        variant="outline" 
        size="sm" 
        className={`mb-4 flex items-center gap-1 hover:bg-legal-accent/10 ${className}`}
      >
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
};

export default BackButton;
