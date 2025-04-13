
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User, ArrowRight, BookOpen, Tag } from 'lucide-react';
import { BlogService } from '@/services/blogService';
import { Skeleton } from '@/components/ui/skeleton';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

interface BlogCategory {
  name: string;
  count: number;
}

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | undefined>(undefined);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [posts, featuredPost, categories] = await Promise.all([
        BlogService.getAllPosts(),
        BlogService.getFeaturedPost(),
        BlogService.getCategories()
      ]);
      
      setBlogPosts(posts);
      setFeaturedPost(featuredPost);
      setCategories(categories);
    } catch (error) {
      console.error("Error loading blog data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      await fetchData();
      return;
    }
    
    setIsLoading(true);
    try {
      const results = await BlogService.searchPosts(searchQuery);
      setBlogPosts(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCategoryClick = async (categoryName: string) => {
    setIsLoading(true);
    try {
      const results = await BlogService.getPostsByCategory(categoryName);
      setBlogPosts(results);
      setSearchQuery(`Category: ${categoryName}`);
    } catch (error) {
      console.error("Category filter error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReadPost = (post: BlogPost) => {
    // Track user engagement
    BlogService.trackPostView(post);
    // Navigate to blog post
    navigate(`/blog/${post.id}`);
  };
  
  const filteredPosts = searchQuery && searchQuery.startsWith("Category:")
    ? blogPosts 
    : searchQuery 
      ? blogPosts.filter(post => 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : blogPosts;
  
  const regularPosts = featuredPost
    ? blogPosts.filter(post => post.id !== featuredPost.id)
    : blogPosts;

  return (
    <AppLayout>
      <Helmet>
        <title>Blog | VakilGPT</title>
        <meta name="description" content="Latest legal insights, analysis and updates on Indian law from VakilGPT" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Legal Insights Blog</h1>
          
          <form onSubmit={handleSearch} className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery.startsWith("Category:") ? "" : searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        {/* Featured Post */}
        {isLoading ? (
          <div className="mb-12">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <Skeleton className="w-full h-[400px]" />
            </div>
          </div>
        ) : (
          featuredPost && !searchQuery && (
            <div className="mb-12">
              <div className="group relative rounded-xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20 w-full md:w-2/3">
                  <Badge className="mb-3 bg-legal-accent text-white border-none">Featured</Badge>
                  <h2 className="text-xl md:text-3xl font-bold text-white mb-3">
                    {featuredPost.title}
                  </h2>
                  <p className="text-white/80 mb-4 line-clamp-2">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center text-white/70 text-sm mb-4 gap-y-2">
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      {featuredPost.date}
                    </div>
                    <div className="flex items-center mr-4">
                      <User className="h-4 w-4 mr-1" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <Button 
                    asChild 
                    className="bg-white text-gray-900 hover:bg-white/90"
                    onClick={() => handleReadPost(featuredPost)}
                  >
                    <div>Read Article</div>
                  </Button>
                </div>
              </div>
            </div>
          )
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                    <Skeleton className="w-full h-48" />
                    <div className="p-5 space-y-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {searchQuery && (
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-gray-500">
                      {searchQuery.startsWith("Category:") ? (
                        <>
                          Showing articles in category: <span className="font-medium">{searchQuery.replace("Category: ", "")}</span>
                        </>
                      ) : (
                        <>
                          Showing {filteredPosts.length} results for <span className="font-medium">"{searchQuery}"</span>
                        </>
                      )}
                    </p>
                    {searchQuery && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSearchQuery('');
                          fetchData();
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                )}
                
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                      No articles found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      We couldn't find any articles matching your search
                    </p>
                    <Button variant="outline" onClick={() => {
                      setSearchQuery('');
                      fetchData();
                    }}>
                      View All Articles
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(searchQuery ? filteredPosts : regularPosts).map(post => (
                      <div 
                        key={post.id}
                        onClick={() => handleReadPost(post)}
                        className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-5">
                          <Badge 
                            className="mb-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryClick(post.category);
                            }}
                          >
                            {post.category}
                          </Badge>
                          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-legal-accent dark:group-hover:text-legal-accent transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-gray-500 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {post.date}
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {post.readTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Categories</h3>
              <div className="space-y-2">
                {isLoading ? (
                  Array(6).fill(0).map((_, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-5 w-6" />
                    </div>
                  ))
                ) : (
                  categories.map(category => (
                    <div key={category.name} className="flex items-center justify-between">
                      <button 
                        onClick={() => handleCategoryClick(category.name)}
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-legal-accent dark:hover:text-legal-accent transition-colors"
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        {category.name}
                      </button>
                      <Badge variant="outline" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Subscribe</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Get the latest legal insights delivered straight to your inbox
              </p>
              <div className="space-y-3">
                <Input placeholder="Your email address" type="email" />
                <Button className="w-full">Subscribe</Button>
              </div>
            </div>
            
            <div className="bg-legal-accent/10 rounded-xl p-6 border border-legal-accent/20">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Have a legal question?</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Try our AI-powered legal assistant to get instant answers
              </p>
              <Button asChild className="w-full bg-legal-accent hover:bg-legal-accent/90">
                <Link to="/chat">
                  Try Legal Chat <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default BlogPage;
