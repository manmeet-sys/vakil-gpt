
/**
 * Performance utilities to optimize application loading and interaction
 */

/**
 * Uses the browser's requestIdleCallback API to defer non-critical tasks
 * until the browser is idle, preventing them from blocking the main thread
 * during initial rendering
 * 
 * @param callback Function to execute during idle time
 * @param timeout Optional timeout in ms after which the callback will be called regardless of idle state
 */
export const runWhenIdle = (callback: () => void, timeout: number = 2000): void => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(callback, 100);
  }
};

/**
 * Preloads components or routes that are likely to be accessed next
 * 
 * @param importFunctions Array of import functions to preload
 */
export const preloadComponents = (importFunctions: (() => Promise<any>)[]): void => {
  runWhenIdle(() => {
    importFunctions.forEach(importFn => {
      importFn().catch(() => {
        // Silently catch errors - preloading shouldn't cause visible errors
      });
    });
  });
};

/**
 * Preloads an image to ensure it's in the browser cache when needed
 * 
 * @param src Image URL to preload
 */
export const preloadImage = (src: string): void => {
  runWhenIdle(() => {
    const img = new Image();
    img.src = src;
  });
};

/**
 * Registers performance monitoring for core web vitals
 */
export const monitorPerformance = (): void => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // Monitor LCP (Largest Contentful Paint)
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          console.debug('[Performance] LCP:', entry.startTime / 1000, 'seconds');
        });
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.error('Error setting up LCP monitoring', e);
    }
    
    // Monitor FID (First Input Delay)
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          const fid = (entry as PerformanceEventTiming).processingStart - entry.startTime;
          console.debug('[Performance] FID:', fid, 'ms');
        });
      }).observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.error('Error setting up FID monitoring', e);
    }
    
    // Monitor CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            console.debug('[Performance] CLS updated:', clsValue);
          }
        });
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error('Error setting up CLS monitoring', e);
    }
  }
};

export default {
  runWhenIdle,
  preloadComponents,
  preloadImage,
  monitorPerformance
};
