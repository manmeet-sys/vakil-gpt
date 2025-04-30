
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Template = {
  id: string;
  title: string;
  type: string;
  description: string;
  content: string;
};

type DocumentTemplateListProps = {
  onTemplateSelect: (template: Template) => void;
};

const DocumentTemplateList: React.FC<DocumentTemplateListProps> = ({ onTemplateSelect }) => {
  const templates: Template[] = [
    {
      id: "1",
      title: "Rental Agreement",
      type: "Contract",
      description: "Standard rental agreement for residential property",
      content: "THIS RENTAL AGREEMENT is made on this [DATE] between [LANDLORD NAME] (hereinafter referred to as the \"Landlord\") and [TENANT NAME] (hereinafter referred to as the \"Tenant\").\n\nWHEREAS the Landlord is the owner of [PROPERTY ADDRESS] (hereinafter referred to as the \"Premises\");\n\nAND WHEREAS the Landlord desires to lease the Premises to the Tenant upon the terms and conditions contained herein;\n\nAND WHEREAS the Tenant desires to lease the Premises from the Landlord upon the terms and conditions contained herein;\n\nNOW THEREFORE, in consideration of the mutual covenants contained herein and other good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged, the parties agree as follows:\n\n1. TERM\nThe Landlord leases to the Tenant the Premises for a term of [LEASE DURATION] commencing on [START DATE] and ending on [END DATE].\n\n2. RENT\nThe Tenant shall pay rent of Rs. [AMOUNT] per month, payable in advance on the [DAY] day of each month.\n\n3. SECURITY DEPOSIT\nThe Tenant has paid the Landlord a security deposit of Rs. [AMOUNT] to be held for the term of this Agreement.\n\n4. USE OF PREMISES\nThe Premises shall be used and occupied by the Tenant exclusively as a private residence.\n\n5. UTILITIES\nThe Tenant shall be responsible for payment of all utilities and services to the Premises, except for [EXCEPTIONS]."
    },
    {
      id: "2",
      title: "Employment Contract",
      type: "Agreement",
      description: "Standard employment agreement with key terms",
      content: "EMPLOYMENT AGREEMENT\n\nThis Employment Agreement (\"Agreement\") is made and entered into on [DATE], by and between [EMPLOYER NAME], a company registered under the Companies Act with its principal place of business at [ADDRESS] (hereinafter referred to as the \"Company\"), and [EMPLOYEE NAME], residing at [ADDRESS] (hereinafter referred to as the \"Employee\").\n\nWHEREAS, the Company desires to employ the Employee on the terms and conditions set forth in this Agreement; and\n\nWHEREAS, the Employee desires to accept employment with the Company on such terms and conditions;\n\nNOW, THEREFORE, in consideration of the mutual covenants and agreements herein contained, the parties agree as follows:\n\n1. EMPLOYMENT\nThe Company hereby employs the Employee, and the Employee hereby accepts employment with the Company, upon the terms and conditions set forth in this Agreement.\n\n2. POSITION AND DUTIES\nThe Employee shall be employed as [JOB TITLE], and shall perform such duties as are customarily performed by persons in such position and as shall be assigned from time to time by the Company.\n\n3. TERM\nThe employment under this Agreement shall commence on [START DATE] and shall continue until terminated in accordance with the provisions of this Agreement.\n\n4. COMPENSATION\nAs compensation for services rendered under this Agreement, the Employee shall be entitled to receive from the Company a salary of Rs. [AMOUNT] per annum, payable in equal monthly installments."
    },
    {
      id: "3",
      title: "Non-Disclosure Agreement",
      type: "Confidentiality",
      description: "Protect confidential information with this NDA",
      content: "NON-DISCLOSURE AGREEMENT\n\nThis Non-Disclosure Agreement (\"Agreement\") is made and entered into on [DATE] between:\n\n[PARTY A NAME], with its principal place of business at [ADDRESS] (\"Disclosing Party\")\n\nand\n\n[PARTY B NAME], with its principal place of business at [ADDRESS] (\"Receiving Party\")\n\nWHEREAS, the Disclosing Party possesses certain confidential and proprietary information relating to its business, products, services, clients, operations, or other matters;\n\nAND WHEREAS, the Receiving Party may receive or has received such confidential information for the purpose of [PURPOSE];\n\nNOW THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:\n\n1. DEFINITION OF CONFIDENTIAL INFORMATION\n\"Confidential Information\" means any information disclosed by the Disclosing Party to the Receiving Party, either directly or indirectly, in writing, orally or by inspection of tangible objects, which is designated as \"Confidential,\" \"Proprietary\" or some similar designation, or information that by its nature would be understood by a reasonable person to be confidential.\n\n2. NON-DISCLOSURE AND NON-USE\nThe Receiving Party agrees not to use any Confidential Information for any purpose except for the Purpose stated above. The Receiving Party agrees not to disclose any Confidential Information to any third party.\n\n3. TERM\nThe obligations of the Receiving Party under this Agreement shall survive for a period of [DURATION] years from the date of disclosure of the Confidential Information."
    }
  ];

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "contract", name: "Contracts" },
    { id: "agreement", name: "Agreements" },
    { id: "confidentiality", name: "Confidentiality" },
  ];

  const handleCategoryChange = (categoryId: string) => {
    // Filter templates based on category
    console.log(`Category selected: ${categoryId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Quick Templates</h3>
        <Select onValueChange={handleCategoryChange} defaultValue="all">
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {templates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors" onClick={() => onTemplateSelect(template)}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">{template.title}</h4>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded px-2 py-0.5">{template.type}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentTemplateList;
