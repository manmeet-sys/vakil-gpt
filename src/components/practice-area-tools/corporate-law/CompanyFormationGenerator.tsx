
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
import { Building, FileText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const CompanyFormationGenerator: React.FC = () => {
  const { toast } = useToast();
  const [companyType, setCompanyType] = useState<string>('private-limited');
  const [companyName, setCompanyName] = useState<string>('');
  const [authorizedCapital, setAuthorizedCapital] = useState<string>('100000');
  const [directors, setDirectors] = useState<string>('');
  const [businessObjectives, setBusinessObjectives] = useState<string>('');
  const [registeredOffice, setRegisteredOffice] = useState<string>('');
  const [includeGST, setIncludeGST] = useState<boolean>(true);
  const [includePF, setIncludePF] = useState<boolean>(true);
  const [includeESI, setIncludeESI] = useState<boolean>(true);
  const [generatedDocument, setGeneratedDocument] = useState<string>('');

  const handleGenerate = () => {
    if (!companyName || !authorizedCapital || !directors || !businessObjectives || !registeredOffice) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const directorsList = directors.split('\n').map(d => d.trim()).filter(d => d);
    
    let document = '';
    
    // Generate appropriate document based on company type
    switch (companyType) {
      case 'private-limited':
        document = generatePrivateLimitedDocs(directorsList);
        break;
      case 'llp':
        document = generateLLPDocs(directorsList);
        break;
      case 'opc':
        document = generateOPCDocs(directorsList);
        break;
      case 'public-limited':
        document = generatePublicLimitedDocs(directorsList);
        break;
      default:
        document = generatePrivateLimitedDocs(directorsList);
    }
    
    setGeneratedDocument(document);
    
    toast({
      title: "Document generated",
      description: "Company formation documents have been generated successfully"
    });
  };

  const generatePrivateLimitedDocs = (directorsList: string[]) => {
    return `
MEMORANDUM OF ASSOCIATION
OF
${companyName.toUpperCase()} PRIVATE LIMITED

1. NAME: The name of the company is "${companyName} Private Limited".

2. REGISTERED OFFICE: The registered office of the company will be situated in ${registeredOffice}.

3. OBJECTIVES OF THE COMPANY:
   A) MAIN OBJECTS:
      ${businessObjectives}
   
   B) ANCILLARY OBJECTS:
      - To do all such other things as may be deemed incidental or conducive to the attainment of the main objects.
      - To enter into partnerships, joint ventures, or any arrangements for sharing profits.
      - To acquire and undertake the whole or any part of the business, property, and liabilities of any person or company.

4. LIABILITY: The liability of the members is limited.

5. CAPITAL: The Authorized Share Capital of the company is Rs. ${parseInt(authorizedCapital).toLocaleString('en-IN')}/- divided into ${(parseInt(authorizedCapital)/10).toLocaleString('en-IN')} equity shares of Rs. 10/- each.

6. SUBSCRIPTION: We, the several persons, whose names, addresses, and descriptions are hereunto subscribed, are desirous of being formed into a company in pursuance of this Memorandum of Association:

${directorsList.map((director, index) => `   ${index + 1}. ${director}`).join('\n')}

ARTICLES OF ASSOCIATION
OF
${companyName.toUpperCase()} PRIVATE LIMITED

INTERPRETATION:
1. In these Articles, unless the context otherwise requires:
   "The Company" means ${companyName} Private Limited.
   "The Act" means the Companies Act, 2013.
   "The Directors" means the Directors of the Company.
   "The Board" means the Board of Directors of the Company.

PRIVATE COMPANY:
2. The company is a private company within the meaning of Section 2(68) of the Companies Act, 2013 and accordingly:
   (a) Restricts the right to transfer its shares.
   (b) Limits the number of its members to two hundred.
   (c) Prohibits any invitation to the public to subscribe for any securities of the company.

SHARE CAPITAL:
3. The Authorized Share Capital of the company shall be Rs. ${parseInt(authorizedCapital).toLocaleString('en-IN')}/-

DIRECTORS:
4. The first directors of the company shall be:
${directorsList.map((director, index) => `   ${index + 1}. ${director}`).join('\n')}

${includeGST ? `
GST REGISTRATION INFORMATION:
- The company shall apply for GST registration within 30 days of incorporation.
- The company shall maintain proper books of accounts as required under GST laws.
- The company shall file regular GST returns as per the applicable provisions.` : ''}

${includePF ? `
EMPLOYEES' PROVIDENT FUND COMPLIANCE:
- The company shall register with EPFO once it employs 20 or more persons.
- The company shall make regular PF contributions for eligible employees.` : ''}

${includeESI ? `
EMPLOYEES' STATE INSURANCE COMPLIANCE:
- The company shall register with ESIC once it employs 10 or more persons.
- The company shall make regular ESI contributions for eligible employees.` : ''}
`;
  };

  const generateLLPDocs = (partnersList: string[]) => {
    return `
LLP AGREEMENT
FOR
${companyName.toUpperCase()} LLP

THIS LLP AGREEMENT is made on this day [DATE] between:
${partnersList.map((partner, index) => `${index + 1}. ${partner}`).join('\n')}

WHEREAS:
The parties hereto have agreed to join hands to form a Limited Liability Partnership under the provisions of the Limited Liability Partnership Act, 2008.

NOW THIS AGREEMENT WITNESSES AS FOLLOWS:

1. NAME: The name of the LLP shall be "${companyName} LLP".

2. REGISTERED OFFICE: The registered office of the LLP will be situated in ${registeredOffice}.

3. BUSINESS OBJECTIVES:
   ${businessObjectives}

4. CAPITAL CONTRIBUTION:
   The initial capital contribution of the LLP shall be Rs. ${parseInt(authorizedCapital).toLocaleString('en-IN')}/- which shall be contributed by the partners in the following proportion:
   ${partnersList.map((partner, index) => `   ${partner}: Rs. ${(parseInt(authorizedCapital) / partnersList.length).toLocaleString('en-IN')}/-`).join('\n')}

5. PROFIT SHARING RATIO:
   The profit sharing ratio among the partners shall be:
   ${partnersList.map((partner) => `   ${partner}: ${Math.floor(100 / partnersList.length)}%`).join('\n')}

6. MANAGEMENT:
   All partners shall have equal rights in the management of the LLP. However, the following partners shall be designated partners:
   ${partnersList.slice(0, Math.min(2, partnersList.length)).map((partner) => `   - ${partner}`).join('\n')}

7. MEETINGS:
   The meetings of partners shall be held at least once in every quarter.

8. ACCOUNTS:
   The LLP shall maintain proper books of accounts as required by law.

${includeGST ? `
9. GST REGISTRATION INFORMATION:
   - The LLP shall apply for GST registration within 30 days of incorporation.
   - The LLP shall maintain proper books of accounts as required under GST laws.
   - The LLP shall file regular GST returns as per the applicable provisions.` : ''}

${includePF ? `
10. EMPLOYEES' PROVIDENT FUND COMPLIANCE:
    - The LLP shall register with EPFO once it employs 20 or more persons.
    - The LLP shall make regular PF contributions for eligible employees.` : ''}

${includeESI ? `
11. EMPLOYEES' STATE INSURANCE COMPLIANCE:
    - The LLP shall register with ESIC once it employs 10 or more persons.
    - The LLP shall make regular ESI contributions for eligible employees.` : ''}

IN WITNESS WHEREOF the parties hereto have signed this agreement on the day and year first above written.

PARTNERS:
${partnersList.map((partner) => `${partner} ___________________ (Signature)`).join('\n')}
`;
  };

  const generateOPCDocs = (directors: string[]) => {
    // For OPC, we only use the first director
    const director = directors[0] || '';
    const nominee = directors[1] || '[Nominee Name]';

    return `
MEMORANDUM OF ASSOCIATION
OF
${companyName.toUpperCase()} ONE PERSON COMPANY

1. NAME: The name of the company is "${companyName} OPC Private Limited".

2. REGISTERED OFFICE: The registered office of the company will be situated in ${registeredOffice}.

3. OBJECTIVES OF THE COMPANY:
   A) MAIN OBJECTS:
      ${businessObjectives}
   
   B) ANCILLARY OBJECTS:
      - To do all such other things as may be deemed incidental or conducive to the attainment of the main objects.
      - To enter into partnerships or any arrangements for sharing profits.
      - To acquire and undertake the whole or any part of the business, property, and liabilities of any person or company.

4. LIABILITY: The liability of the member is limited.

5. CAPITAL: The Authorized Share Capital of the company is Rs. ${parseInt(authorizedCapital).toLocaleString('en-IN')}/- divided into ${(parseInt(authorizedCapital)/10).toLocaleString('en-IN')} equity shares of Rs. 10/- each.

6. SUBSCRIPTION: I, the person whose name, address, and description are hereunto subscribed, am desirous of being formed into a One Person Company in pursuance of this Memorandum of Association:

   Sole Member: ${director}
   Nominee: ${nominee} (in the event of death or incapacity of the sole member)

ARTICLES OF ASSOCIATION
OF
${companyName.toUpperCase()} ONE PERSON COMPANY

INTERPRETATION:
1. In these Articles, unless the context otherwise requires:
   "The Company" means ${companyName} OPC Private Limited.
   "The Act" means the Companies Act, 2013.
   "The Director" means the Director of the Company.
   "Sole Member" means the sole member of the One Person Company.

ONE PERSON COMPANY:
2. The company is a One Person Company within the meaning of Section 2(62) of the Companies Act, 2013.
   (a) The sole member of the company is: ${director}
   (b) The nominee of the sole member is: ${nominee}

3. The sole member may at any time change the nominee by submitting notice to the company and the Registrar.

SHARE CAPITAL:
4. The Authorized Share Capital of the company shall be Rs. ${parseInt(authorizedCapital).toLocaleString('en-IN')}/-

DIRECTOR:
5. The first director of the company shall be: ${director}

${includeGST ? `
GST REGISTRATION INFORMATION:
- The company shall apply for GST registration within 30 days of incorporation.
- The company shall maintain proper books of accounts as required under GST laws.
- The company shall file regular GST returns as per the applicable provisions.` : ''}

${includePF ? `
EMPLOYEES' PROVIDENT FUND COMPLIANCE:
- The company shall register with EPFO once it employs 20 or more persons.
- The company shall make regular PF contributions for eligible employees.` : ''}

${includeESI ? `
EMPLOYEES' STATE INSURANCE COMPLIANCE:
- The company shall register with ESIC once it employs 10 or more persons.
- The company shall make regular ESI contributions for eligible employees.` : ''}
`;
  };

  const generatePublicLimitedDocs = (directorsList: string[]) => {
    return `
MEMORANDUM OF ASSOCIATION
OF
${companyName.toUpperCase()} LIMITED

1. NAME: The name of the company is "${companyName} Limited".

2. REGISTERED OFFICE: The registered office of the company will be situated in ${registeredOffice}.

3. OBJECTIVES OF THE COMPANY:
   A) MAIN OBJECTS:
      ${businessObjectives}
   
   B) ANCILLARY OBJECTS:
      - To do all such other things as may be deemed incidental or conducive to the attainment of the main objects.
      - To enter into partnerships, joint ventures, or any arrangements for sharing profits.
      - To acquire and undertake the whole or any part of the business, property, and liabilities of any person or company.

4. LIABILITY: The liability of the members is limited.

5. CAPITAL: The Authorized Share Capital of the company is Rs. ${parseInt(authorizedCapital).toLocaleString('en-IN')}/- divided into ${(parseInt(authorizedCapital)/10).toLocaleString('en-IN')} equity shares of Rs. 10/- each.

6. SUBSCRIPTION: We, the several persons, whose names, addresses, and descriptions are hereunto subscribed, are desirous of being formed into a company in pursuance of this Memorandum of Association:

${directorsList.map((director, index) => `   ${index + 1}. ${director}`).join('\n')}

ARTICLES OF ASSOCIATION
OF
${companyName.toUpperCase()} LIMITED

INTERPRETATION:
1. In these Articles, unless the context otherwise requires:
   "The Company" means ${companyName} Limited.
   "The Act" means the Companies Act, 2013.
   "The Directors" means the Directors of the Company.
   "The Board" means the Board of Directors of the Company.

SHARE CAPITAL:
2. The Authorized Share Capital of the company shall be Rs. ${parseInt(authorizedCapital).toLocaleString('en-IN')}/-

PUBLIC COMPANY:
3. The company is a public company within the meaning of Section 2(71) of the Companies Act, 2013.
   (a) The company is not prohibited from inviting the public to subscribe for any securities of the company.
   (b) The minimum number of directors shall be 3 and maximum 15.
   (c) The minimum paid-up capital shall be as may be prescribed by the Act from time to time.

DIRECTORS:
4. The first directors of the company shall be:
${directorsList.map((director, index) => `   ${index + 1}. ${director}`).join('\n')}

${includeGST ? `
GST REGISTRATION INFORMATION:
- The company shall apply for GST registration within 30 days of incorporation.
- The company shall maintain proper books of accounts as required under GST laws.
- The company shall file regular GST returns as per the applicable provisions.` : ''}

${includePF ? `
EMPLOYEES' PROVIDENT FUND COMPLIANCE:
- The company shall register with EPFO once it employs 20 or more persons.
- The company shall make regular PF contributions for eligible employees.` : ''}

${includeESI ? `
EMPLOYEES' STATE INSURANCE COMPLIANCE:
- The company shall register with ESIC once it employs 10 or more persons.
- The company shall make regular ESI contributions for eligible employees.` : ''}
`;
  };

  return (
    <BaseDocumentGenerator
      title="Company Formation Document Generator"
      description="Generate formation documents for various types of business entities in India"
      icon={<Building className="h-4 w-4 text-blue-600" />}
      onGenerate={handleGenerate}
      generatedContent={generatedDocument}
    >
      <div className="space-y-5">
        <div>
          <Label htmlFor="company-type">Select entity type</Label>
          <Select value={companyType} onValueChange={setCompanyType}>
            <SelectTrigger id="company-type" className="mt-1">
              <SelectValue placeholder="Select entity type" />
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
          <Label htmlFor="company-name">Company/Entity Name</Label>
          <Input
            id="company-name"
            className="mt-1"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
          />
        </div>
        
        <div>
          <Label htmlFor="authorized-capital">Authorized Capital (₹)</Label>
          <Input
            id="authorized-capital"
            className="mt-1"
            value={authorizedCapital}
            onChange={(e) => setAuthorizedCapital(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Enter authorized capital"
            type="text"
          />
        </div>
        
        <div>
          <Label htmlFor="registered-office">Registered Office Address</Label>
          <Input
            id="registered-office"
            className="mt-1"
            value={registeredOffice}
            onChange={(e) => setRegisteredOffice(e.target.value)}
            placeholder="Enter complete address"
          />
        </div>
        
        <div>
          <Label htmlFor="directors">
            {companyType === 'llp' ? 'Partners (one per line)' : 'Directors (one per line)'}
          </Label>
          <Textarea
            id="directors"
            className="mt-1 h-24"
            value={directors}
            onChange={(e) => setDirectors(e.target.value)}
            placeholder={companyType === 'llp' ? "Enter partner names and addresses" : "Enter director names and addresses"}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {companyType === 'opc' 
              ? 'For OPC, enter the sole director in the first line and the nominee in the second line' 
              : companyType === 'llp'
                ? 'Enter at least 2 partners with complete addresses'
                : companyType === 'public-limited'
                  ? 'Enter at least 3 directors with complete addresses'
                  : 'Enter at least 2 directors with complete addresses'}
          </p>
        </div>
        
        <div>
          <Label htmlFor="business-objectives">Business Objectives</Label>
          <Textarea
            id="business-objectives"
            className="mt-1 h-32"
            value={businessObjectives}
            onChange={(e) => setBusinessObjectives(e.target.value)}
            placeholder="Enter the main business objectives of the company"
          />
        </div>
        
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm font-medium mb-3">Additional Compliance Information</p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="gst-info" 
                  checked={includeGST} 
                  onCheckedChange={(checked) => setIncludeGST(checked as boolean)} 
                />
                <Label htmlFor="gst-info" className="text-sm font-normal cursor-pointer">
                  Include GST registration requirements
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="pf-info" 
                  checked={includePF} 
                  onCheckedChange={(checked) => setIncludePF(checked as boolean)} 
                />
                <Label htmlFor="pf-info" className="text-sm font-normal cursor-pointer">
                  Include PF compliance details
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="esi-info" 
                  checked={includeESI} 
                  onCheckedChange={(checked) => setIncludeESI(checked as boolean)} 
                />
                <Label htmlFor="esi-info" className="text-sm font-normal cursor-pointer">
                  Include ESI compliance details
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseDocumentGenerator>
  );
};

export default CompanyFormationGenerator;
