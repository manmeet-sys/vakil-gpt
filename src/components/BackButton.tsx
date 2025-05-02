
import React from 'react';
import BackToToolsButton from '@/components/practice-areas/BackToToolsButton';

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
  // For consistency, use the BackToToolsButton component which already handles scroll preservation
  return <BackToToolsButton to={to} label={label} className={className} />;
};

export default BackButton;
