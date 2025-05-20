
/**
 * Device Service
 * Utility service to handle device detection and capabilities
 */

export const DeviceService = {
  /**
   * Check if the current device is a mobile device
   * @returns {boolean} True if the current device is a mobile device
   */
  isMobile(): boolean {
    // Check if running in a browser environment
    if (typeof window === 'undefined') {
      return false;
    }
    
    // Check for typical mobile user agents
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Regular expressions for mobile detection
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    
    // Check screen width (common mobile breakpoint)
    const isSmallScreen = window.innerWidth < 768;
    
    // Check if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Combined checks for more accurate detection
    return mobileRegex.test(userAgent) || (isSmallScreen && isTouchDevice);
  },
  
  /**
   * Check if the device supports touch input
   * @returns {boolean} True if the device supports touch input
   */
  isTouchDevice(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    
    return (
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      (window as any).DocumentTouch
    );
  },
  
  /**
   * Get the device orientation
   * @returns {'portrait' | 'landscape'} Current device orientation
   */
  getOrientation(): 'portrait' | 'landscape' {
    if (typeof window === 'undefined') {
      return 'landscape'; // Default for SSR
    }
    
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  },
  
  /**
   * Check if the application is running as a PWA/installed app
   * @returns {boolean} True if the app is running in standalone mode (installed)
   */
  isInstalledPWA(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  },
  
  /**
   * Get the device type based on screen size
   * @returns {'mobile' | 'tablet' | 'desktop'} Device type
   */
  getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') {
      return 'desktop'; // Default for SSR
    }
    
    const width = window.innerWidth;
    
    if (width < 768) {
      return 'mobile';
    } else if (width >= 768 && width < 1024) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  },
  
  /**
   * Check if the device has a slow connection
   * @returns {Promise<boolean>} Promise resolving to true if the connection is slow
   */
  async hasSlowConnection(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return false;
    }
    
    const connection = (navigator as any).connection;
    
    if (connection) {
      // Network Information API is available
      return connection.saveData || 
             connection.effectiveType === 'slow-2g' || 
             connection.effectiveType === '2g' ||
             connection.downlink < 0.5;  // Less than 0.5 Mbps
    }
    
    // Fallback: check by measuring resource load time
    try {
      const start = Date.now();
      const response = await fetch('/favicon.ico', { cache: 'no-store' });
      const end = Date.now();
      
      // If loading a tiny resource takes more than 300ms, consider it a slow connection
      return end - start > 300;
    } catch (error) {
      console.error('Error checking connection speed:', error);
      return false;
    }
  }
};

export default DeviceService;
