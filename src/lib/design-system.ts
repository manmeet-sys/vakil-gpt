
import { cn } from './utils';

// Common design tokens and styles
export const design = {
  // Typography
  text: {
    heading: "font-sans font-medium tracking-tight leading-snug text-gray-800 dark:text-gray-100",
    body: "font-sans text-gray-700 dark:text-gray-300 leading-relaxed",
    caption: "text-xs text-gray-500 dark:text-gray-400",
    
    // Size variants
    sizes: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    }
  },
  
  // Spacing
  spacing: {
    section: "py-8 md:py-12 lg:py-16",
    container: "px-4 md:px-6 lg:px-8",
  },
  
  // Card styles
  card: {
    base: "rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden",
    header: "p-4 md:p-6 border-b border-gray-100 dark:border-zinc-800",
    body: "p-4 md:p-6",
    footer: "p-4 md:p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50",
  },
  
  // Button styles (combining with shadcn's buttonVariants)
  button: {
    base: "rounded-full transition-all active:scale-[0.98]",
  },
  
  // Input styles
  input: {
    base: "h-12 rounded-xl border border-gray-200 dark:border-zinc-700/50 px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2",
  },
  
  // Animation
  animation: {
    fadeIn: "animate-fade-in",
    fadeUp: "animate-fade-up",
  },
  
  // Helpers
  helpers: {
    // Apply card styles with options
    applyCard: (options?: {header?: boolean, footer?: boolean, className?: string}) => {
      return cn(
        design.card.base,
        options?.className
      );
    },
    
    // Apply text styles with variants
    applyText: (size?: keyof typeof design.text.sizes, className?: string) => {
      return cn(
        design.text.body,
        size && design.text.sizes[size],
        className
      );
    },
    
    // Apply heading styles
    applyHeading: (size: keyof typeof design.text.sizes = "2xl", className?: string) => {
      return cn(
        design.text.heading,
        design.text.sizes[size],
        className
      );
    }
  }
};
