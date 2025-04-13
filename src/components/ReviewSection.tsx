
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Corporate Lawyer",
    rating: 5,
    comment: "VakilGPT has revolutionized how I approach legal research. The AI tools have helped me save countless hours on case preparation.",
    date: "2 weeks ago"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Tax Consultant",
    rating: 4,
    comment: "The compliance tools are exceptional. I've been able to keep my clients updated with the latest regulatory changes effortlessly.",
    date: "1 month ago"
  },
  {
    id: 3,
    name: "Anika Patel",
    role: "Litigation Attorney",
    rating: 5,
    comment: "Document analysis has never been easier. VakilGPT identifies key clauses and potential issues faster than any associate could.",
    date: "3 weeks ago"
  }
];

const ReviewSection = () => {
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newReview.trim() === '') {
      toast.error('Please write a review comment');
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    // In a real application, you would send this to your backend
    toast.success('Thank you for your review!');
    setNewReview('');
    setRating(0);
  };
  
  return (
    <section className="py-16 px-4 bg-white dark:bg-legal-slate/5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 bg-gradient-to-l from-legal-accent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full opacity-5 bg-gradient-to-r from-purple-600 to-transparent pointer-events-none" />
      
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-legal-accent/10 text-legal-accent mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-medium">Client Experiences</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-legal-slate dark:text-white mb-4 tracking-tight font-playfair"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            What <span className="text-legal-accent">Legal Professionals</span> Are Saying
          </motion.h2>
          
          <motion.p 
            className="text-legal-muted dark:text-gray-300 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Read what Indian legal practitioners have experienced with our AI-powered tools
          </motion.p>
        </div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {reviews.map((review) => (
            <motion.div key={review.id} variants={itemVariants}>
              <Card className="h-full border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10 shadow-elegant hover:shadow-elevated transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-legal-accent/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-legal-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-legal-slate dark:text-white text-lg">{review.name}</CardTitle>
                        <p className="text-legal-muted text-sm">{review.role}</p>
                      </div>
                    </div>
                    <span className="text-xs text-legal-muted">{review.date}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-legal-slate/80 dark:text-gray-300">"{review.comment}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Card className="border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10 shadow-elegant overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-legal-accent/5 to-purple-600/5 border-b border-legal-border dark:border-legal-slate/20">
              <CardTitle className="text-xl font-playfair text-legal-slate dark:text-white">Share Your Experience</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmitReview}>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <label className="block text-legal-slate dark:text-white mb-2 text-sm font-medium">Your Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-6 h-6 cursor-pointer transition-colors ${
                          star <= (hoveredRating || rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="review" className="block text-legal-slate dark:text-white mb-2 text-sm font-medium">Your Review</label>
                  <Textarea
                    id="review"
                    placeholder="Share your experience with VakilGPT..."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    className="min-h-[120px] bg-white dark:bg-legal-slate/20"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-legal-border dark:border-legal-slate/20 bg-legal-light/30 dark:bg-legal-slate/10">
                <Button type="submit" className="bg-legal-accent hover:bg-legal-accent/90 text-white ml-auto group">
                  Submit Review
                  <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewSection;
