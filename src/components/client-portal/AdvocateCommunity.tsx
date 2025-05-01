
import React, { useState } from 'react';
import { Users, MessageSquare, ThumbsUp, Share2, Flag, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    initials: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
}

const AdvocateCommunity = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        name: 'Sarah Patel',
        initials: 'SP',
      },
      content: 'Has anyone dealt with the recent amendments to the Evidence Act? Looking for interpretations on how Section 65B is being applied in practice.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      likes: 12,
      comments: 4,
      liked: false
    },
    {
      id: '2',
      author: {
        name: 'Rajiv Sharma',
        initials: 'RS',
      },
      content: 'Sharing a recent Supreme Court judgment on contract interpretation that might be helpful for commercial litigation practitioners. The court clarified that implied terms should be rarely read into commercial contracts where sophisticated parties are involved.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      likes: 28,
      comments: 8,
      liked: true
    }
  ]);
  
  const handleSubmitPost = () => {
    if (!newPost.trim()) {
      toast.error('Please enter some content for your post');
      return;
    }
    
    const newPostObject: Post = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        initials: 'YO',
      },
      content: newPost,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      liked: false
    };
    
    setPosts(prev => [newPostObject, ...prev]);
    setNewPost('');
    toast.success('Post shared with the advocate community');
  };
  
  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  return (
    <div className="space-y-6">
      {/* Create post */}
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>YO</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Share insights or ask questions with fellow advocates..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px] mb-3"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitPost} className="flex items-center gap-1">
                <Send className="h-4 w-4 mr-1" />
                Share with Community
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Posts */}
      {posts.map(post => (
        <Card key={post.id} className="p-4">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback>{post.author.initials}</AvatarFallback>
              {post.author.avatar && <AvatarImage src={post.author.avatar} />}
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{post.author.name}</h4>
                <span className="text-xs text-gray-500">{formatTimestamp(post.timestamp)}</span>
              </div>
              <p className="mt-2 text-sm">{post.content}</p>
              
              <div className="flex items-center gap-6 mt-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`text-xs flex items-center gap-1 ${post.liked ? 'text-blue-600 dark:text-blue-400' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  <ThumbsUp className="h-3 w-3" />
                  {post.likes > 0 && <span>{post.likes}</span>}
                  {post.liked ? 'Liked' : 'Like'}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs flex items-center gap-1"
                  onClick={() => toast.info('Comments feature coming soon')}
                >
                  <MessageSquare className="h-3 w-3" />
                  {post.comments > 0 && <span>{post.comments}</span>}
                  Comment
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs flex items-center gap-1"
                  onClick={() => toast.success('Post link copied to clipboard')}
                >
                  <Share2 className="h-3 w-3" />
                  Share
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs flex items-center gap-1 ml-auto"
                  onClick={() => toast.info('Report submitted')}
                >
                  <Flag className="h-3 w-3" />
                  Report
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AdvocateCommunity;
