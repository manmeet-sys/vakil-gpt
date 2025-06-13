
import React from 'react';
import { Input, InputProps } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';

interface MobileInputProps extends InputProps {
  label?: string;
  description?: string;
  error?: string;
  fullWidth?: boolean;
}

interface MobileTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
  fullWidth?: boolean;
}

export const MobileInput: React.FC<MobileInputProps> = ({
  label,
  description,
  error,
  fullWidth = true,
  className,
  ...props
}) => {
  return (
    <div className={cn("space-y-2", fullWidth && "w-full")}>
      {label && (
        <Label className={cn(typography.ui.label, "text-sm md:text-base")}>
          {label}
        </Label>
      )}
      <Input
        className={cn(
          "h-12 md:h-10 text-base md:text-sm", // Larger touch targets on mobile
          "border-gray-200 dark:border-gray-700",
          "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "transition-all duration-200",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {description && (
        <p className={cn(typography.ui.caption, "text-xs md:text-sm text-gray-500")}>
          {description}
        </p>
      )}
      {error && (
        <p className={cn(typography.ui.caption, "text-xs md:text-sm text-red-500")}>
          {error}
        </p>
      )}
    </div>
  );
};

export const MobileTextarea: React.FC<MobileTextareaProps> = ({
  label,
  description,
  error,
  fullWidth = true,
  className,
  ...props
}) => {
  return (
    <div className={cn("space-y-2", fullWidth && "w-full")}>
      {label && (
        <Label className={cn(typography.ui.label, "text-sm md:text-base")}>
          {label}
        </Label>
      )}
      <Textarea
        className={cn(
          "min-h-[120px] md:min-h-[100px] text-base md:text-sm", // Better mobile experience
          "border-gray-200 dark:border-gray-700",
          "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "transition-all duration-200",
          "resize-none", // Prevent resize on mobile
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {description && (
        <p className={cn(typography.ui.caption, "text-xs md:text-sm text-gray-500")}>
          {description}
        </p>
      )}
      {error && (
        <p className={cn(typography.ui.caption, "text-xs md:text-sm text-red-500")}>
          {error}
        </p>
      )}
    </div>
  );
};
