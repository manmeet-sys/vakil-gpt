import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Coins, MessageSquare, Zap } from 'lucide-react';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  freeChatUsed: number;
  freeChatQuota: number;
}

export default function UpgradeModal({ open, onClose, freeChatUsed, freeChatQuota }: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Free Chat Quota Exhausted
          </DialogTitle>
          <DialogDescription>
            You've used {freeChatUsed}/{freeChatQuota} free chats today.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Continue with Full Access</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Get unlimited chats plus advanced legal tools including document analysis, case law research, and more.
            </p>
            <Link to="/pricing" onClick={onClose}>
              <Button className="w-full" size="sm">
                <Coins className="mr-2 h-4 w-4" />
                View Pricing Plans
              </Button>
            </Link>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Or continue with limited preview mode:
            </p>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
              size="sm"
            >
              <Zap className="mr-2 h-4 w-4" />
              Continue with Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}