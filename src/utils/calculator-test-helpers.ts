/**
 * Test helpers for calculator functions
 * Enables proper unit testing of calculation logic
 */

import { expect } from '@jest/globals';

/**
 * Tests a calculation function with multiple test cases
 */
export function testCalculationFunction<T extends Record<string, any>, R>(
  calculatorFn: (params: T) => R,
  testCases: Array<{
    name: string;
    input: T;
    expected: R;
  }>
) {
  testCases.forEach(testCase => {
    test(testCase.name, () => {
      const result = calculatorFn(testCase.input);
      expect(result).toEqual(testCase.expected);
    });
  });
}

/**
 * Calculate interest based on different interest types
 * Extracted for testability
 */
export const calculateInterest = (
  principal: number, 
  days: number, 
  rate: number, 
  interestType: string
): number => {
  switch (interestType) {
    case "simple":
      return (principal * rate * days) / (100 * 365);
    case "compound":
      // Daily compound interest
      return principal * Math.pow(1 + rate / (100 * 365), days) - principal;
    default:
      return (principal * rate * days) / (100 * 365);
  }
};

/**
 * Calculate court fees based on amount and jurisdiction
 */
export const calculateCourtFees = ({
  amount, 
  state = 'general', 
  courtType = 'civil',
  claimType = 'money'
}: {
  amount: number;
  state?: string;
  courtType?: string;
  claimType?: string;
}): {
  fee: number;
  details: string[];
} => {
  let courtFee = 0;
  const details: string[] = [];
  let maxFee = 300000; // Default cap
  
  if (state === 'maharashtra') {
    if (amount <= 100000) {
      courtFee = amount * 0.06; // 6% for amounts up to 1 lakh in Maharashtra
      details.push(`6% of ₹${amount.toLocaleString('en-IN')} = ₹${courtFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
    } else if (amount <= 500000) {
      const baseFee = 6000;
      const additionalFee = (amount - 100000) * 0.04;
      courtFee = baseFee + additionalFee;
      details.push(`Base fee for first ₹1,00,000: ₹6,000`);
      details.push(`Plus 4% of ₹${(amount - 100000).toLocaleString('en-IN')} = ₹${additionalFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
    } else {
      const baseFee = 22000;
      const additionalFee = (amount - 500000) * 0.03;
      courtFee = baseFee + additionalFee;
      details.push(`Base fee for first ₹5,00,000: ₹22,000`);
      details.push(`Plus 3% of ₹${(amount - 500000).toLocaleString('en-IN')} = ₹${additionalFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
      maxFee = 350000; // Maharashtra has higher cap
    }
  } else if (state === 'delhi') {
    if (amount <= 50000) {
      courtFee = 10 + (amount * 0.04); // Fixed ₹10 plus 4% up to 50K in Delhi
      details.push(`Fixed fee of ₹10 plus 4% of ₹${amount.toLocaleString('en-IN')} = ₹${courtFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
    } else {
      const baseFee = 2010;
      const additionalFee = (amount - 50000) * 0.02;
      courtFee = baseFee + additionalFee;
      details.push(`Base fee for first ₹50,000: ₹2,010`);
      details.push(`Plus 2% of ₹${(amount - 50000).toLocaleString('en-IN')} = ₹${additionalFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
      maxFee = 250000; // Delhi has lower cap
    }
  } else {
    // General/Default fee structure
    if (amount <= 100000) {
      courtFee = amount * 0.05; // 5% for amounts up to 1 lakh
      details.push(`5% of ₹${amount.toLocaleString('en-IN')} = ₹${courtFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
    } else if (amount <= 500000) {
      const baseFee = 5000;
      const additionalFee = (amount - 100000) * 0.03;
      courtFee = baseFee + additionalFee;
      details.push(`Base fee for first ₹1,00,000: ₹5,000`);
      details.push(`Plus 3% of ₹${(amount - 100000).toLocaleString('en-IN')} = ₹${additionalFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
    } else if (amount <= 2000000) {
      const baseFee = 17000;
      const additionalFee = (amount - 500000) * 0.02;
      courtFee = baseFee + additionalFee;
      details.push(`Base fee for first ₹5,00,000: ₹17,000`);
      details.push(`Plus 2% of ₹${(amount - 500000).toLocaleString('en-IN')} = ₹${additionalFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
    } else {
      const baseFee = 47000;
      const additionalFee = (amount - 2000000) * 0.01;
      courtFee = baseFee + additionalFee;
      details.push(`Base fee for first ₹20,00,000: ₹47,000`);
      details.push(`Plus 1% of ₹${(amount - 2000000).toLocaleString('en-IN')} = ₹${additionalFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
    }
  }
  
  // Adjust based on court type
  if (courtType === 'high') {
    courtFee *= 1.1; // 10% higher for High Court
    details.push(`High Court surcharge (10%): ₹${(courtFee * 0.1).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
  } else if (courtType === 'supreme') {
    courtFee *= 1.2; // 20% higher for Supreme Court
    details.push(`Supreme Court surcharge (20%): ₹${(courtFee * 0.2).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
  }
  
  // Additional fee for specific claim types
  if (claimType === 'property') {
    const propertyFee = courtFee * 0.05; // 5% additional for property claims
    courtFee += propertyFee;
    details.push(`Property matter additional fee (5%): ₹${propertyFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
  } else if (claimType === 'intellectual') {
    const ipFee = courtFee * 0.08; // 8% additional for IP claims
    courtFee += ipFee;
    details.push(`Intellectual property additional fee (8%): ₹${ipFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
  }
  
  // Cap at maximum limit
  if (courtFee > maxFee) {
    details.push(`Fee capped at maximum limit of ₹${maxFee.toLocaleString('en-IN')}`);
    courtFee = maxFee;
  }
  
  return { fee: courtFee, details };
};
