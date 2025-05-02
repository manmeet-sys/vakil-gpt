
import React, { useState } from 'react';
import { FileCheck, Briefcase, FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BaseDocumentGenerator } from '@/components/practice-area-tools/base';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Checklist item type
interface ChecklistItem {
  id: string;
  text: string;
}

// Categories of checklist items
const dueDiligenceCategories = {
  corporate: [
    { id: 'corp1', text: 'Certificate of Incorporation and other constitutional documents' },
    { id: 'corp2', text: 'Memorandum and Articles of Association' },
    { id: 'corp3', text: 'Board and shareholder resolutions' },
    { id: 'corp4', text: 'Share certificates and share transfer records' },
    { id: 'corp5', text: 'Annual returns and filings with ROC' },
    { id: 'corp6', text: 'Corporate registers (shareholders, directors, charges)' },
    { id: 'corp7', text: 'Organizational chart and group structure' },
    { id: 'corp8', text: 'Details of subsidiaries, joint ventures, and partnerships' },
  ],
  financial: [
    { id: 'fin1', text: 'Audited financial statements (last 3 years)' },
    { id: 'fin2', text: 'Management accounts (current year)' },
    { id: 'fin3', text: 'Budget and financial projections' },
    { id: 'fin4', text: 'Tax returns and assessments (last 3 years)' },
    { id: 'fin5', text: 'GST filings and registrations' },
    { id: 'fin6', text: 'Key financial ratios and indicators' },
    { id: 'fin7', text: 'Outstanding loans and credit facilities' },
    { id: 'fin8', text: 'Working capital analysis' },
    { id: 'fin9', text: 'Capital expenditure plans' },
  ],
  assets: [
    { id: 'asset1', text: 'Fixed assets register' },
    { id: 'asset2', text: 'Real property ownership documents and title deeds' },
    { id: 'asset3', text: 'Lease agreements for rented premises' },
    { id: 'asset4', text: 'Inventory details and valuation methods' },
    { id: 'asset5', text: 'Intellectual property portfolio (patents, trademarks, copyrights)' },
    { id: 'asset6', text: 'IP registration certificates and applications' },
    { id: 'asset7', text: 'Equipment lease agreements and maintenance contracts' },
    { id: 'asset8', text: 'Valuation reports for significant assets' },
  ],
  contracts: [
    { id: 'cont1', text: 'Material contracts and agreements' },
    { id: 'cont2', text: 'Customer and supplier contracts' },
    { id: 'cont3', text: 'Distribution and agency agreements' },
    { id: 'cont4', text: 'Non-disclosure agreements' },
    { id: 'cont5', text: 'Licensing agreements' },
    { id: 'cont6', text: 'Loan agreements and security documents' },
    { id: 'cont7', text: 'Service agreements' },
    { id: 'cont8', text: 'Joint venture agreements' },
    { id: 'cont9', text: 'Change of control provisions in key contracts' },
  ],
  legal: [
    { id: 'legal1', text: 'Pending or threatened litigation matters' },
    { id: 'legal2', text: 'Court orders and judgments' },
    { id: 'legal3', text: 'Settlement agreements' },
    { id: 'legal4', text: 'Regulatory investigations and proceedings' },
    { id: 'legal5', text: 'Legal notices received or issued' },
    { id: 'legal6', text: 'Insurance policies and claims history' },
    { id: 'legal7', text: 'Powers of attorney granted or received' },
    { id: 'legal8', text: 'Warranties and indemnities given or received' },
  ],
  regulatory: [
    { id: 'reg1', text: 'Industry-specific licenses and permits' },
    { id: 'reg2', text: 'Environmental compliance certificates' },
    { id: 'reg3', text: 'Health and safety compliance records' },
    { id: 'reg4', text: 'Foreign exchange approvals (if applicable)' },
    { id: 'reg5', text: 'SEBI/stock exchange compliances (for listed entities)' },
    { id: 'reg6', text: 'FDI compliances and FEMA regulations' },
    { id: 'reg7', text: 'Data privacy compliance documentation' },
    { id: 'reg8', text: 'Anti-corruption compliance policies' },
  ],
  employment: [
    { id: 'emp1', text: 'Employee contracts and service agreements' },
    { id: 'emp2', text: 'Employment policies and handbooks' },
    { id: 'emp3', text: 'Employee benefit schemes and ESOP plans' },
    { id: 'emp4', text: 'Labor law compliance records' },
    { id: 'emp5', text: 'PF and ESI registration and compliance' },
    { id: 'emp6', text: 'Trade union agreements and disputes' },
    { id: 'emp7', text: 'Non-compete and confidentiality agreements' },
    { id: 'emp8', text: 'HR policies and procedures' },
    { id: 'emp9', text: 'Compensation structure and bonus policies' },
  ],
};

