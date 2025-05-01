
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
  as?: React.ElementType;
  containerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const containerSizes = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full',
};

export function ResponsiveContainer({
  children,
  className,
  mobileClassName,
  desktopClassName,
  as: Component = 'div',
  containerSize = 'full',
}: ResponsiveContainerProps) {
  const isMobile = useIsMobile();
  
  return (
    <Component
      className={cn(
        'w-full mx-auto px-4 md:px-6',
        containerSizes[containerSize],
        className,
        isMobile ? mobileClassName : desktopClassName
      )}
    >
      {children}
    </Component>
  );
}

export default ResponsiveContainer;
