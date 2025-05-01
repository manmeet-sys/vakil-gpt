
import { cn } from './utils';

/**
 * VakilGPT Design System Standards
 * This file contains standardized design tokens and utility functions
 * to ensure consistent appearance across all components
 */
export const designSystem = {
  // Color palette - reuse these instead of hardcoded colors
  colors: {
    // Primary blues
    blue: {
      50: '#EBF8FF',
      100: '#BEE3F8', 
      200: '#90CDF4',
      300: '#63B3ED',
      400: '#4299E1',
      500: '#3182CE', // Primary blue
      600: '#2B6CB0',
      700: '#2C5282',
      800: '#1A365D', // Legal slate
      900: '#1A202C', // Dark blue
    },
    
    // Accent colors
    accent: {
      purple: {
        light: '#E9D8FD',
        medium: '#9F7AEA',
        DEFAULT: '#805AD5',
        dark: '#553C9A',
      },
      orange: {
        light: '#FEEBC8',
        medium: '#F6AD55',  
        DEFAULT: '#ED8936',
        dark: '#C05621',
      },
      green: {
        light: '#C6F6D5',
        medium: '#68D391',
        DEFAULT: '#38A169',
        dark: '#2F855A',
      },
      red: {
        light: '#FED7D7',
        medium: '#FC8181',
        DEFAULT: '#E53E3E',
        dark: '#C53030',
      }
    },
    
    // Neutral colors
    neutral: {
      50: '#F7FAFC',
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      600: '#4A5568',
      700: '#2D3748',
      800: '#1A202C',
      900: '#171923',
    }
  },
  
  // Typography
  typography: {
    // Font sizes
    fontSize: {
      xs: 'text-xs',      // 12px
      sm: 'text-sm',      // 14px
      base: 'text-base',  // 16px
      lg: 'text-lg',      // 18px
      xl: 'text-xl',      // 20px
      '2xl': 'text-2xl',  // 24px
      '3xl': 'text-3xl',  // 30px
      '4xl': 'text-4xl',  // 36px
      '5xl': 'text-5xl',  // 48px
    },
    
    // Font weights
    fontWeight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    
    // Line heights
    lineHeight: {
      none: 'leading-none',
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    },
    
    // Tracking (letter spacing)
    letterSpacing: {
      tighter: 'tracking-tighter',
      tight: 'tracking-tight',
      normal: 'tracking-normal',
      wide: 'tracking-wide',
    },
    
    // Heading styles - reuse across all components
    headings: {
      h1: 'text-3xl sm:text-4xl font-semibold tracking-tight text-blue-slate dark:text-blue-light',
      h2: 'text-2xl sm:text-3xl font-semibold tracking-tight text-blue-slate dark:text-blue-light',
      h3: 'text-xl sm:text-2xl font-medium tracking-tight text-blue-slate dark:text-blue-light',
      h4: 'text-lg sm:text-xl font-medium text-blue-slate dark:text-blue-light',
      h5: 'text-base sm:text-lg font-medium text-blue-slate dark:text-blue-light',
      h6: 'text-sm sm:text-base font-medium text-blue-slate dark:text-blue-light',
    },
    
    // Body text styles
    body: {
      default: 'text-base text-gray-700 dark:text-gray-300',
      large: 'text-lg text-gray-700 dark:text-gray-300',
      small: 'text-sm text-gray-600 dark:text-gray-400',
      muted: 'text-sm text-gray-500 dark:text-gray-500',
    }
  },
  
  // Spacing
  spacing: {
    section: 'py-8 sm:py-12 lg:py-16',
    container: 'px-4 sm:px-6 lg:px-8',
    stack: {
      xs: 'space-y-2',
      sm: 'space-y-4',
      md: 'space-y-6',
      lg: 'space-y-8',
      xl: 'space-y-12',
    },
    inline: {
      xs: 'space-x-2',
      sm: 'space-x-4',
      md: 'space-x-6',
      lg: 'space-x-8',
      xl: 'space-x-12',
    }
  },
  
  // Shadows
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    elegant: 'shadow-[0_10px_25px_-3px_rgba(0,0,0,0.05),_0_4px_10px_-2px_rgba(0,0,0,0.02)]',
    elevated: 'shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)]',
    card: 'shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
    blue: 'shadow-[0_2px_10px_rgba(29,78,216,0.05)]',
  },
  
  // Borders
  borders: {
    sm: 'border border-gray-200 dark:border-gray-800',
    md: 'border-2 border-gray-200 dark:border-gray-800',
    primary: 'border border-blue-300 dark:border-blue-800',
    interactive: 'border border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600',
    rounded: {
      sm: 'rounded-sm',
      DEFAULT: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      full: 'rounded-full',
    },
  },
  
  // Transitions
  transitions: {
    default: 'transition-all duration-200',
    fast: 'transition-all duration-150',
    slow: 'transition-all duration-300',
  },
  
  // Standard card styles
  cards: {
    default: 'bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm',
    interactive: 'bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200',
    primary: 'bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30 shadow-sm',
  },
  
  // Buttons - compatible with shadcn/ui buttons
  buttons: {
    sizes: {
      xs: 'h-8 px-3 text-xs',
      sm: 'h-9 px-4 text-sm',
      md: 'h-10 px-5 text-sm',
      lg: 'h-11 px-6 text-base',
      xl: 'h-12 px-8 text-base',
    },
  },
  
  // Form elements
  forms: {
    label: 'text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block',
    input: 'w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600',
    helpText: 'text-xs text-gray-500 dark:text-gray-400 mt-1',
    errorText: 'text-xs text-red-600 dark:text-red-400 mt-1',
  },
  
  // Accessibility helpers
  a11y: {
    visuallyHidden: 'sr-only',
    focusRing: 'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900',
    screenReaderOnly: 'absolute w-px h-px p-0 m-[-1px] overflow-hidden clip-rect-0 whitespace-nowrap border-0',
  },
  
  // Helper functions for consistent styling  
  apply: {
    heading: (level: 1 | 2 | 3 | 4 | 5 | 6, className?: string) => {
      const key = `h${level}` as keyof typeof designSystem.typography.headings;
      return cn(designSystem.typography.headings[key], className);
    },
    
    card: (variant: 'default' | 'interactive' | 'primary' = 'default', className?: string) => {
      return cn(designSystem.cards[variant], className);
    },
    
    // Add focus ring to interactive elements
    focusRing: (className?: string) => {
      return cn(designSystem.a11y.focusRing, className);
    },
  }
};

export default designSystem;
