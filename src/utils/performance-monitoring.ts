
/**
 * Utility for monitoring performance in the application
 */
export const performanceMonitor = {
  /**
   * Measures execution time of a function
   * @param component Component or feature name
   * @param operation Operation being measured
   * @param fn Function to execute and measure
   * @returns Return value of the function
   */
  measure: <T>(component: string, operation: string, fn: () => T): T => {
    const start = performance.now();
    try {
      return fn();
    } finally {
      const duration = performance.now() - start;
      console.log(`[Performance] ${component}.${operation}: ${duration.toFixed(2)}ms`);
    }
  },

  /**
   * Measures execution time of an async function
   * @param component Component or feature name
   * @param operation Operation being measured
   * @param fn Async function to execute and measure
   * @returns Promise resolving to the return value of the function
   */
  measureAsync: async <T>(component: string, operation: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      const duration = performance.now() - start;
      console.log(`[Performance] ${component}.${operation}: ${duration.toFixed(2)}ms`);
    }
  }
};