const MADueDiligenceGenerator: React.FC = () => {
  const { toast } = useToast();
  const [targetName, setTargetName] = useState<string>('');
  const [transactionType, setTransactionType] = useState<string>('acquisition');
  const [transactionValue, setTransactionValue] = useState<string>('');
  const [scope, setScope] = useState<string>('');
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [customItems, setCustomItems] = useState<string>('');
  
  // Initialize selected items on first render
  React.useEffect(() => {
    const initialSelectedItems: Record<string, boolean> = {};
    
    Object.values(dueDiligenceCategories).forEach(category => {
      category.forEach(item => {
        // Select all items by default
        initialSelectedItems[item.id] = true;
      });
    });
    
    setSelectedItems(initialSelectedItems);
  }, []);
  
  const handleToggleItem = (id: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleToggleCategory = (category: ChecklistItem[]) => {
    const allSelected = category.every(item => selectedItems[item.id]);
    
    // If all are selected, deselect all. Otherwise, select all
    const newSelectedItems = { ...selectedItems };
    category.forEach(item => {
      newSelectedItems[item.id] = !allSelected;
    });
    
    setSelectedItems(newSelectedItems);
  };
  
  const handleGenerate = () => {
    if (!targetName) {
      toast({
        title: "Missing information",
        description: "Please enter the target company name",
        variant: "destructive"
      });
      return;
    }
    
    // Generate the checklist document
    const document = generateDueDiligenceChecklist();
    setGeneratedDocument(document);
    
    toast({
      title: "Checklist generated",
      description: "Due diligence checklist has been generated successfully"
    });
  };
  
  const generateDueDiligenceChecklist = () => {
    // Get current date in Indian format
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const checklist = `
DUE DILIGENCE CHECKLIST

TARGET: ${targetName}
TRANSACTION TYPE: ${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}
${transactionValue ? `ESTIMATED TRANSACTION VALUE: ₹${parseInt(transactionValue).toLocaleString('en-IN')}` : ''}
DATE: ${currentDate}
${scope ? `SCOPE OF REVIEW: ${scope}` : ''}

===================================================================

${Object.entries(dueDiligenceCategories).map(([category, items]) => {
  const filteredItems = items.filter(item => selectedItems[item.id]);
  if (filteredItems.length === 0) return '';
  
  return `
## ${category.toUpperCase()} DUE DILIGENCE

${filteredItems.map((item, index) => `${index + 1}. ${item.text}
   Status: [ ] Complete [ ] Pending [ ] Not Applicable
   Comments: _________________________________________________
   Responsible Person: _______________________________________
   Due Date: _________________________________________________
`).join('\n')}
`;
}).filter(section => section).join('\n')}

${customItems.trim() ? `
## CUSTOM DUE DILIGENCE ITEMS

${customItems.split('\n').map((item, index) => `${index + 1}. ${item}
   Status: [ ] Complete [ ] Pending [ ] Not Applicable
   Comments: _________________________________________________
   Responsible Person: _______________________________________
   Due Date: _________________________________________________
`).join('\n')}
` : ''}

===================================================================

GENERAL INSTRUCTIONS:

1. This checklist is for guidance purposes and should be tailored to the specific transaction.
2. Documents should be organized in folders corresponding to each section.
3. All documents should be dated, labeled, and indexed for easy reference.
4. Confidential information should be clearly marked and handled accordingly.
5. Regular status updates should be provided to the transaction team.

===================================================================

PREPARED BY: ________________________________    DATE: ______________

APPROVED BY: ________________________________    DATE: ______________
`;
    
    return checklist;
  };
  
  return (
    <BaseDocumentGenerator
      title="M&A Due Diligence Checklist Generator"
      description="Create comprehensive due diligence checklists for mergers and acquisitions"
      icon={<FileCheck className="h-4 w-4 text-blue-600" />}
      onGenerate={handleGenerate}
      generatedContent={generatedDocument}
    >
      <div className="space-y-5">
        <div>
          <Label htmlFor="target-name">Target Company Name</Label>
          <Input
            id="target-name"
            className="mt-1"
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
            placeholder="Enter target company name"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="transaction-type">Transaction Type</Label>
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger id="transaction-type" className="mt-1">
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acquisition">Acquisition</SelectItem>
                <SelectItem value="merger">Merger</SelectItem>
                <SelectItem value="joint-venture">Joint Venture</SelectItem>
                <SelectItem value="investment">Strategic Investment</SelectItem>
                <SelectItem value="asset-purchase">Asset Purchase</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="transaction-value">Transaction Value (₹)</Label>
            <Input
              id="transaction-value"
              className="mt-1"
              value={transactionValue}
              onChange={(e) => setTransactionValue(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Optional"
              type="text"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="scope">Scope of Review</Label>
          <Textarea
            id="scope"
            className="mt-1 h-20"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            placeholder="Brief description of the due diligence scope and objectives"
          />
        </div>
        
        <div className="mt-6 space-y-5">
          {Object.entries(dueDiligenceCategories).map(([category, items]) => (
            <Card key={category} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium capitalize">{category} Due Diligence</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleToggleCategory(items)}
                    type="button"
                  >
                    {items.every(item => selectedItems[item.id]) ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={item.id} 
                        checked={selectedItems[item.id] || false}
                        onCheckedChange={() => handleToggleItem(item.id)} 
                      />
                      <Label htmlFor={item.id} className="text-sm font-normal cursor-pointer">
                        {item.text}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div>
            <Label htmlFor="custom-items">Custom Checklist Items (one per line)</Label>
            <Textarea
              id="custom-items"
              className="mt-1 h-24"
              value={customItems}
              onChange={(e) => setCustomItems(e.target.value)}
              placeholder="Add any additional items specific to this transaction"
            />
          </div>
        </div>
      </div>
    </BaseDocumentGenerator>
  );
};

export default MADueDiligenceGenerator;
