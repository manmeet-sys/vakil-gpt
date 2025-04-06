
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
        <Gavel className="w-6 h-6 text-[#4CAF50] animate-pulse-subtle" />
      </div>
      <div className="font-sans font-semibold text-xl tracking-tight flex items-center">
        <span className="text-[#37474F]">Vakil</span>
        <span className="text-[#4CAF50]">GPT</span>
        <span className="ml-2 text-xs font-medium bg-[#4CAF50]/10 dark:bg-[#4CAF50]/30 text-[#4CAF50] px-1.5 py-0.5 rounded-full">BETA</span>
      </div>
    </div>
  );
};

export default AnimatedLogo;
