import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, MessageSquare, User, Filter, Clock, ThumbsUp, Sort, ChevronDown, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ShareButton from '@/components/ShareButton';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const initialReviews = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Corporate Lawyer",
    rating: 5,
    comment: "VakilGPT has revolutionized how I approach legal research. The AI tools have helped me save countless hours on case preparation.",
    date: "2 weeks ago",
    helpfulCount: 12
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Tax Consultant",
    rating: 4,
    comment: "The compliance tools are exceptional. I've been able to keep my clients updated with the latest regulatory changes effortlessly.",
    date: "1 month ago",
    helpfulCount: 8
  },
  {
    id: 3,
    name: "Anika Patel",
    role: "Litigation Attorney",
    rating: 5,
    comment: "Document analysis has never been easier. VakilGPT identifies key clauses and potential issues faster than any associate could.",
    date: "3 weeks ago",
    helpfulCount: 15
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Patent Attorney",
    rating: 4,
    comment: "The IP protection tools provide comprehensive analysis. I appreciate how it integrates Indian patent law considerations.",
    date: "1 week ago",
    helpfulCount: 6
  },
  {
    id: 5,
    name: "Meera Joshi",
    role: "Family Court Advocate",
    rating: 3,
    comment: "Useful for basic research, but could improve features for family law cases. Looking forward to seeing more specialization.",
    date: "2 months ago",
    helpfulCount: 3
  }
];

const reviewFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  role: z.string().min(2, { message: "Please provide your professional role" }),
  rating: z.number().min(1, { message: "Please select a rating" }).max(5),
  comment: z.string().min(10, { message: "Review must be at least 10 characters" })
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

