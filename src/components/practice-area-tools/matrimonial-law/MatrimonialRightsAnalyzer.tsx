import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { BaseAnalyzer } from '../base';
import { Book, Heart } from 'lucide-react';

const MatrimonialRightsAnalyzer = () => {
  const [personalLaw, setPersonalLaw] = useState<string>('');
  const [rightCategory, setRightCategory] = useState<string>('');

  const personalLaws = [
    { value: 'hindu', label: 'Hindu Law' },
    { value: 'muslim', label: 'Muslim Law' },
    { value: 'christian', label: 'Christian Law' },
    { value: 'parsi', label: 'Parsi Law' },
    { value: 'special', label: 'Special Marriage Act' },
  ];

  const rightCategories = [
    { value: 'property', label: 'Property Rights' },
    { value: 'maintenance', label: 'Maintenance Rights' },
    { value: 'custody', label: 'Child Custody Rights' },
    { value: 'succession', label: 'Inheritance & Succession' },
    { value: 'stridhan', label: 'Streedhan/Dowry' },
  ];

  const rightsContent = {
    'hindu': {
      'property': (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Hindu Property Rights in Marriage</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="wife_rights">
              <AccordionTrigger>Wife's Rights</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>Under Hindu Law, a wife has the following property rights:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Right to reside in the matrimonial home (Protection of Women from Domestic Violence Act, 2005)</li>
                    <li>Right to maintenance during marriage (Section 18 of Hindu Adoption and Maintenance Act)</li>
                    <li>Equal coparcenary rights in ancestral property by birth (2005 Amendment to Hindu Succession Act)</li>
                    <li>Right to Streedhan (gifts, jewelry given to wife)</li>
                    <li>Rights as Class I heir to husband's property upon his death</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="husband_rights">
              <AccordionTrigger>Husband's Rights</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>Under Hindu Law, a husband has the following property rights:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>No legal right over wife's Streedhan</li>
                    <li>Rights as Class I heir to wife's property upon her death</li>
                    <li>Rights to self-acquired property</li>
                    <li>Coparcenary rights in ancestral property</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="joint_property">
              <AccordionTrigger>Joint Property</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>Property acquired during marriage:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>India does not recognize the concept of community property</li>
                    <li>Property in whose name it is registered is the legal owner</li>
                    <li>Exception: If wife contributes to purchase, she may claim interest</li>
                    <li>Benami Transactions (Prohibition) Act provisions may apply</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="cases">
              <AccordionTrigger>Key Legal Precedents</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Danamma v. Amar (2018):</strong> Supreme Court affirmed that daughters have equal coparcenary rights by birth</li>
                    <li><strong>Vineeta Sharma v. Rakesh Sharma (2020):</strong> Clarified retrospective application of daughter's coparcenary rights</li>
                    <li><strong>S.R. Batra v. Taruna Batra (2007):</strong> Supreme Court on rights in matrimonial home owned by in-laws</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
      'maintenance': (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Hindu Maintenance Rights</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="wife_rights">
              <AccordionTrigger>Wife's Maintenance Rights</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>A Hindu wife can claim maintenance under:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Section 18 of Hindu Adoption and Maintenance Act:</strong> Right to be maintained by husband during marriage</li>
                    <li><strong>Section 125 CrPC:</strong> Maintenance for wives (including during marriage)</li>
                    <li><strong>Section 24 of Hindu Marriage Act:</strong> Interim maintenance during pending proceedings</li>
                    <li><strong>Section 25 of Hindu Marriage Act:</strong> Permanent alimony after divorce</li>
                    <li><strong>Domestic Violence Act, 2005:</strong> Monetary relief</li>
                  </ul>
                  
                  <p className="mt-2">Factors courts consider:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Position and status of the parties</li>
                    <li>Reasonable wants of the claimant</li>
                    <li>Income and property of both parties</li>
                    <li>Number of persons to be maintained by husband</li>
                    <li>Standard of living</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="husband_rights">
              <AccordionTrigger>Husband's Maintenance Rights</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>While traditionally uncommon, Hindu husbands can claim maintenance in certain circumstances:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Under Section 24 of Hindu Marriage Act: Interim maintenance if unable to maintain himself</li>
                    <li>Under Section 25 of Hindu Marriage Act: Permanent alimony if financially dependent</li>
                    <li>Not entitled under Section 125 CrPC (only for wives, children, parents)</li>
                  </ul>
                  
                  <p className="mt-2 text-sm italic">
                    Note: Courts have increasingly recognized husband's right to maintenance in cases where he is unable to maintain himself due to physical or mental disability.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="cases">
              <AccordionTrigger>Important Judgments</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Rajnesh v. Neha (2020):</strong> Supreme Court's comprehensive guidelines on maintenance amounts and procedure</li>
                    <li><strong>Shamima Farooqui v. Shahid Khan (2015):</strong> Maintenance should be from date of application, not order</li>
                    <li><strong>Chaturbhuj v. Sita Bai (2008):</strong> Earning wife can also claim maintenance if husband's income is significantly higher</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
      // Other categories would be implemented similarly
    },
    'muslim': {
      'property': (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Muslim Property Rights in Marriage</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="wife_rights">
              <AccordionTrigger>Wife's Rights</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>Under Islamic Law, a Muslim wife has the following property rights:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Right to Mahr (dower) - a mandatory payment by husband to wife</li>
                    <li>Absolute right over her personal property</li>
                    <li>Right to maintenance (Nafqah) during marriage</li>
                    <li>Right to property gifted to her by husband or others</li>
                    <li>Right to residence in matrimonial home</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="mahr">
              <AccordionTrigger>Mahr (Dower)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>Mahr is a fundamental right of a Muslim wife:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Prompt Mahr (Mu'ajjal):</strong> Payable immediately upon marriage</li>
                    <li><strong>Deferred Mahr (Mu'wajjal):</strong> Payable upon dissolution of marriage or on demand</li>
                    <li>Mahr is wife's exclusive property</li>
                    <li>Cannot be waived except by wife herself</li>
                    <li>Legally enforceable debt if unpaid</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="separate">
              <AccordionTrigger>Separate Property System</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>Islamic law follows the separate property system:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>No concept of joint matrimonial property</li>
                    <li>Each spouse retains ownership of their pre-marriage property</li>
                    <li>Wife maintains complete ownership of property acquired before or during marriage</li>
                    <li>Husband has no legal claim over wife's property</li>
                    <li>Wife can transact her property without husband's consent</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
      // Other categories would be implemented similarly
    },
    'special': {
      'maintenance': (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Maintenance Rights under Special Marriage Act</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="during_proceedings">
              <AccordionTrigger>During Proceedings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>Section 36 of the Special Marriage Act provides:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Either spouse may claim maintenance during proceedings</li>
                    <li>Court considers income and property of both parties</li>
                    <li>Maintenance covers reasonable expenses for proceedings</li>
                    <li>Can include monthly maintenance until conclusion of case</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="permanent">
              <AccordionTrigger>Permanent Alimony</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>Section 37 of the Special Marriage Act provides:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Court may order gross sum or monthly/periodic payments</li>
                    <li>Either husband or wife may be ordered to pay</li>
                    <li>Continues until recipient's lifetime or remarriage</li>
                    <li>Court considers conduct, property, income of parties</li>
                    <li>Can be modified if circumstances change</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="secular">
              <AccordionTrigger>Secular Remedies</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p>Additional remedies available regardless of religion:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Section 125 CrPC: Maintenance for spouse unable to maintain themselves</li>
                    <li>Protection of Women from Domestic Violence Act: Monetary relief</li>
                    <li>Maintenance and Welfare of Parents and Senior Citizens Act (if applicable)</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
      // Other categories would be implemented similarly
    },
    // Additional religions would be implemented similarly
  };

  const renderRightsContent = () => {
    if (!personalLaw || !rightCategory) return null;
    
    return rightsContent[personalLaw]?.[rightCategory] || (
      <div className="text-center py-10">
        <p className="text-gray-500">
          Detailed information for this combination is currently being developed.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
          <div className="flex items-start gap-3">
            <Book className="h-5 w-5 mt-1 text-purple-600" />
            <div>
              <CardTitle className="font-playfair">Matrimonial Rights Analyzer</CardTitle>
              <CardDescription>
                Understand legal rights and obligations under different personal laws in Indian marriages
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="rights" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rights">Rights Analysis</TabsTrigger>
              <TabsTrigger value="comparison">Law Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rights" className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Personal Law</label>
                  <Select value={personalLaw} onValueChange={setPersonalLaw}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select applicable law" />
                    </SelectTrigger>
                    <SelectContent>
                      {personalLaws.map((law) => (
                        <SelectItem key={law.value} value={law.value}>{law.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Select Right Category</label>
                  <Select value={rightCategory} onValueChange={setRightCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select right category" />
                    </SelectTrigger>
                    <SelectContent>
                      {rightCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-6">
                {renderRightsContent()}
              </div>
            </TabsContent>
            
            <TabsContent value="comparison" className="py-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="border p-2 text-left">Right Type</th>
                      <th className="border p-2 text-left">Hindu Law</th>
                      <th className="border p-2 text-left">Muslim Law</th>
                      <th className="border p-2 text-left">Special Marriage Act</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 font-medium">Maintenance</td>
                      <td className="border p-2">
                        Hindu Adoption & Maintenance Act, S.125 CrPC, HMA Sections 24 & 25
                      </td>
                      <td className="border p-2">
                        Muslim Women (Protection of Rights on Divorce) Act, S.125 CrPC
                      </td>
                      <td className="border p-2">
                        Special Marriage Act Sections 36 & 37, S.125 CrPC
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium">Property Rights</td>
                      <td className="border p-2">
                        Separate property system; no automatic joint ownership
                      </td>
                      <td className="border p-2">
                        Separate property system; Mahr (dower) as financial security
                      </td>
                      <td className="border p-2">
                        Separate property system; no automatic joint ownership
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium">Inheritance</td>
                      <td className="border p-2">
                        Hindu Succession Act; equal rights for sons and daughters
                      </td>
                      <td className="border p-2">
                        Sharia law; shares vary by relationship and gender
                      </td>
                      <td className="border p-2">
                        Indian Succession Act applies
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2 font-medium">Child Custody</td>
                      <td className="border p-2">
                        Welfare principle; Guardian & Wards Act
                      </td>
                      <td className="border p-2">
                        Welfare principle; Guardian & Wards Act
                      </td>
                      <td className="border p-2">
                        Welfare principle; Guardian & Wards Act
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Note: This is a simplified comparison. Each legal system has complex provisions and interpretations. Consult a legal professional for specific cases.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="border border-purple-100 dark:border-purple-900/20 bg-purple-50/50 dark:bg-purple-900/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Key Legislation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <Heart className="h-4 w-4 mt-0.5 text-purple-600 flex-shrink-0" />
            <div>
              <span className="font-medium">Protection of Women from Domestic Violence Act, 2005</span>
              <p className="text-muted-foreground mt-0.5">Provides civil remedies including residence rights regardless of religion</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Heart className="h-4 w-4 mt-0.5 text-purple-600 flex-shrink-0" />
            <div>
              <span className="font-medium">Section 125 of Code of Criminal Procedure</span>
              <p className="text-muted-foreground mt-0.5">Secular provision for maintenance of wives, children and parents</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Heart className="h-4 w-4 mt-0.5 text-purple-600 flex-shrink-0" />
            <div>
              <span className="font-medium">Guardians and Wards Act, 1890</span>
              <p className="text-muted-foreground mt-0.5">General law on guardianship applicable to all religions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatrimonialRightsAnalyzer;
