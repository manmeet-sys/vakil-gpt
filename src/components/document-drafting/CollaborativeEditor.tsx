
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Users, Save, UserPlus, MessageCircle, Clock, History, X } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface CollaboratorType {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  isOnline: boolean;
  lastActive?: Date;
}

interface CollaborativeEditorProps {
  documentId?: string;
  initialContent: string;
  onChange: (content: string) => void;
  title: string;
  documentType: string;
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  documentId,
  initialContent,
  onChange,
  title,
  documentType
}) => {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [collaborators, setCollaborators] = useState<CollaboratorType[]>([
    {
      id: '1',
      name: 'You',
      role: 'Owner',
      isOnline: true,
    },
  ]);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [showActivityLog, setShowActivityLog] = useState(false);
  
  // Simulate typing activity with other collaborators
  useEffect(() => {
    if (documentId && collaborators.length > 1) {
      const interval = setInterval(() => {
        // Simulate activity from another collaborator
        if (Math.random() > 0.7) {
          toast.info(`${collaborators[1].name} is editing the document...`, {
            duration: 2000,
          });
        }
      }, 30000); // Every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [collaborators, documentId]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onChange(e.target.value);
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate saving to database/storage
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Document saved successfully');
    }, 800);
  };

  const handleInviteCollaborator = () => {
    if (!inviteEmail) return;
    
    // In a real app, this would send an invitation via email
    const newCollaborator: CollaboratorType = {
      id: (collaborators.length + 1).toString(),
      name: inviteEmail.split('@')[0],
      role: inviteRole,
      isOnline: false,
      lastActive: new Date()
    };
    
    setCollaborators([...collaborators, newCollaborator]);
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setShowInviteDialog(false);
  };

  const activityLog = [
    { user: 'You', action: 'created document', timestamp: new Date(Date.now() - 3600000 * 2) },
    { user: 'You', action: 'edited content', timestamp: new Date(Date.now() - 3600000) },
    { user: 'System', action: 'auto-saved document', timestamp: new Date(Date.now() - 1800000) },
    { user: 'You', action: 'invited Rahul', timestamp: new Date(Date.now() - 900000) },
  ];

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h3 className="font-medium text-sm">{title || 'Untitled Document'}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {documentType || 'Legal Document'}
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Last edited just now
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline"
            className="text-xs flex items-center gap-1"
            onClick={() => setShowActivityLog(!showActivityLog)}
          >
            <History className="h-3 w-3" />
            Activity
          </Button>
          
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-xs flex items-center gap-1">
                <UserPlus className="h-3 w-3" />
                Invite
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Invite Collaborators</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Permission Level
                  </label>
                  <select 
                    id="role" 
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                  >
                    <option value="Viewer">Can View</option>
                    <option value="Editor">Can Edit</option>
                  </select>
                </div>
                <Button onClick={handleInviteCollaborator} disabled={!inviteEmail}>
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
            className="text-xs"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3 w-3 mr-1" />
                Save
              </>
            )}
          </Button>
          
          <div className="flex -space-x-2">
            {collaborators.map((collaborator) => (
              <TooltipProvider key={collaborator.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className={`h-6 w-6 border-2 ${collaborator.isOnline ? 'border-green-500' : 'border-gray-200 dark:border-gray-700'}`}>
                      {collaborator.avatarUrl && <AvatarImage src={collaborator.avatarUrl} />}
                      <AvatarFallback className="text-xs">
                        {collaborator.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {collaborator.name} ({collaborator.role})
                      <span className="block">
                        {collaborator.isOnline 
                          ? 'Currently online' 
                          : collaborator.lastActive 
                            ? `Last active ${formatTimeAgo(collaborator.lastActive)}` 
                            : 'Offline'}
                      </span>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {collaborators.length > 3 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-6 w-6 border-2 border-gray-200 dark:border-gray-700">
                      <AvatarFallback className="text-xs">+{collaborators.length - 3}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{collaborators.length - 3} more collaborators</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
      
      <div className="relative">
        <Textarea
          value={content}
          onChange={handleContentChange}
          className="min-h-[400px] p-4 rounded-none border-0 focus:ring-0 resize-none font-mono text-sm"
          placeholder="Start typing your legal document..."
        />
        
        {showActivityLog && (
          <div className="absolute top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
            <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h4 className="font-medium text-sm">Activity Log</h4>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0"
                onClick={() => setShowActivityLog(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-3 space-y-3">
              {activityLog.map((activity, idx) => (
                <div key={idx} className="border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{activity.user}</span>
                    <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{activity.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="text-xs">
            <MessageCircle className="h-3 w-3 mr-1" /> Comments
          </Button>
        </div>
        
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="text-xs">
            <Clock className="h-3 w-3 mr-1" /> Auto-saving
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center ml-2">
                  <Users className="h-3 w-3 text-blue-500 mr-1" />
                  <span className="text-xs text-blue-500">{collaborators.filter(c => c.isOnline).length} online</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {collaborators.filter(c => c.isOnline).length} people currently viewing this document
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeEditor;
