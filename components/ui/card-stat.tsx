import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CardStatProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: number;
  trendDirection?: "up" | "down" | "neutral";
  className?: string;
  iconClassName?: string;
}

export function CardStat({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendDirection = "neutral",
  className,
  iconClassName,
}: CardStatProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm p-6 transition-all duration-200 hover:shadow-md",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-3xl font-bold">{value}</h3>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
          {trend !== undefined && (
            <div className="mt-2 flex items-center">
              <span
                className={cn(
                  "text-xs font-medium",
                  trendDirection === "up" && "text-green-600",
                  trendDirection === "down" && "text-red-600",
                  trendDirection === "neutral" && "text-muted-foreground"
                )}
              >
                {trendDirection === "up" && "+"}
                {trendDirection === "down" && "-"}
                {Math.abs(trend)}%
              </span>
              <span className="ml-1 text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full bg-primary/10",
          iconClassName
        )}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
} 