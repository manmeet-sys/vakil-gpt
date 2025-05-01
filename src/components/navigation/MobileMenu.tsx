
import React from 'react';
import { useNavigation } from '@/context/NavigationContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { design } from '@/lib/design-system';
import MobileNavigation from './MobileNavigation';

const MobileMenu: React.FC = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useNavigation();

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className={cn("w-[85vw] max-w-[350px] p-0", design.animation.fadeIn)}
        aria-label="Mobile navigation"
      >
        <MobileNavigation />
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
