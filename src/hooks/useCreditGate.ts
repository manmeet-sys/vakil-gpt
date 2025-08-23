import { useState } from 'react';
import { useWallet } from './useWallet';
import { ActionType, getActionCost, getActionName } from '@/utils/creditSystem';

interface CreditGateProps {
  action: ActionType;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useCreditGate = ({ action, onSuccess, onError }: CreditGateProps) => {
  const { deductCredits, hasEnoughCredits, wallet } = useWallet();
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const cost = getActionCost(action);
  const actionName = getActionName(action);

  const executeWithCredits = async () => {
    // Free actions don't need credit check
    if (cost === 0) {
      onSuccess?.();
      return true;
    }

    // Check if user has enough credits
    if (!hasEnoughCredits(cost)) {
      setShowInsufficientModal(true);
      onError?.(`Insufficient credits for ${actionName}`);
      return false;
    }

    setLoading(true);
    try {
      const success = await deductCredits(action, cost);
      if (success) {
        onSuccess?.();
        return true;
      } else {
        onError?.('Failed to deduct credits');
        return false;
      }
    } catch (error) {
      onError?.('An error occurred while processing credits');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const closeInsufficientModal = () => {
    setShowInsufficientModal(false);
  };

  return {
    executeWithCredits,
    loading,
    cost,
    actionName,
    hasEnoughCredits: hasEnoughCredits(cost),
    showInsufficientModal,
    closeInsufficientModal,
    currentCredits: wallet?.current_credits || 0,
  };
};