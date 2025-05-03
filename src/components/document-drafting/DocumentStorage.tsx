
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Search, 
  Save, 
  Folder, 
  Trash, 
  FileText,
  FileCheck,
  Clock,
  Download,
  Plus,
  Calendar
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DocumentStorageProps {
  currentDocument: {
    title: string;
    type: string;
    content: string;
  };
  onLoadDocument: (document: SavedDocument) => void;
}

export interface SavedDocument {
  id: string;
  title: string;
  type: string;
  content: string;
  category: string;
  dateCreated: string;
  dateModified: string;
  tags?: string[];
}

const DocumentStorage: React.FC<DocumentStorageProps> = ({ 
  currentDocument, 
  onLoadDocument 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<SavedDocument[]>([]);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentCategory, setDocumentCategory] = useState("general");
  const [documentTags, setDocumentTags] = useState("");
  const [saveMode, setSaveMode] = useState<"new" | "update">("new");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  useEffect(() => {
    // Load saved documents from localStorage when component mounts
    const loadDocuments = () => {
      try {
        const storedDocs = localStorage.getItem("savedDocuments");
        if (storedDocs) {
          const parsedDocs = JSON.parse(storedDocs) as SavedDocument[];
          setDocuments(parsedDocs);
          setFilteredDocuments(parsedDocs);
        }
      } catch (error) {
        console.error("Error loading documents:", error);
        toast.error("Failed to load saved documents");
      }
    };

    loadDocuments();
  }, []);

  useEffect(() => {
    // Filter documents based on search term
    if (searchTerm === "") {
      setFilteredDocuments(documents);
      return;
    }

    const filtered = documents.filter((doc) => {
      const termLower = searchTerm.toLowerCase();
      return (
        doc.title.toLowerCase().includes(termLower) ||
        doc.type.toLowerCase().includes(termLower) ||
        doc.category.toLowerCase().includes(termLower) ||
        (doc.tags && doc.tags.some((tag) => tag.toLowerCase().includes(termLower)))
      );
    });
    setFilteredDocuments(filtered);
  }, [searchTerm, documents]);

  // Pre-fill form fields when the current document changes
  useEffect(() => {
    if (currentDocument?.title) {
      setDocumentTitle(currentDocument.title);
    }
    if (currentDocument?.type) {
      setDocumentType(currentDocument.type);
    }
  }, [currentDocument]);

  const handleSaveDocument = () => {
    if (!documentTitle.trim()) {
      toast.error("Document title is required");
      return;
    }

    if (!currentDocument.content.trim()) {
      toast.error("Document content is required");
      return;
    }

    try {
      const tagsArray = documentTags.trim() 
        ? documentTags.split(",").map((tag) => tag.trim()) 
        : [];

      const now = new Date().toISOString();

      let updatedDocuments: SavedDocument[];

      if (saveMode === "update" && selectedDocumentId) {
        // Update existing document
        updatedDocuments = documents.map((doc) =>
          doc.id === selectedDocumentId
            ? {
                ...doc,
                title: documentTitle,
                type: documentType || currentDocument.type || "Document",
                content: currentDocument.content,
                category: documentCategory,
                dateModified: now,
                tags: tagsArray,
              }
            : doc
        );
        toast.success("Document updated successfully");
      } else {
        // Create new document
        const newDocument: SavedDocument = {
          id: uuidv4(),
          title: documentTitle,
          type: documentType || currentDocument.type || "Document",
          content: currentDocument.content,
          category: documentCategory,
          dateCreated: now,
          dateModified: now,
          tags: tagsArray,
        };

        updatedDocuments = [...documents, newDocument];
        toast.success("Document saved successfully");
      }

      localStorage.setItem("savedDocuments", JSON.stringify(updatedDocuments));
      setDocuments(updatedDocuments);
      setFilteredDocuments(updatedDocuments);
      setIsOpen(false);
      
      // Reset form
      setSaveMode("new");
      setSelectedDocumentId(null);
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("Failed to save document");
    }
  };

  const handleDeleteDocument = (id: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        const updatedDocuments = documents.filter((doc) => doc.id !== id);
        localStorage.setItem("savedDocuments", JSON.stringify(updatedDocuments));
        setDocuments(updatedDocuments);
        setFilteredDocuments(updatedDocuments);
        toast.success("Document deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
        toast.error("Failed to delete document");
      }
    }
  };

  const handleEditDocument = (doc: SavedDocument) => {
    setDocumentTitle(doc.title);
    setDocumentType(doc.type);
    setDocumentCategory(doc.category);
    setDocumentTags(doc.tags ? doc.tags.join(", ") : "");
    setSaveMode("update");
    setSelectedDocumentId(doc.id);
    setIsOpen(true);
  };

  const handleNewDocument = () => {
    setDocumentTitle(currentDocument.title || "");
    setDocumentType(currentDocument.type || "");
    setDocumentCategory("general");
    setDocumentTags("");
    setSaveMode("new");
    setSelectedDocumentId(null);
    setIsOpen(true);
  };

  const handleLoadDocument = (doc: SavedDocument) => {
    onLoadDocument(doc);
    toast.success(`Document '${doc.title}' loaded`);
  };

  const handleDownloadDocument = (doc: SavedDocument) => {
    try {
      const element = document.createElement("a");
      const file = new Blob([doc.content], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${doc.title}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const categoryColorMap: Record<string, string> = {
    general: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    litigation: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    contract: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    property: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    family: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    corporate: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    court_filing: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Folder className="h-4 w-4" />
          My Documents
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>My Legal Documents</DialogTitle>
          <DialogDescription>
            Access and manage your saved legal documents
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 mt-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="default"
            size="sm"
            className="whitespace-nowrap flex items-center gap-1"
            onClick={handleNewDocument}
          >
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-4" />
            <h3 className="text-lg font-medium mb-2">No documents found</h3>
            {documents.length === 0 ? (
              <p className="text-muted-foreground text-sm max-w-xs">
                You haven't saved any documents yet. Create a document and save it here for
                future reference.
              </p>
            ) : (
              <p className="text-muted-foreground text-sm max-w-xs">
                No documents match your search. Try different search terms or clear the search.
              </p>
            )}
            {documents.length > 0 && searchTerm && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="mt-2"
              >
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <TableCell onClick={() => handleLoadDocument(doc)}>
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{doc.title}</span>
                      </div>
                    </TableCell>
                    <TableCell onClick={() => handleLoadDocument(doc)}>
                      {doc.type}
                    </TableCell>
                    <TableCell onClick={() => handleLoadDocument(doc)}>
                      <Badge 
                        variant="outline"
                        className={`text-xs ${categoryColorMap[doc.category.toLowerCase()] || categoryColorMap.general}`}
                      >
                        {doc.category}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={() => handleLoadDocument(doc)}>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-gray-500" />
                        <span>{formatDate(doc.dateModified)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditDocument(doc);
                                }}
                              >
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit Document Details</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadDocument(doc);
                                }}
                              >
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Download Document</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDocument(doc.id);
                                }}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Document</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}

        {/* Dialog for saving/updating a document */}
        {isOpen && (
          <div className="border-t pt-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="document-title">Document Title</Label>
                  <Input
                    id="document-title"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    placeholder="Enter document title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document-type">Document Type</Label>
                  <Input
                    id="document-type"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    placeholder="E.g., Contract, Affidavit, Notice"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="document-category">Category</Label>
                  <select
                    id="document-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={documentCategory}
                    onChange={(e) => setDocumentCategory(e.target.value)}
                  >
                    <option value="general">General</option>
                    <option value="litigation">Litigation</option>
                    <option value="contract">Contracts</option>
                    <option value="property">Property</option>
                    <option value="family">Family Law</option>
                    <option value="corporate">Corporate</option>
                    <option value="court_filing">Court Filing</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document-tags">
                    Tags (comma-separated)
                  </Label>
                  <Input
                    id="document-tags"
                    value={documentTags}
                    onChange={(e) => setDocumentTags(e.target.value)}
                    placeholder="E.g., urgent, property, client"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Document Info</Label>
                  <div className="text-xs text-muted-foreground">
                    <Calendar className="inline h-3.5 w-3.5 mr-1" />
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md text-sm">
                  <p className="line-clamp-2">
                    Content: {currentDocument.content.slice(0, 150)}
                    {currentDocument.content.length > 150 ? "..." : ""}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="gap-1"
                onClick={handleSaveDocument}
              >
                <Save className="h-4 w-4" />
                {saveMode === "update" ? "Update" : "Save"} Document
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentStorage;
