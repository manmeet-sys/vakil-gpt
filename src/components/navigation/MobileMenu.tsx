
import React from 'react';
import MobileNavigation from './MobileNavigation';
import { design } from '@/lib/design-system';

// This component now directly uses MobileNavigation without any wrapper logic
const MobileMenu: React.FC = () => {
  return (
    <div className={design.animation.fadeIn}>
      <MobileNavigation />
    </div>
  );
};

export default MobileMenu;
