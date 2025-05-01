
import React from 'react';
import MobileNavigation from './MobileNavigation';

interface MobileMenuProps {
  currentPath: string;
}

// This is a compatibility wrapper that redirects to our new MobileNavigation
const MobileMenu: React.FC<MobileMenuProps> = () => {
  return <MobileNavigation />;
};

export default MobileMenu;
