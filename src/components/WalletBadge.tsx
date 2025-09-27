import React from 'react';
import { Coins, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

interface WalletBadgeProps {
  balance: number;
  free: {
    used: number;
    quota: number;
  };
}

export default function WalletBadge({ balance, free }: WalletBadgeProps) {
  const { user } = useAuth();
  
  if (!user) return null;

  const remainingFree = Math.max(0, (free.quota || 0) - (free.used || 0));
  const isLowCredits = balance < 50;
  const isLowFreeChats = remainingFree <= 2;

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={isLowFreeChats ? "destructive" : "secondary"}
        className="flex items-center gap-1.5 px-3 py-1"
      >
        <MessageSquare className="h-3 w-3" />
        <span className="text-xs font-medium">
          {remainingFree}/{free.quota} free
        </span>
      </Badge>
      
      <div className="w-px h-4 bg-border opacity-50" />
      
      <Badge 
        variant={isLowCredits ? "destructive" : "outline"}
        className="flex items-center gap-1.5 px-3 py-1"
      >
        <Coins className="h-3 w-3" />
        <span className="text-xs font-medium">
          {balance.toLocaleString()}
        </span>
      </Badge>
    </div>
  );
}