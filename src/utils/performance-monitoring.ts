
/**
 * Performance monitoring utility for tracking and measuring function performance
 */

interface PerformanceMetric {
  componentName: string;
  functionName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'started' | 'completed' | 'failed';
  error?: Error;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];

  /**
   * Measures the execution time of an async function
   */
  async measureAsync<T>(
    componentName: string, 
    functionName: string, 
    fn: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    
    const metric: PerformanceMetric = {
      componentName,
      functionName,
      startTime,
      status: 'started'
    };
    
    this.metrics.push(metric);
    
    try {
      const result = await fn();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Update the metric
      metric.endTime = endTime;
      metric.duration = duration;
      metric.status = 'completed';
      
      console.log(`[Performance] ${componentName}.${functionName} completed in ${duration.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Update the metric with error information
      metric.endTime = endTime;
      metric.duration = duration;
      metric.status = 'failed';
      metric.error = error instanceof Error ? error : new Error(String(error));
      
      console.error(`[Performance] ${componentName}.${functionName} failed after ${duration.toFixed(2)}ms:`, error);
      
      throw error;
    }
  }

  /**
   * Measures the execution time of a synchronous function
   */
  measure<T>(
    componentName: string,
    functionName: string,
    fn: () => T
  ): T {
    const startTime = performance.now();
    
    try {
      const result = fn();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.metrics.push({
        componentName,
        functionName,
        startTime,
        endTime,
        duration,
        status: 'completed'
      });
      
      console.log(`[Performance] ${componentName}.${functionName} executed in ${duration.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.metrics.push({
        componentName,
        functionName,
        startTime,
        endTime,
        duration,
        status: 'failed',
        error: error instanceof Error ? error : new Error(String(error))
      });
      
      console.error(`[Performance] ${componentName}.${functionName} failed after ${duration.toFixed(2)}ms:`, error);
      
      throw error;
    }
  }

  /**
   * Get all collected performance metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Clear all collected metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Gets metrics for a specific component
   */
  getComponentMetrics(componentName: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.componentName === componentName);
  }

  /**
   * Gets the average duration for a specific function
   */
  getAverageDuration(componentName: string, functionName: string): number | null {
    const relevantMetrics = this.metrics.filter(
      metric => 
        metric.componentName === componentName && 
        metric.functionName === functionName &&
        metric.status === 'completed' &&
        typeof metric.duration === 'number'
    );
    
    if (relevantMetrics.length === 0) {
      return null;
    }
    
    const totalDuration = relevantMetrics.reduce((sum, metric) => sum + (metric.duration || 0), 0);
    return totalDuration / relevantMetrics.length;
  }
}

// Export a singleton instance
export const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;
