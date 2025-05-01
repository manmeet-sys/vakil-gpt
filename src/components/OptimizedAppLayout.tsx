
import React, { lazy, Suspense } from 'react';
import { ThemeToggle } from './ThemeToggle';
import BackButton from './BackButton';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, LogOut, User, Menu, X, Book, BookOpen, Settings, Bell, Cog } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

// Lazy loaded sheet component
const Sheet = lazy(() => import('@/components/ui/sheet').then(module => ({ 
  default: module.Sheet 
})));

const SheetContent = lazy(() => import('@/components/ui/sheet').then(module => ({ 
  default: module.SheetContent 
})));

const SheetTrigger = lazy(() => import('@/components/ui/sheet').then(module => ({ 
  default: module.SheetTrigger 
})));

const SheetClose = lazy(() => import('@/components/ui/sheet').then(module => ({ 
  default: module.SheetClose 
})));

interface AppLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  path: string;
  icon: React.FC<{ className?: string }>;
  current?: boolean;
}

const MobileSheetFallback = () => (
  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
    <Menu className="h-5 w-5" />
    <span className="sr-only">Loading menu...</span>
  </Button>
);

const OptimizedAppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/reset-password';
  const { user, signOut, userProfile } = useAuth();

  const mainNavigationItems: NavigationItem[] = [
    { name: 'Tools', path: '/tools', icon: Settings },
    { name: 'Legal Chat', path: '/chat', icon: Bell },
    { name: 'Knowledge', path: '/knowledge', icon: BookOpen },
    {
      name: "Practice Areas",
      path: "/practice-areas",
      icon: Book,
      current: location.pathname === "/practice-areas",
    },
  ];
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-zinc-700/50 py-3 px-4 backdrop-blur-sm bg-white/90 dark:bg-zinc-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-semibold text-gray-800 dark:text-white flex items-center"
            >
              VakilGPT
              <span className="text-orange-500 text-xs font-medium ml-1">IN</span>
              <Badge variant="outline" className="ml-1.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full border-blue-200 dark:border-blue-800/50">
                BETA
              </Badge>
            </motion.h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6 ml-8">
            {mainNavigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link 
                  key={item.name}
                  to={item.path} 
                  className={cn(
                    "text-sm font-medium flex items-center gap-1.5 transition-colors", 
                    location.pathname === item.path || location.pathname.startsWith(`${item.path}/`) 
                      ? "text-legal-accent dark:text-legal-accent" 
                      : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  )}
                >
                  <IconComponent className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isAuthPage ? (
            <Link 
              to={location.pathname === '/login' ? '/signup' : '/login'} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
            >
              <LogIn className="h-4 w-4" />
              <span>{location.pathname === '/login' ? 'Sign Up' : 'Log In'}</span>
            </Link>
          ) : (
            <>
              {user ? (
                <>
                  <Link
                    to="/settings"
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    <Cog className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={userProfile?.avatar_url || ''} alt={userProfile?.full_name || 'User'} />
                          <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                            {userProfile?.full_name 
                              ? userProfile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                              : user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{userProfile?.full_name || 'User'}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/user-profile" className="cursor-pointer flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="cursor-pointer flex items-center">
                          <Cog className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-red-500 dark:text-red-400 focus:text-red-500 dark:focus:text-red-400"
                        onClick={() => signOut()}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Log In</span>
                  </Link>
                  <Link 
                    to="/signup" 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    <User className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </>
          )}
          <ThemeToggle />
          
          {/* Mobile Navigation Menu - Lazy loaded */}
          <div className="md:hidden">
            <Suspense fallback={<MobileSheetFallback />}>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[350px] border-l border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                      <h2 className="text-lg font-semibold">
                        Menu
                        <Badge variant="outline" className="ml-2 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full">
                          BETA
                        </Badge>
                      </h2>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <X className="h-4 w-4" />
                          <span className="sr-only">Close</span>
                        </Button>
                      </SheetClose>
                    </div>
                    
                    <nav className="flex-1 pt-4">
                      <ul className="space-y-2">
                        {mainNavigationItems.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <li key={item.name}>
                              <SheetClose asChild>
                                <Link
                                  to={item.path}
                                  className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                                  )}
                                >
                                  <IconComponent className="h-5 w-5" />
                                  {item.name}
                                </Link>
                              </SheetClose>
                            </li>
                          );
                        })}
                        
                        {user && (
                          <li>
                            <SheetClose asChild>
                              <Link
                                to="/settings"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                              >
                                <Cog className="h-5 w-5" />
                                Settings
                              </Link>
                            </SheetClose>
                          </li>
                        )}
                      </ul>
                    </nav>
                    
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      {user ? (
                        <div className="flex flex-col space-y-3">
                          <div className="px-4 py-2">
                            <p className="text-sm font-medium">{userProfile?.full_name || 'User'}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                          <SheetClose asChild>
                            <Link
                              to="/user-profile"
                              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <User className="h-5 w-5" />
                              My Profile
                            </Link>
                          </SheetClose>
                          <Button
                            variant="outline"
                            className="mx-4 justify-start"
                            onClick={() => signOut()}
                          >
                            <LogOut className="h-5 w-5 mr-2" />
                            Log out
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-3 px-4">
                          <SheetClose asChild>
                            <Link
                              to="/login"
                              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
                            >
                              <LogIn className="h-4 w-4" />
                              <span>Log In</span>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              to="/signup"
                              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
                            >
                              <User className="h-4 w-4" />
                              <span>Sign Up</span>
                            </Link>
                          </SheetClose>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </Suspense>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col py-6 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default OptimizedAppLayout;
