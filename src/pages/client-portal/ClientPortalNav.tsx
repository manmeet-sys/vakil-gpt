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
import { useAuth } from '@/context/AuthContext';

interface AdvocateNavProps {
  unreadCount?: number;
}

const AdvocatePortalNav = ({ unreadCount = 0 }: AdvocateNavProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path: string) => location.pathname === path;
  
  // Define navigation items with path and icon
  const navItems = [
    { path: '/client-portal', label: 'Dashboard', icon: FileText },
    { path: '/client-portal/documents', label: 'Documents', icon: Shield },
    { path: '/client-portal/messages', label: 'Messages', icon: MessageSquare },
    { 
      path: '/client-portal/updates', 
      label: 'Updates', 
      icon: Bell, 
      badge: unreadCount > 0 ? unreadCount : undefined 
    },
    { path: '/client-portal/upload', label: 'Upload', icon: Upload },
    { path: '/client-portal/calendar', label: 'Calendar', icon: Calendar },
  ];

  if (!user) {
    return null; // Don't render navigation if user is not logged in
  }

  return (
    <div className="flex flex-col space-y-1 w-full">
      {navItems.map(item => (
        <Link key={item.path} to={item.path}>
          <Button
            variant={isActive(item.path) ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start',
              isActive(item.path) ? 'bg-accent' : ''
            )}
            size="sm"
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
            {item.badge && (
              <Badge
                variant="destructive"
                className="ml-auto h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]"
              >
                {item.badge}
              </Badge>
            )}
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default AdvocatePortalNav;
