
import { useCallback } from 'react';
import { trackEvent, trackPageView, trackAction, trackError, trackSearch } from '@/services/analytics';
import { supabase } from '@/integrations/supabase/client';

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

  const resetProfileData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: null,
          avatar_url: null,
          bar_number: null,
          enrollment_date: null,
          jurisdiction: null
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error resetting profile data:', error);
      return false;
    }
  }, []);

  const updateProfileData = useCallback(async (profileData: {
    full_name?: string;
    avatar_url?: string;
    bar_number?: string;
    enrollment_date?: string;
    jurisdiction?: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating profile data:', error);
      return false;
    }
  }, []);

  return {
    logEvent,
    logPageView,
    logAction,
    logError,
    logSearch,
    clearData,
    resetProfileData,
    updateProfileData
  };
};
