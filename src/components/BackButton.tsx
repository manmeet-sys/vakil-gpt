
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
  // BackToToolsButton accepts only className, so we need to handle navigation and label differently
  return (
    <BackToToolsButton className={className}>
      {label}
    </BackToToolsButton>
  );
};

export default BackButton;
