
import { useCallback } from 'react';
import { trackPageView, trackAction, trackSearch, trackError } from '@/services/analytics';

export function useAnalytics() {
  // Track page view
  const logPageView = useCallback((additionalData: Record<string, any> = {}) => {
    return trackPageView(additionalData);
  }, []);

  // Track user action
  const logAction = useCallback((actionName: string, additionalData: Record<string, any> = {}) => {
    return trackAction(actionName, additionalData);
  }, []);

  // Track search
  const logSearch = useCallback((searchQuery: string, searchFilters: Record<string, any> = {}) => {
    return trackSearch(searchQuery, searchFilters);
  }, []);

  // Track error
  const logError = useCallback((errorType: string, errorDetails: Record<string, any> = {}) => {
    return trackError(errorType, errorDetails);
  }, []);

  return {
    logPageView,
    logAction,
    logSearch,
    logError
  };
}
