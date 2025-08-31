"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartData = [
  { date: "2024-01-01", members: 1120, events: 8 },
  { date: "2024-02-01", members: 1135, events: 12 },
  { date: "2024-03-01", members: 1148, events: 15 },
  { date: "2024-04-01", members: 1162, events: 18 },
  { date: "2024-05-01", members: 1178, events: 22 },
  { date: "2024-06-01", members: 1195, events: 25 },
  { date: "2024-07-01", members: 1210, events: 28 },
  { date: "2024-08-01", members: 1225, events: 32 },
  { date: "2024-09-01", members: 1238, events: 35 },
  { date: "2024-10-01", members: 1247, events: 38 },
];

const chartConfig = {
  visitors: {
    label: "Growth",
  },
  members: {
    label: "Members",
    color: "var(--primary)",
  },
  events: {
    label: "Events",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("10m");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-10-01");
    let monthsToSubtract = 10;
    if (timeRange === "6m") {
      monthsToSubtract = 6;
    } else if (timeRange === "3m") {
      monthsToSubtract = 3;
    }
    const startDate = new Date(referenceDate);
    startDate.setMonth(startDate.getMonth() - monthsToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">Member Growth</CardTitle>
          <CardDescription className="text-sm text-gray-500 mt-1">
            Total members and events over time
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40 border-gray-200">
            <SelectValue placeholder="Last 10 months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10m">Last 10 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="3m">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillMembers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-members)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-members)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillEvents" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-events)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-events)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value: string) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="events"
              type="natural"
              fill="url(#fillEvents)"
              stroke="var(--color-events)"
              stackId="a"
            />
            <Area
              dataKey="members"
              type="natural"
              fill="url(#fillMembers)"
              stroke="var(--color-members)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
