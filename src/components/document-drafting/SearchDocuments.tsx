
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, FileType } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SearchDocumentsProps {
  onSearch: (query: string, type: string, dateRange: string) => void;
}

const SearchDocuments: React.FC<SearchDocumentsProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documentType, setDocumentType] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, documentType, dateRange);
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
                className="pl-9"
              />
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
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchDocuments;
