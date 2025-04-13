
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

// Sample blog posts to use when the database isn't available
const sampleBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Understanding the New Amendments to the Arbitration and Conciliation Act",
    excerpt: "An in-depth analysis of the recent changes to India's arbitration laws and their implications for businesses and legal practitioners.",
    date: "April 10, 2025",
    author: "Aditya Sharma",
    category: "Corporate Law",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: 2,
    title: "The Role of AI in Transforming Legal Research in India",
    excerpt: "How artificial intelligence is revolutionizing legal research methodologies and improving efficiency in the Indian legal system.",
    date: "April 5, 2025",
    author: "Priya Mehta",
    category: "Legal Tech",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1655720033654-a4239e356ae0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Supreme Court's Landmark Judgment on Privacy Rights: Five Years Later",
    excerpt: "A retrospective analysis of the impact of the Supreme Court's privacy judgment on digital rights and data protection in India.",
    date: "March 28, 2025",
    author: "Vikram Singh",
    category: "Constitutional Law",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "The Evolution of Environmental Laws in India: Recent Developments",
    excerpt: "Exploring how environmental legislation in India has evolved to address modern challenges including climate change and sustainable development.",
    date: "March 20, 2025",
    author: "Neha Patel",
    category: "Environmental Law",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Digital Evidence in Indian Courts: Admissibility and Challenges",
    excerpt: "An examination of the legal framework governing digital evidence in Indian courts and the practical challenges in its presentation.",
    date: "March 15, 2025",
    author: "Rajiv Kumar",
    category: "Criminal Law",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

// Sample categories
const sampleCategories: BlogCategory[] = [
  { name: "Constitutional Law", count: 12 },
  { name: "Supreme Court", count: 8 },
  { name: "High Courts", count: 15 },
  { name: "Criminal Law", count: 10 },
  { name: "Civil Law", count: 14 },
  { name: "Corporate Law", count: 9 },
  { name: "Intellectual Property", count: 7 },
  { name: "Legal Tech", count: 5 },
];

// Track which categories users have shown interest in
const userInterests: Record<string, number> = {};

export const BlogService = {
  getAllPosts: async (): Promise<BlogPost[]> => {
    try {
      // In a real implementation, we would fetch from the database
      // const { data, error } = await supabase.from('blog_posts').select('*');
      // if (error) throw error;
      // return data;
      
      return Promise.resolve(sampleBlogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Failed to fetch blog posts");
      return sampleBlogPosts;
    }
  },
  
  getFeaturedPost: async (): Promise<BlogPost | undefined> => {
    try {
      // In a real implementation, we would fetch from the database
      // const { data, error } = await supabase.from('blog_posts').select('*').eq('featured', true).single();
      // if (error) throw error;
      // return data;
      
      return Promise.resolve(sampleBlogPosts.find(post => post.featured));
    } catch (error) {
      console.error("Error fetching featured post:", error);
      return sampleBlogPosts.find(post => post.featured);
    }
  },
  
  getCategories: async (): Promise<BlogCategory[]> => {
    try {
      // In a real implementation, we would fetch from the database
      // const { data, error } = await supabase.from('blog_categories').select('*');
      // if (error) throw error;
      // return data;
      
      return Promise.resolve(sampleCategories);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      return sampleCategories;
    }
  },
  
  getPostById: async (id: number): Promise<BlogPost | undefined> => {
    try {
      // In a real implementation, we would fetch from the database
      // const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
      // if (error) throw error;
      // return data;
      
      return Promise.resolve(sampleBlogPosts.find(post => post.id === id));
    } catch (error) {
      console.error(`Error fetching blog post with id ${id}:`, error);
      return sampleBlogPosts.find(post => post.id === id);
    }
  },
  
  getPostsByCategory: async (category: string): Promise<BlogPost[]> => {
    try {
      // In a real implementation, we would fetch from the database
      // const { data, error } = await supabase.from('blog_posts').select('*').eq('category', category);
      // if (error) throw error;
      // return data;
      
      // Track user interest in this category
      userInterests[category] = (userInterests[category] || 0) + 1;
      
      return Promise.resolve(sampleBlogPosts.filter(post => post.category === category));
    } catch (error) {
      console.error(`Error fetching blog posts for category ${category}:`, error);
      return sampleBlogPosts.filter(post => post.category === category);
    }
  },
  
  searchPosts: async (query: string): Promise<BlogPost[]> => {
    try {
      // In a real implementation, we would use a more sophisticated search
      // const { data, error } = await supabase.from('blog_posts').select('*')
      //  .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,category.ilike.%${query}%`);
      // if (error) throw error;
      // return data;
      
      return Promise.resolve(sampleBlogPosts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.category.toLowerCase().includes(query.toLowerCase())
      ));
    } catch (error) {
      console.error(`Error searching blog posts for "${query}":`, error);
      return [];
    }
  },
  
  // This function would be called daily to refresh blog content
  // based on user interaction data
  refreshContent: async (): Promise<void> => {
    try {
      console.log("Refreshing blog content based on user interests:", userInterests);
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
      console.error("Error refreshing blog content:", error);
    }
  },
  
  // Track when a user views a blog post
  trackPostView: (post: BlogPost): void => {
    // Track interest in this category
    userInterests[post.category] = (userInterests[post.category] || 0) + 1;
    console.log(`User viewed "${post.title}" in category "${post.category}"`);
    
    // In a real app, we would log this to analytics
  }
};

// In a real app, we'd set up a cron job or scheduled function to call refreshContent daily
// For this demo, we'll simulate it with a timer when the module is loaded
if (typeof window !== 'undefined') {
  // Refresh content every 24 hours
  const REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  setInterval(() => {
    BlogService.refreshContent();
  }, REFRESH_INTERVAL);
}
