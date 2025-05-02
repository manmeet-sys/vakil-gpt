
import React, { useState } from 'react';
import { Calendar as CalendarIcon, FileText, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BaseDocumentGenerator } from '@/components/practice-area-tools/base';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface ComplianceDeadline {
  id: string;
  category: string;
  description: string;
  dueDate: string; // like "31 March", "30 September"
  applicability: string;
  interval: 'annual' | 'quarterly' | 'monthly';
  penalty?: string;
}

// Predefined compliance deadlines
const complianceDeadlines: ComplianceDeadline[] = [
  // Annual ROC Filings
  {
    id: 'roc1',
    category: 'ROC Filings',
    description: 'Annual Return (Form MGT-7)',
    dueDate: '60 days from AGM',
    applicability: 'All companies',
    interval: 'annual',
    penalty: 'Rs. 100 per day (continues even after 300 days)'
  },
  {
    id: 'roc2',
    category: 'ROC Filings',
    description: 'Financial Statements (Form AOC-4)',
    dueDate: '30 days from AGM',
    applicability: 'All companies',
    interval: 'annual',
    penalty: 'Rs. 100 per day (continues even after 300 days)'
  },
  {
    id: 'roc3',
    category: 'ROC Filings',
    description: 'Return of Allotment (Form PAS-3)',
    dueDate: '30 days from allotment',
    applicability: 'Companies issuing shares',
    interval: 'annual',
    penalty: 'Rs. 1000 per day (max Rs. 5 lakhs for company; Rs. 50,000 for officer in default)'
  },
  
  // Income Tax
  {
    id: 'it1',
    category: 'Income Tax',
    description: 'File Income Tax Return',
    dueDate: '31 October',
    applicability: 'All companies',
    interval: 'annual',
    penalty: 'Rs. 10,000 if filed after due date'
  },
  {
    id: 'it2',
    category: 'Income Tax',
    description: 'Tax Audit Report',
    dueDate: '30 September',
    applicability: 'Companies with turnover > Rs. 1 crore',
    interval: 'annual',
    penalty: 'Rs. 1.5% per month on tax payable'
  },
  {
    id: 'it3',
    category: 'Income Tax',
    description: 'Advance Tax - 1st Installment (15%)',
    dueDate: '15 June',
    applicability: 'All companies',
    interval: 'annual',
    penalty: 'Interest @1% per month on defaulted amount'
  },
  {
    id: 'it4',
    category: 'Income Tax',
    description: 'Advance Tax - 2nd Installment (45%)',
    dueDate: '15 September',
    applicability: 'All companies',
    interval: 'annual',
    penalty: 'Interest @1% per month on defaulted amount'
  },
  {
    id: 'it5',
    category: 'Income Tax',
    description: 'Advance Tax - 3rd Installment (75%)',
    dueDate: '15 December',
    applicability: 'All companies',
    interval: 'annual',
    penalty: 'Interest @1% per month on defaulted amount'
  },
  {
    id: 'it6',
    category: 'Income Tax',
    description: 'Advance Tax - 4th Installment (100%)',
    dueDate: '15 March',
    applicability: 'All companies',
    interval: 'annual',
    penalty: 'Interest @1% per month on defaulted amount'
  },
  
  // GST
  {
    id: 'gst1',
    category: 'GST',
    description: 'File GSTR-3B',
    dueDate: '20th of next month',
    applicability: 'All registered companies',
    interval: 'monthly',
    penalty: 'Rs. 50 per day (max Rs. 10,000)'
  },
  {
    id: 'gst2',
    category: 'GST',
    description: 'File GSTR-1',
    dueDate: '11th of next month',
    applicability: 'All registered companies',
    interval: 'monthly',
    penalty: 'Rs. 50 per day (max Rs. 10,000)'
  },
  {
    id: 'gst3',
    category: 'GST',
    description: 'File Annual Return (GSTR-9)',
    dueDate: '31 December',
    applicability: 'All registered companies',
    interval: 'annual',
    penalty: 'Rs. 200 per day (max Rs. 10,000)'
  },
  
  // TDS
  {
    id: 'tds1',
    category: 'TDS',
    description: 'File TDS Return (Form 24Q, 26Q)',
    dueDate: '31 July (Q1), 31 Oct (Q2), 31 Jan (Q3), 31 May (Q4)',
    applicability: 'Companies deducting TDS',
    interval: 'quarterly',
    penalty: 'Rs. 200 per day (max tax deductible)'
  },
  {
    id: 'tds2',
    category: 'TDS',
    description: 'Issue TDS Certificates (Form 16, 16A)',
    dueDate: '15 days from filing TDS return',
    applicability: 'Companies deducting TDS',
    interval: 'quarterly',
    penalty: 'Rs. 100 per day (max Rs. 25,000)'
  },
  
  // Labour Laws
  {
    id: 'pf1',
    category: 'PF/ESI',
    description: 'PF Deposit',
    dueDate: '15th of next month',
    applicability: 'Companies with PF registration',
    interval: 'monthly',
    penalty: '5% to 25% of the amount + interest @12% p.a.'
  },
  {
    id: 'esi1',
    category: 'PF/ESI',
    description: 'ESI Deposit',
    dueDate: '15th of next month',
    applicability: 'Companies with ESI registration',
    interval: 'monthly',
    penalty: 'Interest @12% p.a. + recovery proceedings'
  },
  
  // Annual General Meeting
  {
    id: 'agm1',
    category: 'Corporate',
    description: 'Hold Annual General Meeting',
    dueDate: '30 September',
    applicability: 'All companies',
    interval: 'annual',
    penalty: 'Rs. 100,000 for company; Rs. 5,000 per day for officers in default'
  },
  
  // Board Meetings
  {
    id: 'board1',
    category: 'Corporate',
    description: 'Board Meeting (minimum one per quarter)',
    dueDate: 'Every quarter with max gap of 120 days',
    applicability: 'All companies',
    interval: 'quarterly',
    penalty: 'Rs. 25,000 for company; Rs. 5,000 for officers'
  }
];

