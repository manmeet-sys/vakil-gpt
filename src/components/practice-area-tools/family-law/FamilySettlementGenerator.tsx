import React, { useState } from 'react';
import { BaseDocumentGenerator } from '@/components/practice-area-tools/base';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText } from 'lucide-react';

const FamilySettlementGenerator = () => {
  const [settlementType, setSettlementType] = useState<string>('divorce');
  const [party1Name, setParty1Name] = useState<string>('');
  const [party2Name, setParty2Name] = useState<string>('');
  const [marriageDate, setMarriageDate] = useState<string>('');
  const [marriagePlace, setMarriagePlace] = useState<string>('');
  const [separationDate, setSeparationDate] = useState<string>('');
  const [personalLaw, setPersonalLaw] = useState<string>('hindu');
  
  const [includeOptions, setIncludeOptions] = useState({
    maintenance: true,
    custody: false,
    property: false,
    streedhan: false,
    legalProceedings: false,
  });
  
  const [childDetails, setChildDetails] = useState<string>('');
  const [maintenanceAmount, setMaintenanceAmount] = useState<string>('');
  const [propertyDetails, setPropertyDetails] = useState<string>('');
  const [otherTerms, setOtherTerms] = useState<string>('');
  
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  
  const handleOptionChange = (option: string, checked: boolean) => {
    setIncludeOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };
  
  const generateDocument = () => {
    // Generate the document based on the inputs
    let document = '';
    
    // Document title
    const documentTitle = settlementType === 'divorce' ? 'MUTUAL CONSENT DIVORCE SETTLEMENT AGREEMENT' :
                          settlementType === 'separation' ? 'DEED OF SEPARATION' :
                          'FAMILY SETTLEMENT AGREEMENT';
    
    document += `${documentTitle.toUpperCase()}\n\n`;
    
    // Introduction
    document += `THIS AGREEMENT is made and entered into on this ${new Date().toLocaleDateString('en-IN')}, BETWEEN:\n\n`;
    
    document += `${party1Name.toUpperCase()}, hereinafter referred to as "PARTY OF THE FIRST PART"\n\n`;
    document += `AND\n\n`;
    document += `${party2Name.toUpperCase()}, hereinafter referred to as "PARTY OF THE SECOND PART"\n\n`;
    
    // Background
    document += `WHEREAS the parties were married on ${marriageDate} at ${marriagePlace} according to ${personalLaw === 'hindu' ? 'Hindu' : personalLaw === 'muslim' ? 'Muslim' : personalLaw === 'christian' ? 'Christian' : 'Civil'} rites and ceremonies;\n\n`;
    
    if (separationDate) {
      document += `AND WHEREAS the parties have been living separately since ${separationDate} due to differences and disputes that have arisen between them;\n\n`;
    }
    
    if (settlementType === 'divorce') {
      document += `AND WHEREAS the parties have mutually agreed that their marriage has irretrievably broken down and they desire to obtain a divorce by mutual consent under ${personalLaw === 'hindu' ? 'Section 13B of the Hindu Marriage Act, 1955' : personalLaw === 'muslim' ? 'applicable provisions of Muslim Personal Law' : personalLaw === 'christian' ? 'Section 10A of the Indian Divorce Act, 1869' : 'Section 28 of the Special Marriage Act, 1954'};\n\n`;
    } else if (settlementType === 'separation') {
      document += `AND WHEREAS the parties have mutually agreed to live separately and to formalize the terms of their separation;\n\n`;
    }
    
    document += `AND WHEREAS the parties wish to settle all issues between them in an amicable manner;\n\n`;
    document += `NOW THEREFORE THIS AGREEMENT WITNESSETH AS FOLLOWS:\n\n`;
    
    // Separation/Divorce clause
    if (settlementType === 'divorce') {
      document += `1. DIVORCE BY MUTUAL CONSENT\n`;
      document += `   The parties agree to file a petition for divorce by mutual consent under ${personalLaw === 'hindu' ? 'Section 13B of the Hindu Marriage Act, 1955' : personalLaw === 'muslim' ? 'applicable provisions of Muslim Personal Law' : personalLaw === 'christian' ? 'Section 10A of the Indian Divorce Act, 1869' : 'Section 28 of the Special Marriage Act, 1954'} before the competent Family Court, and to do all acts, deeds, and things necessary to obtain a decree of divorce.\n\n`;
    } else if (settlementType === 'separation') {
      document += `1. SEPARATION\n`;
      document += `   The parties shall live separate and apart from each other, free from interference, authority and control, direct or indirect, by the other, as fully as if they were unmarried.\n\n`;
    }
    
    // Custody clause
    if (includeOptions.custody && childDetails) {
      document += `2. CUSTODY AND GUARDIANSHIP OF CHILD(REN)\n`;
      document += `   With regard to the child(ren) of the marriage: ${childDetails}\n\n`;
    }
    
    // Maintenance clause
    if (includeOptions.maintenance && maintenanceAmount) {
      document += `${includeOptions.custody ? '3' : '2'}. MAINTENANCE\n`;
      document += `   The Party of the ${maintenanceAmount.includes('First Party to Second Party') ? 'First' : 'Second'} Part shall pay to the Party of the ${maintenanceAmount.includes('First Party to Second Party') ? 'Second' : 'First'} Part a sum of ${maintenanceAmount.replace('First Party to Second Party', '').replace('Second Party to First Party', '')} as full and final settlement of all claims for maintenance, alimony and support.\n\n`;
    }
    
    // Property settlement
    if (includeOptions.property && propertyDetails) {
      const clauseNum = (includeOptions.custody ? 1 : 0) + (includeOptions.maintenance ? 1 : 0) + 2;
      document += `${clauseNum}. PROPERTY SETTLEMENT\n`;
      document += `   The parties agree to the following division of property:\n   ${propertyDetails}\n\n`;
    }
    
    // Streedhan/Jewelry
    if (includeOptions.streedhan) {
      const clauseNum = (includeOptions.custody ? 1 : 0) + (includeOptions.maintenance ? 1 : 0) + (includeOptions.property ? 1 : 0) + 2;
      document += `${clauseNum}. RETURN OF STREEDHAN/PERSONAL BELONGINGS\n`;
      document += `   The Party of the First Part has returned/shall return all streedhan articles, jewelry, and personal belongings to the Party of the Second Part, the receipt of which is hereby acknowledged by the Party of the Second Part.\n\n`;
    }
    
    // Legal proceedings
    if (includeOptions.legalProceedings) {
      const clauseNum = (includeOptions.custody ? 1 : 0) + (includeOptions.maintenance ? 1 : 0) + (includeOptions.property ? 1 : 0) + (includeOptions.streedhan ? 1 : 0) + 2;
      document += `${clauseNum}. WITHDRAWAL OF LEGAL PROCEEDINGS\n`;
      document += `   The parties agree to withdraw all complaints, FIRs, and cases filed against each other and their family members in any court of law or police station within 15 days of execution of this agreement.\n\n`;
    }
    
    // Other terms
    if (otherTerms) {
      const clauseNum = (includeOptions.custody ? 1 : 0) + (includeOptions.maintenance ? 1 : 0) + (includeOptions.property ? 1 : 0) + (includeOptions.streedhan ? 1 : 0) + (includeOptions.legalProceedings ? 1 : 0) + 2;
      document += `${clauseNum}. OTHER TERMS AND CONDITIONS\n`;
      document += `   ${otherTerms}\n\n`;
    }
    
    // Full and final settlement
    const finalClauseNum = (includeOptions.custody ? 1 : 0) + (includeOptions.maintenance ? 1 : 0) + (includeOptions.property ? 1 : 0) + (includeOptions.streedhan ? 1 : 0) + (includeOptions.legalProceedings ? 1 : 0) + (otherTerms ? 1 : 0) + 2;
    document += `${finalClauseNum}. FULL AND FINAL SETTLEMENT\n`;
    document += `   This agreement constitutes a full and final settlement of all claims between the parties. Neither party shall have any claim against the other except as provided in this agreement.\n\n`;
    
    // Signatures
    document += `IN WITNESS WHEREOF, the parties have set their hands on the day, month and year first above written.\n\n`;
    document += `SIGNED BY:\n\n`;
    document += `____________________________\n`;
    document += `(${party1Name.toUpperCase()})\n`;
    document += `PARTY OF THE FIRST PART\n\n`;
    document += `____________________________\n`;
    document += `(${party2Name.toUpperCase()})\n`;
    document += `PARTY OF THE SECOND PART\n\n`;
    document += `WITNESSES:\n\n`;
    document += `1. ____________________________\n\n`;
    document += `2. ____________________________\n`;
    
    setGeneratedDocument(document);
  };
  
  return (
    <BaseDocumentGenerator
      title="Family Settlement Document Generator"
      description="Generate family law settlement documents based on specific requirements"
      icon={<FileText className="h-5 w-5 text-blue-600" />}
      onGenerate={generateDocument}
      generatedContent={generatedDocument}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="settlement-type">Settlement Type</Label>
          <Select 
            value={settlementType} 
            onValueChange={setSettlementType}
          >
            <SelectTrigger className="w-full" id="settlement-type">
              <SelectValue placeholder="Select Settlement Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="divorce">Mutual Consent Divorce Settlement</SelectItem>
              <SelectItem value="separation">Deed of Separation</SelectItem>
              <SelectItem value="family">Family Settlement Agreement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="party1-name">First Party Name</Label>
            <Input 
              id="party1-name"
              placeholder="Enter first party's full name"
              value={party1Name}
              onChange={(e) => setParty1Name(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="party2-name">Second Party Name</Label>
            <Input 
              id="party2-name"
              placeholder="Enter second party's full name"
              value={party2Name}
              onChange={(e) => setParty2Name(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="personal-law">Personal Law Applicable</Label>
          <Select 
            value={personalLaw} 
            onValueChange={setPersonalLaw}
          >
            <SelectTrigger className="w-full" id="personal-law">
              <SelectValue placeholder="Select Personal Law" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hindu">Hindu Marriage Act</SelectItem>
              <SelectItem value="muslim">Muslim Personal Law</SelectItem>
              <SelectItem value="christian">Indian Divorce Act (Christians)</SelectItem>
              <SelectItem value="civil">Special Marriage Act (Civil)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="marriage-date">Date of Marriage</Label>
            <Input 
              id="marriage-date"
              placeholder="e.g., 15th April 2010"
              value={marriageDate}
              onChange={(e) => setMarriageDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="marriage-place">Place of Marriage</Label>
            <Input 
              id="marriage-place"
              placeholder="e.g., Delhi"
              value={marriagePlace}
              onChange={(e) => setMarriagePlace(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="separation-date">Date of Separation (if applicable)</Label>
          <Input 
            id="separation-date"
            placeholder="e.g., January 2022"
            value={separationDate}
            onChange={(e) => setSeparationDate(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Include Sections</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="maintenance-option"
                checked={includeOptions.maintenance}
                onCheckedChange={(checked) => 
                  handleOptionChange('maintenance', checked === true)}
              />
              <Label htmlFor="maintenance-option">Maintenance/Alimony</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="custody-option"
                checked={includeOptions.custody}
                onCheckedChange={(checked) => 
                  handleOptionChange('custody', checked === true)}
              />
              <Label htmlFor="custody-option">Child Custody</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="property-option"
                checked={includeOptions.property}
                onCheckedChange={(checked) => 
                  handleOptionChange('property', checked === true)}
              />
              <Label htmlFor="property-option">Property Division</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="streedhan-option"
                checked={includeOptions.streedhan}
                onCheckedChange={(checked) => 
                  handleOptionChange('streedhan', checked === true)}
              />
              <Label htmlFor="streedhan-option">Streedhan/Jewelry</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="legal-proceedings-option"
                checked={includeOptions.legalProceedings}
                onCheckedChange={(checked) => 
                  handleOptionChange('legalProceedings', checked === true)}
              />
              <Label htmlFor="legal-proceedings-option">Legal Proceedings</Label>
            </div>
          </div>
        </div>
        
        {includeOptions.custody && (
          <div className="space-y-2">
            <Label htmlFor="child-details">Child Details & Custody Arrangement</Label>
            <Textarea 
              id="child-details"
              placeholder="Describe children and custody arrangement"
              value={childDetails}
              onChange={(e) => setChildDetails(e.target.value)}
              rows={3}
            />
          </div>
        )}
        
        {includeOptions.maintenance && (
          <div className="space-y-2">
            <Label htmlFor="maintenance-amount">Maintenance Details</Label>
            <Textarea 
              id="maintenance-amount"
              placeholder="e.g., Rs. 25,000 per month from First Party to Second Party"
              value={maintenanceAmount}
              onChange={(e) => setMaintenanceAmount(e.target.value)}
              rows={2}
            />
          </div>
        )}
        
        {includeOptions.property && (
          <div className="space-y-2">
            <Label htmlFor="property-details">Property Division Details</Label>
            <Textarea 
              id="property-details"
              placeholder="Describe how properties will be divided"
              value={propertyDetails}
              onChange={(e) => setPropertyDetails(e.target.value)}
              rows={3}
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="other-terms">Other Terms and Conditions</Label>
          <Textarea 
            id="other-terms"
            placeholder="Any other terms or conditions to include"
            value={otherTerms}
            onChange={(e) => setOtherTerms(e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </BaseDocumentGenerator>
  );
};

export default FamilySettlementGenerator;
