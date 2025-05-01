
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import designSystem from '@/lib/design-system-standards';
import { useIsMobile } from '@/hooks/use-mobile';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  className,
  onClick,
  disabled,
  loading,
  error
}) => {
  const isMobile = useIsMobile();
  const isInteractive = onClick && !disabled && !loading;
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div 
      className={cn(
        "group relative overflow-hidden p-6 md:p-8 rounded-lg border border-legal-border shadow-elegant bg-white dark:bg-legal-slate/10 transition-all duration-300",
        isInteractive && "hover:shadow-elevated hover:translate-y-[-2px] cursor-pointer",
        disabled && "opacity-60 cursor-not-allowed",
        loading && "animate-pulse",
        error && "border-red-300 dark:border-red-700/50",
        isMobile && "p-5", // Tighter padding on mobile
        className
      )}
      onClick={isInteractive ? onClick : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={isInteractive ? title : undefined}
      aria-disabled={disabled}
      aria-busy={loading}
      onKeyDown={handleKeyDown}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-legal-accent to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-full bg-legal-accent/10 flex items-center justify-center mb-4 md:mb-6">
          <Icon className="w-6 h-6 text-legal-accent" aria-hidden="true" />
        </div>
        
        <h3 className={designSystem.apply.heading(3, "mb-2 md:mb-3")}>{title}</h3>
        <p className={cn(
          designSystem.typography.body.default,
          isMobile && "text-sm" // Slightly smaller text on mobile
        )}>
          {description}
        </p>
        
        {error && (
          <div className="mt-3 p-2 text-xs rounded bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30">
            {error}
          </div>
        )}
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75 dark:bg-gray-900/75">
            <div className="w-6 h-6 rounded-full border-2 border-legal-accent/30 border-t-legal-accent animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;
