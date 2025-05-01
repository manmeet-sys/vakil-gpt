
import React from 'react';
import MobileNavigation from './MobileNavigation';
import { design } from '@/lib/design-system';
import { useNavigation } from '@/context/NavigationContext';

interface MobileMenuProps {
  currentPath: string;
}

// This is a compatibility wrapper that redirects to our new MobileNavigation
const MobileMenu: React.FC<MobileMenuProps> = ({ currentPath }) => {
  const { setIsMobileMenuOpen } = useNavigation();
  
  // Open the mobile menu automatically if this component is used directly
  React.useEffect(() => {
    setIsMobileMenuOpen(true);
    return () => {
      setIsMobileMenuOpen(false);
    };
  }, [setIsMobileMenuOpen]);
  
  return (
    <div className={design.animation.fadeIn}>
      <MobileNavigation />
    </div>
  );
};

export default MobileMenu;
