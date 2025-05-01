
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  FileText,
  Shield,
  MessageSquare,
  Bell,
  Upload,
  Calendar,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClientNavProps {
  unreadCount?: number;
}

const ClientPortalNav = ({ unreadCount = 0 }: ClientNavProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col space-y-1 w-full">
      <Link to="/client-portal">
        <Button
          variant={isActive('/client-portal') ? 'secondary' : 'ghost'}
          className={cn(
            'w-full justify-start',
            isActive('/client-portal') ? 'bg-accent' : ''
          )}
          size="sm"
        >
          <FileText className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
      </Link>
      
      <Link to="/client-portal/documents">
        <Button
          variant={isActive('/client-portal/documents') ? 'secondary' : 'ghost'}
          className={cn(
            'w-full justify-start',
            isActive('/client-portal/documents') ? 'bg-accent' : ''
          )}
          size="sm"
        >
          <Shield className="mr-2 h-4 w-4" />
          Documents
        </Button>
      </Link>
      
      <Link to="/client-portal/messages">
        <Button
          variant={isActive('/client-portal/messages') ? 'secondary' : 'ghost'}
          className={cn(
            'w-full justify-start',
            isActive('/client-portal/messages') ? 'bg-accent' : ''
          )}
          size="sm"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Messages
        </Button>
      </Link>
      
      <Link to="/client-portal/updates">
        <Button
          variant={isActive('/client-portal/updates') ? 'secondary' : 'ghost'}
          className={cn(
            'w-full justify-start',
            isActive('/client-portal/updates') ? 'bg-accent' : ''
          )}
          size="sm"
        >
          <Bell className="mr-2 h-4 w-4" />
          Updates
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="ml-auto h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </Link>
      
      <Link to="/client-portal/upload">
        <Button
          variant={isActive('/client-portal/upload') ? 'secondary' : 'ghost'}
          className={cn(
            'w-full justify-start',
            isActive('/client-portal/upload') ? 'bg-accent' : ''
          )}
          size="sm"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </Link>
      
      <Link to="/client-portal/calendar">
        <Button
          variant={isActive('/client-portal/calendar') ? 'secondary' : 'ghost'}
          className={cn(
            'w-full justify-start',
            isActive('/client-portal/calendar') ? 'bg-accent' : ''
          )}
          size="sm"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Calendar
        </Button>
      </Link>
    </div>
  );
};

export default ClientPortalNav;
