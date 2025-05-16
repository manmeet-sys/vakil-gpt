
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';

export const DeviceService = {
  /**
   * Check if the app is running on a mobile device
   */
  isMobile(): boolean {
    return Capacitor.getPlatform() !== 'web';
  },
  
  /**
   * Check if the app is running on iOS
   */
  isIOS(): boolean {
    return Capacitor.getPlatform() === 'ios';
  },
  
  /**
   * Check if the app is running on Android
   */
  isAndroid(): boolean {
    return Capacitor.getPlatform() === 'android';
  },
  
  /**
   * Check if the app is running in a web browser
   */
  isWeb(): boolean {
    return Capacitor.getPlatform() === 'web';
  },
  
  /**
   * Get the platform name
   */
  getPlatform(): string {
    return Capacitor.getPlatform();
  },

  /**
   * Check if the device has network connectivity
   */
  async hasNetworkConnectivity(): Promise<boolean> {
    return navigator.onLine;
  },
  
  /**
   * Get the network connection type (wifi, cellular, none)
   * This is a simplified implementation - for real implementation, you would use
   * Capacitor's Network API which requires additional plugin
   */
  getNetworkConnectionType(): 'wifi' | 'cellular' | 'none' {
    if (!navigator.onLine) return 'none';
    // This is simplified - in a real app we would use Capacitor Network plugin
    // to distinguish between wifi and cellular
    return 'wifi';
  }
};

// Additional utility for safe API calls with offline detection
export const safeApiCall = async <T>(
  apiCallFn: () => Promise<T>,
  options?: {
    offlineMessage?: string;
    fallback?: T;
    retryCount?: number;
  }
): Promise<T> => {
  const { offlineMessage = "You're offline. Please check your connection.", fallback, retryCount = 2 } = options || {};
  
  let attempts = 0;
  const maxAttempts = retryCount + 1; // +1 for initial attempt

  while (attempts < maxAttempts) {
    try {
      if (!navigator.onLine) {
        throw new Error('NETWORK_OFFLINE');
      }
      
      return await apiCallFn();
    } catch (error) {
      attempts++;
      const isOfflineError = 
        (error instanceof Error && error.message === 'NETWORK_OFFLINE') ||
        (error instanceof Error && error.message.includes('network')) ||
        (!navigator.onLine);

      if (isOfflineError) {
        if (fallback !== undefined) {
          console.warn('Network offline, using fallback data');
          return fallback;
        }
        throw new Error(offlineMessage);
      }
      
      if (attempts >= maxAttempts) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 500));
    }
  }
  
  // This line should never be reached due to the loop above
  throw new Error('Failed after maximum retry attempts');
};
