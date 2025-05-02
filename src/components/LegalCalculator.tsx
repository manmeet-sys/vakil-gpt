
import React, { useState } from 'react';
import {
  Calculator,
  IndianRupee,
  Percent,
  AlertCircle,
  Copy
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
import { Textarea } from '@/components/ui/textarea';
import BackToToolsButton from '@/components/practice-areas/BackToToolsButton';

// Calculate interest based on different interest types
const calculateInterest = (principal: number, days: number, rate: number, interestType: string) => {
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

const LegalCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<string>('courtFees');
  const [amount, setAmount] = useState<string>('');
  const [days, setDays] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [interestType, setInterestType] = useState<string>('simple');
  const [result, setResult] = useState<string | null>(null);
  const [calculationDetails, setCalculationDetails] = useState<string | null>(null);
  const [stateSelected, setStateSelected] = useState<string>('general');
  const [courtType, setCourtType] = useState<string>('civil');
  const [claimType, setClaimType] = useState<string>('money');
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
      // Court fee calculation based on selected state and court type
      let courtFee = 0;
      let details = [];
      let maxFee = 300000; // Default cap
      
      if (stateSelected === 'maharashtra') {
        if (numAmount <= 100000) {
          courtFee = numAmount * 0.06; // 6% for amounts up to 1 lakh in Maharashtra
          details.push(`6% of ₹${numAmount.toLocaleString('en-IN')} = ₹${courtFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
        } else if (numAmount <= 500000) {
          const baseFee = 6000;
          const additionalFee = (numAmount - 100000) * 0.04;
          courtFee = baseFee + additionalFee;
          details.push(`Base fee for first ₹1,00,000: ₹6,000`);
          details.push(`Plus 4% of ₹${(numAmount - 100000).toLocaleString('en-IN')} = ₹${additionalFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
        } else {
          const baseFee = 22000;
          const additionalFee = (numAmount - 500000) * 0.03;
          courtFee = baseFee + additionalFee;
          details.push(`Base fee for first ₹5,00,000: ₹22,000`);
          details.push(`Plus 3% of ₹${(numAmount - 500000).toLocaleString('en-IN')} = ₹${additionalFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
          maxFee = 350000; // Maharashtra has higher cap
        }
      } else if (stateSelected === 'delhi') {
        if (numAmount <= 50000) {
          courtFee = 10 + (numAmount * 0.04); // Fixed ₹10 plus 4% up to 50K in Delhi
          details.push(`Fixed fee of ₹10 plus 4% of ₹${numAmount.toLocaleString('en-IN')} = ₹${courtFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
        } else {
          const baseFee = 2010;
          const additionalFee = (numAmount - 50000) * 0.02;
          courtFee = baseFee + additionalFee;
          details.push(`Base fee for first ₹50,000: ₹2,010`);
          details.push(`Plus 2% of ₹${(numAmount - 50000).toLocaleString('en-IN')} = ₹${additionalFee.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
          maxFee = 250000; // Delhi has lower cap
        }
      } else {
        // General/Default fee structure
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
      
      // Calculate interest based on selected type
      const interest = calculateInterest(numAmount, numDays, numRate, interestType);
      const totalAmount = numAmount + interest;
      
      setResult(`₹${interest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`);
      
      let interestDetails = `Principal: ₹${numAmount.toLocaleString('en-IN')}\n`;
      interestDetails += `Rate: ${numRate}% per annum\n`;
      interestDetails += `Period: ${numDays} days\n`;
      interestDetails += `Interest Type: ${interestType === 'simple' ? 'Simple Interest' : 'Compound Interest (daily)'}\n`;
      interestDetails += `Interest: ₹${interest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
      interestDetails += `Total Amount: ₹${totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
      
      setCalculationDetails(interestDetails);
      
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
        <BackToToolsButton className="mb-4" />
        
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
                    <Label htmlFor="state" className="text-sm font-medium">State</Label>
                    <Select 
                      value={stateSelected} 
                      onValueChange={setStateSelected}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General (Default)</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select your state for jurisdiction-specific court fees
                    </p>
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="courtType" className="text-sm font-medium">Court Type</Label>
                    <Select 
                      value={courtType} 
                      onValueChange={setCourtType}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select court type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="civil">Civil Court</SelectItem>
                        <SelectItem value="high">High Court</SelectItem>
                        <SelectItem value="supreme">Supreme Court</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="claimType" className="text-sm font-medium">Claim Type</Label>
                    <Select 
                      value={claimType} 
                      onValueChange={setClaimType}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select claim type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="money">Monetary Claim</SelectItem>
                        <SelectItem value="property">Property Matter</SelectItem>
                        <SelectItem value="intellectual">Intellectual Property</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="amount" className="text-sm font-medium">Suit Value/Claim Amount</Label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        placeholder="Enter amount"
                        className="pl-3" 
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
                      <span>Court Fee Structure: {stateSelected === 'maharashtra' ? 'Maharashtra' : stateSelected === 'delhi' ? 'Delhi' : 'General'}</span>
                    </p>
                    
                    {stateSelected === 'maharashtra' && (
                      <ul className="text-sm space-y-2 text-blue-600 dark:text-blue-200 pl-5 list-disc marker:text-blue-500">
                        <li>6% for amounts up to ₹1,00,000</li>
                        <li>₹6,000 + 4% for amounts between ₹1,00,000 and ₹5,00,000</li>
                        <li>₹22,000 + 3% for amounts above ₹5,00,000 (capped at ₹3,50,000)</li>
                      </ul>
                    )}
                    
                    {stateSelected === 'delhi' && (
                      <ul className="text-sm space-y-2 text-blue-600 dark:text-blue-200 pl-5 list-disc marker:text-blue-500">
                        <li>Fixed ₹10 + 4% for amounts up to ₹50,000</li>
                        <li>₹2,010 + 2% for amounts above ₹50,000 (capped at ₹2,50,000)</li>
                      </ul>
                    )}
                    
                    {stateSelected === 'general' && (
                      <ul className="text-sm space-y-2 text-blue-600 dark:text-blue-200 pl-5 list-disc marker:text-blue-500">
                        <li>5% for amounts up to ₹1,00,000</li>
                        <li>₹5,000 + 3% for amounts between ₹1,00,000 and ₹5,00,000</li>
                        <li>₹17,000 + 2% for amounts between ₹5,00,000 and ₹20,00,000</li>
                        <li>₹47,000 + 1% for amounts above ₹20,00,000 (capped at ₹3,00,000)</li>
                      </ul>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-800/30">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Additional factors:</p>
                      <ul className="text-sm space-y-1.5 text-blue-600 dark:text-blue-200 pl-5 list-disc marker:text-blue-500">
                        <li>High Court: 10% additional fee</li>
                        <li>Supreme Court: 20% additional fee</li>
                        <li>Property matters: 5% additional fee</li>
                        <li>Intellectual property: 8% additional fee</li>
                      </ul>
                    </div>
                    
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
                                <Copy className="h-4 w-4" />
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
                      <Input
                        id="principal"
                        type="number"
                        min="0"
                        placeholder="Enter principal amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="days" className="text-sm font-medium">Number of Days</Label>
                    <div className="relative">
                      <Input
                        id="days"
                        type="number"
                        min="1"
                        placeholder="Enter number of days"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="rate" className="text-sm font-medium">Interest Rate (% per annum)</Label>
                    <div className="relative">
                      <Input
                        id="rate"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter interest rate"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="interestType" className="text-sm font-medium">Interest Type</Label>
                    <Select 
                      value={interestType} 
                      onValueChange={setInterestType}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select interest type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple Interest</SelectItem>
                        <SelectItem value="compound">Compound Interest (Daily)</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <li><span className="font-medium">Section 34 of CPC:</span> 6-18% per annum as court may order</li>
                      <li><span className="font-medium">Negotiable Instruments Act:</span> 18% per annum from due date</li>
                      <li><span className="font-medium">Commercial transactions:</span> 2% above SBI base rate for delayed payments</li>
                      <li><span className="font-medium">Consumer cases:</span> 9-12% as per consumer forums</li>
                      <li><span className="font-medium">Income Tax refunds:</span> 6% per annum simple interest</li>
                    </ul>
                    
                    <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-800/30">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Common Legal Interest Rates:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="bg-white dark:bg-blue-950/40 p-2 rounded border border-blue-50 dark:border-blue-900/50">
                          <p className="text-xs font-medium">Contract Defaults</p>
                          <p className="text-xs">12-18% per annum</p>
                        </div>
                        <div className="bg-white dark:bg-blue-950/40 p-2 rounded border border-blue-50 dark:border-blue-900/50">
                          <p className="text-xs font-medium">Court Judgments</p>
                          <p className="text-xs">9-18% per annum</p>
                        </div>
                        <div className="bg-white dark:bg-blue-950/40 p-2 rounded border border-blue-50 dark:border-blue-900/50">
                          <p className="text-xs font-medium">Statutory Interest</p>
                          <p className="text-xs">6-12% per annum</p>
                        </div>
                        <div className="bg-white dark:bg-blue-950/40 p-2 rounded border border-blue-50 dark:border-blue-900/50">
                          <p className="text-xs font-medium">Bank Loans</p>
                          <p className="text-xs">8-14% per annum</p>
                        </div>
                      </div>
                    </div>
                    
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
                                <Copy className="h-4 w-4" />
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
        
        <div className="mt-8 bg-muted/40 p-5 rounded-lg border border-muted/50">
          <h3 className="text-lg font-medium mb-3">Explanation of Calculations</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-base mb-1">Court Fees</h4>
              <p className="text-sm text-muted-foreground">
                Court fees in India vary by state, type of court, and nature of claim. The calculator provides an estimation based on common fee structures across different states, with specific calculations for Maharashtra and Delhi as examples. These fees are calculated as a percentage of the claim amount, with different slabs for different ranges.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-base mb-1">Legal Interest</h4>
              <p className="text-sm text-muted-foreground">
                Interest calculation follows two primary methods:
              </p>
              <ul className="text-sm mt-2 ml-5 list-disc text-muted-foreground">
                <li className="mt-1"><span className="font-medium">Simple Interest:</span> Calculated as (Principal × Rate × Time) ÷ (100 × 365)</li>
                <li className="mt-1"><span className="font-medium">Compound Interest:</span> Calculated as Principal × [(1 + Rate/(100×365))^Days - 1]</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Courts may award different interest rates based on the nature of the case, applicable laws, and discretion of the judge.
              </p>
            </div>
          </div>
          
          <div className="mt-5 pt-4 border-t border-muted">
            <h4 className="font-medium text-base mb-2">Need more help?</h4>
            <Textarea 
              placeholder="Enter details of your specific case for a more accurate calculation..." 
              className="h-24 resize-none mb-3"
            />
            <div className="text-right">
              <Button variant="outline">
                Request Expert Assistance
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default LegalCalculator;
