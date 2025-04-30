import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Case } from '@/pages/case-management';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import { CalendarDate } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner';
import { File, Copy, Download, Edit, Trash2, Bell } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Link } from 'react-router-dom';

interface CaseDetailsProps {
  caseData: Case;
  onCaseUpdated: (updatedCase: Case) => void;
  onCaseDeleted: (caseId: string) => void;
}

const CaseDetails: React.FC<CaseDetailsProps> = ({ caseData, onCaseUpdated, onCaseDeleted }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCase, setEditedCase] = useState<Case>(caseData);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    caseData.hearing_date ? new Date(caseData.hearing_date) : undefined
  );

  useEffect(() => {
    setEditedCase(caseData);
    setSelectedDate(caseData.hearing_date ? new Date(caseData.hearing_date) : undefined);
  }, [caseData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedCase((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setEditedCase((prev) => ({ ...prev, hearing_date: date ? date.toISOString() : null }));
  };

  const handleUpdateCase = async () => {
    try {
      const { data, error } = await supabase
        .from('court_filings')
        .update(editedCase)
        .eq('id', caseData.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      onCaseUpdated(data as Case);
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating case:', error.message);
      toast.error('Failed to update case. Please try again.');
    }
  };

  const handleDeleteCase = async () => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        const { error } = await supabase
          .from('court_filings')
          .delete()
          .eq('id', caseData.id);

        if (error) {
          throw error;
        }

        onCaseDeleted(caseData.id);
        navigate('/case-management');
      } catch (error: any) {
        console.error('Error deleting case:', error.message);
        toast.error('Failed to delete case. Please try again.');
      }
    }
  };

  const handleCopyCaseDetails = () => {
    const caseDetailsText = `
      Case Title: ${caseData.case_title || ''}
      Case Number: ${caseData.case_number || ''}
      Client Name: ${caseData.client_name || ''}
      Court Name: ${caseData.court_name || ''}
      Filing Date: ${caseData.filing_date ? new Date(caseData.filing_date).toLocaleDateString() : ''}
      Hearing Date: ${caseData.hearing_date ? new Date(caseData.hearing_date).toLocaleDateString() : ''}
      Status: ${caseData.status || ''}
      Description: ${caseData.description || ''}
    `;

    navigator.clipboard.writeText(caseDetailsText);
    toast.success('Case details copied to clipboard!');
  };

  const handleDownloadCaseDetails = () => {
    const caseDetailsText = `
      Case Title: ${caseData.case_title || ''}
      Case Number: ${caseData.case_number || ''}
      Client Name: ${caseData.client_name || ''}
      Court Name: ${caseData.court_name || ''}
      Filing Date: ${caseData.filing_date ? new Date(caseData.filing_date).toLocaleDateString() : ''}
      Hearing Date: ${caseData.hearing_date ? new Date(caseData.hearing_date).toLocaleDateString() : ''}
      Status: ${caseData.status || ''}
      Description: ${caseData.description || ''}
    `;

    const element = document.createElement('a');
    const file = new Blob([caseDetailsText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${caseData.case_title?.replace(/\s+/g, '_').toLowerCase() || 'case_details'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Case details downloaded successfully!');
  };

  // Add this new method to the CaseDetails component to send status updates to clients
  const sendStatusUpdate = async (caseData: Case) => {
    try {
      if (!caseData.client_id) {
        toast.error('No client associated with this case');
        return;
      }
      
      const message = `Your case "${caseData.case_title}" status has been updated to "${caseData.status}".`;
      
      const { data, error } = await supabase
        .from('case_status_updates')
        .insert([{
          client_id: caseData.client_id,
          case_id: caseData.id,
          case_title: caseData.case_title,
          status: caseData.status,
          message: message,
          is_read: false
        }])
        .select();
        
      if (error) throw error;
      
      toast.success('Status update sent to client');
      
    } catch (error) {
      console.error('Error sending status update:', error);
      toast.error('Failed to send status update');
    }
  };

  return (
    <Card className="shadow-md border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-b border-gray-200 dark:border-gray-700">
        <div>
          <CardTitle className="text-xl">{caseData.case_title || 'Case Details'}</CardTitle>
          <CardDescription>View and manage case information</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Case
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyCaseDetails}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadCaseDetails}>
              <Download className="h-4 w-4 mr-2" />
              Download Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => sendStatusUpdate(caseData)}>
              <Bell className="h-4 w-4 mr-2" />
              Send Status Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteCase}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Case
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="case_title">Case Title</Label>
                <Input
                  type="text"
                  id="case_title"
                  name="case_title"
                  value={editedCase.case_title || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="case_number">Case Number</Label>
                <Input
                  type="text"
                  id="case_number"
                  name="case_number"
                  value={editedCase.case_number || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="client_name">Client Name</Label>
                <Input
                  type="text"
                  id="client_name"
                  name="client_name"
                  value={editedCase.client_name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="court_name">Court Name</Label>
                <Input
                  type="text"
                  id="court_name"
                  name="court_name"
                  value={editedCase.court_name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Input
                  type="text"
                  id="status"
                  name="status"
                  value={editedCase.status || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="opposing_party">Opposing Party</Label>
                <Input
                  type="text"
                  id="opposing_party"
                  name="opposing_party"
                  value={editedCase.opposing_party || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="filing_date">Filing Date</Label>
                <Input
                  type="text"
                  id="filing_date"
                  name="filing_date"
                  value={editedCase.filing_date || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="hearing_date">Hearing Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarDate
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      disabled={(date) =>
                        date > new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={editedCase.description || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCase}>Update Case</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Case Title</div>
                <div className="text-gray-600 dark:text-gray-400">{caseData.case_title || '—'}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Case Number</div>
                <div className="text-gray-600 dark:text-gray-400">{caseData.case_number || '—'}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Client Name</div>
                <div className="text-gray-600 dark:text-gray-400">{caseData.client_name || '—'}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Court Name</div>
                <div className="text-gray-600 dark:text-gray-400">{caseData.court_name || '—'}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Status</div>
                <div>
                  <Badge variant={
                      caseData.status === "active"
                        ? "default"
                        : caseData.status === "pending"
                        ? "secondary"
                        : caseData.status === "scheduled"
                        ? "outline"
                        : "secondary"
                    }>
                    {caseData.status || '—'}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Opposing Party</div>
                <div className="text-gray-600 dark:text-gray-400">{caseData.opposing_party || '—'}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Filing Date</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {caseData.filing_date ? new Date(caseData.filing_date).toLocaleDateString() : '—'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Hearing Date</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {caseData.hearing_date ? new Date(caseData.hearing_date).toLocaleDateString() : '—'}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Description</div>
              <div className="text-gray-600 dark:text-gray-400">{caseData.description || '—'}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CaseDetails;
