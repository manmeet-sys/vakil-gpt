
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Calendar, Eye, Download, Trash2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface SearchDocumentsProps {
  onSearch: (query: string, type: string, dateRange: string) => void;
}

interface SavedDocument {
  id: string;
  title: string;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const SearchDocuments: React.FC<SearchDocumentsProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<SavedDocument[]>([]);

  const documentTypes = [
    { value: '', label: 'All Types' },
    { value: 'affidavit', label: 'Affidavit' },
    { value: 'contract', label: 'Contract Agreement' },
    { value: 'legal-notice', label: 'Legal Notice' },
    { value: 'petition', label: 'Petition' },
    { value: 'mou', label: 'Memorandum of Understanding' },
    { value: 'will', label: 'Will & Testament' },
    { value: 'power-of-attorney', label: 'Power of Attorney' },
    { value: 'rental-agreement', label: 'Rental Agreement' },
    { value: 'other', label: 'Other Document' }
  ];

  const dateRanges = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  // Load saved documents from localStorage
  useEffect(() => {
    const loadSavedDocuments = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
        setSavedDocuments(saved);
        setFilteredDocuments(saved);
      } catch (error) {
        console.error('Error loading saved documents:', error);
        setSavedDocuments([]);
        setFilteredDocuments([]);
      }
    };

    loadSavedDocuments();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadSavedDocuments();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter documents based on search criteria
  useEffect(() => {
    let filtered = savedDocuments;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by document type
    if (documentType) {
      filtered = filtered.filter(doc => doc.type === documentType);
    }

    // Filter by date range
    if (dateRange) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      if (dateRange !== '') {
        filtered = filtered.filter(doc => new Date(doc.createdAt) >= filterDate);
      }
    }

    setFilteredDocuments(filtered);
  }, [searchQuery, documentType, dateRange, savedDocuments]);

  const handleSearch = () => {
    onSearch(searchQuery, documentType, dateRange);
    toast.success(`Found ${filteredDocuments.length} documents`);
  };

  const handleViewDocument = (doc: SavedDocument) => {
    // Create a temporary preview
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>${doc.title}</title>
            <style>
              body { font-family: serif; padding: 40px; line-height: 1.6; }
              h1 { color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
              .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
              pre { white-space: pre-wrap; font-family: serif; }
            </style>
          </head>
          <body>
            <h1>${doc.title}</h1>
            <div class="meta">
              Created: ${new Date(doc.createdAt).toLocaleDateString()} | 
              Type: ${documentTypes.find(t => t.value === doc.type)?.label || doc.type}
            </div>
            <pre>${doc.content}</pre>
          </body>
        </html>
      `);
    }
  };

  const handleDownloadDocument = (doc: SavedDocument) => {
    const blob = new Blob([doc.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Document downloaded successfully');
  };

  const handleDeleteDocument = (docId: string) => {
    const updatedDocs = savedDocuments.filter(doc => doc.id !== docId);
    setSavedDocuments(updatedDocs);
    localStorage.setItem('savedDocuments', JSON.stringify(updatedDocs));
    toast.success('Document deleted successfully');
  };

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-orange-600" />
            Search & Filter
          </CardTitle>
          <CardDescription>
            Search through your saved documents and templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents by title or content..."
                className="h-11"
              />
            </div>
            <Button onClick={handleSearch} className="px-6">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Document Type</label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Search Results
            </span>
            <Badge variant="secondary">
              {filteredDocuments.length} documents
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No documents found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {savedDocuments.length === 0 
                  ? "You haven't saved any documents yet. Create your first document to see it here."
                  : "No documents match your search criteria. Try adjusting your filters."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredDocuments.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-2">{doc.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {documentTypes.find(t => t.value === doc.type)?.label || doc.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark: text-gray-400 line-clamp-2">
                          {doc.content.substring(0, 150)}...
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(doc)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(doc)}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchDocuments;