const ReviewSection = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [filteredReviews, setFilteredReviews] = useState(initialReviews);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState<number[]>([]);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      name: "",
      role: "",
      rating: 0,
      comment: ""
    }
  });
  
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
    let result = [...reviews];
    
    if (filterRating !== null) {
      result = result.filter(review => review.rating === filterRating);
    }
    
    switch(sortOption) {
      case 'newest':
        result = [...result].reverse();
        break;
      case 'oldest':
        break;
      case 'highest':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        result = [...result].sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        result = [...result].sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
    }
    
    setFilteredReviews(result);
  }, [reviews, filterRating, sortOption]);

  const toggleExpandReview = (id: number) => {
    setExpandedReviews(prev => 
      prev.includes(id) ? prev.filter(reviewId => reviewId !== id) : [...prev, id]
    );
  };
  
  const markHelpful = (id: number) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === id 
          ? { ...review, helpfulCount: review.helpfulCount + 1 } 
          : review
      )
    );
    toast.success("Thank you for your feedback!");
  };

  const clearFilters = () => {
    setFilterRating(null);
    setSortOption('newest');
  };

  const onSubmit = (data: ReviewFormValues) => {
    const newReview = {
      id: Date.now(),
      name: data.name,
      role: data.role,
      rating: data.rating,
      comment: data.comment,
      date: "Just now",
      helpfulCount: 0
    };
    
    setReviews([newReview, ...reviews]);
    form.reset();
    toast.success('Thank you for your review!');
  };
  
  return (
    <section className="py-16 px-4 bg-white dark:bg-legal-slate/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 bg-gradient-to-l from-legal-accent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full opacity-10 bg-gradient-to-r from-purple-600 to-transparent pointer-events-none" />
      
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

        <div className="max-w-5xl mx-auto mb-16">
          <Tabs defaultValue="view" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="view" className="text-base py-3">
                <MessageSquare className="mr-2 h-4 w-4" />
                Read Reviews
              </TabsTrigger>
              <TabsTrigger value="write" className="text-base py-3">
                <Send className="mr-2 h-4 w-4" />
                Write a Review
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="view" className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-legal-light/30 dark:bg-legal-slate/10 rounded-lg border border-legal-border dark:border-legal-slate/20">
                <div className="flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filter by Rating
                        {filterRating && <span className="ml-1 bg-legal-accent/20 text-legal-accent px-2 py-0.5 rounded-full text-xs">{filterRating}★</span>}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <DropdownMenuItem 
                          key={rating}
                          onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                          className="flex items-center gap-2"
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
                      <DropdownMenuItem onClick={clearFilters} className="border-t mt-1 pt-1 text-legal-accent font-medium">
                        Clear Filters
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Sort className="h-4 w-4" />
                        Sort by
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setSortOption('newest')} className="flex items-center gap-2">
                        {sortOption === 'newest' && <CheckSquare className="h-4 w-4 text-legal-accent" />}
                        {sortOption !== 'newest' && <div className="w-4" />}
                        Newest First
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption('oldest')} className="flex items-center gap-2">
                        {sortOption === 'oldest' && <CheckSquare className="h-4 w-4 text-legal-accent" />}
                        {sortOption !== 'oldest' && <div className="w-4" />}
                        Oldest First
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption('highest')} className="flex items-center gap-2">
                        {sortOption === 'highest' && <CheckSquare className="h-4 w-4 text-legal-accent" />}
                        {sortOption !== 'highest' && <div className="w-4" />}
                        Highest Rated
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption('lowest')} className="flex items-center gap-2">
                        {sortOption === 'lowest' && <CheckSquare className="h-4 w-4 text-legal-accent" />}
                        {sortOption !== 'lowest' && <div className="w-4" />}
                        Lowest Rated
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption('helpful')} className="flex items-center gap-2">
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

              <motion.div 
                className="grid md:grid-cols-2 gap-6"
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
                      >
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
                                : `"${review.comment.slice(0, 150)}..."`
                              }
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
                          <CardFooter className="justify-between pt-0 border-t border-legal-border/20 dark:border-legal-slate/10 mt-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => markHelpful(review.id)}
                              className="text-legal-muted hover:text-legal-accent"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              Helpful ({review.helpfulCount})
                            </Button>
                            <ShareButton 
                              variant="ghost" 
                              size="sm"
                              title={`Review by ${review.name} - VakilGPT`}
                              description={review.comment}
                            />
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      className="col-span-2 text-center py-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-16 h-16 bg-legal-light dark:bg-legal-slate/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-legal-muted" />
                      </div>
                      <h3 className="text-xl font-medium text-legal-slate dark:text-white mb-2">No reviews found</h3>
                      <p className="text-legal-muted dark:text-gray-400 max-w-md mx-auto">
                        No reviews match your current filters. Try adjusting your filter criteria or clear all filters.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={clearFilters}
                        className="mt-4"
                      >
                        Clear Filters
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="write" className="space-y-4">
              <Card className="border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10 shadow-elegant overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-legal-accent/5 to-purple-600/5 border-b border-legal-border dark:border-legal-slate/20">
                  <CardTitle className="text-xl font-playfair text-legal-slate dark:text-white">Share Your Experience</CardTitle>
                </CardHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Professional Role</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Corporate Lawyer" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Rating</FormLabel>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star}
                                  className={`w-6 h-6 cursor-pointer transition-colors ${
                                    star <= (hoveredRating || field.value) 
                                      ? 'text-yellow-400 fill-yellow-400' 
                                      : 'text-gray-300'
                                  }`}
                                  onClick={() => field.onChange(star)}
                                  onMouseEnter={() => setHoveredRating(star)}
                                  onMouseLeave={() => setHoveredRating(0)}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Review</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Share your experience with VakilGPT..."
                                className="min-h-[120px] bg-white dark:bg-legal-slate/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="border-t border-legal-border dark:border-legal-slate/20 bg-legal-light/30 dark:bg-legal-slate/10">
                      <Button type="submit" className="bg-legal-accent hover:bg-legal-accent/90 text-white ml-auto group">
                        Submit Review
                        <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
              
              <div className="bg-legal-light/50 dark:bg-legal-slate/10 p-4 rounded-lg border border-legal-border/50 dark:border-legal-slate/20">
                <h4 className="text-legal-slate dark:text-white font-medium flex items-center mb-2">
                  <MessageSquare className="w-4 h-4 mr-2 text-legal-accent" />
                  Review Guidelines
                </h4>
                <ul className="text-sm text-legal-muted dark:text-gray-400 space-y-1 list-disc pl-5">
                  <li>Share your honest experience with our platform</li>
                  <li>Focus on specific features and tools you've used</li>
                  <li>Keep your review professional and respectful</li>
                  <li>Mention how VakilGPT has helped your legal practice</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
