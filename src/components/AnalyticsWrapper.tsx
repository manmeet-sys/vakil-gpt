
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/hooks/use-analytics';

interface AnalyticsWrapperProps {
  children: React.ReactNode;
}

const AnalyticsWrapper: React.FC<AnalyticsWrapperProps> = ({ children }) => {
  const location = useLocation();
  const { logPageView } = useAnalytics();

  // Track page view on route change
  useEffect(() => {
    logPageView({ path: location.pathname });
  }, [location.pathname, logPageView]);

  return <>{children}</>;
};

export default AnalyticsWrapper;
