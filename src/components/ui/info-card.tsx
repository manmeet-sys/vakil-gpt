
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Info, HelpCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

type InfoCardType = 'info' | 'help' | 'tip';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  type?: InfoCardType;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const InfoCard = ({
  title,
  children,
  type = 'info',
  dismissible = false,
  onDismiss,
  className
}: InfoCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'help':
        return <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'info':
        return 'border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10';
      case 'help':
        return 'border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-900/10';
      case 'tip':
        return 'border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10';
      default:
        return 'border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10';
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'info':
        return 'text-blue-700 dark:text-blue-300';
      case 'help':
        return 'text-purple-700 dark:text-purple-300';
      case 'tip':
        return 'text-amber-700 dark:text-amber-300';
      default:
        return 'text-blue-700 dark:text-blue-300';
    }
  };

  const getContentColor = () => {
    switch (type) {
      case 'info':
        return 'text-blue-600/90 dark:text-blue-400/90';
      case 'help':
        return 'text-purple-600/90 dark:text-purple-400/90';
      case 'tip':
        return 'text-amber-600/90 dark:text-amber-400/90';
      default:
        return 'text-blue-600/90 dark:text-blue-400/90';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'info':
        return 'bg-white dark:bg-blue-950/50';
      case 'help':
        return 'bg-white dark:bg-purple-950/50';
      case 'tip':
        return 'bg-white dark:bg-amber-950/50';
      default:
        return 'bg-white dark:bg-blue-950/50';
    }
  };

  return (
    <Card className={cn(getStyles(), className)}>
      <CardContent className="pt-4">
        <div className="flex gap-3">
          <div className="mt-1 shrink-0">
            {getIcon()}
          </div>
          <div>
            <h4 className={cn("text-sm font-medium", getTitleColor())}>{title}</h4>
            <div className={cn("text-sm mt-1", getContentColor())}>
              {children}
            </div>
            {dismissible && onDismiss && (
              <Button 
                variant="outline" 
                size="sm" 
                className={cn("mt-2 text-xs", getButtonColor())}
                onClick={onDismiss}
              >
                Got it
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
