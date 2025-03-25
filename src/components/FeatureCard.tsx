
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  className,
}) => {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden p-8 rounded-lg border border-legal-border shadow-elegant bg-white dark:bg-legal-slate/10 transition-all duration-300 hover:shadow-elevated hover:translate-y-[-2px]",
        className
      )}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-legal-accent to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-full bg-legal-accent/10 flex items-center justify-center mb-6">
          <Icon className="w-6 h-6 text-legal-accent" />
        </div>
        
        <h3 className="text-xl font-semibold text-legal-slate mb-3">{title}</h3>
        <p className="text-legal-muted">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
