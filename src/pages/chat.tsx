
import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import AppLayout from '@/components/AppLayout';
import BackButton from '@/components/BackButton';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load ChatInterface component
const ChatInterface = lazy(() => import('@/components/ChatInterface'));

// Chat loading skeleton
const ChatLoadingSkeleton = () => (
  <div className="w-full h-[calc(100vh-350px)] min-h-[500px] flex flex-col">
    <div className="flex-1 p-4 overflow-hidden">
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="border-t p-4">
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  </div>
);

const ChatPage = () => {
  // Ensure page scrolls to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AppLayout>
      <Helmet>
        <title>AI Legal Chat | VakilGPT</title>
      </Helmet>
      <div className="container mx-auto px-4 py-6">
        <BackButton />
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden mt-4">
          {/* Browser-like top bar */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <h2 className="font-medium text-gray-700 dark:text-gray-200">VakilGPT Chat Interface</h2>
          </div>
          
          {/* Chat interface container with Suspense */}
          <div className="h-[calc(100vh-350px)] min-h-[500px]">
            <Suspense fallback={<ChatLoadingSkeleton />}>
              <ChatInterface />
            </Suspense>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatPage;
