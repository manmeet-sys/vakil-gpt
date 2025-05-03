
import { calculateInterest, calculateCourtFees, testCalculationFunction } from './calculator-test-helpers';

describe('Interest Calculation Function', () => {
  testCalculationFunction(
    ({ principal, days, rate, interestType }) => calculateInterest(principal, days, rate, interestType),
    [
      {
        name: 'calculates simple interest correctly',
        input: { principal: 10000, days: 365, rate: 10, interestType: 'simple' },
        expected: 1000
      },
      {
        name: 'calculates compound interest correctly',
        input: { principal: 10000, days: 365, rate: 10, interestType: 'compound' },
        expected: 1051.56 // Slightly higher than simple interest due to compounding
      },
      {
        name: 'handles short periods correctly',
        input: { principal: 10000, days: 30, rate: 12, interestType: 'simple' },
        expected: 98.63
      },
      {
        name: 'defaults to simple interest for unknown type',
        input: { principal: 10000, days: 365, rate: 10, interestType: 'unknown' },
        expected: 1000
      }
    ]
  );
});

describe('Court Fee Calculation Function', () => {
  test('calculates Maharashtra court fees correctly', () => {
    const result = calculateCourtFees({
      amount: 75000,
      state: 'maharashtra',
      courtType: 'civil',
      claimType: 'money'
    });
    
    expect(result.fee).toEqual(4500); // 6% of 75000
    expect(result.details.length).toBeGreaterThan(0);
  });
  
  test('applies court type surcharges correctly', () => {
    const civilResult = calculateCourtFees({
      amount: 10000,
      state: 'general',
      courtType: 'civil',
      claimType: 'money'
    });
    
    const highCourtResult = calculateCourtFees({
      amount: 10000,
      state: 'general',
      courtType: 'high',
      claimType: 'money'
    });
    
    // High court should be 10% higher
    expect(highCourtResult.fee).toEqual(civilResult.fee * 1.1);
  });
  
  test('applies claim type additional fees correctly', () => {
    const moneyResult = calculateCourtFees({
      amount: 10000,
      state: 'general',
      courtType: 'civil',
      claimType: 'money'
    });
    
    const propertyResult = calculateCourtFees({
      amount: 10000,
      state: 'general',
      courtType: 'civil',
      claimType: 'property'
    });
    
    // Property should be 5% higher
    expect(propertyResult.fee).toEqual(moneyResult.fee * 1.05);
  });
  
  test('applies fee caps correctly', () => {
    // Test with a very large amount that would exceed the cap
    const result = calculateCourtFees({
      amount: 100000000, // 10 crore
      state: 'general',
      courtType: 'civil',
      claimType: 'money'
    });
    
    // Should be capped at 3 lakh
    expect(result.fee).toEqual(300000);
    // Should include a note about capping
    expect(result.details.some(detail => detail.includes('capped'))).toBe(true);
  });
});
