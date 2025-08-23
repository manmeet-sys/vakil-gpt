import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Coins, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InsufficientCreditsModalProps {
  open: boolean;
  onClose: () => void;
  requiredCredits: number;
  currentCredits: number;
  actionName: string;
}

const InsufficientCreditsModal: React.FC<InsufficientCreditsModalProps> = ({
  open,
  onClose,
  requiredCredits,
  currentCredits,
  actionName
}) => {
  const shortfallCredits = requiredCredits - currentCredits;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-destructive" />
            Insufficient Credits
          </DialogTitle>
          <DialogDescription>
            You need more credits to use {actionName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Credit Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Required:</span>
                <span className="font-medium">{requiredCredits.toLocaleString()} credits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Balance:</span>
                <span className="font-medium">{currentCredits.toLocaleString()} credits</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">Shortfall:</span>
                <span className="font-medium text-destructive">{shortfallCredits.toLocaleString()} credits</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col gap-2">
            <Link to="/wallet/topup" onClick={onClose}>
              <Button className="w-full" size="lg">
                <CreditCard className="h-4 w-4 mr-2" />
                Top-up Credits
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            
            <Link to="/pricing" onClick={onClose}>
              <Button variant="outline" className="w-full" size="lg">
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InsufficientCreditsModal;