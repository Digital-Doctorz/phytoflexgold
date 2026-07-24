import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-label-md font-label-md uppercase tracking-widest",
  {
    variants: {
      variant: {
        default: "bg-surface-container-highest text-on-surface",
        primary: "bg-primary-container/15 text-primary-container border border-primary-container/20",
        secondary: "bg-secondary/15 text-secondary border border-secondary/20",
        success: "bg-green-500/15 text-green-400 border border-green-500/20",
        warning: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
        error: "bg-error-container/50 text-on-error-container",
        outline: "border border-outline-variant/30 text-on-surface-variant",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
