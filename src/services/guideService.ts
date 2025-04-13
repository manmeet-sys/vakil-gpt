
import { toast } from "sonner";

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

interface GuideCategory {
  name: string;
  icon: string;
  color: string;
}

// Sample guides
const sampleGuides: Guide[] = [
  {
    id: 1,
    title: 'Filing a PIL in India: Complete Step-by-Step Guide',
    description: 'Learn how to draft and file a Public Interest Litigation in India with our comprehensive guide for legal practitioners and individuals.',
    category: 'Constitutional Law',
    level: 'Advanced',
    steps: 12,
    timeToComplete: '60 min',
    updatedAt: 'April 2, 2025',
    image: 'https://images.unsplash.com/photo-1593115057322-e94b77572f20?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'Understanding the GST Framework for Small Businesses',
    description: 'A practical guide to GST compliance, filing returns, and managing input tax credits for small business owners in India.',
    category: 'Tax Law',
    level: 'Intermediate',
    steps: 8,
    timeToComplete: '45 min',
    updatedAt: 'March 25, 2025',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Drafting an Effective Legal Notice: Templates and Best Practices',
    description: 'Learn how to draft legally sound notices for various purposes with ready-to-use templates and professional tips.',
    category: 'Legal Documentation',
    level: 'Beginner',
    steps: 6,
    timeToComplete: '30 min',
    updatedAt: 'March 18, 2025',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'Incorporating a Private Limited Company in India',
    description: 'A step-by-step guide to company formation, from name reservation to obtaining necessary registrations and licenses.',
    category: 'Corporate Law',
    level: 'Intermediate',
    steps: 10,
    timeToComplete: '50 min',
    updatedAt: 'March 12, 2025',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    title: 'Filing an FIR: Process, Rights and Follow-up Actions',
    description: 'Everything you need to know about filing a First Information Report with the police in India and tracking its progress.',
    category: 'Criminal Law',
    level: 'Beginner',
    steps: 7,
    timeToComplete: '35 min',
    updatedAt: 'March 5, 2025',
    image: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

// Sample categories with icons
const sampleCategories: GuideCategory[] = [
  { name: 'Constitutional Law', icon: 'Shield', color: 'text-blue-500' },
  { name: 'Corporate Law', icon: 'Building', color: 'text-indigo-500' },
  { name: 'Criminal Law', icon: 'Scale', color: 'text-red-500' },
  { name: 'Family Law', icon: 'Users', color: 'text-green-500' },
  { name: 'Tax Law', icon: 'PieChart', color: 'text-amber-500' },
  { name: 'Legal Documentation', icon: 'FileText', color: 'text-purple-500' }
];

// Track which categories users have shown interest in
const userInterests: Record<string, number> = {};

export const GuideService = {
  getAllGuides: async (): Promise<Guide[]> => {
    try {
      // In a real implementation, we would fetch from the database
      // const { data, error } = await supabase.from('guides').select('*');
      // if (error) throw error;
      // return data;
      
      return Promise.resolve(sampleGuides);
    } catch (error) {
      console.error("Error fetching guides:", error);
      toast.error("Failed to fetch guides");
      return sampleGuides;
    }
  },
  
  getCategories: async (): Promise<GuideCategory[]> => {
    try {
      // In a real implementation, we would fetch from the database
      // const { data, error } = await supabase.from('guide_categories').select('*');
      // if (error) throw error;
      // return data;
      
      return Promise.resolve(sampleCategories);
    } catch (error) {
      console.error("Error fetching guide categories:", error);
      return sampleCategories;
    }
  },
  
  getGuideById: async (id: number): Promise<Guide | undefined> => {
    try {
      // In a real implementation, we would fetch from the database
      // const { data, error } = await supabase.from('guides').select('*').eq('id', id).single();
      // if (error) throw error;
      // return data;
      
      return Promise.resolve(sampleGuides.find(guide => guide.id === id));
    } catch (error) {
      console.error(`Error fetching guide with id ${id}:`, error);
      return sampleGuides.find(guide => guide.id === id);
    }
  },
  
  getGuidesByCategory: async (category: string): Promise<Guide[]> => {
    try {
      // In a real implementation, we would fetch from the database
      // const { data, error } = await supabase.from('guides').select('*').eq('category', category);
      // if (error) throw error;
      // return data;
      
      // Track user interest in this category
      userInterests[category] = (userInterests[category] || 0) + 1;
      
      return Promise.resolve(sampleGuides.filter(guide => guide.category === category));
    } catch (error) {
      console.error(`Error fetching guides for category ${category}:`, error);
      return sampleGuides.filter(guide => guide.category === category);
    }
  },
  
  searchGuides: async (query: string): Promise<Guide[]> => {
    try {
      // In a real implementation, we would use a more sophisticated search
      // const { data, error } = await supabase.from('guides').select('*')
      //  .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`);
      // if (error) throw error;
      // return data;
      
      return Promise.resolve(sampleGuides.filter(guide => 
        guide.title.toLowerCase().includes(query.toLowerCase()) ||
        guide.description.toLowerCase().includes(query.toLowerCase()) ||
        guide.category.toLowerCase().includes(query.toLowerCase())
      ));
    } catch (error) {
      console.error(`Error searching guides for "${query}":`, error);
      return [];
    }
  },
  
  // This function would be called daily to refresh guide content
  // based on user interaction data
  refreshContent: async (): Promise<void> => {
    try {
      console.log("Refreshing guide content based on user interests:", userInterests);
      // In a real implementation, we would:
      // 1. Analyze user interests
      // 2. Generate or curate new content
      // 3. Update the database
      
      // For now, we'll just log the interests
      const topInterests = Object.entries(userInterests)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([category]) => category);
        
      console.log("Top user interests:", topInterests);
      
      // Reset interests for the next cycle
      Object.keys(userInterests).forEach(key => {
        userInterests[key] = 0;
      });
      
      // In a production app, we would make API calls to update content here
    } catch (error) {
      console.error("Error refreshing guide content:", error);
    }
  },
  
  // Track when a user views a guide
  trackGuideView: (guide: Guide): void => {
    // Track interest in this category
    userInterests[guide.category] = (userInterests[guide.category] || 0) + 1;
    console.log(`User viewed "${guide.title}" in category "${guide.category}"`);
    
    // In a real app, we would log this to analytics
  }
};

// In a real app, we'd set up a cron job or scheduled function to call refreshContent daily
// For this demo, we'll simulate it with a timer when the module is loaded
if (typeof window !== 'undefined') {
  // Refresh content every 24 hours
  const REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  setInterval(() => {
    GuideService.refreshContent();
  }, REFRESH_INTERVAL);
}
