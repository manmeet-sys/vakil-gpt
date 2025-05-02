
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator, InfoIcon, CalendarIcon, IndianRupee } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { BaseCalculator } from '../base';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface AlimonyInputs {
  husbandIncome: number;
  wifeIncome: number;
  marriageDuration: number;
  childrenCount: number;
  personalLaw: string;
  state: string;
  spouseDependents: number;
  standardOfLiving: number;
  medicalExpenses: number;
}

const AlimonyCalculator = () => {
  const [inputs, setInputs] = useState<AlimonyInputs>({
    husbandIncome: 50000,
    wifeIncome: 20000,
    marriageDuration: 5,
    childrenCount: 0,
    personalLaw: 'general',
    state: 'general',
    spouseDependents: 0,
    standardOfLiving: 5,
    medicalExpenses: 0
  });

  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);
  const [calculationDetails, setCalculationDetails] = useState<string[]>([]);

  const handleInputChange = (
    field: keyof AlimonyInputs,
    value: string | number | string[]
  ) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' && field !== 'personalLaw' && field !== 'state' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const calculateAlimony = () => {
    // Basic validation
    if (inputs.husbandIncome <= 0) {
      toast({
        title: "Validation Error",
        description: "Primary earner's income must be greater than zero.",
        variant: "destructive"
      });
      return;
    }

    const calculationDetails: string[] = [];
    let baseAmount = 0;
    let finalAmount = 0;
    
    // Calculate base amount based on income difference
    const incomeDifference = inputs.husbandIncome - inputs.wifeIncome;
    
    if (incomeDifference <= 0) {
      toast({
        title: "Calculation Notice",
        description: "Maintenance is typically not awarded when recipient's income is higher than or equal to the payer's income.",
      });
      setCalculatedAmount(0);
      setCalculationDetails([
        "Maintenance is typically not awarded when the recipient's income is higher than or equal to the payer's income."
      ]);
      return;
    }
    
    // Base calculation method based on Indian court practices (varies widely)
    baseAmount = incomeDifference * 0.25; // Common starting point is 25% of difference
    calculationDetails.push(`Base calculation: 25% of income difference (₹${incomeDifference.toLocaleString()}) = ₹${baseAmount.toLocaleString()}`);
    
    // Adjust for marriage duration
    let durationFactor = 1.0;
    if (inputs.marriageDuration < 2) {
      durationFactor = 0.8;
      calculationDetails.push(`Short marriage adjustment (< 2 years): factor of 0.8`);
    } else if (inputs.marriageDuration > 10) {
      durationFactor = 1.2;
      calculationDetails.push(`Long marriage adjustment (> 10 years): factor of 1.2`);
    } else {
      calculationDetails.push(`Standard marriage duration (${inputs.marriageDuration} years): no adjustment`);
    }
    
    // Adjust for children
    let childrenFactor = 1.0;
    if (inputs.childrenCount > 0) {
      childrenFactor = 1.0 + (inputs.childrenCount * 0.15); // 15% increase per child
      calculationDetails.push(`Children adjustment: factor of ${childrenFactor.toFixed(2)} for ${inputs.childrenCount} children`);
    }
    
    // Adjust for standard of living (1-10 scale)
    const standardFactor = 0.9 + (inputs.standardOfLiving * 0.02);
    calculationDetails.push(`Standard of living adjustment (level ${inputs.standardOfLiving}): factor of ${standardFactor.toFixed(2)}`);
    
    // Adjust for medical expenses
    let medicalFactor = 1.0;
    if (inputs.medicalExpenses > 0) {
      const medicalPercentage = inputs.medicalExpenses / inputs.husbandIncome;
      medicalFactor = 1.0 + (medicalPercentage > 0.2 ? 0.2 : medicalPercentage);
      calculationDetails.push(`Medical expense adjustment: factor of ${medicalFactor.toFixed(2)}`);
    }
    
    // Apply personal law adjustments
    let lawFactor = 1.0;
    switch(inputs.personalLaw) {
      case 'hindu':
        calculationDetails.push('Hindu Marriage Act principles applied');
        break;
      case 'muslim':
        lawFactor = 0.95; // Muslim law might have different considerations due to Mahr
        calculationDetails.push('Muslim Personal Law considerations applied (factor 0.95)');
        break;
      case 'special':
        calculationDetails.push('Special Marriage Act principles applied');
        break;
      default:
        calculationDetails.push('General maintenance principles applied');
    }
    
    // Final calculation
    finalAmount = baseAmount * durationFactor * childrenFactor * standardFactor * medicalFactor * lawFactor;
    
    // Cap at 50% of payer's income as per judicial precedent
    const maxAmount = inputs.husbandIncome * 0.5;
    if (finalAmount > maxAmount) {
      finalAmount = maxAmount;
      calculationDetails.push(`Amount capped at 50% of payer's income (₹${maxAmount.toLocaleString()})`);
    }
    
    // Final calculated amount
    calculationDetails.push(`Final calculated maintenance amount: ₹${finalAmount.toLocaleString()} per month`);
    
    // Set results
    setCalculatedAmount(Math.round(finalAmount));
    setCalculationDetails(calculationDetails);

    // Show success toast
    toast({
      title: "Calculation Complete",
      description: "Estimated maintenance amount calculated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
          <div className="flex items-start gap-3">
            <Calculator className="h-5 w-5 mt-1 text-purple-600" />
            <div>
              <CardTitle className="font-playfair">Alimony Calculator</CardTitle>
              <CardDescription>
                Calculate approximate alimony/maintenance amounts based on Indian legal parameters
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="info">Legal Information</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="husbandIncome">
                        Primary Earner's Monthly Income (₹)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Include all sources of income including salary, business, rent, etc.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex gap-2 items-center">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="husbandIncome"
                        type="number"
                        value={inputs.husbandIncome}
                        onChange={(e) => handleInputChange('husbandIncome', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="wifeIncome">
                        Other Spouse's Monthly Income (₹)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Include all sources of income of the spouse seeking maintenance.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex gap-2 items-center">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="wifeIncome"
                        type="number"
                        value={inputs.wifeIncome}
                        onChange={(e) => handleInputChange('wifeIncome', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marriageDuration">Marriage Duration (years)</Label>
                      <span className="text-sm text-muted-foreground">{inputs.marriageDuration} years</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        id="marriageDuration"
                        min={0}
                        max={30}
                        step={1}
                        value={[inputs.marriageDuration]}
                        onValueChange={(value) => handleInputChange('marriageDuration', value[0])}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="childrenCount">Children under 18 years</Label>
                    <div className="flex gap-2 items-center">
                      <Select
                        value={inputs.childrenCount.toString()}
                        onValueChange={(value) => handleInputChange('childrenCount', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Number of children" />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="personalLaw">Applicable Personal Law</Label>
                    <Select
                      value={inputs.personalLaw}
                      onValueChange={(value) => handleInputChange('personalLaw', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select applicable law" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Principles (CrPC 125)</SelectItem>
                        <SelectItem value="hindu">Hindu Marriage Act</SelectItem>
                        <SelectItem value="muslim">Muslim Personal Law</SelectItem>
                        <SelectItem value="christian">Indian Divorce Act</SelectItem>
                        <SelectItem value="special">Special Marriage Act</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Jurisdiction</Label>
                    <Select
                      value={inputs.state}
                      onValueChange={(value) => handleInputChange('state', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General (All India)</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="tamil_nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="punjab">Punjab & Haryana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Standard of Living During Marriage</Label>
                      <span className="text-sm text-muted-foreground">{inputs.standardOfLiving}/10</span>
                    </div>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[inputs.standardOfLiving]}
                      onValueChange={(value) => handleInputChange('standardOfLiving', value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="medicalExpenses">
                        Monthly Medical Expenses (₹)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Regular medical expenses of the party seeking maintenance.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex gap-2 items-center">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="medicalExpenses"
                        type="number"
                        value={inputs.medicalExpenses}
                        onChange={(e) => handleInputChange('medicalExpenses', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={calculateAlimony}
              >
                Calculate Maintenance Amount
              </Button>
              
              {calculatedAmount !== null && (
                <div className="mt-6 pt-6 border-t">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Estimated Monthly Maintenance</h3>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                      ₹{calculatedAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="calculation-details">
                      <AccordionTrigger>Calculation Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          {calculationDetails.map((detail, index) => (
                            <p key={index} className="text-gray-600 dark:text-gray-400">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="legal-disclaimer">
                      <AccordionTrigger>Legal Disclaimer</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          This calculator provides an estimate based on common judicial practices and precedents.
                          Actual maintenance amounts may vary significantly based on specific facts, judicial discretion,
                          and other factors not accounted for in this calculator.
                          This is not legal advice. Please consult a qualified family law attorney for your specific case.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="info">
              <div className="space-y-6 py-4">
                <h3 className="text-lg font-medium">Maintenance Laws in India</h3>
                <div className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="general">
                      <AccordionTrigger>Section 125 CrPC - Universal Maintenance</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          <p>
                            Section 125 of the Criminal Procedure Code provides for maintenance to wives, 
                            children, and parents regardless of religion if they are unable to maintain themselves.
                          </p>
                          <p>
                            <strong>Key aspects:</strong>
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Maximum maintenance amount is not specified in law</li>
                            <li>Courts typically consider 25-33% of husband's net income as reasonable</li>
                            <li>Supreme Court in Rajnesh v. Neha (2020) established detailed guidelines</li>
                            <li>Interim maintenance can be granted during proceedings</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="hindu">
                      <AccordionTrigger>Hindu Laws on Maintenance</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          <p>
                            For Hindus, maintenance can be claimed under:
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Hindu Marriage Act (S.24 & S.25):</strong> For interim and permanent maintenance</li>
                            <li><strong>Hindu Adoption and Maintenance Act:</strong> For maintenance rights during marriage</li>
                          </ul>
                          <p>
                            Courts consider factors including:
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Income and property of both parties</li>
                            <li>Conduct of parties</li>
                            <li>Other liabilities of the paying spouse</li>
                            <li>Standard of living during marriage</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="muslim">
                      <AccordionTrigger>Muslim Laws on Maintenance</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          <p>
                            Muslim women can claim maintenance under:
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Muslim Women (Protection of Rights on Divorce) Act, 1986:</strong> For maintenance after divorce</li>
                            <li><strong>Section 125 CrPC:</strong> Supreme Court in Shamim Ara case confirmed Muslim women can claim under CrPC</li>
                          </ul>
                          <p>
                            Key concepts:
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Mahr:</strong> Mandatory payment to wife that can serve as financial security</li>
                            <li><strong>Iddat period:</strong> Maintenance required during waiting period after divorce</li>
                            <li><strong>Reasonable and fair provision:</strong> Supreme Court interpretation of maintenance rights</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="special">
                      <AccordionTrigger>Special Marriage Act Provisions</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          <p>
                            The Special Marriage Act applies to inter-religious marriages or those who choose to marry under this secular law.
                          </p>
                          <p>
                            Maintenance provisions:
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Section 36:</strong> Maintenance pendente lite (during proceedings)</li>
                            <li><strong>Section 37:</strong> Permanent alimony and maintenance</li>
                          </ul>
                          <p>
                            Either spouse can be ordered to pay maintenance to the other based on needs and income capacity.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="precedents">
                      <AccordionTrigger>Important Judicial Precedents</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          <ul className="list-disc pl-5 space-y-3">
                            <li>
                              <strong>Rajnesh v. Neha (2020):</strong> Supreme Court established comprehensive guidelines 
                              for maintenance proceedings, including determining income, interim maintenance, final orders, 
                              and enforcement mechanisms.
                            </li>
                            <li>
                              <strong>Shamima Farooqui v. Shahid Khan (2015):</strong> Supreme Court held that 
                              maintenance should be paid from the date of application, not the date of order.
                            </li>
                            <li>
                              <strong>Chaturbhuj v. Sita Bai (2008):</strong> Supreme Court clarified that even 
                              earning wives can claim maintenance if husband's income is significantly higher.
                            </li>
                            <li>
                              <strong>Shailja v. Khobbanna (2017):</strong> Supreme Court held that 25% of 
                              husband's net income as alimony is reasonable and judicial benchmark.
                            </li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="bg-gray-50/50 dark:bg-gray-900/20 text-xs text-muted-foreground">
          <p>
            Note: This calculator provides estimates based on common judicial practices. Actual court-determined amounts may vary.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AlimonyCalculator;
