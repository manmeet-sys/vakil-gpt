
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2, Search, Gavel, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  // Load knowledge items from localStorage
  const knowledgeItems = JSON.parse(localStorage.getItem('precedentAI-knowledge') || '[]');
  
  // Filter precedents and legislation from knowledge items
  const precedents = knowledgeItems.filter((item: any) => item.type === 'precedent');
  const legislations = knowledgeItems.filter((item: any) => item.type === 'legislation');

  // Mock data for demonstration (to supplement user-added items)
  const mockStatutes = [
    { id: 1, title: "Indian Penal Code, 1860", section: "Section 1-511", tags: ["Criminal Law"] },
    { id: 2, title: "The Bharatiya Nyaya Sanhita, 2023", section: "Section 1-358", tags: ["Criminal Law", "New"] },
    { id: 3, title: "Indian Contract Act, 1872", section: "Section 1-238", tags: ["Contract Law"] },
    { id: 4, title: "Companies Act, 2013", section: "Section 1-470", tags: ["Corporate Law"] }
  ];

  const mockCases = [
    { id: 1, title: "Kesavananda Bharati v. State of Kerala", citation: "AIR 1973 SC 1461", tags: ["Constitutional Law"] },
    { id: 2, title: "Maneka Gandhi v. Union of India", citation: "AIR 1978 SC 597", tags: ["Constitutional Law"] },
    { id: 3, title: "Vishaka v. State of Rajasthan", citation: "AIR 1997 SC 3011", tags: ["Labor Law"] }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };
  
  const handleOpenFullKnowledgeBase = () => {
    setIsOpen(false);
    navigate('/knowledge');
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
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="statutes">
              <BookOpen className="h-3 w-3 mr-1" />
              Statutes & Regulations
            </TabsTrigger>
            <TabsTrigger value="cases">
              <Gavel className="h-3 w-3 mr-1" />
              Case Law
            </TabsTrigger>
            <TabsTrigger value="my-knowledge">
              <Database className="h-3 w-3 mr-1" />
              My Knowledge
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="statutes" className="space-y-4 mt-4">
            {mockStatutes.map((statute) => (
              <div key={statute.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{statute.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{statute.section}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {statute.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Added user's legislation data */}
            {legislations.map((legislation: any) => (
              <div key={legislation.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{legislation.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {legislation.statuteType === 'act' ? 'Act' : 
                       legislation.statuteType === 'rules' ? 'Rules' : 
                       legislation.statuteType === 'regulations' ? 'Regulations' : 
                       legislation.statuteType === 'notification' ? 'Notification' : 
                       legislation.statuteType === 'order' ? 'Order' : 'Amendment'}
                    </p>
                  </div>
                  {legislation.jurisdiction && (
                    <Badge variant="outline" className="text-xs">
                      {legislation.jurisdiction === 'central' ? 'Central' : 
                       legislation.jurisdiction === 'state' ? 'State' : 'Local'}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="cases" className="space-y-4 mt-4">
            {mockCases.map((case_) => (
              <div key={case_.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{case_.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{case_.citation}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {case_.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Added user's precedents data */}
            {precedents.map((precedent: any) => (
              <div key={precedent.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{precedent.title}</h3>
                    {precedent.citation && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{precedent.citation}</p>
                    )}
                  </div>
                  {precedent.court && (
                    <Badge variant="outline" className="text-xs">
                      {precedent.court === 'supreme-court' ? 'Supreme Court' : 
                       precedent.court === 'high-court' ? 'High Court' : 
                       precedent.court === 'district-court' ? 'District Court' : 
                       precedent.court === 'tribunals' ? 'Tribunal' : 'Other Court'}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="my-knowledge" className="space-y-4 mt-4">
            {knowledgeItems.length > 0 ? (
              knowledgeItems.map((item: any) => (
                <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.type === 'document' ? 'Document' : 
                         item.type === 'url' ? 'URL' : 
                         item.type === 'text' ? 'Text' :
                         item.type === 'precedent' ? 'Precedent' : 'Legislation'}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Added {new Date(item.dateAdded).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  No knowledge items added yet
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleOpenFullKnowledgeBase}>
            Manage Knowledge Base
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KnowledgeBaseButton;
