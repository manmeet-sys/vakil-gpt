
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface KnowledgeBaseButtonProps {
  buttonLabel?: string;
  iconOnly?: boolean;
}

const KnowledgeBaseButton: React.FC<KnowledgeBaseButtonProps> = ({ 
  buttonLabel = "Knowledge Base",
  iconOnly = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('statutes');
  const [isSearching, setIsSearching] = useState(false);

  // Mock data for demonstration
  const mockStatutes = [
    { id: 1, title: "Indian Penal Code, 1860", section: "Section 1-511" },
    { id: 2, title: "Code of Criminal Procedure, 1973", section: "Section 1-484" },
    { id: 3, title: "Indian Contract Act, 1872", section: "Section 1-238" },
    { id: 4, title: "Companies Act, 2013", section: "Section 1-470" }
  ];

  const mockCases = [
    { id: 1, title: "Kesavananda Bharati v. State of Kerala", citation: "AIR 1973 SC 1461" },
    { id: 2, title: "Maneka Gandhi v. Union of India", citation: "AIR 1978 SC 597" },
    { id: 3, title: "Vishaka v. State of Rajasthan", citation: "AIR 1997 SC 3011" }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`text-xs flex items-center gap-1 ${iconOnly ? 'px-2 h-8 min-w-8' : ''}`}
        >
          <Database className="h-3 w-3" />
          {!iconOnly && <span>{buttonLabel}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle>Indian Law Knowledge Base</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 my-4">
          <Input
            type="text"
            placeholder="Search legal resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
        
        <Tabs defaultValue="statutes" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="statutes">Statutes & Regulations</TabsTrigger>
            <TabsTrigger value="cases">Case Law</TabsTrigger>
          </TabsList>
          
          <TabsContent value="statutes" className="space-y-4 mt-4">
            {mockStatutes.map((statute) => (
              <div key={statute.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer">
                <h3 className="font-medium">{statute.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{statute.section}</p>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="cases" className="space-y-4 mt-4">
            {mockCases.map((case_) => (
              <div key={case_.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer">
                <h3 className="font-medium">{case_.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{case_.citation}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default KnowledgeBaseButton;
