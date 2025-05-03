
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessagesSquare, Send, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FeedbackDialogProps {
  toolName?: string;
  trigger?: React.ReactNode;
  variant?: 'issue' | 'suggestion' | 'general';
  placement?: 'float' | 'inline';
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ 
  toolName = '',
  trigger,
  variant = 'general',
  placement = 'float'
}) => {
  const [open, setOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');
  const [severity, setSeverity] = useState('normal');
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get error information from localStorage if available (set by error boundaries)
  const errorInfo = React.useMemo(() => {
    try {
      const storedInfo = localStorage.getItem('errorFeedbackInfo');
      if (storedInfo) {
        const info = JSON.parse(storedInfo);
        // Clear it once we've used it
        localStorage.removeItem('errorFeedbackInfo');
        return info;
      }
      return null;
    } catch (e) {
      return null;
    }
  }, []);

  const getTitle = () => {
    switch (variant) {
      case 'issue': return 'Report an Issue';
      case 'suggestion': return 'Suggest an Improvement';
      default: return 'Send Feedback';
    }
  };

  const getDescription = () => {
    switch (variant) {
      case 'issue': 
        return `Help us improve ${toolName || 'this tool'} by reporting any issues you've encountered.`;
      case 'suggestion': 
        return `Share your ideas on how we can make ${toolName || 'this tool'} better.`;
      default: 
        return 'Your feedback helps us improve our legal tools.';
    }
  };

  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
      toast.error('Please enter some feedback text');
      return;
    }
    
    setIsSubmitting(true);
    
    // Gather all feedback data
    const feedbackData = {
      type: variant,
      tool: toolName,
      message: feedbackText,
      email: email || undefined,
      severity,
      rating,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      errorInfo: errorInfo || undefined
    };
    
    try {
      // In a real implementation, you would send this to your API
      console.log('Submitting feedback:', feedbackData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success('Thank you for your feedback!');
      
      // Reset and close
      setFeedbackText('');
      setEmail('');
      setSeverity('normal');
      setRating(null);
      setOpen(false);
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTrigger = () => {
    if (trigger) return trigger;
    
    if (placement === 'float') {
      return (
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            variant="secondary" 
            className="rounded-full h-12 w-12 shadow-lg"
            onClick={() => setOpen(true)}
          >
            <MessagesSquare className="h-5 w-5" />
            <span className="sr-only">Send Feedback</span>
          </Button>
        </div>
      );
    }
    
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2" 
        onClick={() => setOpen(true)}
      >
        <MessagesSquare className="h-4 w-4" />
        Send Feedback
      </Button>
    );
  };

  return (
    <>
      {renderTrigger()}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{getTitle()}</DialogTitle>
            <DialogDescription>{getDescription()}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {variant === 'general' && (
              <div className="space-y-2">
                <p className="text-sm font-medium">How would you rate your experience?</p>
                <div className="flex gap-4">
                  <Button 
                    variant={rating === 1 ? "default" : "outline"} 
                    onClick={() => setRating(1)}
                    className="flex-1 gap-2"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Poor
                  </Button>
                  <Button 
                    variant={rating === 2 ? "default" : "outline"} 
                    onClick={() => setRating(2)}
                    className="flex-1"
                  >
                    Neutral
                  </Button>
                  <Button 
                    variant={rating === 3 ? "default" : "outline"} 
                    onClick={() => setRating(3)}
                    className="flex-1 gap-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Good
                  </Button>
                </div>
              </div>
            )}
            
            {variant === 'issue' && (
              <div className="space-y-2">
                <Label htmlFor="severity">How severe is this issue?</Label>
                <RadioGroup 
                  id="severity" 
                  value={severity} 
                  onValueChange={setSeverity}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minor" id="minor" />
                    <Label htmlFor="minor">Minor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="critical" id="critical" />
                    <Label htmlFor="critical">Critical</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="feedback" className="text-sm">
                {variant === 'issue' 
                  ? 'Please describe the issue you encountered' 
                  : variant === 'suggestion' 
                    ? 'What would you like us to improve?' 
                    : 'Your feedback'}
              </Label>
              <Textarea 
                id="feedback"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Type your feedback here..."
                className="min-h-[120px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email (optional)</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Provide your email if you'd like us to follow up with you.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">○</span>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Feedback
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedbackDialog;
