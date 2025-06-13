
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';

interface MobileOptimizedCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  compact?: boolean;
  icon?: React.ReactNode;
}

export const MobileOptimizedCard: React.FC<MobileOptimizedCardProps> = ({
  title,
  description,
  children,
  footer,
  className,
  compact = false,
  icon
}) => {
  return (
    <Card className={cn(
      "border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm",
      "shadow-sm hover:shadow-md transition-all duration-300",
      "rounded-xl overflow-hidden",
      compact ? "p-3" : "p-0",
      className
    )}>
      <CardHeader className={cn(
        compact ? "pb-2" : "pb-4",
        "px-4 md:px-6 pt-4 md:pt-6"
      )}>
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <CardTitle className={cn(
              typography.heading.h3,
              "text-base md:text-lg leading-tight"
            )}>
              {title}
            </CardTitle>
            {description && (
              <CardDescription className={cn(
                typography.body.small,
                "mt-1 text-xs md:text-sm"
              )}>
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={cn(
        "px-4 md:px-6",
        compact ? "py-2" : "py-4"
      )}>
        {children}
      </CardContent>
      
      {footer && (
        <CardFooter className="px-4 md:px-6 pb-4 md:pb-6 pt-2">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default MobileOptimizedCard;
