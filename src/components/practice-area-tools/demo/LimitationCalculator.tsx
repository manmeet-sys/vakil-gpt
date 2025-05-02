
import React, { useState } from 'react';
import { BaseCalculator } from '../base';
import { CalendarIcon, Clock } from 'lucide-react';
import { usePracticeAreaTool } from '../PracticeAreaToolContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, addDays, addMonths, addYears } from 'date-fns';
import { daysBetween, formatDate } from '../utils';

interface LimitationResult {
  startDate: Date;
  endDate: Date;
  limitationPeriod: string;
  daysRemaining: number;
  totalDays: number;
  isExpired: boolean;
}

const LimitationCalculator = () => {
  const { saveToHistory } = usePracticeAreaTool();
  const [causeOfAction, setCauseOfAction] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [limitationType, setLimitationType] = useState('3years');
  const [result, setResult] = useState<LimitationResult | null>(null);
  
  const limitationOptions = [
    { value: '3years', label: '3 years (General limitation period)', days: 1095 },
    { value: '1year', label: '1 year', days: 365 },
    { value: '2years', label: '2 years', days: 730 },
    { value: '30days', label: '30 days', days: 30 },
    { value: '60days', label: '60 days', days: 60 },
    { value: '90days', label: '90 days', days: 90 },
    { value: '6months', label: '6 months', days: 183 },
    { value: '12years', label: '12 years (Immovable property)', days: 4380 },
  ];
  
  const calculateLimitation = () => {
    if (!startDate || !limitationType) return;
    
    const selectedOption = limitationOptions.find(opt => opt.value === limitationType);
    if (!selectedOption) return;
    
    let endDate;
    
    switch (limitationType) {
      case '1year':
        endDate = addYears(startDate, 1);
        break;
      case '2years':
        endDate = addYears(startDate, 2);
        break;
      case '3years':
        endDate = addYears(startDate, 3);
        break;
      case '30days':
        endDate = addDays(startDate, 30);
        break;
      case '60days':
        endDate = addDays(startDate, 60);
        break;
      case '90days':
        endDate = addDays(startDate, 90);
        break;
      case '6months':
        endDate = addMonths(startDate, 6);
        break;
      case '12years':
        endDate = addYears(startDate, 12);
        break;
      default:
        endDate = addYears(startDate, 3);
    }
    
    const today = new Date();
    const daysRemaining = daysBetween(today, endDate);
    const isExpired = today > endDate;
    
    const calculationResult = {
      startDate,
      endDate,
      limitationPeriod: selectedOption.label,
      daysRemaining: isExpired ? 0 : daysRemaining,
      totalDays: selectedOption.days,
      isExpired
    };
    
    setResult(calculationResult);
    
    // Save to history
    saveToHistory('limitation-calculator', {
      causeOfAction,
      startDate: startDate.toISOString(),
      limitationType,
      result: calculationResult
    });
  };
  
  return (
    <BaseCalculator
      title="Limitation Period Calculator"
      description="Calculate limitation periods for civil actions with consideration for exceptions"
      icon={<Clock className="h-5 w-5" />}
      onCalculate={calculateLimitation}
      results={
        result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Cause of Action</p>
                <p className="text-sm">{causeOfAction || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Limitation Period</p>
                <p className="text-sm">{result.limitationPeriod}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Start Date</p>
                <p className="text-sm">{formatDate(result.startDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">End Date</p>
                <p className="text-sm">{formatDate(result.endDate)}</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded-lg border bg-background">
              <h4 className="font-medium mb-2">Status</h4>
              {result.isExpired ? (
                <div className="bg-red-100 border border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-900 dark:text-red-300 p-2 rounded">
                  <p className="font-medium">Limitation period expired</p>
                  <p className="text-sm">The limitation period for this action has already expired.</p>
                </div>
              ) : (
                <div className="bg-green-100 border border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-900 dark:text-green-300 p-2 rounded">
                  <p className="font-medium">Time remaining: {result.daysRemaining} days</p>
                  <p className="text-sm">The limitation period is still valid.</p>
                </div>
              )}
            </div>
          </div>
        )
      }
      footerContent={
        <Button variant="outline" onClick={() => setResult(null)}>
          Reset
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="causeOfAction">Cause of Action</Label>
          <Input
            id="causeOfAction"
            placeholder="E.g., Breach of Contract, Recovery of Property"
            value={causeOfAction}
            onChange={(e) => setCauseOfAction(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Date of Cause of Action</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="limitationType">Limitation Period</Label>
          <Select value={limitationType} onValueChange={setLimitationType}>
            <SelectTrigger id="limitationType">
              <SelectValue placeholder="Select limitation period" />
            </SelectTrigger>
            <SelectContent>
              {limitationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </BaseCalculator>
  );
};

export default LimitationCalculator;
