
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
  const navigate = useNavigate();
  
  // Handle back navigation with scroll position preservation
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Store current scroll position for the destination page
    const scrollPosition = sessionStorage.getItem(`scroll_${to}`);
    
    // Navigate back to the specified route
    navigate(to, { state: { scrollPosition } });
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Button 
        variant="outline" 
        size="sm" 
        className={`mb-4 flex items-center gap-1 hover:bg-legal-accent/10 shadow-sm ${className}`}
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Button>
    </motion.div>
  );
};

export default BackButton;
