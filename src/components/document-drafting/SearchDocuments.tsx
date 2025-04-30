
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, FileType, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface SearchDocumentsProps {
  onSearch: (query: string, type: string, dateRange: string) => void;
}

const SearchDocuments: React.FC<SearchDocumentsProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documentType, setDocumentType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

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
  const saveSearch = (query: string) => {
    if (!query.trim()) return;
    
    try {
      const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentDocumentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error saving search:', error);
      toast.error('Could not save your search history');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search legal documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" size="sm" className="whitespace-nowrap">
              Search
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="flex items-center text-sm mb-1">
                <FileType className="mr-1 h-4 w-4" />
                <span>Document Type</span>
              </div>
              <Select 
                value={documentType} 
                onValueChange={setDocumentType}
              >
                <SelectTrigger className="h-9">
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
                <Calendar className="mr-1 h-4 w-4" />
                <span>Date Range</span>
              </div>
              <Select
                value={dateRange}
                onValueChange={setDateRange}
              >
                <SelectTrigger className="h-9">
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
              <p className="text-xs text-gray-500 mb-1">Recent Searches:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <div 
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {search}
                    <X 
                      className="ml-1 h-3 w-3 hover:text-red-500" 
                      onClick={(e) => handleRemoveRecentSearch(search, e)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {(searchQuery || documentType !== 'all' || dateRange !== 'all') && (
            <div className="pt-1">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleClearSearch}
                className="text-xs"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchDocuments;
