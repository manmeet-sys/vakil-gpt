
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User, ArrowRight, BookOpen, Tag } from 'lucide-react';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Sample blog categories
  const categories = [
    { name: 'Constitutional Law', count: 12 },
    { name: 'Supreme Court', count: 8 },
    { name: 'High Courts', count: 15 },
    { name: 'Criminal Law', count: 10 },
    { name: 'Civil Law', count: 14 },
    { name: 'Corporate Law', count: 9 },
    { name: 'Intellectual Property', count: 7 },
    { name: 'Legal Tech', count: 5 },
  ];
  
  // Sample blog posts
  const blogPosts = [
    {
      id: 1,
      title: 'Understanding the New Amendments to the Arbitration and Conciliation Act',
      excerpt: 'An in-depth analysis of the recent changes to India\'s arbitration laws and their implications for businesses and legal practitioners.',
      date: 'April 10, 2025',
      author: 'Aditya Sharma',
      category: 'Corporate Law',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true
    },
    {
      id: 2,
      title: 'The Role of AI in Transforming Legal Research in India',
      excerpt: 'How artificial intelligence is revolutionizing legal research methodologies and improving efficiency in the Indian legal system.',
      date: 'April 5, 2025',
      author: 'Priya Mehta',
      category: 'Legal Tech',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1655720033654-a4239e356ae0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Supreme Court\'s Landmark Judgment on Privacy Rights: Five Years Later',
      excerpt: 'A retrospective analysis of the impact of the Supreme Court\'s privacy judgment on digital rights and data protection in India.',
      date: 'March 28, 2025',
      author: 'Vikram Singh',
      category: 'Constitutional Law',
      readTime: '12 min read',
      image: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      title: 'The Evolution of Environmental Laws in India: Recent Developments',
      excerpt: 'Exploring how environmental legislation in India has evolved to address modern challenges including climate change and sustainable development.',
      date: 'March 20, 2025',
      author: 'Neha Patel',
      category: 'Environmental Law',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      title: 'Digital Evidence in Indian Courts: Admissibility and Challenges',
      excerpt: 'An examination of the legal framework governing digital evidence in Indian courts and the practical challenges in its presentation.',
      date: 'March 15, 2025',
      author: 'Rajiv Kumar',
      category: 'Criminal Law',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      title: 'The Impact of Recent High Court Rulings on Contractual Obligations',
      excerpt: 'Analysis of key High Court judgments that have significantly influenced the interpretation of contractual obligations in India.',
      date: 'March 8, 2025',
      author: 'Ananya Desai',
      category: 'Civil Law',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];
  
  const filteredPosts = searchQuery 
    ? blogPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : blogPosts;
  
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <AppLayout>
      <Helmet>
        <title>Blog | VakilGPT</title>
        <meta name="description" content="Latest legal insights, analysis and updates on Indian law from VakilGPT" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Legal Insights Blog</h1>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Featured Post */}
        {featuredPost && !searchQuery && (
          <div className="mb-12">
            <div className="group relative rounded-xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20 w-full md:w-2/3">
                <Badge className="mb-3 bg-legal-accent text-white border-none">Featured</Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {featuredPost.title}
                </h2>
                <p className="text-white/80 mb-4 line-clamp-2">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center text-white/70 text-sm mb-4">
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
                <Button asChild className="bg-white text-gray-900 hover:bg-white/90">
                  <Link to={`/blog/${featuredPost.id}`}>Read Article</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {searchQuery && filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-500 mb-4">
                  We couldn't find any articles matching "{searchQuery}"
                </p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </div>
            ) : (
              <>
                {searchQuery && (
                  <p className="mb-6 text-gray-500">
                    Showing {filteredPosts.length} results for "{searchQuery}"
                  </p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(searchQuery ? filteredPosts : regularPosts).map(post => (
                    <Link 
                      to={`/blog/${post.id}`} 
                      key={post.id}
                      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <Badge className="mb-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
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
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.name} className="flex items-center justify-between">
                    <Link 
                      to={`/blog/category/${category.name.toLowerCase().replace(' ', '-')}`}
                      className="flex items-center text-gray-700 dark:text-gray-300 hover:text-legal-accent dark:hover:text-legal-accent transition-colors"
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      {category.name}
                    </Link>
                    <Badge variant="outline" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                ))}
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
