
import React, { useState } from 'react';
import { useUserData } from '@/context/UserDataContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Trash2, Search, History, Save, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const ResultsHistory: React.FC = () => {
  const { toolResults, documents, exportData, clearToolResults, clearDocuments } = useUserData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('results');

  // Filter results based on search query
  const filteredResults = toolResults.filter(result => 
    result.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.toolType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.documentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Handle export
  const handleExport = (data: any, name: string) => {
    exportData(data, name, 'json');
  };

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="bg-muted/30 border-b">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-blue-600" /> 
          Your Activity History
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search history..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="results" className="flex items-center gap-1">
              <Save className="h-4 w-4" /> Tool Results 
              <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                {toolResults.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-1">
              <FileText className="h-4 w-4" /> Documents
              <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                {documents.length}
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="results" className="mt-0">
            {filteredResults.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {filteredResults.map((result) => (
                  <Card key={result.id} className="overflow-hidden">
                    <CardHeader className="py-3 px-4 bg-muted/20">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">
                          {result.toolName}
                        </h3>
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                          {result.toolType}
                        </span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="py-3 px-4">
                      <div className="text-xs text-muted-foreground mb-2">
                        {formatDate(result.createdAt)}
                      </div>
                      
                      <div className="text-sm max-h-24 overflow-y-auto">
                        {typeof result.data === 'object' ? (
                          <pre className="text-xs overflow-x-auto">{JSON.stringify(result.data, null, 2)}</pre>
                        ) : (
                          <p>{String(result.data)}</p>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="py-2 px-4 bg-muted/10 border-t flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleExport(result.data, `${result.toolType}-${result.id.substring(0, 8)}`)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 
                  "No matching results found" : 
                  "No saved tool results yet"}
              </div>
            )}
            
            {toolResults.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all saved results?')) {
                      clearToolResults();
                    }
                  }}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All Results
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="documents" className="mt-0">
            {filteredDocuments.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <CardHeader className="py-3 px-4 bg-muted/20">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">
                          {doc.title}
                        </h3>
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                          {doc.documentType}
                        </span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="py-3 px-4">
                      <div className="text-xs text-muted-foreground mb-2">
                        {formatDate(doc.createdAt)}
                      </div>
                      
                      <div className="text-sm max-h-24 overflow-y-auto">
                        <p className="line-clamp-3">{doc.content.substring(0, 150)}...</p>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="py-2 px-4 bg-muted/10 border-t flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleExport(doc.content, `${doc.documentType}-${doc.id.substring(0, 8)}`)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 
                  "No matching documents found" : 
                  "No saved documents yet"}
              </div>
            )}
            
            {documents.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all saved documents?')) {
                      clearDocuments();
                    }
                  }}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All Documents
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResultsHistory;
