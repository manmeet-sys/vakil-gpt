import { useWallet } from './useWallet';
import { ActionType, getActionCost } from '@/utils/creditSystem';

export const useCreditGate = () => {
  const { deductCredits, hasEnoughCredits } = useWallet();

  const executeWithCredits = async (
    actionType: ActionType, 
    callback: () => Promise<void>
  ) => {
    const cost = getActionCost(actionType);
    
    // Free actions don't need credit check
    if (cost === 0) {
      await callback();
      return;
    }

    // Check if user has enough credits
    if (!hasEnoughCredits(cost)) {
      throw new Error('Insufficient credits');
    }

    // Deduct credits first, then execute
    const success = await deductCredits(actionType, cost);
    if (!success) {
      throw new Error('Failed to deduct credits');
    }

    await callback();
  };

  return { executeWithCredits };
};