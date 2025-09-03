"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isVisible?: boolean;
  title?: string;
  message?: string;
  className?: string;
}

export function LoadingOverlay({
  isVisible = true,
  title,
  message = "Carregando...",
  className,
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 rounded-lg border border-neutral-200 bg-white p-8 shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        {title && (
          <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
        )}
        <p className="text-sm font-medium text-neutral-700">{message}</p>
      </div>
    </div>
  );
}
