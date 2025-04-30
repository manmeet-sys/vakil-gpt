
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { HistoryIcon, Clock, Download, Eye, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export interface DocumentVersion {
  id: string;
  version: number;
  title: string;
  createdAt: Date;
  createdBy: string;
  size: string;
  content: string;
}

interface DocumentVersionHistoryProps {
  documentId: string;
  currentVersion?: number;
  onRestoreVersion?: (version: DocumentVersion) => void;
}

const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  documentId,
  currentVersion = 1,
  onRestoreVersion
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareVersion, setCompareVersion] = useState<number | null>(null);

  const loadVersions = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, we would fetch from database
      // Simulated loading delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockVersions: DocumentVersion[] = [
        {
          id: "v1",
          version: 1,
          title: "Initial Draft",
          createdAt: new Date(Date.now() - 86400000 * 10), // 10 days ago
          createdBy: "You",
          size: "12 KB",
          content: "This is the initial draft content with basic structure."
        },
        {
          id: "v2",
          version: 2,
          title: "Added Clauses",
          createdAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
          createdBy: "You",
          size: "14 KB",
          content: "This is the initial draft content with basic structure and additional clauses for indemnity and jurisdiction."
        },
        {
          id: "v3",
          version: 3,
          title: "Client Feedback",
          createdAt: new Date(Date.now() - 86400000 * 4), // 4 days ago
          createdBy: "Rahul Sharma",
          size: "15 KB",
          content: "This is the revised draft with client feedback incorporated. Changes to sections 2, 4, and 7."
        },
        {
          id: "v4",
          version: 4,
          title: "Current Version",
          createdAt: new Date(), // Now
          createdBy: "You",
          size: "16 KB",
          content: "This is the current version with all revisions and final formatting complete."
        }
      ];
      
      setVersions(mockVersions);
    } catch (error) {
      toast.error("Failed to load version history");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      loadVersions();
    }
  };

  const viewVersion = (version: DocumentVersion) => {
    setSelectedVersion(version);
    setIsPreviewOpen(true);
  };

  const downloadVersion = (version: DocumentVersion) => {
    const element = document.createElement('a');
    const file = new Blob([version.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Document_v${version.version}_${new Date(version.createdAt).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`Version ${version.version} downloaded`);
  };

  const restoreVersion = (version: DocumentVersion) => {
    if (onRestoreVersion) {
      onRestoreVersion(version);
      setIsOpen(false);
      toast.success(`Restored to version ${version.version}`);
    }
  };

  const toggleCompare = (version: DocumentVersion) => {
    if (compareVersion === version.version) {
      setCompareVersion(null);
      setIsCompareMode(false);
    } else {
      setCompareVersion(version.version);
      setIsCompareMode(true);
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs flex items-center gap-1"
          >
            <HistoryIcon className="h-3 w-3" /> 
            Version History
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HistoryIcon className="h-4 w-4" /> 
              Document Version History
            </DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versions.map((version) => (
                    <TableRow key={version.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {version.version === currentVersion ? (
                            <Badge className="bg-green-500">Current</Badge>
                          ) : (
                            <Badge variant="outline">v{version.version}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{version.title}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-gray-500" />
                          <span className="text-xs">{formatDate(version.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{version.createdBy}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => viewVersion(version)} 
                            className="h-7 px-2 text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => downloadVersion(version)}
                            className="h-7 px-2 text-xs"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Download</span>
                          </Button>
                          {version.version !== currentVersion && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => restoreVersion(version)}
                              className="h-7 px-2 text-xs"
                            >
                              <ArrowLeft className="h-3 w-3 mr-1" />
                              Restore
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="text-xs text-gray-500 mt-2">
                Showing {versions.length} versions • Automatic versioning enabled
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Version Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          {selectedVersion && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedVersion.title} (Version {selectedVersion.version})</DialogTitle>
              </DialogHeader>
              
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <div>Created by {selectedVersion.createdBy}</div>
                <div>{formatDate(selectedVersion.createdAt)}</div>
              </div>
              
              <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900 font-mono text-sm whitespace-pre-wrap">
                {selectedVersion.content}
              </div>
              
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => downloadVersion(selectedVersion)}>
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                {selectedVersion.version !== currentVersion && (
                  <Button size="sm" onClick={() => restoreVersion(selectedVersion)}>
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Restore This Version
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentVersionHistory;
