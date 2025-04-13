import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogService } from '@/services/blogService';
import { Calendar, User, ArrowLeft, Tag, BookOpen, Share2, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

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

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();
  const pageShareUrl = window.location.href;
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPost();
  }, [id]);
  
  const fetchPost = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const postId = parseInt(id, 10);
      const fetchedPost = await BlogService.getPostById(postId);
      
      if (!fetchedPost) {
        navigate('/blog');
        toast.error("Blog post not found");
        return;
      }
      
      setPost(fetchedPost);
      
      BlogService.trackPostView(fetchedPost);
      
      const sameCategory = await BlogService.getPostsByCategory(fetchedPost.category);
      setRelatedPosts(sameCategory.filter(p => p.id !== postId).slice(0, 3));
    } catch (error) {
      console.error("Error fetching blog post:", error);
      toast.error("Failed to load blog post");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShare = (platform: string) => {
    if (!post) return;
    
    const title = encodeURIComponent(post.title);
    const url = encodeURIComponent(pageShareUrl);
    
    let socialShareUrl = '';
    
    switch (platform) {
      case 'twitter':
        socialShareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case 'facebook':
        socialShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        socialShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'email':
        socialShareUrl = `mailto:?subject=${title}&body=${url}`;
        break;
      default:
        return;
    }
    
    window.open(socialShareUrl, '_blank');
  };
  
  return (
    <AppLayout>
      <Helmet>
        <title>{post ? `${post.title} | VakilGPT Blog` : 'Blog Post | VakilGPT'}</title>
        <meta name="description" content={post?.excerpt || 'VakilGPT blog post'} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/blog')} 
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
          
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4 mx-auto" />
              <div className="flex justify-center gap-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : post ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Badge 
                  className="mb-4 inline-flex bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  onClick={() => navigate(`/blog/category/${post.category.toLowerCase().replace(' ', '-')}`)}
                >
                  {post.category}
                </Badge>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap justify-center items-center gap-4 text-gray-600 dark:text-gray-400 text-sm mb-8">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleShare('twitter')}>
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('facebook')}>
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('email')}>
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="mb-10">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-auto max-h-[500px] object-cover rounded-xl mb-8"
                />
                
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="lead">{post.excerpt}</p>
                  <p>
                    This is a sample blog post. In a real implementation, the full content of the blog would be displayed here. 
                    The content would be formatted with proper typography, including headings, paragraphs, lists, and other 
                    elements necessary for a good reading experience.
                  </p>
                  <h2>Key Points</h2>
                  <ul>
                    <li>First major point about {post.title}</li>
                    <li>Second major consideration for readers</li>
                    <li>Important legal implications to consider</li>
                    <li>How this affects practitioners in the field</li>
                  </ul>
                  <p>
                    Legal professionals need to stay updated with the latest developments in their fields. This blog post 
                    aims to provide valuable insights into {post.category} and help practitioners understand the nuances 
                    involved.
                  </p>
                  <h2>Legal Framework</h2>
                  <p>
                    The existing legal framework provides certain guidelines that practitioners must follow. Understanding 
                    these guidelines is crucial for compliance and effective legal practice.
                  </p>
                  <p>
                    Recent changes in legislation have introduced new requirements that need careful consideration. These 
                    changes affect how legal professionals approach cases related to {post.category}.
                  </p>
                  <blockquote>
                    <p>
                      "The practice of law requires continuous learning and adaptation to changing legal landscapes."
                    </p>
                  </blockquote>
                  <h2>Practical Implications</h2>
                  <p>
                    For practitioners, these developments mean adjusting their strategies and approaches. The implications 
                    extend beyond theoretical understanding to practical application in day-to-day legal work.
                  </p>
                  <p>
                    Clients also need to be informed about how these changes might affect their cases or legal situations. 
                    Clear communication is essential for managing client expectations and providing effective legal services.
                  </p>
                  <h2>Conclusion</h2>
                  <p>
                    Staying informed about developments in {post.category} is essential for legal professionals who want to 
                    provide the best service to their clients. This blog post has highlighted key aspects of recent changes 
                    and their implications.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-10 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 mr-4 overflow-hidden">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${post.author.replace(' ', '+')}&background=random`} 
                      alt={post.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{post.author}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Legal specialist in {post.category} with years of experience in the Indian legal system.
                    </p>
                  </div>
                </div>
              </div>
              
              {relatedPosts.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Related Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPosts.map(relatedPost => (
                      <div 
                        key={relatedPost.id}
                        onClick={() => navigate(`/blog/${relatedPost.id}`)}
                        className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={relatedPost.image} 
                            alt={relatedPost.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-md font-bold mb-2 text-gray-900 dark:text-white group-hover:text-legal-accent dark:group-hover:text-legal-accent transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          <div className="flex items-center justify-between text-gray-500 text-xs">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {relatedPost.date}
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {relatedPost.readTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="bg-gradient-to-r from-legal-accent/10 to-blue-500/10 rounded-xl p-6 border border-legal-accent/20 text-center">
                <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  Need legal assistance?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our AI-powered assistant can help answer your legal questions
                </p>
                <Button asChild className="bg-legal-accent hover:bg-legal-accent/90">
                  <Link to="/chat">
                    Try Legal Chat
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blog post not found
              </h3>
              <p className="text-gray-500 mb-4">
                The blog post you're looking for doesn't exist or has been removed
              </p>
              <Button asChild variant="outline">
                <Link to="/blog">
                  Return to Blog
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default BlogPostPage;
