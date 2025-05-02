
import React, { useState } from 'react';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Search } from 'lucide-react';
import { BaseAnalyzer } from '../base';
import { Label } from '@/components/ui/label';
import { AnalysisResult } from '../base/BaseAnalyzer';

// BNS vs IPC comparison data
const bnsIpcComparisons = [
  {
    section: "45",
    bns: "Section 45: Culpable homicide - Whoever causes death by doing an act with the intention of causing death, or with the intention of causing such bodily injury as is likely to cause death, or with the knowledge that such act is likely to cause death, commits the offence of culpable homicide.",
    ipc: "Section 299: Culpable homicide - Whoever causes death by doing an act with the intention of causing death, or with the intention of causing such bodily injury as is likely to cause death, or with the knowledge that he is likely by such act to cause death, commits the offence of culpable homicide.",
    key_changes: "Section number changed from 299 to 45. Language simplified and modernized."
  },
  {
    section: "103", 
    bns: "Section 103: Public servant disobeying law, with intent to cause injury to any person - Whoever, being a public servant, knowingly disobeys any direction of the law which prohibits him from requiring the attendance at any place of any person for the purpose of investigation into an offence, with intent to cause injury to any person, shall be punished with imprisonment of either description for a term which may extend to one year, or with fine, or with both.",
    ipc: "Section 166: Public servant disobeying law, with intent to cause injury to any person - Whoever, being a public servant, knowingly disobeys any direction of the law which prohibits him from requiring the attendance at any place of any person for the purpose of investigation into an offence or any other matter, shall be punished with imprisonment of either description for a term which may extend to one year, or with fine, or with both.", 
    key_changes: "Section number changed from 166 to 103. The phrase 'or any other matter' has been removed, narrowing the scope to only investigation into offenses."
  },
  {
    section: "121",
    bns: "Section 121: Voluntarily causing hurt - Whoever voluntarily causes pain, disease or infirmity to any person, including acts such as poisoning a person, shall have said to have committed the offence of voluntarily causing hurt.",
    ipc: "Section 321: Voluntarily causing hurt - Whoever does any act with the intention of thereby causing hurt to any person, or with the knowledge that he is likely thereby to cause hurt to any person, and does thereby cause hurt to any person, is said "voluntarily to cause hurt".",
    key_changes: "Section number changed from 321 to 121. Definition expanded to explicitly include acts such as poisoning."
  },
  {
    section: "69",
    bns: "Section 69: Sedition - Whoever by words, either spoken or written, or by signs, or by visible representation, or otherwise, brings or attempts to bring into hatred or contempt, or excites or attempts to excite disaffection towards, the Government established by law shall be punished with imprisonment of either description for a term which may extend to three years, to which fine may be added, or with fine.",
    ipc: "Section 124A: Sedition - Whoever, by words, either spoken or written, or by signs, or by visible representation, or otherwise, brings or attempts to bring into hatred or contempt, or excites or attempts to excite disaffection towards the Government established by law in India, shall be punished with imprisonment for life, to which fine may be added, or with imprisonment which may extend to three years, to which fine may be added, or with fine.",
    key_changes: "Section number changed from 124A to 69. Maximum punishment reduced from life imprisonment to three years."
  },
  {
    section: "254",
    bns: "Section 254: Defamation - Whoever, by words either spoken or intended to be read, or by signs or by visible representations, makes or publishes any imputation concerning any person intending to harm, or knowing or having reason to believe that such imputation will harm, the reputation of such person, is said to defame that person.",
    ipc: "Section 499: Defamation - Whoever, by words either spoken or intended to be read, or by signs or by visible representations, makes or publishes any imputation concerning any person intending to harm, or knowing or having reason to believe that such imputation will harm, the reputation of such person, is said, except in the cases hereinafter expected, to defame that person.",
    key_changes: "Section number changed from 499 to 254. The exemption clause 'except in the cases hereinafter expected' has been removed."
  }
];

const BNSCodeAssistant = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('section');
  const [searchResults, setSearchResults] = useState<typeof bnsIpcComparisons>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  
  const handleSearch = () => {
    if (!searchTerm) return;
    
    let results;
    if (searchType === 'section') {
      results = bnsIpcComparisons.filter(comp => 
        comp.section.includes(searchTerm)
      );
    } else {
      results = bnsIpcComparisons.filter(comp => 
        comp.bns.toLowerCase().includes(searchTerm.toLowerCase()) || 
        comp.ipc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setSearchResults(results);
    
    // Create analysis results
    const analysis: AnalysisResult[] = results.map(result => ({
      title: `BNS Section ${result.section} (formerly IPC Section ${result.ipc.split(':')[0].replace('Section', '').trim()})`,
      description: result.key_changes,
      severity: 'info'
    }));
    
    setAnalysisResults(analysis);
  };
  
  return (
    <BaseAnalyzer
      title="BNS Code Assistant"
      description="Navigate and compare sections between Bharatiya Nyaya Sanhita (BNS) and Indian Penal Code (IPC)"
      icon={<BookOpen className="h-5 w-5 text-blue-600" />}
      onAnalyze={handleSearch}
      analysisResults={analysisResults.length > 0 ? analysisResults : undefined}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search-type">Search By</Label>
          <Select 
            value={searchType} 
            onValueChange={setSearchType}
          >
            <SelectTrigger className="w-full" id="search-type">
              <SelectValue placeholder="Search by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="section">Section Number</SelectItem>
              <SelectItem value="keyword">Keyword</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="search-term">{searchType === 'section' ? 'Enter Section Number' : 'Enter Keyword'}</Label>
          <div className="flex space-x-2">
            <Input
              id="search-term"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchType === 'section' ? 'e.g., 45' : 'e.g., sedition'}
              className="flex-1"
            />
          </div>
        </div>
        
        {searchResults.length > 0 && (
          <div className="mt-6 border rounded-lg p-4">
            <Tabs defaultValue={searchResults[0].section}>
              <TabsList className="w-full mb-4 overflow-x-auto flex-nowrap">
                {searchResults.map((result) => (
                  <TabsTrigger key={result.section} value={result.section}>
                    Section {result.section}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {searchResults.map((result) => (
                <TabsContent key={result.section} value={result.section} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h3 className="font-medium text-blue-700 dark:text-blue-400 mb-2">
                        BNS {result.bns.split(':')[0]}:
                      </h3>
                      <p className="text-sm">{result.bns.split(':').slice(1).join(':').trim()}</p>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <h3 className="font-medium text-amber-700 dark:text-amber-400 mb-2">
                        IPC {result.ipc.split(':')[0]}:
                      </h3>
                      <p className="text-sm">{result.ipc.split(':').slice(1).join(':').trim()}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-medium text-green-700 dark:text-green-400 mb-2">Key Changes:</h3>
                    <p className="text-sm">{result.key_changes}</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </BaseAnalyzer>
  );
};

export default BNSCodeAssistant;
