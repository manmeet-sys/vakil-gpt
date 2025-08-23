import React from 'react';
import { Button } from '@/components/ui/button';
import { ActionType } from '@/utils/creditSystem';
import { useCreditGate } from '@/hooks/useCreditGate';
import InsufficientCreditsModal from './InsufficientCreditsModal';
import { Coins, Loader2 } from 'lucide-react';

interface CreditProtectedActionProps {
  action: ActionType;
  onExecute: () => void | Promise<void>;
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
}

const CreditProtectedAction: React.FC<CreditProtectedActionProps> = ({
  action,
  onExecute,
  children,
  variant = "default",
  size = "default",
  className,
  disabled
}) => {
  const {
    executeWithCredits,
    loading,
    cost,
    actionName,
    hasEnoughCredits,
    showInsufficientModal,
    closeInsufficientModal,
    currentCredits
  } = useCreditGate({
    action,
    onSuccess: onExecute,
  });

  const handleClick = async () => {
    await executeWithCredits();
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
        disabled={disabled || loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : cost > 0 ? (
          <Coins className="h-4 w-4 mr-2" />
        ) : null}
        {children}
        {cost > 0 && (
          <span className="ml-2 text-xs opacity-75">
            {cost} credits
          </span>
        )}
      </Button>

      <InsufficientCreditsModal
        open={showInsufficientModal}
        onClose={closeInsufficientModal}
        requiredCredits={cost}
        currentCredits={currentCredits}
        actionName={actionName}
      />
    </>
  );
};

export default CreditProtectedAction;