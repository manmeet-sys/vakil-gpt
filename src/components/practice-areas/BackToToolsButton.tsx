
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BackToToolsButtonProps {
  to?: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

const BackToToolsButton: React.FC<BackToToolsButtonProps> = ({ 
  to = '/tools', 
  label, 
  className = '',
  children 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Store current scroll position for the destination page
    const scrollPosition = window.scrollY.toString();
    sessionStorage.setItem(`scroll_${to}`, scrollPosition);
    
    // Navigate back to the specified route
    navigate(to, { 
      state: { 
        fromTool: true,
        scrollPosition
      } 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Button
        variant="outline"
        size="sm"
        className="mb-4 flex items-center gap-2 hover:bg-legal-accent/10 shadow-sm"
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4" />
        {children || label || 'Back to Tools'}
      </Button>
    </motion.div>
  );
};

export default BackToToolsButton;
