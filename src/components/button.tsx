import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:ring-offset-2 aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white shadow-sm hover:bg-primary-700 focus-visible:ring-primary-500/20 active:bg-primary-800",
        destructive:
          "bg-error text-white shadow-sm hover:bg-error/90 focus-visible:ring-error/20 dark:focus-visible:ring-error/40 active:bg-error/80",
        outline:
          "border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 dark:bg-neutral-800 dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-50",
        secondary:
          "bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-200 focus-visible:ring-neutral-500/20 active:bg-neutral-300",
        ghost:
          "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        link: "text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline",
        success:
          "bg-success text-white shadow-sm hover:bg-success/90 focus-visible:ring-success/20 active:bg-success/80",
        warning:
          "bg-warning text-white shadow-sm hover:bg-warning/90 focus-visible:ring-warning/20 active:bg-warning/80",
        info: "bg-info text-white shadow-sm hover:bg-info/90 focus-visible:ring-info/20 active:bg-info/80",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-lg px-6 has-[>svg]:px-4",
        xl: "h-14 rounded-lg px-8 has-[>svg]:px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
