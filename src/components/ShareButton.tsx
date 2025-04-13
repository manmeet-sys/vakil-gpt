
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon"; // Added size property to match Button component
}

const ShareButton = ({ 
  url = window.location.href,
  title = "VakilGPT - AI-Powered Legal Assistance",
  description = "Advanced legal assistance powered by artificial intelligence",
  className = "",
  variant = "outline",
  size = "default" // Default size
}: ShareButtonProps) => {
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: description,
          url
        });
        toast.success("Shared successfully");
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share");
    }
  };

  return (
    <Button 
      onClick={handleShare} 
      variant={variant}
      size={size}
      className={className}
    >
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  );
};

export default ShareButton;
