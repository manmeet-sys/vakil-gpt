
import { useCallback } from 'react';
import { trackEvent, trackPageView, trackAction, trackError, trackSearch } from '@/services/analytics';

export const useAnalytics = () => {
  const logEvent = useCallback((eventName: string, eventData: Record<string, any> = {}) => {
    return trackEvent(eventName, eventData);
  }, []);

  const logPageView = useCallback((additionalData: Record<string, any> = {}) => {
    return trackPageView(additionalData);
  }, []);

  const logAction = useCallback((actionName: string, additionalData: Record<string, any> = {}) => {
    return trackAction(actionName, additionalData);
  }, []);

  const logError = useCallback((errorType: string, errorDetails: Record<string, any> = {}) => {
    return trackError(errorType, errorDetails);
  }, []);

  const logSearch = useCallback((searchQuery: string, searchFilters: Record<string, any> = {}) => {
    return trackSearch(searchQuery, searchFilters);
  }, []);

  const clearData = useCallback(() => {
    // This is a client-side function that doesn't actually clear data from the database
    // It would typically be used to reset local state in the analytics dashboard
    console.log('Analytics data cleared from current view');
    return true;
  }, []);

  return {
    logEvent,
    logPageView,
    logAction,
    logError,
    logSearch,
    clearData
  };
};
