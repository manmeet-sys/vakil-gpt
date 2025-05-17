
import { Capacitor } from '@capacitor/core';

// Safe Network import that won't break if the module isn't available
let Network: any = null;
try {
  import('@capacitor/network').then(module => {
    Network = module.Network;
  }).catch(error => {
    console.warn('Capacitor Network plugin not available:', error.message);
  });
} catch (error) {
  console.warn('Error importing Capacitor Network plugin:', error);
}

export const DeviceService = {
  /**
   * Check if the app is running on a mobile device
   */
  isMobile(): boolean {
    try {
      return Capacitor.getPlatform() !== 'web';
    } catch (error) {
      console.warn('Error checking platform:', error);
      return false;
    }
  },
  
  /**
   * Check if the app is running on iOS
   */
  isIOS(): boolean {
    try {
      return Capacitor.getPlatform() === 'ios';
    } catch (error) {
      console.warn('Error checking if platform is iOS:', error);
      return false;
    }
  },
  
  /**
   * Check if the app is running on Android
   */
  isAndroid(): boolean {
    try {
      return Capacitor.getPlatform() === 'android';
    } catch (error) {
      console.warn('Error checking if platform is Android:', error);
      return false;
    }
  },
  
  /**
   * Check if the app is running in a web browser
   */
  isWeb(): boolean {
    try {
      return Capacitor.getPlatform() === 'web';
    } catch (error) {
      console.warn('Error checking if platform is web:', error);
      return true; // Default to web if there's an error
    }
  },
  
  /**
   * Get the platform name
   */
  getPlatform(): string {
    try {
      return Capacitor.getPlatform();
    } catch (error) {
      console.warn('Error getting platform:', error);
      return 'web'; // Default to web if there's an error
    }
  },

  /**
   * Check if the device has network connectivity
   * Falls back to navigator.onLine if Capacitor Network plugin isn't available
   */
  async hasNetworkConnectivity(): Promise<boolean> {
    try {
      if (Network) {
        const status = await Network.getStatus();
        return status.connected;
      }
    } catch (error) {
      console.warn('Error checking network connectivity:', error);
    }
    
    // Fallback to browser API
    return navigator.onLine;
  },
  
  /**
   * Get the network connection type (wifi, cellular, none)
   * Falls back to simple online/offline detection if Capacitor Network plugin isn't available
   */
  getNetworkConnectionType(): 'wifi' | 'cellular' | 'none' {
    try {
      if (!navigator.onLine) {
        return 'none';
      }

      // If we can't access Network plugin details, just report 'wifi' for online state
      // In a real app, we would use Network.getStatus().connectionType
      return 'wifi';
    } catch (error) {
      console.warn('Error getting network connection type:', error);
      return navigator.onLine ? 'wifi' : 'none';
    }
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
