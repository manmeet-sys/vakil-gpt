
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Star, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const AddReviewSection = () => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [comment, setComment] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim() || !role.trim() || !comment.trim() || rating === 0) {
      toast.error("Please fill all fields and provide a rating");
      return;
    }

    // In a real app, this would send data to a backend
    console.log({ name, role, comment, rating });
    
    // Success message
    toast.success("Thank you for your review!");
    
    // Reset form
    setName('');
    setRole('');
    setComment('');
    setRating(0);
    setIsDialogOpen(false);
  };

  return (
    <div className="mt-16 text-center">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            className="bg-white hover:bg-white/90 text-legal-accent border border-legal-accent/30 shadow-sm hover:shadow-md transition-all px-8 py-6"
          >
            <Star className="mr-2 h-5 w-5 text-yellow-400 fill-yellow-400" />
            Share Your Experience
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-legal-slate/90 backdrop-blur-lg border-legal-border/40 dark:border-legal-slate/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair font-bold text-center text-legal-slate dark:text-white">
              Share Your Experience
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitReview} className="space-y-4 mt-4">
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 focus:outline-none"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star 
                    className={`w-8 h-8 transition-all duration-200 
                      ${(hoverRating || rating) >= star 
                        ? 'text-yellow-400 fill-yellow-400 scale-110' 
                        : 'text-gray-300'}`} 
                  />
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              <Input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Input
                placeholder="Your Role (e.g. Corporate Lawyer)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Textarea
                placeholder="Share your experience with VakilGPT..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full min-h-[120px]"
              />
            </div>
            
            <DialogFooter className="mt-6 gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </DialogClose>
              
              <Button 
                type="submit" 
                className="bg-legal-accent hover:bg-legal-accent/90"
              >
                <Send className="mr-2 h-4 w-4" />
                Submit Review
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddReviewSection;
