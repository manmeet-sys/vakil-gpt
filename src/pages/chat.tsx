
import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import AppLayout from '@/components/AppLayout';
import BackButton from '@/components/BackButton';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer } from '@/components/ui/responsive-container';

// Lazy load ChatInterface component
const ChatInterface = lazy(() => import('@/components/ChatInterface'));

// Chat loading skeleton
const ChatLoadingSkeleton = () => (
  <div className="w-full h-[calc(100vh-16rem)] min-h-[500px] flex flex-col">
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

  // Don't use AppLayout here since ChatInterface has its own styling
  return (
    <>
      <Helmet>
        <title>AI Legal Chat | VakilGPT</title>
      </Helmet>
      <ResponsiveContainer>
        <BackButton className="mb-4 mt-4" />
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Chat interface container with Suspense */}
          <div className="h-[calc(100vh-16rem)] min-h-[500px]">
            <Suspense fallback={<ChatLoadingSkeleton />}>
              <ChatInterface hideHeader={true} />
            </Suspense>
          </div>
        </div>
      </ResponsiveContainer>
    </>
  );
};

export default ChatPage;
