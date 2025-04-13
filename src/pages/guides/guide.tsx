import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GuideService } from '@/services/guideService';
import { ArrowLeft, FileText, Clock, ChevronRight, Shield, Building, Scale, Users, PieChart, Book, BookOpen, Share2, Twitter, Facebook, Linkedin, Mail, Bookmark, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Guide {
  id: number;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: number;
  timeToComplete: string;
  updatedAt: string;
  image: string;
}

// For demonstration purposes only
const guideSteps = [
  {
    title: "Understanding the Legal Framework",
    content: "This step provides an overview of the legal framework and jurisdictional aspects that apply to this process."
  },
  {
    title: "Document Collection",
    content: "Gather all required documents and forms needed throughout the process. This section lists all necessary paperwork."
  },
  {
    title: "Form Completion",
    content: "Detailed instructions on how to properly fill out each required form, including common mistakes to avoid."
  },
  {
    title: "Filing Procedures",
    content: "Step-by-step instructions on where and how to file the documentation, including fees and timelines."
  },
  {
    title: "Next Steps and Follow-up",
    content: "What to expect after filing, including timeframes, potential responses, and follow-up actions."
  }
];

const GuideDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [guide, setGuide] = useState<Guide | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedGuides, setRelatedGuides] = useState<Guide[]>([]);
  const navigate = useNavigate();
  const shareUrl = window.location.href; // Move this before any function that uses it
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchGuide();
  }, [id]);
  
  const fetchGuide = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const guideId = parseInt(id, 10);
      const fetchedGuide = await GuideService.getGuideById(guideId);
      
      if (!fetchedGuide) {
        navigate('/guides');
        toast.error("Guide not found");
        return;
      }
      
      setGuide(fetchedGuide);
      
      // Track this view
      GuideService.trackGuideView(fetchedGuide);
      
      // Fetch related guides by category
      const sameCategory = await GuideService.getGuidesByCategory(fetchedGuide.category);
      setRelatedGuides(sameCategory.filter(g => g.id !== guideId).slice(0, 3));
    } catch (error) {
      console.error("Error fetching guide:", error);
      toast.error("Failed to load guide");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to get level badge color
  const getLevelBadgeColor = (level: string) => {
    switch(level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Function to get category icon
  const getCategoryIcon = (categoryName: string) => {
    // Map category names to icons
    const iconMap: Record<string, any> = {
      'Constitutional Law': Shield,
      'Corporate Law': Building,
      'Criminal Law': Scale,
      'Family Law': Users,
      'Tax Law': PieChart,
      'Legal Documentation': FileText
    };
    
    const IconComponent = iconMap[categoryName] || Book;
    
    // Also map colors
    const colorMap: Record<string, string> = {
      'Constitutional Law': 'text-blue-500',
      'Corporate Law': 'text-indigo-500',
      'Criminal Law': 'text-red-500',
      'Family Law': 'text-green-500',
      'Tax Law': 'text-amber-500',
      'Legal Documentation': 'text-purple-500'
    };
    
    const color = colorMap[categoryName] || 'text-gray-500';
    
    return <IconComponent className={`h-5 w-5 ${color}`} />;
  };
  
  const handleShare = (platform: string) => {
    if (!guide) return;
    
    const title = encodeURIComponent(guide.title);
    const url = encodeURIComponent(shareUrl);
    
    let shareUrl = ''; // Renamed to avoid shadowing
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };
  
  // For demonstration, we'll use a subset of the steps array based on the guide's step count
  const stepsToShow = guide ? guideSteps.slice(0, Math.min(guide.steps, guideSteps.length)) : [];
  // If the guide has more steps than our sample, we'll duplicate the last ones
  while (guide && stepsToShow.length < guide.steps) {
    stepsToShow.push({
      title: `Additional Step ${stepsToShow.length + 1}`,
      content: "This is an additional step in the process. In a real implementation, this would contain detailed information specific to this step."
    });
  }
  
  return (
    <AppLayout>
      <Helmet>
        <title>{guide ? `${guide.title} | VakilGPT Guides` : 'Legal Guide | VakilGPT'}</title>
        <meta name="description" content={guide?.description || 'VakilGPT legal guide'} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/guides')} 
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Guides
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
          ) : guide ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg mb-10">
                <div className="h-64 sm:h-80 overflow-hidden relative">
                  <img 
                    src={guide.image} 
                    alt={guide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <div className="flex items-center mb-3">
                      {getCategoryIcon(guide.category)}
                      <Badge className="ml-2 bg-white/80 text-gray-800 dark:bg-white/20 dark:text-white">
                        {guide.category}
                      </Badge>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                      {guide.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-white/80">
                      <Badge className={`${getLevelBadgeColor(guide.level)} border-none`}>
                        {guide.level}
                      </Badge>
                      <span className="flex items-center text-sm">
                        <FileText className="h-4 w-4 mr-1" />
                        {guide.steps} steps
                      </span>
                      <span className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {guide.timeToComplete}
                      </span>
                      <span className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Updated: {guide.updatedAt}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Guide Overview</h2>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
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
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-8">
                    {guide.description}
                  </p>
                  
                  <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-5 mb-8 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">What You'll Need</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-legal-accent mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">Valid identification documents (Aadhar, PAN card, etc.)</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-legal-accent mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">Access to official government websites or portals</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-legal-accent mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">Basic understanding of legal terminology</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="h-5 w-5 text-legal-accent mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">Approximately {guide.timeToComplete} to complete the process</span>
                      </li>
                    </ul>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Step-by-Step Guide</h3>
                  
                  <div className="space-y-6">
                    {stepsToShow.map((step, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3 border-b border-gray-200 dark:border-gray-600 flex items-center">
                          <span className="bg-legal-accent text-white text-sm font-medium h-6 w-6 rounded-full flex items-center justify-center mr-3">
                            {index + 1}
                          </span>
                          <h4 className="font-medium text-gray-900 dark:text-white">{step.title}</h4>
                        </div>
                        <div className="p-5">
                          <p className="text-gray-700 dark:text-gray-300">
                            {step.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-10 bg-gradient-to-r from-legal-accent/10 to-blue-500/10 rounded-lg p-6 border border-legal-accent/20">
                    <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Need Personalized Help?</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      If you have specific questions about your situation, our AI legal assistant can provide guidance tailored to your needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button asChild className="bg-legal-accent hover:bg-legal-accent/90">
                        <Link to="/chat">
                          Ask Legal Assistant
                        </Link>
                      </Button>
                      <Button variant="outline">
                        <Bookmark className="mr-2 h-4 w-4" />
                        Save for Later
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Related Guides */}
              {relatedGuides.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Related Guides</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedGuides.map(relatedGuide => (
                      <div 
                        key={relatedGuide.id}
                        onClick={() => navigate(`/guides/${relatedGuide.id}`)}
                        className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={relatedGuide.image} 
                            alt={relatedGuide.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <Badge className={`mb-2 ${getLevelBadgeColor(relatedGuide.level)}`}>
                            {relatedGuide.level}
                          </Badge>
                          <h3 className="text-md font-bold mb-2 text-gray-900 dark:text-white group-hover:text-legal-accent dark:group-hover:text-legal-accent transition-colors line-clamp-2">
                            {relatedGuide.title}
                          </h3>
                          <div className="flex items-center justify-between text-gray-500 text-xs">
                            <div className="flex items-center">
                              <FileText className="h-3 w-3 mr-1" />
                              {relatedGuide.steps} steps
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {relatedGuide.timeToComplete}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                Guide not found
              </h3>
              <p className="text-gray-500 mb-4">
                The guide you're looking for doesn't exist or has been removed
              </p>
              <Button asChild variant="outline">
                <Link to="/guides">
                  Return to Guides
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default GuideDetailPage;
