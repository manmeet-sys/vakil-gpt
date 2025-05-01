
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, FileType, X, History } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';

interface SearchDocumentsProps {
  onSearch: (query: string, type: string, dateRange: string) => void;
}

// Memoized item component for better performance
const RecentSearchItem = memo(({ 
  search, 
  onSelect, 
  onRemove 
}: { 
  search: string; 
  onSelect: () => void; 
  onRemove: (e: React.MouseEvent) => void;
}) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 group"
    onClick={onSelect}
  >
    <History className="mr-1 h-3 w-3 text-gray-500" />
    {search}
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${search} from recent searches`}
      className="ml-1 p-0.5 rounded-full group-hover:bg-gray-300 dark:group-hover:bg-gray-600"
    >
      <X className="h-2.5 w-2.5 text-gray-500 group-hover:text-red-500" />
    </button>
  </motion.div>
));

const SearchDocuments: React.FC<SearchDocumentsProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documentType, setDocumentType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isTouched, setIsTouched] = useState(false);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    try {
      const savedSearches = localStorage.getItem('recentDocumentSearches');
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
      // Reset if there's an error with the stored data
      localStorage.removeItem('recentDocumentSearches');
    }
  }, []);

  // Save recent searches to localStorage
  const saveSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    
    try {
      const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentDocumentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error saving search:', error);
      toast.error('Could not save your search history');
    }
  }, [recentSearches]);

  // Debounced search function to prevent excessive calls on typing
  const debouncedSearch = useCallback(
    debounce((query: string, type: string, date: string) => {
      onSearch(query, type, date);
      if (query.trim()) {
        saveSearch(query);
        if (isTouched) {
          toast.success('Search filters applied');
        }
      }
    }, 500),
    [onSearch, saveSearch, isTouched]
  );

  // Apply search when filters change
  useEffect(() => {
    if (isTouched) {
      debouncedSearch(searchQuery, documentType, dateRange);
    }
    // Clean up debounced function on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, documentType, dateRange, debouncedSearch, isTouched]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTouched(true);
    onSearch(searchQuery, documentType, dateRange);
    if (searchQuery.trim()) {
      saveSearch(searchQuery);
      toast.success('Search filters applied');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDocumentType('all');
    setDateRange('all');
    onSearch('', 'all', 'all');
    toast.info('Search filters cleared');
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    setIsTouched(true);
    onSearch(search, documentType, dateRange);
    saveSearch(search);
  };

  const handleRemoveRecentSearch = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSearches = recentSearches.filter(s => s !== search);
    setRecentSearches(updatedSearches);
    try {
      localStorage.setItem('recentDocumentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error removing search:', error);
    }
  };

  return (
    <Card className="shadow-sm dark:shadow-zinc-800/10">
      <CardContent className="p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search legal documents..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsTouched(true);
                }}
                className="pl-9 pr-8 transition-all duration-200 border-gray-200 focus:border-blue-300 dark:border-gray-700 dark:focus:border-blue-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <Button 
              type="submit" 
              size="sm" 
              className="whitespace-nowrap bg-legal-accent hover:bg-blue-700 text-white"
            >
              Search
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="flex items-center text-sm mb-1">
                <FileType className="mr-1 h-4 w-4 text-gray-500" />
                <span>Document Type</span>
              </div>
              <Select 
                value={documentType} 
                onValueChange={(value) => {
                  setDocumentType(value);
                  setIsTouched(true);
                }}
              >
                <SelectTrigger className="h-9 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="All document types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All document types</SelectItem>
                  <SelectItem value="contract">Contracts</SelectItem>
                  <SelectItem value="affidavit">Affidavits</SelectItem>
                  <SelectItem value="petition">Petitions</SelectItem>
                  <SelectItem value="notice">Legal Notices</SelectItem>
                  <SelectItem value="will">Wills & Testament</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center text-sm mb-1">
                <Calendar className="mr-1 h-4 w-4 text-gray-500" />
                <span>Date Range</span>
              </div>
              <Select
                value={dateRange}
                onValueChange={(value) => {
                  setDateRange(value);
                  setIsTouched(true);
                }}
              >
                <SelectTrigger className="h-9 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {recentSearches.length > 0 && (
            <div className="pt-2">
              <p className="text-xs text-gray-500 mb-1 flex items-center">
                <History className="h-3.5 w-3.5 mr-1" /> Recent Searches:
              </p>
              <AnimatePresence>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <RecentSearchItem
                      key={`${search}-${index}`}
                      search={search}
                      onSelect={() => handleRecentSearchClick(search)}
                      onRemove={(e) => handleRemoveRecentSearch(search, e)}
                    />
                  ))}
                </div>
              </AnimatePresence>
            </div>
          )}
          
          {(searchQuery || documentType !== 'all' || dateRange !== 'all') && (
            <motion.div 
              className="pt-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleClearSearch}
                className="text-xs"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchDocuments;
