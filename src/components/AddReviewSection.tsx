
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Star, Send, X, MessageSquare, Heart } from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const AddReviewSection = () => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [comment, setComment] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim() || !role.trim() || !comment.trim() || rating === 0) {
      toast.error("Please fill all fields and provide a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You need to be signed in to submit a review");
        // Redirect to login page or handle accordingly
        setIsSubmitting(false);
        setIsDialogOpen(false);
        // You might want to add login redirection here
        return;
      }

      // Add review to database
      const { error } = await supabase
        .from('user_reviews')
        .insert({
          user_id: session.user.id,
          name,
          role,
          rating,
          comment,
        });

      if (error) {
        console.error("Error submitting review:", error);
        toast.error("Failed to submit review. Please try again.");
        setIsSubmitting(false);
        return;
      }
      
      // Success message
      toast.success("Thank you for your review!");
      
      // Reset form
      setName('');
      setRole('');
      setComment('');
      setRating(0);
      setIsDialogOpen(false);
      
      // Refresh the reviews section
      window.location.reload();
    } catch (error) {
      console.error("Error in submit process:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10 mb-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-6 rounded-xl shadow-lg border border-indigo-100/60 dark:border-indigo-800/30"
      >
        <div className="mb-4">
          <Heart className="w-12 h-12 mx-auto text-pink-500 mb-3" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white font-playfair">Share Your Experience</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
            Help us improve by sharing your feedback with the VakilGPT community
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-legal-accent to-purple-600 hover:from-legal-accent/90 hover:to-purple-600/90 text-white border-none shadow-md hover:shadow-xl transition-all px-8 py-6 mt-2 w-full"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Write a Review
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px] bg-white/95 dark:bg-legal-slate/95 backdrop-blur-lg border-legal-border/40 dark:border-legal-slate/20 shadow-xl">
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
                    className="p-1 focus:outline-none transform transition-all duration-200 hover:scale-125"
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
                  className="w-full bg-gray-50/80 dark:bg-gray-800/50 border-indigo-100 dark:border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  placeholder="Your Role (e.g. Corporate Lawyer)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-gray-50/80 dark:bg-gray-800/50 border-indigo-100 dark:border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Textarea
                  placeholder="Share your experience with VakilGPT..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full min-h-[120px] bg-gray-50/80 dark:bg-gray-800/50 border-indigo-100 dark:border-gray-700"
                />
              </div>
              
              <DialogFooter className="mt-6 gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="border-indigo-200 dark:border-gray-700">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </DialogClose>
                
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-legal-accent to-purple-600 hover:from-legal-accent/90 hover:to-purple-600/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Review
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default AddReviewSection;
