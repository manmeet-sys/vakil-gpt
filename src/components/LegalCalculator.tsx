
import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculatorFunctions } from '@/utils/calculator-functions'; 
import { useInputValidation } from '@/hooks/use-input-validation';
import { toast } from 'sonner';
import { useUserData } from '@/context/UserDataContext';
import { Download, Save, History, Calculator } from 'lucide-react';
import { usePerformanceTracking } from '@/utils/performance-monitoring';

const LegalCalculator = () => {
  // Track component performance
  usePerformanceTracking('LegalCalculator');
  
  // Access user data context
  const { saveToolResult, exportData, getToolHistory } = useUserData();
  
  // Form state
  const [calculatorType, setCalculatorType] = useState('courtFees');
  const [result, setResult] = useState<number | string | null>(null);
  const [calculationHistory, setCalculationHistory] = useState<Array<{ type: string, params: any, result: number | string, date: string }>>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Input validation using our custom hook
  const principalAmount = useInputValidation('', { required: true, min: 1, pattern: /^[0-9]+(\.[0-9]{1,2})?$/ });
  const interestRate = useInputValidation('', { required: true, min: 0, max: 100, pattern: /^[0-9]+(\.[0-9]{1,2})?$/ });
  const dateFrom = useInputValidation('', { required: true });
  const dateTo = useInputValidation('', { required: true });

  // Get calculator options based on the selected type
  const calculatorOptions = useMemo(() => {
    const options: Record<string, { fields: string[], calculate: Function }> = {
      courtFees: {
        fields: ['principalAmount'],
        calculate: () => calculatorFunctions.calculateCourtFees(Number(principalAmount.value))
      },
      legalInterest: {
        fields: ['principalAmount', 'interestRate', 'dateFrom', 'dateTo'],
        calculate: () => calculatorFunctions.calculateLegalInterest(
          Number(principalAmount.value),
          Number(interestRate.value),
          new Date(dateFrom.value),
          new Date(dateTo.value)
        )
      }
    };
    
    return options[calculatorType] || options.courtFees;
  }, [calculatorType, principalAmount.value, interestRate.value, dateFrom.value, dateTo.value]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('calculationHistory');
      if (savedHistory) {
        setCalculationHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading calculation history:', error);
    }
  }, []);

  // Calculate result
  const handleCalculate = () => {
    try {
      // Validate required fields
      const requiredFields = calculatorOptions.fields;
      const validationResults = [];
      
      if (requiredFields.includes('principalAmount')) {
        validationResults.push(principalAmount.validate());
      }
      
      if (requiredFields.includes('interestRate')) {
        validationResults.push(interestRate.validate());
      }
      
      if (requiredFields.includes('dateFrom')) {
        validationResults.push(dateFrom.validate());
      }
      
      if (requiredFields.includes('dateTo')) {
        validationResults.push(dateTo.validate());
      }
      
      // Check if all validations passed
      if (validationResults.every(result => result)) {
        // Perform calculation
        const calculatedResult = calculatorOptions.calculate();
        setResult(calculatedResult);

        // Save to history
        const newHistoryEntry = {
          type: calculatorType,
          params: {
            principalAmount: principalAmount.value,
            interestRate: interestRate.value,
            dateFrom: dateFrom.value,
            dateTo: dateTo.value
          },
          result: calculatedResult,
          date: new Date().toISOString()
        };

        const updatedHistory = [newHistoryEntry, ...calculationHistory].slice(0, 20);
        setCalculationHistory(updatedHistory);
        localStorage.setItem('calculationHistory', JSON.stringify(updatedHistory));
        
        toast.success('Calculation completed successfully!');
      } else {
        toast.error('Please correct the errors in the form');
      }
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error('An error occurred during calculation');
      setResult('Error: Could not complete calculation');
    }
  };

  // Save result
  const handleSaveResult = () => {
    if (result !== null) {
      saveToolResult('Legal Calculator', 'calculator', {
        calculatorType,
        parameters: {
          principalAmount: principalAmount.value || null,
          interestRate: interestRate.value || null,
          dateFrom: dateFrom.value || null,
          dateTo: dateTo.value || null
        },
        result,
        calculatedAt: new Date().toISOString()
      }).then(() => {
        toast.success('Result saved successfully');
      }).catch(err => {
        toast.error('Failed to save result');
      });
    } else {
      toast.warning('No result to save');
    }
  };

  // Export result
  const handleExportResult = () => {
    if (result !== null) {
      const exportData = {
        calculatorType,
        parameters: {
          principalAmount: principalAmount.value || null,
          interestRate: interestRate.value || null,
          dateFrom: dateFrom.value || null,
          dateTo: dateTo.value || null
        },
        result,
        calculatedAt: new Date().toISOString()
      };
      
      exportData(exportData, `legal-calculation-${Date.now()}`, 'json');
    } else {
      toast.warning('No result to export');
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-b from-muted/50 to-muted/30 border-b pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calculator className="h-5 w-5 text-blue-600" />
          Indian Legal Calculator
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-5 px-6">
        <div className="space-y-5">
          <div className="mb-5">
            <Label htmlFor="calculator-type">Calculator Type</Label>
            <Select
              value={calculatorType}
              onValueChange={(value) => {
                setCalculatorType(value);
                setResult(null);
              }}
            >
              <SelectTrigger id="calculator-type" className="mt-1">
                <SelectValue placeholder="Select calculator type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="courtFees">Court Fee Calculator</SelectItem>
                <SelectItem value="legalInterest">Legal Interest Calculator</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1 text-sm text-muted-foreground">
              {calculatorType === 'courtFees' ? 
                'Calculate court filing fees based on suit value according to Indian Court Fee Act' : 
                'Calculate interest on judgments and decrees as per Indian judicial standards'}
            </p>
          </div>

          <div className="grid gap-5">
            {calculatorOptions.fields.includes('principalAmount') && (
              <div>
                <Label htmlFor="principal-amount" className="text-sm font-medium">
                  {calculatorType === 'courtFees' ? 'Suit Value (₹)' : 'Principal Amount (₹)'}
                </Label>
                <Input
                  id="principal-amount"
                  type="number"
                  placeholder="Enter amount in INR"
                  className="mt-1"
                  value={principalAmount.value}
                  onChange={principalAmount.handleChange}
                  onBlur={principalAmount.handleBlur}
                />
                {principalAmount.error && (
                  <p className="mt-1 text-sm text-red-500">{principalAmount.error}</p>
                )}
              </div>
            )}

            {calculatorOptions.fields.includes('interestRate') && (
              <div>
                <Label htmlFor="interest-rate" className="text-sm font-medium">
                  Interest Rate (% per annum)
                </Label>
                <Input
                  id="interest-rate"
                  type="number"
                  placeholder="Enter interest rate"
                  className="mt-1"
                  value={interestRate.value}
                  onChange={interestRate.handleChange}
                  onBlur={interestRate.handleBlur}
                />
                {interestRate.error && (
                  <p className="mt-1 text-sm text-red-500">{interestRate.error}</p>
                )}
              </div>
            )}

            {calculatorOptions.fields.includes('dateFrom') && (
              <div>
                <Label htmlFor="date-from" className="text-sm font-medium">
                  Start Date
                </Label>
                <Input
                  id="date-from"
                  type="date"
                  className="mt-1"
                  value={dateFrom.value}
                  onChange={dateFrom.handleChange}
                  onBlur={dateFrom.handleBlur}
                />
                {dateFrom.error && (
                  <p className="mt-1 text-sm text-red-500">{dateFrom.error}</p>
                )}
              </div>
            )}

            {calculatorOptions.fields.includes('dateTo') && (
              <div>
                <Label htmlFor="date-to" className="text-sm font-medium">
                  End Date
                </Label>
                <Input
                  id="date-to"
                  type="date"
                  className="mt-1"
                  value={dateTo.value}
                  onChange={dateTo.handleChange}
                  onBlur={dateTo.handleBlur}
                />
                {dateTo.error && (
                  <p className="mt-1 text-sm text-red-500">{dateTo.error}</p>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <Button
            onClick={handleCalculate}
            className="w-full"
          >
            Calculate
          </Button>
        </div>

        {result !== null && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
            <h3 className="font-medium text-lg mb-2">Result</h3>
            <p className="text-2xl font-semibold text-blue-600">
              {typeof result === 'number' ? `₹${result.toLocaleString('en-IN')}` : result}
            </p>
            
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={handleSaveResult}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleExportResult}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center" 
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-4 w-4 mr-1" />
            {showHistory ? 'Hide History' : 'Show Calculation History'}
          </Button>
          
          {showHistory && calculationHistory.length > 0 && (
            <div className="mt-4 max-h-64 overflow-y-auto border rounded divide-y">
              {calculationHistory.map((item, index) => (
                <div key={index} className="p-2 text-sm hover:bg-muted/20">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {item.type === 'courtFees' ? 'Court Fees' : 'Legal Interest'}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-1">
                    Result: <span className="font-medium">
                      {typeof item.result === 'number' ? 
                        `₹${item.result.toLocaleString('en-IN')}` : 
                        item.result}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {showHistory && calculationHistory.length === 0 && (
            <p className="mt-2 text-sm text-muted-foreground">No calculation history available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LegalCalculator;
