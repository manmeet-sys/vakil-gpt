
import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import UserMenuButton from './UserMenuButton';

interface AuthButtonsProps {
  isMobile?: boolean;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ isMobile = false }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <UserMenuButton />;
  }
  
  if (isMobile) {
    return null; // Mobile buttons are handled in the mobile menu
  }
  
  return (
    <div className="flex items-center space-x-2">
      <Link to="/login">
        <Button variant="ghost" className="text-legal-slate dark:text-white/90">
          Log in
        </Button>
      </Link>
      <Link to="/signup">
        <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white">
          Sign up
        </Button>
      </Link>
    </div>
  );
};

export default AuthButtons;
