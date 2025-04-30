import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2, Search, Gavel, BookOpen, Bookmark, Clock, Badge, Filter, FileText, Globe, Landmark } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge as UIBadge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
  const [sortOption, setSortOption] = useState('newest');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  // Load knowledge items from localStorage
  const [knowledgeItems, setKnowledgeItems] = useState<any[]>([]);
  
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('precedentAI-knowledge') || '[]');
    setKnowledgeItems(items);
  }, [isOpen]); // Reload when dialog opens
  
  // Filter precedents and legislation from knowledge items
  const precedents = knowledgeItems.filter((item) => item.type === 'precedent');
  const legislations = knowledgeItems.filter((item) => item.type === 'legislation');

  // Mock data for demonstration (to supplement user-added items)
  const mockStatutes = [
    { id: 1, title: "Indian Penal Code, 1860", section: "Section 1-511", tags: ["Criminal Law"], date: new Date(2020, 3, 15) },
    { id: 2, title: "The Bharatiya Nyaya Sanhita, 2023", section: "Section 1-358", tags: ["Criminal Law", "New"], date: new Date(2023, 7, 10) },
    { id: 3, title: "Indian Contract Act, 1872", section: "Section 1-238", tags: ["Contract Law"], date: new Date(2021, 5, 22) },
    { id: 4, title: "Companies Act, 2013", section: "Section 1-470", tags: ["Corporate Law"], date: new Date(2022, 9, 5) }
  ];

  const mockCases = [
    { id: 1, title: "Kesavananda Bharati v. State of Kerala", citation: "AIR 1973 SC 1461", tags: ["Constitutional Law"], date: new Date(2020, 2, 10) },
    { id: 2, title: "Maneka Gandhi v. Union of India", citation: "AIR 1978 SC 597", tags: ["Constitutional Law"], date: new Date(2019, 11, 8) },
    { id: 3, title: "Vishaka v. State of Rajasthan", citation: "AIR 1997 SC 3011", tags: ["Labor Law"], date: new Date(2021, 4, 17) }
  ];

  // Logic to filter and sort items
  const getFilteredStatutes = () => {
    let filteredItems = [...mockStatutes, ...legislations];
    
    // Apply search filter
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.title?.toLowerCase().includes(lowercaseQuery) || 
        item.section?.toLowerCase().includes(lowercaseQuery) ||
        item.tags?.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    // Apply type filter
    if (filterType !== 'all' && filterType !== '') {
      if (filterType === 'user-added') {
        // Only show user-added items
        filteredItems = legislations;
      } else if (filterType === 'system') {
        // Only show system items
        filteredItems = mockStatutes;
      }
    }
    
    // Apply sorting
    if (sortOption === 'newest') {
      filteredItems.sort((a, b) => new Date(b.date || b.dateAdded).getTime() - new Date(a.date || a.dateAdded).getTime());
    } else if (sortOption === 'oldest') {
      filteredItems.sort((a, b) => new Date(a.date || a.dateAdded).getTime() - new Date(b.date || b.dateAdded).getTime());
    } else if (sortOption === 'a-z') {
      filteredItems.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'z-a') {
      filteredItems.sort((a, b) => b.title.localeCompare(a.title));
    }
    
    return filteredItems;
  };
  
  const getFilteredCases = () => {
    let filteredItems = [...mockCases, ...precedents];
    
    // Apply search filter
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.title?.toLowerCase().includes(lowercaseQuery) || 
        item.citation?.toLowerCase().includes(lowercaseQuery) ||
        item.tags?.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    // Apply type filter
    if (filterType !== 'all' && filterType !== '') {
      if (filterType === 'user-added') {
        // Only show user-added items
        filteredItems = precedents;
      } else if (filterType === 'system') {
        // Only show system items
        filteredItems = mockCases;
      }
    }
    
    // Apply sorting
    if (sortOption === 'newest') {
      filteredItems.sort((a, b) => new Date(b.date || b.dateAdded).getTime() - new Date(a.date || a.dateAdded).getTime());
    } else if (sortOption === 'oldest') {
      filteredItems.sort((a, b) => new Date(a.date || a.dateAdded).getTime() - new Date(b.date || b.dateAdded).getTime());
    } else if (sortOption === 'a-z') {
      filteredItems.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'z-a') {
      filteredItems.sort((a, b) => b.title.localeCompare(a.title));
    }
    
    return filteredItems;
  };
  
  const getFilteredUserItems = () => {
    let filteredItems = knowledgeItems;
    
    // Apply search filter
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.title?.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    // Apply sorting
    if (sortOption === 'newest') {
      filteredItems.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    } else if (sortOption === 'oldest') {
      filteredItems.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
    } else if (sortOption === 'a-z') {
      filteredItems.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'z-a') {
      filteredItems.sort((a, b) => b.title.localeCompare(a.title));
    }
    
    return filteredItems;
  };

  // Filtered items based on the active tab
  const filteredStatutes = getFilteredStatutes();
  const filteredCases = getFilteredCases(); 
  const filteredUserItems = getFilteredUserItems();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };
  
  const handleOpenFullKnowledgeBase = () => {
    setIsOpen(false);
    navigate('/knowledge');
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.25 }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`text-xs flex items-center gap-1 transition-all duration-200 ${iconOnly ? 'px-2 h-8 min-w-8' : ''}`}
        >
          <Database className="h-3 w-3" />
          {!iconOnly && <span>{buttonLabel}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-auto bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Database className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
            Indian Law Knowledge Base
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search legal resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching} size="sm">
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-gray-500" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Filter items" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="user-added">User Added</SelectItem>
                  <SelectItem value="system">System Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-gray-500" />
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="a-z">A to Z</SelectItem>
                  <SelectItem value="z-a">Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
              <Bookmark className="h-3 w-3 mr-1" />
              My Knowledge
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="statutes" className="space-y-4 mt-4">
            {filteredStatutes.length > 0 ? (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: { staggerChildren: 0.05 }
                  }
                }}
              >
                {filteredStatutes.map((statute) => (
                  <motion.div 
                    key={statute.id} 
                    variants={itemVariants}
                    whileHover="hover"
                    className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{statute.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{statute.section}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {statute.tags && statute.tags.map((tag: string, i: number) => (
                          <UIBadge key={i} variant="outline" className="text-xs">{tag}</UIBadge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No statutes found matching your criteria</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cases" className="space-y-4 mt-4">
            {filteredCases.length > 0 ? (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: { staggerChildren: 0.05 }
                  }
                }}
              >
                {filteredCases.map((case_) => (
                  <motion.div 
                    key={case_.id} 
                    variants={itemVariants}
                    whileHover="hover"
                    className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{case_.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{case_.citation}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {case_.tags && case_.tags.map((tag: string, i: number) => (
                          <UIBadge key={i} variant="outline" className="text-xs">{tag}</UIBadge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <Gavel className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No cases found matching your criteria</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="my-knowledge" className="space-y-4 mt-4">
            {filteredUserItems.length > 0 ? (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: { staggerChildren: 0.05 }
                  }
                }}
              >
                {filteredUserItems.map((item: any) => (
                  <motion.div 
                    key={item.id} 
                    variants={itemVariants}
                    whileHover="hover"
                    className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <UIBadge 
                            variant="secondary" 
                            className="text-xs flex items-center gap-1"
                          >
                            {item.type === 'document' && <FileText className="h-3 w-3" />}
                            {item.type === 'url' && <Globe className="h-3 w-3" />}
                            {item.type === 'text' && <BookOpen className="h-3 w-3" />}
                            {item.type === 'precedent' && <Gavel className="h-3 w-3" />}
                            {item.type === 'legislation' && <Landmark className="h-3 w-3" />}
                            {item.type === 'document' ? 'Document' : 
                             item.type === 'url' ? 'URL' : 
                             item.type === 'text' ? 'Text' :
                             item.type === 'precedent' ? 'Precedent' : 'Legislation'}
                          </UIBadge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Added {new Date(item.dateAdded).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <Database className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  No knowledge items added yet
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={handleOpenFullKnowledgeBase}
                >
                  Add Knowledge Items
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2">
          <Button variant="secondary" onClick={handleOpenFullKnowledgeBase} className="w-full sm:w-auto">
            Manage Knowledge Base
          </Button>
          <Button onClick={() => setIsOpen(false)} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KnowledgeBaseButton;
