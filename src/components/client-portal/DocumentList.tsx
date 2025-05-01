
import React from 'react';
import { File, Download, Search, Filter } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientDocument } from '@/types/client-portal';

interface DocumentListProps {
  documents: ClientDocument[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onDownload: (document: ClientDocument) => void;
  onUpload: () => void;
}

const DocumentList = ({
  documents,
  loading,
  searchTerm,
  setSearchTerm,
  onDownload,
  onUpload
}: DocumentListProps) => {
  
  const renderDocumentsSkeletons = () => (
    <>
      {[1, 2, 3].map(i => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        </TableRow>
      ))}
    </>
  );
  
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.status && doc.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div className="mt-2 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input 
            placeholder="Search documents..." 
            className="pl-8" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSearchTerm('')}>
              All Documents
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchTerm('pdf')}>
              PDF Documents
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchTerm('shared')}>
              Shared With Me
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchTerm('approved')}>
              Approved Documents
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {loading ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderDocumentsSkeletons()}
            </TableBody>
          </Table>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <File className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium">No documents found</h3>
          <p className="text-gray-500 mt-2 mb-4">
            {searchTerm ? 'No documents match your search criteria' : 'Your advocate hasn\'t shared any documents yet'}
          </p>
          <Button variant="outline" onClick={onUpload}>
            Upload Your Document
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map(document => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <File className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{document.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(document.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        document.status === 'approved' ? 'default' :
                        document.status === 'rejected' ? 'destructive' :
                        document.status === 'pending_review' ? 'secondary' :
                        'outline'
                      }
                    >
                      {document.status?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => onDownload(document)}
                    >
                      <Download className="h-3 w-3" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default DocumentList;
