
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, User, Filter, Clock, ThumbsUp, ChevronDown, CheckSquare, ArrowDownAZ } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import ShareButton from '@/components/ShareButton';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import AddReviewSection from './AddReviewSection';
import { supabase } from '@/integrations/supabase/client';
import { UserReview } from '@/types/UserReviews';

interface Review extends UserReview {
  date?: string;
}

const ReviewSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('user_reviews')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching reviews:", error);
          toast.error("Failed to load reviews");
          return;
        }
        
        const formattedReviews: Review[] = (data || []).map(review => ({
          id: review.id,
          user_id: review.user_id,
          name: review.name,
          role: review.role,
          rating: review.rating,
          comment: review.comment,
          date: formatDate(review.created_at),
          helpful_count: review.helpful_count,
          created_at: review.created_at
        }));
        
        setReviews(formattedReviews);
        setFilteredReviews(formattedReviews);
      } catch (error) {
        console.error("Error in fetch process:", error);
        toast.error("Something went wrong loading reviews");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    
    if (diffInDays < 1) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }
  };

  useEffect(() => {
    let result = [...reviews];
    
    if (filterRating !== null) {
      result = result.filter(review => review.rating === filterRating);
    }
    
    switch(sortOption) {
      case 'newest':
        result = [...result].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'oldest':
        result = [...result].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateA - dateB;
        });
        break;
      case 'highest':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        result = [...result].sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        result = [...result].sort((a, b) => b.helpful_count - a.helpful_count);
        break;
    }
    
    setFilteredReviews(result);
  }, [reviews, filterRating, sortOption]);

  const toggleExpandReview = (id: string) => {
    setExpandedReviews(prev => 
      prev.includes(id) ? prev.filter(reviewId => reviewId !== id) : [...prev, id]
    );
  };
  
  const markHelpful = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You need to be signed in to mark a review as helpful");
        return;
      }
      
      const reviewToUpdate = reviews.find(r => r.id === id);
      if (!reviewToUpdate) return;
      
      const { error } = await supabase
        .from('user_reviews')
        .update({ helpful_count: reviewToUpdate.helpful_count + 1 })
        .eq('id', id);
      
      if (error) {
        console.error("Error updating helpful count:", error);
        toast.error("Failed to mark review as helpful");
        return;
      }
      
      setReviews(prev => 
        prev.map(review => 
          review.id === id 
            ? { ...review, helpful_count: review.helpful_count + 1 } 
            : review
        )
      );
      
      toast.success("Thank you for your feedback!");
    } catch (error) {
      console.error("Error marking review as helpful:", error);
      toast.error("Something went wrong");
    }
  };

  const clearFilters = () => {
    setFilterRating(null);
    setSortOption('newest');
  };
  
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-blue-950/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 bg-gradient-to-l from-purple-500 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full opacity-20 bg-gradient-to-r from-blue-500 to-transparent pointer-events-none" />
      
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-legal-accent/20 to-purple-500/20 text-legal-accent mb-4"
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
            What <span className="bg-gradient-to-r from-legal-accent to-purple-600 bg-clip-text text-transparent">Legal Professionals</span> Are Saying
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

        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white/80 dark:bg-legal-slate/30 backdrop-blur-sm rounded-lg border border-indigo-200/60 dark:border-legal-slate/30 shadow-md">
            <div className="flex items-center gap-3 flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white dark:bg-legal-slate/40 border-indigo-200 dark:border-legal-slate/40">
                    <Filter className="h-4 w-4" />
                    Filter by Rating
                    {filterRating && <span className="ml-1 bg-gradient-to-r from-legal-accent/20 to-purple-500/20 text-legal-accent px-2 py-0.5 rounded-full text-xs">{filterRating}★</span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-white/95 dark:bg-legal-slate/95 backdrop-blur-sm border-indigo-200 dark:border-legal-slate/40">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <DropdownMenuItem 
                      key={rating}
                      onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                      className="flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    >
                      {filterRating === rating && <CheckSquare className="h-4 w-4 text-legal-accent" />}
                      {filterRating !== rating && <div className="w-4" />}
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star 
                            key={index} 
                            className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span>{rating} Star{rating !== 1 && 's'}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem onClick={clearFilters} className="border-t mt-1 pt-1 text-legal-accent font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                    Clear Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white dark:bg-legal-slate/40 border-indigo-200 dark:border-legal-slate/40">
                    <ArrowDownAZ className="h-4 w-4" />
                    Sort by
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-white/95 dark:bg-legal-slate/95 backdrop-blur-sm border-indigo-200 dark:border-legal-slate/40">
                  <DropdownMenuItem onClick={() => setSortOption('newest')} className="flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                    {sortOption === 'newest' && <CheckSquare className="h-4 w-4 text-legal-accent" />}
                    {sortOption !== 'newest' && <div className="w-4" />}
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('oldest')} className="flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                    {sortOption === 'oldest' && <CheckSquare className="h-4 w-4 text-legal-accent" />}
                    {sortOption !== 'oldest' && <div className="w-4" />}
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('highest')} className="flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                    {sortOption === 'highest' && <CheckSquare className="h-4 w-4 text-legal-accent" />}
                    {sortOption !== 'highest' && <div className="w-4" />}
                    Highest Rated
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('lowest')} className="flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                    {sortOption === 'lowest' && <CheckSquare className="h-4 w-4 text-legal-accent" />}
                    {sortOption !== 'lowest' && <div className="w-4" />}
                    Lowest Rated
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption('helpful')} className="flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                    {sortOption === 'helpful' && <CheckSquare className="h-4 w-4 text-legal-accent" />}
                    {sortOption !== 'helpful' && <div className="w-4" />}
                    Most Helpful
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="text-sm text-legal-muted dark:text-gray-400">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </div>
          </div>

          {isLoading ? (
            <div className="mt-8 space-y-6">
              {[1, 2, 3, 4].map(skeleton => (
                <div key={skeleton} className="bg-white/50 dark:bg-legal-slate/20 rounded-xl p-6 border border-indigo-100/30 dark:border-indigo-800/10 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <div key={star} className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      ))}
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid md:grid-cols-2 gap-6 mt-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="wait">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <motion.div 
                      key={review.id} 
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, y: 20 }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    >
                      <Card className="h-full border-indigo-200/60 dark:border-legal-slate/30 bg-white/90 dark:bg-legal-slate/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-legal-accent to-purple-500"></div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-legal-accent to-purple-600 flex items-center justify-center text-white shadow-md">
                                <User className="w-5 h-5" />
                              </div>
                              <div>
                                <CardTitle className="text-legal-slate dark:text-white text-lg">{review.name}</CardTitle>
                                <p className="text-legal-muted text-sm">{review.role}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-legal-muted flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {review.date}
                              </span>
                            </div>
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
                          <p className="text-legal-slate/80 dark:text-gray-300">
                            {expandedReviews.includes(review.id) || review.comment.length < 150
                              ? `"${review.comment}"`
                              : `"${review.comment.slice(0, 150)}..."`}
                          </p>
                          {review.comment.length > 150 && (
                            <button 
                              onClick={() => toggleExpandReview(review.id)}
                              className="text-legal-accent text-sm mt-2 hover:underline"
                            >
                              {expandedReviews.includes(review.id) ? "Read less" : "Read more"}
                            </button>
                          )}
                        </CardContent>
                        <CardFooter className="justify-between pt-0 border-t border-indigo-100/40 dark:border-legal-slate/20 mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markHelpful(review.id)}
                            className="text-legal-muted hover:text-legal-accent group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/10"
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Helpful ({review.helpful_count})
                          </Button>
                          <ShareButton 
                            title={`Review by ${review.name} - VakilGPT`}
                            description={review.comment}
                            className="text-legal-muted hover:text-legal-accent group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/10"
                            variant="ghost"
                            size="sm"
                          />
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    className="col-span-2 text-center py-10 bg-white/70 dark:bg-legal-slate/20 rounded-xl border border-indigo-200/40 dark:border-legal-slate/30 shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-legal-slate/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-legal-muted" />
                    </div>
                    <h3 className="text-xl font-medium text-legal-slate dark:text-white mb-2">No reviews found</h3>
                    <p className="text-legal-muted dark:text-gray-400 max-w-md mx-auto">
                      No reviews match your current filters. Try adjusting your filter criteria or clear all filters.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={clearFilters}
                      className="mt-4 bg-white dark:bg-legal-slate/40 border-indigo-200 dark:border-legal-slate/40"
                    >
                      Clear Filters
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
        
        <AddReviewSection />
      </div>
    </section>
  );
};

export default ReviewSection;
