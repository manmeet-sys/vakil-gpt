
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';

interface MobileButtonProps extends ButtonProps {
  mobileSize?: 'sm' | 'md' | 'lg';
  fullWidthOnMobile?: boolean;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  className,
  mobileSize = 'md',
  fullWidthOnMobile = false,
  ...props
}) => {
  const mobileStyles = {
    sm: "h-8 px-3 text-xs md:h-9 md:px-4 md:text-sm",
    md: "h-10 px-4 text-sm md:h-10 md:px-6 md:text-sm",
    lg: "h-12 px-6 text-base md:h-11 md:px-8 md:text-base"
  };

  return (
    <Button
      className={cn(
        typography.ui.button,
        mobileStyles[mobileSize],
        fullWidthOnMobile && "w-full md:w-auto",
        "touch-manipulation", // Better touch response
        "transition-all duration-200 ease-out",
        "active:scale-95", // Smooth press animation
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default MobileButton;
