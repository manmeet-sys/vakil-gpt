
import React from 'react';
import { Gavel } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center w-8 h-8">
        <Gavel className="w-6 h-6 text-legal-accent animate-pulse-subtle" />
      </div>
      <div className="font-sans font-semibold text-xl tracking-tight">
        <span className="text-legal-slate">Vakil</span>
        <span className="text-legal-accent">GPT</span>
      </div>
    </div>
  );
};

export default AnimatedLogo;
