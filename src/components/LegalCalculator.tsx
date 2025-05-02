
import React, { useState } from 'react';
import { 
  Calculator, 
  IndianRupee, 
  Clock, 
  Percent,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/components/ui/error-message';
import designSystem from '@/lib/design-system-standards';
import useErrorHandler from '@/hooks/use-error-handler';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const LegalCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<string>('courtFees');
  const [amount, setAmount] = useState<string>('');
  const [days, setDays] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [calculationDetails, setCalculationDetails] = useState<string | null>(null);
  const { toast } = useToast();
  const { error, setError, clearError } = useErrorHandler();
  
  const handleCalculate = () => {
    clearError();
    
    // Basic input validation
    if (calculationType === 'courtFees' && !amount) {
      setError('Please enter an amount for court fees calculation');
      return;
    }
    
    if (calculationType === 'interest' && (!amount || !days || !rate)) {
      setError('Please fill all fields for interest calculation');
      return;
    }
    
    // Parse inputs to numbers
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount < 0) {
      setError('Please enter a valid positive amount');
      return;
    }
    
    if (calculationType === 'courtFees') {
      // Court fee calculation based on Indian court fee structure
      let courtFee = 0;
      let details = [];
      
      if (numAmount <= 100000) {
        courtFee = numAmount * 0.05; // 5% for amounts up to 1 lakh
        details.push(`5% of ₹${numAmount.toLocaleString('en-IN')} = ₹${courtFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
      } else if (numAmount <= 500000) {
        const baseFee = 5000;
        const additionalFee = (numAmount - 100000) * 0.03;
        courtFee = baseFee + additionalFee;
        details.push(`Base fee for first ₹1,00,000: ₹5,000`);
        details.push(`Plus 3% of ₹${(numAmount - 100000).toLocaleString('en-IN')} = ₹${additionalFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
      } else if (numAmount <= 2000000) {
        const baseFee = 17000;
        const additionalFee = (numAmount - 500000) * 0.02;
        courtFee = baseFee + additionalFee;
        details.push(`Base fee for first ₹5,00,000: ₹17,000`);
        details.push(`Plus 2% of ₹${(numAmount - 500000).toLocaleString('en-IN')} = ₹${additionalFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
      } else {
        const baseFee = 47000;
        const additionalFee = (numAmount - 2000000) * 0.01;
        courtFee = baseFee + additionalFee;
        details.push(`Base fee for first ₹20,00,000: ₹47,000`);
        details.push(`Plus 1% of ₹${(numAmount - 2000000).toLocaleString('en-IN')} = ₹${additionalFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
        
        // Cap at 3 lakhs (common in many Indian states)
        if (courtFee > 300000) {
          details.push(`Fee capped at maximum limit of ₹3,00,000`);
          courtFee = 300000;
        }
      }
      
      setResult(`₹${courtFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
      setCalculationDetails(details.join('\n'));
      
      toast({
        title: "Success",
        description: "Court fee calculated successfully"
      });
    } else if (calculationType === 'interest') {
      const numDays = parseFloat(days);
      const numRate = parseFloat(rate);
      
      if (isNaN(numDays) || numDays < 0) {
        setError('Please enter valid number of days');
        return;
      }
      
      if (isNaN(numRate) || numRate < 0) {
        setError('Please enter a valid interest rate');
        return;
      }
      
      // Simple interest calculation
      const interest = (numAmount * numRate * numDays) / (100 * 365);
      const totalAmount = numAmount + interest;
      
      setResult(`₹${interest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
      setCalculationDetails(`Principal: ₹${numAmount.toLocaleString('en-IN')}\nRate: ${numRate}% per annum\nPeriod: ${numDays} days\nInterest: ₹${interest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\nTotal Amount: ₹${totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
      
      toast({
        title: "Success",
        description: "Interest calculated successfully"
      });
    }
  };
  
  const copyResultToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(`${result}${calculationDetails ? '\n\n' + calculationDetails : ''}`);
      toast({
        title: "Copied!",
        description: "Calculation result copied to clipboard"
      });
    }
  };
  
  return (
    <TooltipProvider>
      <div className="w-full max-w-3xl mx-auto">
        <Tabs defaultValue="courtFees" onValueChange={setCalculationType} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8 p-1">
            <TabsTrigger value="courtFees" className="flex items-center gap-2.5 py-2.5">
              <IndianRupee className="h-4 w-4" />
              <span>Court Fees</span>
            </TabsTrigger>
            <TabsTrigger value="interest" className="flex items-center gap-2.5 py-2.5">
              <Percent className="h-4 w-4" />
              <span>Interest Calculation</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="courtFees">
            <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className={designSystem.typography.headings.h3}>Court Fee Calculator</CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  Calculate court fees based on the suit value as per Indian court fee regulations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div className="space-y-2.5">
                    <Label htmlFor="amount" className="text-sm font-medium">Suit Value/Claim Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        placeholder="Enter amount"
                        className="pl-8"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    className="pt-2 mt-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30"
                  >
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4" />
                      <span>Court Fee Structure:</span>
                    </p>
                    <ul className="text-sm space-y-2 text-blue-600 dark:text-blue-200 pl-5 list-disc marker:text-blue-500">
                      <li>5% for amounts up to ₹1,00,000</li>
                      <li>₹5,000 + 3% for amounts between ₹1,00,000 and ₹5,00,000</li>
                      <li>₹17,000 + 2% for amounts between ₹5,00,000 and ₹20,00,000</li>
                      <li>₹47,000 + 1% for amounts above ₹20,00,000 (capped at ₹3,00,000)</li>
                    </ul>
                    <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 italic">
                      Note: Actual court fees may vary by state and case type. This is only an estimate.
                    </p>
                  </motion.div>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="pt-5 flex flex-col items-stretch gap-4">
                {error && (
                  <ErrorMessage 
                    message={error} 
                    onDismiss={clearError} 
                    className="w-full"
                  />
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
                  <Button onClick={handleCalculate} className="w-full sm:w-auto gap-2 py-2.5 px-5" size="lg">
                    <Calculator className="h-4 w-4" />
                    Calculate Court Fees
                  </Button>
                  
                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex-1 w-full flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 dark:text-gray-300">Result:</span>
                          <span className="text-lg font-semibold text-green-700 dark:text-green-300">{result}</span>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0" 
                                onClick={copyResultToClipboard}
                              >
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy result</TooltipContent>
                          </Tooltip>
                        </div>
                        
                        {calculationDetails && (
                          <div className="mt-2 text-sm text-green-600 dark:text-green-300 whitespace-pre-line">
                            {calculationDetails}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="interest">
            <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className={designSystem.typography.headings.h3}>Legal Interest Calculator</CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  Calculate interest on delayed payments, damages, or legal judgments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div className="space-y-2.5">
                    <Label htmlFor="principal" className="text-sm font-medium">Principal Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        id="principal"
                        type="number"
                        min="0"
                        placeholder="Enter principal amount"
                        className="pl-8"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="days" className="text-sm font-medium">Number of Days</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="days"
                        type="number"
                        min="1"
                        placeholder="Enter number of days"
                        className="pl-10"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="rate" className="text-sm font-medium">Interest Rate (% per annum)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="rate"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter interest rate"
                        className="pl-10"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    className="pt-2 mt-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30"
                  >
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4" />
                      <span>Interest Rate Information:</span>
                    </p>
                    <ul className="text-sm space-y-2 text-blue-600 dark:text-blue-200 pl-5 list-disc marker:text-blue-500">
                      <li>Section 34 of CPC: 6-18% per annum as court may order</li>
                      <li>Negotiable Instruments Act: 18% per annum from due date</li>
                      <li>Commercial transactions: 2% above SBI base rate for delayed payments</li>
                    </ul>
                    <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 italic">
                      Note: Interest rates may vary based on the nature of the case, court directions, and applicable laws.
                    </p>
                  </motion.div>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="pt-5 flex flex-col items-stretch gap-4">
                {error && (
                  <ErrorMessage 
                    message={error} 
                    onDismiss={clearError} 
                    className="w-full"
                  />
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
                  <Button onClick={handleCalculate} className="w-full sm:w-auto gap-2 py-2.5 px-5" size="lg">
                    <Calculator className="h-4 w-4" />
                    Calculate Interest
                  </Button>
                  
                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex-1 w-full flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 dark:text-gray-300">Result:</span>
                          <span className="text-lg font-semibold text-green-700 dark:text-green-300">{result}</span>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0" 
                                onClick={copyResultToClipboard}
                              >
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy result</TooltipContent>
                          </Tooltip>
                        </div>
                        
                        {calculationDetails && (
                          <div className="mt-2 text-sm text-green-600 dark:text-green-300 whitespace-pre-line">
                            {calculationDetails}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default LegalCalculator;
