import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/useWallet';
import { useAuth } from '@/context/AuthContext';

const WalletBalance: React.FC = () => {
  const { user } = useAuth();
  const { wallet, loading } = useWallet();

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="animate-pulse">
          <Coins className="h-3 w-3 mr-1" />
          Loading...
        </Badge>
      </div>
    );
  }

  const credits = wallet?.current_credits || 0;
  const isLowCredits = credits < 100;

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={isLowCredits ? "destructive" : "secondary"}
        className="flex items-center gap-1 px-3 py-1"
      >
        <Coins className="h-3 w-3" />
        {credits.toLocaleString()} credits
      </Badge>
      
      <Link to="/wallet/topup">
        <Button 
          size="sm" 
          variant="outline"
          className="h-8 px-2"
          title="Add Credits"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </Link>
    </div>
  );
};

export default WalletBalance;