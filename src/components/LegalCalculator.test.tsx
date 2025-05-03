
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/utils/test-utils';
import LegalCalculator from '@/components/LegalCalculator';
import { toast } from 'sonner';

// Mock the toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('LegalCalculator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders court fees calculator by default', () => {
    render(<LegalCalculator />);
    
    // Check that the court fees calculator is rendered by default
    expect(screen.getByText('Court Fee Calculator')).toBeInTheDocument();
    expect(screen.getByText('State')).toBeInTheDocument();
    expect(screen.getByText('Court Type')).toBeInTheDocument();
    expect(screen.getByText('Claim Type')).toBeInTheDocument();
    expect(screen.getByText('Suit Value/Claim Amount')).toBeInTheDocument();
    expect(screen.getByText('Calculate Court Fees')).toBeInTheDocument();
  });
  
  test('switches to interest calculator', () => {
    render(<LegalCalculator />);
    
    // Click on the interest calculator tab
    fireEvent.click(screen.getByText('Interest Calculation'));
    
    // Check that the interest calculator is rendered
    expect(screen.getByText('Legal Interest Calculator')).toBeInTheDocument();
    expect(screen.getByText('Principal Amount')).toBeInTheDocument();
    expect(screen.getByText('Number of Days')).toBeInTheDocument();
    expect(screen.getByText('Interest Rate (% per annum)')).toBeInTheDocument();
    expect(screen.getByText('Interest Type')).toBeInTheDocument();
    expect(screen.getByText('Calculate Interest')).toBeInTheDocument();
  });
  
  test('shows error when calculating court fees without amount', async () => {
    render(<LegalCalculator />);
    
    // Try to calculate without entering an amount
    fireEvent.click(screen.getByText('Calculate Court Fees'));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Please enter an amount for court fees calculation')).toBeInTheDocument();
    });
  });
  
  test('calculates court fees correctly with valid input', async () => {
    render(<LegalCalculator />);
    
    // Enter amount
    const amountInput = screen.getByPlaceholderText('Enter amount');
    fireEvent.change(amountInput, { target: { value: '10000' } });
    
    // Calculate
    fireEvent.click(screen.getByText('Calculate Court Fees'));
    
    // Check success toast was called
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(expect.objectContaining({
        title: "Success"
      }));
    });
    
    // Check result is displayed
    expect(await screen.findByText('Result:')).toBeInTheDocument();
  });
  
  test('validates interest calculator inputs', async () => {
    render(<LegalCalculator />);
    
    // Switch to interest calculator
    fireEvent.click(screen.getByText('Interest Calculation'));
    
    // Try to calculate without entering values
    fireEvent.click(screen.getByText('Calculate Interest'));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Please fill all fields for interest calculation')).toBeInTheDocument();
    });
  });
});
