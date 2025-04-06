
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#006039] text-white hover:bg-[#006039]/90 shadow-sm",
        destructive:
          "bg-[#C0392B] text-white hover:bg-[#C0392B]/90 shadow-sm",
        outline:
          "border border-[#7F8C8D]/30 bg-background hover:bg-[#F0F0F0] hover:text-accent-foreground dark:border-[#7F8C8D]/20 dark:hover:bg-[#7F8C8D]/20",
        secondary:
          "bg-[#F0F0F0] text-[#4A6572] hover:bg-[#F0F0F0]/80 shadow-sm dark:bg-[#7F8C8D]/20 dark:text-white dark:hover:bg-[#7F8C8D]/30",
        ghost: "hover:bg-[#F0F0F0] hover:text-[#4A6572] dark:hover:bg-[#7F8C8D]/20 dark:hover:text-white",
        link: "text-[#006039] underline-offset-4 hover:underline",
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
