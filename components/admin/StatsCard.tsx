import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "blue" | "green" | "yellow" | "red" | "purple" | "indigo";
  trend?: "up" | "down";
}

const colorVariants = {
  blue: {
    bg: "from-blue-400 to-blue-500",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    changeBg: "bg-blue-50",
    changeText: "text-blue-700",
  },
  green: {
    bg: "from-green-400 to-green-500",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    changeBg: "bg-green-50",
    changeText: "text-green-700",
  },
  yellow: {
    bg: "from-yellow-400 to-yellow-500",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    changeBg: "bg-yellow-50",
    changeText: "text-yellow-700",
  },
  red: {
    bg: "from-red-400 to-red-500",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    changeBg: "bg-red-50",
    changeText: "text-red-700",
  },
  purple: {
    bg: "from-purple-400 to-purple-500",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    changeBg: "bg-purple-50",
    changeText: "text-purple-700",
  },
  indigo: {
    bg: "from-indigo-400 to-indigo-500",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    changeBg: "bg-indigo-50",
    changeText: "text-indigo-700",
  },
};

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  trend,
}: StatsCardProps) {
  const colors = colorVariants[color];
  const isPositive = change.startsWith("+");
  const actualTrend = trend || (isPositive ? "up" : "down");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
                colors.changeBg,
                colors.changeText
              )}
            >
              {actualTrend === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{change}</span>
            </div>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        </div>

        <div className="ml-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
              `bg-linear-to-br ${colors.bg}`
            )}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
