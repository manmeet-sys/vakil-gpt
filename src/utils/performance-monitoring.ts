
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Performance monitoring utility to track and report application performance metrics
 */

// Performance thresholds in milliseconds
const THRESHOLDS = {
  RENDER: 500,
  NETWORK: 1000,
  INTERACTION: 200,
};

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
    return;
  }
  
  // Create performance observer for interactions
  try {
    const interactionObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > THRESHOLDS.INTERACTION) {
          console.warn(`Slow interaction detected: ${entry.name} took ${entry.duration.toFixed(1)}ms`);
          reportPerformanceIssue('interaction', entry.name, entry.duration);
        }
      });
    });
    
    interactionObserver.observe({ type: 'event', buffered: true });
    return 'Monitoring initialized';
  } catch (err) {
    console.error('Performance monitoring initialization failed:', err);
    return;
  }
}

// Track component render performance
export function trackRenderPerformance(componentName: string) {
  const startTime = performance.now();
  
  return () => {
    const duration = performance.now() - startTime;
    if (duration > THRESHOLDS.RENDER) {
      console.warn(`Slow render detected: ${componentName} took ${duration.toFixed(1)}ms`);
      reportPerformanceIssue('render', componentName, duration);
    }
  };
}

// Track network request performance
export function trackNetworkPerformance() {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
    return;
  }
  
  try {
    const networkObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > THRESHOLDS.NETWORK) {
          console.warn(`Slow network request detected: ${entry.name} took ${entry.duration.toFixed(1)}ms`);
          reportPerformanceIssue('network', entry.name, entry.duration);
        }
      });
    });
    
    networkObserver.observe({ type: 'resource', buffered: true });
  } catch (err) {
    console.error('Network performance monitoring initialization failed:', err);
  }
}

// Report performance issues
function reportPerformanceIssue(type: 'render' | 'network' | 'interaction', name: string, duration: number) {
  // Log to console
  console.warn(`Performance issue detected: ${type} - ${name} - ${duration.toFixed(1)}ms`);
  
  // In a real app, we might send this to an analytics service
  if (duration > THRESHOLDS.NETWORK * 2) {
    toast.warning(`Slow ${type} detected. Please report if this persists.`, {
      position: 'bottom-left',
      duration: 3000,
    });
  }
}

// Hook for tracking performance in function components
export function usePerformanceTracking(componentName: string) {
  useEffect(() => {
    const endTracking = trackRenderPerformance(componentName);
    return endTracking;
  }, [componentName]);
}
