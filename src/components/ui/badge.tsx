// 🏷️ shadcn/ui Badge — CVA-based status/role badge
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  // 🏗️ Base
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-50 text-primary-700 border-primary-200",
        secondary: "bg-neutral-100 text-neutral-600 border-neutral-200",
        success: "bg-secondary-50 text-secondary-700 border-secondary-200",
        danger: "bg-danger-50 text-danger-700 border-danger-200",
        warning: "bg-amber-50 text-amber-700 border-amber-200",
        outline: "border-neutral-200 text-neutral-600 bg-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
