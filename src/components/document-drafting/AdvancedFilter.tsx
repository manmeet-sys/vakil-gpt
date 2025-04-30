
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckIcon, FilterIcon, XIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterOption {
  id: string;
  label: string;
}

interface AdvancedFilterProps {
  onFilterChange: (filters: Record<string, string[]>) => void;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<Record<string, string[]>>({
    type: [],
    jurisdiction: [],
    court: [],
  });
  
  const [isOpen, setIsOpen] = useState(false);
  
  const documentTypes: FilterOption[] = [
    { id: 'affidavit', label: 'Affidavit' },
    { id: 'petition', label: 'Petition' },
    { id: 'contract', label: 'Contract' },
    { id: 'notice', label: 'Legal Notice' },
    { id: 'will', label: 'Will & Testament' },
  ];
  
  const jurisdictions: FilterOption[] = [
    { id: 'delhi', label: 'Delhi' },
    { id: 'maharashtra', label: 'Maharashtra' },
    { id: 'karnataka', label: 'Karnataka' },
    { id: 'tamil_nadu', label: 'Tamil Nadu' },
    { id: 'west_bengal', label: 'West Bengal' },
  ];
  
  const courts: FilterOption[] = [
    { id: 'supreme_court', label: 'Supreme Court' },
    { id: 'high_court', label: 'High Court' },
    { id: 'district_court', label: 'District Court' },
    { id: 'consumer_forum', label: 'Consumer Forum' },
  ];
  
  const addFilter = (category: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value) 
        ? prev[category]
        : [...prev[category], value]
    }));
  };
  
  const removeFilter = (category: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].filter(v => v !== value)
    }));
  };
  
  const clearAllFilters = () => {
    setFilters({
      type: [],
      jurisdiction: [],
      court: [],
    });
  };
  
  const applyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };
  
  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, filterValues) => count + filterValues.length, 0);
  };
  
  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <FilterIcon className="h-4 w-4" />
            <span>Filter</span>
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-1 px-1 py-0 h-5 min-w-5 flex items-center justify-center">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filter Documents</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={clearAllFilters}
              >
                Clear all
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Document Type</Label>
                <ScrollArea className="h-24 border rounded-md p-2">
                  <div className="space-y-1">
                    {documentTypes.map((type) => (
                      <div key={type.id} className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-7 justify-start px-2 font-normal w-full ${
                            filters.type.includes(type.id) ? 'bg-primary/10' : ''
                          }`}
                          onClick={() => 
                            filters.type.includes(type.id) 
                              ? removeFilter('type', type.id) 
                              : addFilter('type', type.id)
                          }
                        >
                          {filters.type.includes(type.id) && (
                            <CheckIcon className="h-3 w-3 mr-2" />
                          )}
                          <span className="text-xs">{type.label}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <div>
                <Label htmlFor="jurisdiction" className="text-xs font-medium mb-1.5 block">Jurisdiction</Label>
                <Select 
                  onValueChange={(value) => {
                    if (value) {
                      setFilters(prev => ({...prev, jurisdiction: [value]}));
                    }
                  }}
                  value={filters.jurisdiction[0] || ""} 
                >
                  <SelectTrigger id="jurisdiction" className="w-full">
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jurisdictions</SelectItem>
                    {jurisdictions.map((jurisdiction) => (
                      <SelectItem key={jurisdiction.id} value={jurisdiction.id}>
                        {jurisdiction.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="court" className="text-xs font-medium mb-1.5 block">Court/Authority</Label>
                <Select
                  onValueChange={(value) => {
                    if (value) {
                      setFilters(prev => ({...prev, court: [value]}));
                    }
                  }}
                  value={filters.court[0] || ""}
                >
                  <SelectTrigger id="court" className="w-full">
                    <SelectValue placeholder="Select court" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courts</SelectItem>
                    {courts.map((court) => (
                      <SelectItem key={court.id} value={court.id}>
                        {court.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Active filters display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(filters).map(([category, values]) => 
            values.map(value => {
              const label = 
                category === 'type' 
                  ? documentTypes.find(t => t.id === value)?.label
                  : category === 'jurisdiction'
                    ? jurisdictions.find(j => j.id === value)?.label
                    : courts.find(c => c.id === value)?.label;
                
              return label && value !== 'all' ? (
                <Badge 
                  key={`${category}-${value}`} 
                  variant="outline"
                  className="py-1 px-2 h-6"
                >
                  <span className="text-xs font-normal">{label}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => removeFilter(category, value)}
                  >
                    <XIcon className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </Badge>
              ) : null;
            })
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedFilter;
