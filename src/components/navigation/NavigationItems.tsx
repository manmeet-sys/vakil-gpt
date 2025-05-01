
import React from 'react';
import { Book, BookOpen, Settings, Bell } from 'lucide-react';

export interface NavigationItem {
  name: string;
  path: string;
  icon: React.FC<{ className?: string }>;
  current?: boolean;
}

export const mainNavigationItems = (currentPath: string): NavigationItem[] => [
  { 
    name: 'Tools', 
    path: '/tools', 
    icon: Settings,
    current: currentPath === '/tools' || currentPath.startsWith('/tools/'),
  },
  { 
    name: 'Legal Chat', 
    path: '/chat', 
    icon: Bell,
    current: currentPath === '/chat' || currentPath.startsWith('/chat/'),
  },
  { 
    name: 'Knowledge', 
    path: '/knowledge', 
    icon: BookOpen,
    current: currentPath === '/knowledge' || currentPath.startsWith('/knowledge/'),
  },
  {
    name: "Practice Areas",
    path: "/practice-areas",
    icon: Book,
    current: currentPath === "/practice-areas" || currentPath.startsWith('/practice-areas/'),
  },
];

export interface ResourceNavigationItem {
  name: string;
  path: string;
  icon: React.FC<{ className?: string }>;
}

export const resourceNavigationItems: ResourceNavigationItem[] = [
  { name: 'Blog', path: '/blog', icon: Book },
  { name: 'Guides', path: '/guides', icon: BookOpen },
  { name: 'FAQ', path: '/faq', icon: BookOpen },
  { name: 'Terms of Service', path: '/terms-of-service', icon: BookOpen },
  { name: 'Privacy Policy', path: '/privacy-policy', icon: BookOpen },
];

export default mainNavigationItems;
