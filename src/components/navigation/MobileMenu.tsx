
import React from 'react';
import MobileNavigation from './MobileNavigation';
import { design } from '@/lib/design-system';

interface MobileMenuProps {
  currentPath: string;
}

// This is a compatibility wrapper that redirects to our new MobileNavigation
const MobileMenu: React.FC<MobileMenuProps> = () => {
  return (
    <div className={design.animation.fadeIn}>
      <MobileNavigation />
    </div>
  );
};

export default MobileMenu;
