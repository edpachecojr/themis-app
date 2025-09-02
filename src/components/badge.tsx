import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:ring-offset-2 transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-600 text-white hover:bg-primary-700",
        secondary:
          "border-neutral-200 bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
        destructive: "border-transparent bg-error text-white hover:bg-error/90",
        outline:
          "border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 hover:text-neutral-900",
        success: "border-transparent bg-success text-white hover:bg-success/90",
        warning: "border-transparent bg-warning text-white hover:bg-warning/90",
        info: "border-transparent bg-info text-white hover:bg-info/90",
        muted:
          "border-transparent bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
