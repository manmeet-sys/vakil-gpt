
import React from 'react';
import { Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center w-8 h-8">
        <Scale className="w-6 h-6 text-blue-accent animate-pulse-subtle" />
      </div>
      <div className="font-serif font-semibold text-xl tracking-tight">
        <span className="text-blue-slate">Vakil</span>
        <span className="text-blue-accent">GPT</span>
      </div>
    </div>
  );
};

export default AnimatedLogo;