const ComplianceCalendarGenerator: React.FC = () => {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState<string>('');
  const [companyType, setCompanyType] = useState<string>('private-limited');
  const [financialYear, setFinancialYear] = useState<string>(
    `${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}`
  );
  const [gstRegistered, setGstRegistered] = useState<boolean>(true);
  const [hasPfEsi, setHasPfEsi] = useState<boolean>(true);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({
    'ROC Filings': true,
    'Income Tax': true,
    'GST': true, 
    'TDS': true,
    'PF/ESI': true,
    'Corporate': true
  });
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const handleGenerate = () => {
    if (!companyName) {
      toast({
        title: "Missing information",
        description: "Please enter the company name",
        variant: "destructive"
      });
      return;
    }
    
    // Generate the compliance calendar
    const document = generateComplianceCalendar();
    setGeneratedDocument(document);
    
    toast({
      title: "Calendar generated",
      description: "Corporate compliance calendar has been generated successfully"
    });
  };
  
  const generateComplianceCalendar = () => {
    // Get filtered deadlines based on selection criteria
    const filteredDeadlines = complianceDeadlines.filter(deadline => {
      // Filter by selected categories
      if (!selectedCategories[deadline.category]) return false;
      
      // Filter GST-related deadlines if not GST registered
      if (!gstRegistered && deadline.category === 'GST') return false;
      
      // Filter PF/ESI-related deadlines if not applicable
      if (!hasPfEsi && deadline.category === 'PF/ESI') return false;
      
      return true;
    });
    
    // Group deadlines by month for better organization
    const deadlinesByMonth: Record<string, ComplianceDeadline[]> = {};
    const months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
    
    months.forEach(month => {
      deadlinesByMonth[month] = [];
    });
    
    // Categorize deadlines by month (as best as possible)
    filteredDeadlines.forEach(deadline => {
      if (deadline.interval === 'monthly') {
        months.forEach(month => {
          deadlinesByMonth[month].push({...deadline});
        });
      } else if (deadline.interval === 'quarterly') {
        if (deadline.dueDate.includes('July')) deadlinesByMonth['July'].push({...deadline});
        if (deadline.dueDate.includes('Oct')) deadlinesByMonth['October'].push({...deadline});
        if (deadline.dueDate.includes('Jan')) deadlinesByMonth['January'].push({...deadline});
        if (deadline.dueDate.includes('May')) deadlinesByMonth['May'].push({...deadline});
        
        // For board meetings which happen every quarter
        if (deadline.id === 'board1') {
          deadlinesByMonth['June'].push({...deadline});
          deadlinesByMonth['September'].push({...deadline});
          deadlinesByMonth['December'].push({...deadline});
          deadlinesByMonth['March'].push({...deadline});
        }
      } else {
        // Annual deadlines
        if (deadline.dueDate.includes('March')) deadlinesByMonth['March'].push({...deadline});
        else if (deadline.dueDate.includes('April')) deadlinesByMonth['April'].push({...deadline});
        else if (deadline.dueDate.includes('May')) deadlinesByMonth['May'].push({...deadline});
        else if (deadline.dueDate.includes('June')) deadlinesByMonth['June'].push({...deadline});
        else if (deadline.dueDate.includes('July')) deadlinesByMonth['July'].push({...deadline});
        else if (deadline.dueDate.includes('August')) deadlinesByMonth['August'].push({...deadline});
        else if (deadline.dueDate.includes('September')) deadlinesByMonth['September'].push({...deadline});
        else if (deadline.dueDate.includes('October')) deadlinesByMonth['October'].push({...deadline});
        else if (deadline.dueDate.includes('November')) deadlinesByMonth['November'].push({...deadline});
        else if (deadline.dueDate.includes('December')) deadlinesByMonth['December'].push({...deadline});
        else if (deadline.dueDate.includes('January')) deadlinesByMonth['January'].push({...deadline});
        else if (deadline.dueDate.includes('February')) deadlinesByMonth['February'].push({...deadline});
        else {
          // If it's related to AGM (like "60 days from AGM"), add to October since AGM is typically by September
          if (deadline.dueDate.toLowerCase().includes('agm')) {
            if (deadline.id === 'roc1') deadlinesByMonth['November'].push({...deadline});
            else deadlinesByMonth['October'].push({...deadline});
          }
        }
      }
    });

    // Format the calendar
    const calendar = `
CORPORATE COMPLIANCE CALENDAR
=============================
COMPANY: ${companyName}
TYPE: ${companyType === 'private-limited' ? 'Private Limited Company' : 
      companyType === 'llp' ? 'Limited Liability Partnership' :
      companyType === 'opc' ? 'One Person Company' : 'Public Limited Company'}
FINANCIAL YEAR: ${financialYear}
GENERATED ON: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

COMPLIANCE SUMMARY:
------------------
This calendar includes deadlines for:
${Object.entries(selectedCategories).filter(([_, isSelected]) => isSelected).map(([category]) => `- ${category}`).join('\n')}

${gstRegistered ? '✓ Company is GST registered' : '✗ Company is not GST registered'}
${hasPfEsi ? '✓ Company has PF/ESI registrations' : '✗ Company does not have PF/ESI registrations'}

MONTHLY COMPLIANCE CALENDAR:
==========================

${months.map(month => {
  const deadlines = deadlinesByMonth[month];
  if (deadlines.length === 0) return '';
  
  return `
## ${month.toUpperCase()} ${month === 'January' || month === 'February' || month === 'March' ? financialYear.split('-')[1] : financialYear.split('-')[0]}

${deadlines.map(deadline => {
  return `${deadline.category} - ${deadline.description}
  Due Date: ${deadline.dueDate}
  Applicability: ${deadline.applicability}
  Penalty: ${deadline.penalty || 'Not specified'}
  Responsible Person: ______________________
  Status: [ ] Completed  [ ] In Progress  [ ] Pending

`;
}).join('\n')}`;
}).join('\n')}

IMPORTANT NOTES:
--------------
1. This compliance calendar is for guidance purposes only and should be reviewed by a professional.
2. Due dates may be extended by regulatory authorities. Always verify current deadlines.
3. Company-specific compliances based on industry, location, or business activities may require additional filings.
4. For companies with subsidiaries or overseas operations, additional compliance requirements may apply.

COMPLIANCE TRACKING:
------------------
- Each compliance item should be assigned to a responsible person.
- Regular reviews should be conducted to ensure timely compliance.
- Documentation of compliance should be maintained systematically.
- Set up reminder alerts 15 days prior to each deadline.

PREPARED BY: ______________________    DATE: ______________

APPROVED BY: ______________________    DATE: ______________

© ${new Date().getFullYear()} ${companyName} - All Rights Reserved
`;

    return calendar;
  };
  
  const categories = Array.from(new Set(complianceDeadlines.map(d => d.category)));
  
  return (
    <BaseDocumentGenerator
      title="Corporate Compliance Calendar Generator"
      description="Create customized compliance calendars with key regulatory deadlines"
      icon={<CalendarIcon className="h-4 w-4 text-blue-600" />}
      onGenerate={handleGenerate}
      generatedContent={generatedDocument}
    >
      <div className="space-y-5">
        <div>
          <Label htmlFor="company-name">Company Name</Label>
          <Input
            id="company-name"
            className="mt-1"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company-type">Company Type</Label>
            <Select value={companyType} onValueChange={setCompanyType}>
              <SelectTrigger id="company-type" className="mt-1">
                <SelectValue placeholder="Select company type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private-limited">Private Limited Company</SelectItem>
                <SelectItem value="llp">Limited Liability Partnership (LLP)</SelectItem>
                <SelectItem value="opc">One Person Company (OPC)</SelectItem>
                <SelectItem value="public-limited">Public Limited Company</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="financial-year">Financial Year</Label>
            <Select value={financialYear} onValueChange={setFinancialYear}>
              <SelectTrigger id="financial-year" className="mt-1">
                <SelectValue placeholder="Select financial year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={`${new Date().getFullYear()-1}-${(new Date().getFullYear()).toString().slice(-2)}`}>
                  {`${new Date().getFullYear()-1}-${new Date().getFullYear()}`}
                </SelectItem>
                <SelectItem value={`${new Date().getFullYear()}-${(new Date().getFullYear()+1).toString().slice(-2)}`}>
                  {`${new Date().getFullYear()}-${new Date().getFullYear()+1}`}
                </SelectItem>
                <SelectItem value={`${new Date().getFullYear()+1}-${(new Date().getFullYear()+2).toString().slice(-2)}`}>
                  {`${new Date().getFullYear()+1}-${new Date().getFullYear()+2}`}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Applicability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="gst-registered" 
                  checked={gstRegistered} 
                  onCheckedChange={(checked) => setGstRegistered(!!checked)} 
                />
                <Label htmlFor="gst-registered" className="text-sm font-normal cursor-pointer">
                  Company is GST registered
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="pf-esi" 
                  checked={hasPfEsi} 
                  onCheckedChange={(checked) => setHasPfEsi(!!checked)} 
                />
                <Label htmlFor="pf-esi" className="text-sm font-normal cursor-pointer">
                  Company has PF/ESI registrations
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Compliance Categories</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-3">
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={selectedCategories[category] || false} 
                    onCheckedChange={() => handleCategoryToggle(category)} 
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer">
                    {category}
                  </Label>
                  <span className="ml-auto">
                    <Badge variant="outline">
                      {complianceDeadlines.filter(d => d.category === category).length} items
                    </Badge>
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>Select categories applicable to your company</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseDocumentGenerator>
  );
};

export default ComplianceCalendarGenerator;
