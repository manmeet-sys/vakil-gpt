
import React, { useState } from 'react';
import { BaseCalculator } from '@/components/practice-area-tools/base';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate, daysBetween, pluralize } from '@/components/practice-area-tools/utils';
import { Calendar } from 'lucide-react';

const LimitationPeriodCalculator: React.FC = () => {
  const [causeOfAction, setCauseOfAction] = useState('breach_of_contract');
  const [eventDate, setEventDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [hasExtension, setHasExtension] = useState(false);
  const [extensionReason, setExtensionReason] = useState('');
  const [extensionPeriod, setExtensionPeriod] = useState(0);
  const [calculatedResults, setCalculatedResults] = useState<any>(null);
  
  const causeOfActionTypes = [
    { value: 'breach_of_contract', label: 'Breach of Contract', limitationYears: 3 },
    { value: 'specific_performance', label: 'Specific Performance', limitationYears: 3 },
    { value: 'property_recovery', label: 'Recovery of Immovable Property', limitationYears: 12 },
    { value: 'movable_property', label: 'Recovery of Movable Property', limitationYears: 3 },
    { value: 'negligence', label: 'Negligence', limitationYears: 1 },
    { value: 'defamation', label: 'Defamation', limitationYears: 1 },
    { value: 'tort_damages', label: 'Tort Damages', limitationYears: 1 },
    { value: 'account_recovery', label: 'Recovery of Accounts', limitationYears: 3 },
    { value: 'decree_execution', label: 'Execution of Decree', limitationYears: 12 },
    { value: 'mortgage_foreclosure', label: 'Mortgage Foreclosure', limitationYears: 12 },
  ];

  const calculateLimitation = () => {
    try {
      const selectedCauseType = causeOfActionTypes.find(type => type.value === causeOfAction);
      if (!selectedCauseType || !eventDate) return;
      
      const eventDateObj = new Date(eventDate);
      const limitationYears = selectedCauseType.limitationYears;
      
      // Calculate standard limitation date
      const standardLimitationDate = new Date(eventDateObj);
      standardLimitationDate.setFullYear(standardLimitationDate.getFullYear() + limitationYears);
      
      // Calculate extended date if applicable
      let extendedLimitationDate = new Date(standardLimitationDate);
      if (hasExtension && extensionPeriod > 0) {
        extendedLimitationDate.setDate(extendedLimitationDate.getDate() + extensionPeriod);
      }
      
      // Calculate days remaining
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const finalLimitDate = hasExtension ? extendedLimitationDate : standardLimitationDate;
      const daysRemaining = daysBetween(today, finalLimitDate);
      const isExpired = finalLimitDate < today;
      
      setCalculatedResults({
        causeOfAction: selectedCauseType.label,
        eventDate: formatDate(eventDateObj),
        standardLimitationDate: formatDate(standardLimitationDate),
        extendedLimitationDate: hasExtension ? formatDate(extendedLimitationDate) : null,
        daysRemaining: isExpired ? 0 : daysRemaining,
        isExpired,
        limitationPeriod: `${limitationYears} ${pluralize(limitationYears, 'year')}`,
        extensionApplied: hasExtension,
        extensionReason: hasExtension ? extensionReason : null,
        extensionDays: hasExtension ? extensionPeriod : null,
      });
    } catch (error) {
      console.error("Error calculating limitation period:", error);
    }
  };

  const renderResults = () => {
    if (!calculatedResults) return null;
    
    return (
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:gap-4">
          <div className="font-medium">Cause of Action:</div>
          <div>{calculatedResults.causeOfAction}</div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:gap-4">
          <div className="font-medium">Event Date:</div>
          <div>{calculatedResults.eventDate}</div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:gap-4">
          <div className="font-medium">Standard Limitation Period:</div>
          <div>{calculatedResults.limitationPeriod}</div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:gap-4">
          <div className="font-medium">Limitation Deadline:</div>
          <div className={calculatedResults.isExpired ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
            {calculatedResults.standardLimitationDate}
          </div>
        </div>
        
        {calculatedResults.extensionApplied && (
          <>
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <div className="font-medium">Extension Applied:</div>
              <div>{calculatedResults.extensionDays} days ({calculatedResults.extensionReason})</div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <div className="font-medium">Extended Deadline:</div>
              <div className={calculatedResults.isExpired ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
                {calculatedResults.extendedLimitationDate}
              </div>
            </div>
          </>
        )}
        
        <div className="flex flex-col sm:flex-row sm:gap-4">
          <div className="font-medium">Status:</div>
          <div className={calculatedResults.isExpired ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
            {calculatedResults.isExpired 
              ? "EXPIRED - Limitation period has passed" 
              : `ACTIVE - ${calculatedResults.daysRemaining} days remaining`}
          </div>
        </div>
      </div>
    );
  };

  return (
    <BaseCalculator
      title="Limitation Period Calculator"
      description="Calculate limitation periods for various civil actions with consideration for exceptions and extensions"
      icon={<Calendar className="h-5 w-5" />}
      onCalculate={calculateLimitation}
      results={renderResults()}
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cause-of-action">Cause of Action</Label>
          <Select value={causeOfAction} onValueChange={setCauseOfAction}>
            <SelectTrigger id="cause-of-action">
              <SelectValue placeholder="Select cause of action" />
            </SelectTrigger>
            <SelectContent>
              {causeOfActionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Select the specific cause of action to determine the applicable limitation period
          </p>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="event-date">Date of Cause of Action</Label>
          <Input
            id="event-date"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            The date when the cause of action arose (e.g., breach date, injury date)
          </p>
        </div>
        
        <div className="flex items-start space-x-2 pt-2">
          <Checkbox 
            id="has-extension" 
            checked={hasExtension}
            onCheckedChange={(checked) => setHasExtension(checked === true)}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="has-extension"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Apply Extension or Exception
            </label>
            <p className="text-sm text-muted-foreground">
              Apply extension due to legal disability, acknowledgment, fraud, etc.
            </p>
          </div>
        </div>
        
        {hasExtension && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="extension-reason">Extension Reason</Label>
              <Select value={extensionReason} onValueChange={setExtensionReason}>
                <SelectTrigger id="extension-reason">
                  <SelectValue placeholder="Select reason for extension" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="legal_disability">Legal Disability (Minor/Mental Incapacity)</SelectItem>
                  <SelectItem value="acknowledgment">Written Acknowledgment by Defendant</SelectItem>
                  <SelectItem value="fraud">Concealment by Fraud</SelectItem>
                  <SelectItem value="covid">COVID-19 Judicial Orders</SelectItem>
                  <SelectItem value="foreign_defendant">Foreign Defendant</SelectItem>
                  <SelectItem value="court_order">Court Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="extension-period">Extension Period (Days)</Label>
              <Input
                id="extension-period"
                type="number"
                value={extensionPeriod}
                onChange={(e) => setExtensionPeriod(parseInt(e.target.value) || 0)}
              />
              <p className="text-sm text-muted-foreground">
                Number of days by which the limitation period is extended
              </p>
            </div>
          </>
        )}
      </div>
    </BaseCalculator>
  );
};

export default LimitationPeriodCalculator;
