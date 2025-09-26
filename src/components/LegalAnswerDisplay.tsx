import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scale, FileText, ExternalLink, CheckCircle, XCircle, Minus, AlertTriangle, ArrowRight } from 'lucide-react';

interface LegalAuthority {
  court?: string;
  year?: number;
  title: string;
  pinpoint?: string;
  holding: string;
  why_relevant?: string;
  primary: boolean;
}

interface ApplicabilityItem {
  proposition: string;
  supports_user: boolean;
  because?: string;
}

interface LegalAnswer {
  issue: {
    partySeeking: string;
    partyResponding?: string;
    relief: string;
    forum: string;
    provisions?: string[];
  };
  answer: {
    short: string;
    long?: string;
  };
  authorities: LegalAuthority[];
  applicability_grid?: ApplicabilityItem[];
  missing_facts?: string[];
  next_steps?: string[];
  confidence?: number;
}

interface LegalAnswerDisplayProps {
  answer: LegalAnswer;
  onCitationClick?: (authority: LegalAuthority) => void;
}

export function LegalAnswerDisplay({ answer, onCitationClick }: LegalAnswerDisplayProps) {
  const confidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-500';
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSupportIcon = (supports: boolean) => {
    return supports ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Issue Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Legal Issue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Party Seeking:</span> {answer.issue.partySeeking}
            </div>
            <div>
              <span className="font-medium">Relief:</span> {answer.issue.relief}
            </div>
            <div>
              <span className="font-medium">Forum:</span> {answer.issue.forum}
            </div>
            {answer.issue.provisions && answer.issue.provisions.length > 0 && (
              <div className="col-span-full">
                <span className="font-medium">Provisions:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {answer.issue.provisions.map((provision, index) => (
                    <Badge key={index} variant="outline">{provision}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Answer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Legal Analysis</span>
            {answer.confidence !== undefined && (
              <Badge variant="outline" className={confidenceColor(answer.confidence)}>
                {Math.round(answer.confidence * 100)}% confidence
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-lg font-medium mb-4">{answer.answer.short}</p>
            {answer.answer.long && (
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {answer.answer.long}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Authorities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Legal Authorities ({answer.authorities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case/Source</TableHead>
                <TableHead>Court & Year</TableHead>
                <TableHead>Holding</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {answer.authorities.map((authority, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="font-medium">{authority.title}</div>
                    {authority.pinpoint && (
                      <div className="text-sm text-gray-500">Para: {authority.pinpoint}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>{authority.court || 'Not specified'}</div>
                    {authority.year && (
                      <div className="text-sm text-gray-500">{authority.year}</div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm">{authority.holding}</div>
                    {authority.why_relevant && (
                      <div className="text-xs text-gray-500 mt-1">
                        <strong>Relevance:</strong> {authority.why_relevant}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={authority.primary ? "default" : "secondary"}
                      className={authority.primary ? "bg-blue-600" : ""}
                    >
                      {authority.primary ? "Primary" : "Secondary"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCitationClick?.(authority)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Applicability Grid */}
      {answer.applicability_grid && answer.applicability_grid.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>How These Cases Apply to Your Situation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {answer.applicability_grid.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getSupportIcon(item.supports_user)}
                  <div className="flex-1">
                    <div className="font-medium">{item.proposition}</div>
                    {item.because && (
                      <div className="text-sm text-gray-600 mt-1">{item.because}</div>
                    )}
                  </div>
                  <Badge variant={item.supports_user ? "default" : "destructive"}>
                    {item.supports_user ? "Supports" : "Against"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Missing Facts Alert */}
      {answer.missing_facts && answer.missing_facts.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <div className="font-medium text-yellow-800 mb-2">Additional Information Needed</div>
            <ul className="text-sm text-yellow-700 space-y-1">
              {answer.missing_facts.map((fact, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Minus className="h-3 w-3" />
                  {fact.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Next Steps */}
      {answer.next_steps && answer.next_steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Recommended Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {answer.next_steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="text-sm">{step}</div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}