import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, MapPin, Scale, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LegalAuthority {
  court?: string;
  year?: number;
  title: string;
  pinpoint?: string;
  holding: string;
  why_relevant?: string;
  primary: boolean;
}

interface DocumentChunk {
  id: string;
  content: string;
  seq: number;
  doc_id: string;
  provisions: string[];
  posture: string;
  court_level: string;
  date: string;
}

interface Document {
  id: string;
  title: string;
  source_url?: string;
  jurisdiction?: string;
  court_level?: string;
  date?: string;
  provisions: string[];
  posture?: string;
  is_primary: boolean;
}

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  authority: LegalAuthority | null;
}

export function CitationModal({ isOpen, onClose, authority }: CitationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [document, setDocument] = useState<Document | null>(null);
  const [chunks, setChunks] = useState<DocumentChunk[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadDocumentData = useCallback(async (authority: LegalAuthority) => {
    if (!authority) return;
    
    setIsLoading(true);
    setError(null);
    setDocument(null);
    setChunks([]);

    try {
      // Search for document by title and year
      const { data: docs, error: docError } = await supabase
        .from('documents')
        .select('*')
        .ilike('title', `%${authority.title}%`)
        .limit(5);

      if (docError) throw docError;

      if (!docs || docs.length === 0) {
        setError("Source document not found in the database");
        return;
      }

      // Try to find the best match
      let bestDoc = docs[0];
      if (authority.year && docs.length > 1) {
        const yearMatch = docs.find(doc => 
          doc.date && new Date(doc.date).getFullYear() === authority.year
        );
        if (yearMatch) bestDoc = yearMatch;
      }

      setDocument(bestDoc);

      // Load relevant chunks from this document
      const { data: docChunks, error: chunksError } = await supabase
        .from('chunks')
        .select('*')
        .eq('doc_id', bestDoc.id)
        .order('seq', { ascending: true });

      if (chunksError) throw chunksError;

      setChunks(docChunks || []);

    } catch (err) {
      console.error('Error loading document:', err);
      setError(err instanceof Error ? err.message : 'Failed to load document');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isOpen && authority) {
      loadDocumentData(authority);
    }
  }, [isOpen, authority, loadDocumentData]);

  if (!authority) return null;

  const handleExternalLink = () => {
    if (document?.source_url) {
      window.open(document.source_url, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pr-8">
            <FileText className="h-5 w-5" />
            {authority.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Authority Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Citation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Court:</span>
                  <span>{authority.court || 'Not specified'}</span>
                </div>
                
                {authority.year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Year:</span>
                    <span>{authority.year}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Badge variant={authority.primary ? "default" : "secondary"}>
                    {authority.primary ? "Primary Source" : "Secondary Source"}
                  </Badge>
                </div>
                
                {authority.pinpoint && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Pinpoint:</span>
                    <span>{authority.pinpoint}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <div className="font-medium mb-2">Holding:</div>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  {authority.holding}
                </p>
              </div>
              
              {authority.why_relevant && (
                <div className="mt-4">
                  <div className="font-medium mb-2">Relevance:</div>
                  <p className="text-sm text-gray-700">
                    {authority.why_relevant}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Info */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading document details...
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
            </div>
          )}

          {document && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Source Document</CardTitle>
                  {document.source_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExternalLink}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Original
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {document.jurisdiction && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Jurisdiction:</span>
                      <span>{document.jurisdiction}</span>
                    </div>
                  )}
                  
                  {document.court_level && (
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Court Level:</span>
                      <span>{document.court_level}</span>
                    </div>
                  )}
                  
                  {document.date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Date:</span>
                      <span>{new Date(document.date).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {document.posture && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Case Posture:</span>
                      <span>{document.posture.replace(/_/g, ' ')}</span>
                    </div>
                  )}
                </div>
                
                {document.provisions && document.provisions.length > 0 && (
                  <div className="mt-4">
                    <div className="font-medium mb-2">Legal Provisions:</div>
                    <div className="flex flex-wrap gap-1">
                      {document.provisions.map((provision, index) => (
                        <Badge key={index} variant="outline">{provision}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Document Content */}
          {chunks.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Document Content ({chunks.length} sections)</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {chunks.map((chunk, index) => (
                      <div key={chunk.id} className="border-l-2 border-gray-200 pl-4">
                        <div className="text-xs text-gray-500 mb-1">
                          Section {chunk.seq + 1}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">
                          {chunk.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}