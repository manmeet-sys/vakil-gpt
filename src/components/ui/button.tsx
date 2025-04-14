
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-blue-accent text-white hover:bg-blue-accent/90 shadow-sm",
        destructive:
          "bg-blue-error text-white hover:bg-blue-error/90 shadow-sm",
        outline:
          "border border-blue-border bg-background hover:bg-blue-light hover:text-accent-foreground dark:border-blue-muted/20 dark:hover:bg-blue-info/20",
        secondary:
          "bg-blue-light text-blue-slate hover:bg-blue-light/80 shadow-sm dark:bg-blue-info/20 dark:text-blue-light dark:hover:bg-blue-info/30",
        ghost: "hover:bg-blue-light hover:text-blue-slate dark:hover:bg-blue-info/20 dark:hover:text-blue-light",
        link: "text-blue-accent underline-offset-4 hover:underline",
        advocate: "bg-purple-600 text-white hover:bg-purple-700 shadow-sm dark:bg-purple-700 dark:hover:bg-purple-800 pointer-events-auto",
        success: "bg-green-600 text-white hover:bg-green-700 shadow-sm dark:bg-green-700 dark:hover:bg-green-800",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-full px-4 py-2 text-xs",
        lg: "h-12 rounded-full px-6 py-3 text-base",
        icon: "h-10 w-10",
        action: "h-10 px-4 py-2 text-sm font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
