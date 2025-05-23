
import React from 'react';
import { Link } from 'react-router-dom';
import { X, User, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetClose
} from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/context/NavigationContext';
import { design } from '@/lib/design-system';

const MobileNavigation: React.FC = () => {
  const { user, userProfile, signOut } = useAuth();
  const { mainItems, resourceItems, currentPath, isMobileMenuOpen, setIsMobileMenuOpen } = useNavigation();
  
  return (
    <div className="md:hidden">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent 
          side="right" 
          className={cn("p-0 border-l border-gray-200 dark:border-gray-800", design.animation.fadeIn)}
          aria-label="Mobile navigation menu"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className={cn(design.text.heading, design.text.sizes.lg)}>
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
            
            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-1 p-4">
                {mainItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={item.name}>
                      <SheetClose asChild>
                        <Link
                          to={item.path}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            currentPath === item.path || currentPath.startsWith(`${item.path}/`)
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800"
                          )}
                        >
                          <IconComponent className="h-5 w-5" aria-hidden="true" />
                          {item.name}
                        </Link>
                      </SheetClose>
                    </li>
                  );
                })}
              </ul>
              
              <div className="mt-2 pt-4 px-4 border-t border-gray-100 dark:border-gray-800">
                <h3 className={cn(design.text.caption, "uppercase tracking-wider text-gray-500 dark:text-gray-400")}>Resources</h3>
                <ul className="mt-2 space-y-1">
                  {resourceItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <li key={item.name}>
                        <SheetClose asChild>
                          <Link
                            to={item.path}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2.5 text-sm transition-colors rounded-md",
                              currentPath === item.path
                                ? "text-blue-700 dark:text-blue-400"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            )}
                          >
                            <IconComponent className="h-4 w-4" aria-hidden="true" />
                            {item.name}
                          </Link>
                        </SheetClose>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>
            
            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
              {user ? (
                <div className="flex flex-col space-y-3">
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className={cn(design.text.body, design.text.sizes.sm, "font-medium")}>{userProfile?.full_name || 'User'}</p>
                    <p className={cn(design.text.caption, "truncate")}>{user.email}</p>
                  </div>
                  <SheetClose asChild>
                    <Link
                      to="/user-profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <User className="h-5 w-5" aria-hidden="true" />
                      My Profile
                    </Link>
                  </SheetClose>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-2" aria-hidden="true" />
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <SheetClose asChild>
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
                    >
                      <LogIn className="h-4 w-4" aria-hidden="true" />
                      <span>Log In</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      to="/signup"
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
                    >
                      <User className="h-4 w-4" aria-hidden="true" />
                      <span>Sign Up</span>
                    </Link>
                  </SheetClose>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
