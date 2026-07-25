import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'glass';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', as = 'button', ...props }, ref) => {
    const Comp = as;
    return (
      <Comp
        ref={ref as any}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20': variant === 'default',
            'border border-surface-border bg-transparent hover:bg-surface-hover text-text-main': variant === 'outline',
            'hover:bg-surface-hover text-text-main': variant === 'ghost',
            'glass glass-hover text-text-main': variant === 'glass',
            'h-9 px-4 py-2': size === 'default',
            'h-8 rounded-full px-3 text-xs': size === 'sm',
            'h-10 rounded-full px-8': size === 'lg',
            'h-9 w-9': size === 'icon',
          },
          className
        )}
        {...(props as any)}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
