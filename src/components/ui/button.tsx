
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-apple-blue text-white hover:bg-apple-blue/90 shadow-sm",
        destructive:
          "bg-apple-red text-white hover:bg-apple-red/90 shadow-sm",
        outline:
          "border border-apple-gray/30 bg-background hover:bg-apple-light-gray hover:text-accent-foreground dark:border-apple-gray/20 dark:hover:bg-apple-gray/20",
        secondary:
          "bg-apple-light-gray text-apple-dark-gray hover:bg-apple-light-gray/80 shadow-sm dark:bg-apple-gray/20 dark:text-white dark:hover:bg-apple-gray/30",
        ghost: "hover:bg-apple-light-gray hover:text-apple-dark-gray dark:hover:bg-apple-gray/20 dark:hover:text-white",
        link: "text-apple-blue underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-full px-4 py-2 text-xs",
        lg: "h-12 rounded-full px-6 py-3 text-base",
        icon: "h-10 w-10",
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
