
/**
 * Performance monitoring utilities
 * Helps track, measure and report performance metrics
 */
import React from 'react';

interface PerformanceEntry {
  component: string;
  action: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private measurements: Map<string, PerformanceEntry> = new Map();
  private completedMeasurements: PerformanceEntry[] = [];
  
  /**
   * Start timing a performance measurement
   */
  start(component: string, action: string): string {
    const id = `${component}-${action}-${Date.now()}`;
    this.measurements.set(id, {
      component,
      action,
      startTime: performance.now()
    });
    
    return id;
  }
  
  /**
   * End timing a performance measurement
   */
  end(id: string): PerformanceEntry | undefined {
    const measurement = this.measurements.get(id);
    if (!measurement) {
      console.warn(`Performance measurement ${id} not found`);
      return;
    }
    
    const endTime = performance.now();
    const duration = endTime - measurement.startTime;
    
    const completedMeasurement: PerformanceEntry = {
      ...measurement,
      endTime,
      duration
    };
    
    this.completedMeasurements.push(completedMeasurement);
    this.measurements.delete(id);
    
    // Log performance metrics for critical paths
    if (duration > 500) {
      console.warn(`Slow ${completedMeasurement.component} ${completedMeasurement.action}: ${duration.toFixed(2)}ms`);
    }
    
    return completedMeasurement;
  }
  
  /**
   * Measure a function execution time
   */
  measure<T>(component: string, action: string, fn: () => T): T {
    const id = this.start(component, action);
    try {
      return fn();
    } finally {
      this.end(id);
    }
  }
  
  /**
   * Measure an async function execution time
   */
  async measureAsync<T>(component: string, action: string, fn: () => Promise<T>): Promise<T> {
    const id = this.start(component, action);
    try {
      return await fn();
    } finally {
      this.end(id);
    }
  }
  
  /**
   * Get performance report
   */
  getReport(): PerformanceEntry[] {
    return [...this.completedMeasurements];
  }
  
  /**
   * Clear all measurements
   */
  clear(): void {
    this.measurements.clear();
    this.completedMeasurements = [];
  }
}

// Create and export a singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook to measure component render performance
 */
export function useComponentPerformance(componentName: string) {
  React.useEffect(() => {
    // Use the Web Performance API for component render timing
    const id = `${componentName}-render-${Date.now()}`;
    performance.mark(`${id}-start`);
    
    return () => {
      performance.mark(`${id}-end`);
      performance.measure(
        `${componentName} render time`,
        `${id}-start`,
        `${id}-end`
      );
      
      // Get the measurement
      const measurements = performance.getEntriesByName(`${componentName} render time`);
      const duration = measurements[0]?.duration;
      
      if (duration && duration > 200) {
        console.warn(`Slow render for ${componentName}: ${duration.toFixed(2)}ms`);
      }
      
      // Clean up marks
      performance.clearMarks(`${id}-start`);
      performance.clearMarks(`${id}-end`);
      performance.clearMeasures(`${componentName} render time`);
    };
  }, [componentName]);
}
