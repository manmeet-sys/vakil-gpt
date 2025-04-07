
import { supabase } from "@/integrations/supabase/client";

// Define our analytics event type
interface AnalyticsEvent {
  user_id?: string | null;
  event_name: string;
  page_path: string;
  event_data?: Record<string, any>;
  user_agent?: string | null;
  referrer?: string | null;
}

// Analytics tracking service
export const trackEvent = async (eventName: string, eventData: Record<string, any> = {}) => {
  try {
    const { pathname } = window.location;
    const userAgent = window.navigator.userAgent;
    const referrer = document.referrer;

    // Get session to check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // Insert the event into our analytics table
    await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_name: eventName,
        page_path: pathname,
        event_data: eventData,
        user_agent: userAgent,
        referrer: referrer,
        // IP address will be captured by Supabase RLS
      } as any);

    console.log(`Analytics event tracked: ${eventName}`);
    return true;
  } catch (error) {
    console.error("Failed to track analytics event:", error);
    return false;
  }
};

// Track page view
export const trackPageView = async (additionalData: Record<string, any> = {}) => {
  return trackEvent('page_view', additionalData);
};

// Track user action
export const trackAction = async (actionName: string, additionalData: Record<string, any> = {}) => {
  return trackEvent(`action_${actionName}`, additionalData);
};

// Track error
export const trackError = async (errorType: string, errorDetails: Record<string, any> = {}) => {
  return trackEvent(`error_${errorType}`, errorDetails);
};

// Track search
export const trackSearch = async (searchQuery: string, searchFilters: Record<string, any> = {}) => {
  return trackEvent('search', {
    query: searchQuery,
    filters: searchFilters
  });
};
