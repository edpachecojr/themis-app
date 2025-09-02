"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendIndicatorProps {
  value: number;
  className?: string;
}

export function TrendIndicator({ value, className }: TrendIndicatorProps) {
  const getTrendData = () => {
    if (value > 0) {
      return {
        icon: TrendingUp,
        color: "text-success",
        bgColor: "bg-success/10",
        text: "Crescimento",
      };
    } else if (value < 0) {
      return {
        icon: TrendingDown,
        color: "text-error",
        bgColor: "bg-error/10",
        text: "Queda",
      };
    } else {
      return {
        icon: Minus,
        color: "text-neutral-600",
        bgColor: "bg-neutral-100",
        text: "Estável",
      };
    }
  };

  const trendData = getTrendData();
  const Icon = trendData.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium",
        trendData.bgColor,
        className
      )}
    >
      <Icon className={cn("h-4 w-4", trendData.color)} />
      <span className={cn("font-medium", trendData.color)}>
        {trendData.text}
      </span>
    </div>
  );
}
