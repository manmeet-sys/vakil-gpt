import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { extractLegalMetadata, validateDocumentMeta } from '@/utils/documentIngestion';

interface DocumentMetadata {
  jurisdiction?: string;
  court_level?: string;
  date?: string;
  provisions?: string[];
  posture?: string;
  holding_direction?: string;
  primary?: boolean;
}

export function DocumentIngestionTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [text, setText] = useState('');
  const [metadata, setMetadata] = useState<DocumentMetadata>({
    primary: true,
    provisions: []
  });
  const [newProvision, setNewProvision] = useState('');
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a text file (.txt)",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
      
      if (!title) {
        setTitle(file.name.replace('.txt', ''));
      }

      // Auto-extract metadata
      const extractedMeta = extractLegalMetadata(content);
      setMetadata(prev => ({
        ...prev,
        ...extractedMeta,
        provisions: extractedMeta.provisions || prev.provisions
      }));

      toast({
        title: "File uploaded",
        description: `Loaded ${content.length} characters. Metadata auto-extracted.`
      });
    };
    reader.readAsText(file);
  };

  const addProvision = () => {
    if (newProvision.trim() && !metadata.provisions?.includes(newProvision.trim())) {
      setMetadata(prev => ({
        ...prev,
        provisions: [...(prev.provisions || []), newProvision.trim()]
      }));
      setNewProvision('');
    }
  };

  const removeProvision = (provision: string) => {
    setMetadata(prev => ({
      ...prev,
      provisions: prev.provisions?.filter(p => p !== provision) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !text.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please provide both title and document text",
        variant: "destructive"
      });
      return;
    }

    // Validate metadata
    const validation = validateDocumentMeta(metadata);
    if (!validation.valid) {
      toast({
        title: "Invalid metadata",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('document-ingest', {
        body: {
          title: title.trim(),
          source_url: sourceUrl.trim() || null,
          text: text.trim(),
          meta: metadata
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to ingest document');
      }

      const result = response.data;
      
      toast({
        title: "Document ingested successfully",
        description: `Created ${result.chunks_created} chunks with embeddings`
      });

      // Reset form
      setTitle('');
      setSourceUrl('');
      setText('');
      setMetadata({ primary: true, provisions: [] });
      
      // Clear file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Ingestion error:', error);
      toast({
        title: "Ingestion failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Legal Document Ingestion
        </CardTitle>
        <CardDescription>
          Upload and process legal documents for the RAG knowledge base
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Document (Text File)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file-upload"
                type="file"
                accept=".txt,text/plain"
                onChange={handleFileUpload}
                className="flex-1"
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., ABC vs XYZ - Supreme Court 2024"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="source-url">Source URL (Optional)</Label>
              <Input
                id="source-url"
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://example.com/judgment.pdf"
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Court Level</Label>
              <Select 
                value={metadata.court_level || ''} 
                onValueChange={(value) => setMetadata(prev => ({ ...prev, court_level: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select court level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Supreme Court">Supreme Court</SelectItem>
                  <SelectItem value="High Court">High Court</SelectItem>
                  <SelectItem value="District Court">District Court</SelectItem>
                  <SelectItem value="Family Court">Family Court</SelectItem>
                  <SelectItem value="Tribunal">Tribunal</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Case Posture</Label>
              <Select 
                value={metadata.posture || ''} 
                onValueChange={(value) => setMetadata(prev => ({ ...prev, posture: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select posture" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="husband_from_wife">Husband seeking from Wife</SelectItem>
                  <SelectItem value="wife_from_husband">Wife seeking from Husband</SelectItem>
                  <SelectItem value="child_from_parent">Child seeking from Parent</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Holding Direction</Label>
              <Select 
                value={metadata.holding_direction || ''} 
                onValueChange={(value) => setMetadata(prev => ({ ...prev, holding_direction: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supports">Supports</SelectItem>
                  <SelectItem value="contradicts">Contradicts</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Jurisdiction</Label>
              <Input
                value={metadata.jurisdiction || ''}
                onChange={(e) => setMetadata(prev => ({ ...prev, jurisdiction: e.target.value }))}
                placeholder="e.g., Delhi, Maharashtra, All India"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={metadata.date || ''}
                onChange={(e) => setMetadata(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          {/* Provisions */}
          <div className="space-y-2">
            <Label>Legal Provisions</Label>
            <div className="flex gap-2">
              <Input
                value={newProvision}
                onChange={(e) => setNewProvision(e.target.value)}
                placeholder="e.g., Section 24 HMA, Section 125 CrPC"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProvision())}
              />
              <Button type="button" onClick={addProvision} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {metadata.provisions?.map((provision, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeProvision(provision)}>
                  {provision} ×
                </Badge>
              ))}
            </div>
          </div>

          {/* Primary Source */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="primary"
              checked={metadata.primary || false}
              onCheckedChange={(checked) => setMetadata(prev => ({ ...prev, primary: checked as boolean }))}
            />
            <Label htmlFor="primary">Primary source (court judgment vs. secondary commentary)</Label>
          </div>

          {/* Document Text */}
          <div className="space-y-2">
            <Label htmlFor="text">Document Text *</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the full text of the legal document here..."
              className="min-h-[300px] font-mono text-sm"
              required
            />
            <div className="text-sm text-muted-foreground">
              {text.length} characters • Will be chunked into ~{Math.ceil(text.length / 1200)} pieces
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Document...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Ingest Document
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}