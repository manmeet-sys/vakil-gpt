
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import designSystem from '@/lib/design-system-standards';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  className,
  onClick
}) => {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden p-8 rounded-lg border border-legal-border shadow-elegant bg-white dark:bg-legal-slate/10 transition-all duration-300 hover:shadow-elevated hover:translate-y-[-2px]",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? title : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-legal-accent to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-full bg-legal-accent/10 flex items-center justify-center mb-6">
          <Icon className="w-6 h-6 text-legal-accent" aria-hidden="true" />
        </div>
        
        <h3 className={designSystem.apply.heading(3, "mb-3")}>{title}</h3>
        <p className={designSystem.typography.body.default}>{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
