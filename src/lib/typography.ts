
import { cn } from './utils';

// Enhanced typography system for better text hierarchy
export const typography = {
  // Display text - for hero sections and large headings
  display: {
    large: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
    medium: "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
    small: "text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight"
  },
  
  // Headings with improved hierarchy
  heading: {
    h1: "text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white",
    h2: "text-xl md:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white",
    h3: "text-lg md:text-xl font-semibold tracking-tight text-gray-800 dark:text-gray-100",
    h4: "text-base md:text-lg font-medium tracking-tight text-gray-800 dark:text-gray-100",
    h5: "text-sm md:text-base font-medium text-gray-700 dark:text-gray-200",
    h6: "text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300"
  },
  
  // Body text with better readability
  body: {
    large: "text-lg leading-relaxed text-gray-700 dark:text-gray-300",
    medium: "text-base leading-relaxed text-gray-700 dark:text-gray-300",
    small: "text-sm leading-relaxed text-gray-600 dark:text-gray-400"
  },
  
  // UI text for buttons, labels, etc.
  ui: {
    button: "text-sm font-medium tracking-wide",
    label: "text-sm font-medium text-gray-700 dark:text-gray-300",
    caption: "text-xs text-gray-500 dark:text-gray-400",
    badge: "text-xs font-medium tracking-wide"
  },
  
  // Rich text content
  richText: {
    prose: "prose prose-gray dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded dark:prose-code:bg-gray-800",
    content: "leading-relaxed text-gray-700 dark:text-gray-300 space-y-4"
  }
};

// Helper functions for applying typography
export const applyTypography = (variant: keyof typeof typography, size?: string, className?: string) => {
  const baseClasses = typography[variant] as any;
  const sizeClasses = size && baseClasses[size] ? baseClasses[size] : baseClasses;
  return cn(sizeClasses, className);
};

export const richTextStyles = cn(
  typography.richText.prose,
  "prose-sm md:prose-base lg:prose-lg"
);
