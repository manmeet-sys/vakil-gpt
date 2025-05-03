
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateInterest, calculateCourtFees, calculateDaysBetweenDates, formatIndianCurrency } from '@/utils/calculator-functions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarIcon, AlertCircle, Info } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUserData } from '@/context/UserDataContext';
import { usePerformanceTracking } from '@/utils/performance-monitoring';

const LegalCalculator = () => {
  usePerformanceTracking('LegalCalculator');
  const { saveToolResult } = useUserData();

  // Interest calculator state
  const [principalAmount, setPrincipalAmount] = useState<string>('10000');
  const [interestRate, setInterestRate] = useState<string>('10');
  const [interestType, setInterestType] = useState<string>('simple');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date());
  const [dateTo, setDateTo] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1); // Default to one year later
    return date;
  });
  const [interestResult, setInterestResult] = useState<string | number>('');

  // Court fee calculator state
  const [amount, setAmount] = useState<string>('50000');
  const [state, setState] = useState<string>('general');
  const [courtType, setCourtType] = useState<string>('civil');
  const [claimType, setClaimType] = useState<string>('money');
  const [courtFeeResult, setCourtFeeResult] = useState<{ fee: number; details: string[] } | null>(null);

  // Calculate interest
  const handleCalculateInterest = () => {
    if (!principalAmount || !interestRate || !dateFrom || !dateTo) {
      return;
    }

    const principal = parseFloat(principalAmount);
    const rate = parseFloat(interestRate);
    const days = calculateDaysBetweenDates(
      format(dateFrom, 'yyyy-MM-dd'),
      format(dateTo, 'yyyy-MM-dd')
    );

    if (days <= 0) {
      setInterestResult('End date must be after start date');
      return;
    }

    const interest = calculateInterest(principal, days, rate, interestType);
    const total = principal + interest;

    const result = `
Principal: ${formatIndianCurrency(principal)}
Interest Rate: ${rate}%
Period: ${days} days
Interest Type: ${interestType === 'simple' ? 'Simple Interest' : 'Compound Interest'}
Interest Amount: ${formatIndianCurrency(interest)}
Total Amount: ${formatIndianCurrency(total)}
    `;

    setInterestResult(result);
    
    // Save calculation to user data
    saveToolResult('calculator', 'interest-calculation', {
      calculatorType: 'interest',
      parameters: {
        principalAmount,
        interestRate,
        dateFrom: format(dateFrom, 'yyyy-MM-dd'),
        dateTo: format(dateTo, 'yyyy-MM-dd'),
        interestType
      },
      result,
      calculatedAt: new Date().toISOString()
    });
  };

  // Calculate court fees
  const handleCalculateCourtFees = () => {
    if (!amount) {
      return;
    }

    const amountValue = parseFloat(amount);
    const result = calculateCourtFees({
      amount: amountValue,
      state,
      courtType,
      claimType
    });

    setCourtFeeResult(result);
    
    // Save calculation to user data
    saveToolResult('calculator', 'court-fees-calculation', {
      calculatorType: 'courtFees',
      parameters: {
        amount,
        state,
        courtType,
        claimType
      },
      result: {
        fee: result.fee,
        details: result.details
      },
      calculatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center">Legal Calculator</h2>
        <p className="text-muted-foreground text-center text-sm pb-4">
          Calculate interest and court fees according to Indian legal standards
        </p>
      </div>

      <Tabs defaultValue="interest" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="interest">Interest Calculator</TabsTrigger>
          <TabsTrigger value="courtfees">Court Fee Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="interest" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="principal">Principal Amount (₹)</Label>
                  <Input
                    id="principal"
                    type="number"
                    value={principalAmount}
                    onChange={(e) => setPrincipalAmount(e.target.value)}
                    placeholder="Principal amount"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate">Interest Rate (% per annum)</Label>
                  <Input
                    id="rate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="Interest rate"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestType">Interest Type</Label>
                <Select value={interestType} onValueChange={setInterestType}>
                  <SelectTrigger id="interestType">
                    <SelectValue placeholder="Select interest type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple Interest</SelectItem>
                    <SelectItem value="compound">Compound Interest (Daily)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCalculateInterest} className="w-full">Calculate Interest</Button>

              {interestResult && (
                <Alert variant="default" className="bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/50">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Result</AlertTitle>
                  <AlertDescription className="font-mono whitespace-pre-wrap">
                    {interestResult}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courtfees" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Suit/Claim Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Claim amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Jurisdiction</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General (Default)</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="courtType">Court Type</Label>
                  <Select value={courtType} onValueChange={setCourtType}>
                    <SelectTrigger id="courtType">
                      <SelectValue placeholder="Select court type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="civil">Civil Court</SelectItem>
                      <SelectItem value="high">High Court</SelectItem>
                      <SelectItem value="supreme">Supreme Court</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="claimType">Claim Type</Label>
                  <Select value={claimType} onValueChange={setClaimType}>
                    <SelectTrigger id="claimType">
                      <SelectValue placeholder="Select claim type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="money">Money Claim</SelectItem>
                      <SelectItem value="property">Property Matter</SelectItem>
                      <SelectItem value="intellectual">Intellectual Property</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleCalculateCourtFees} className="w-full">Calculate Court Fee</Button>

              {courtFeeResult && (
                <Alert variant="default" className="bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/50">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Court Fee: {formatIndianCurrency(courtFeeResult.fee)}</AlertTitle>
                  <AlertDescription className="flex flex-col gap-2 mt-2">
                    <p className="font-semibold">How this was calculated:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {courtFeeResult.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalCalculator;
