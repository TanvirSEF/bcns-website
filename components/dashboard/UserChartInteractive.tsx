"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", activities: 5, publications: 2 },
  { month: "February", activities: 8, publications: 4 },
  { month: "March", activities: 12, publications: 6 },
  { month: "April", activities: 15, publications: 8 },
  { month: "May", activities: 18, publications: 10 },
  { month: "June", activities: 22, publications: 12 },
];

const chartConfig = {
  activities: {
    label: "Activities",
    color: "hsl(var(--chart-1))",
  },
  publications: {
    label: "Publications",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function UserChartInteractive() {
  return (
    <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">My Activity Overview</CardTitle>
        <CardDescription className="text-gray-600">
          Your engagement with BCNS activities and publications over the past 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="publications"
              type="natural"
              fill="var(--color-publications)"
              fillOpacity={0.4}
              stroke="var(--color-publications)"
              stackId="a"
            />
            <Area
              dataKey="activities"
              type="natural"
              fill="var(--color-activities)"
              fillOpacity={0.4}
              stroke="var(--color-activities)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Your engagement is trending up by 32% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Keep up the great work with your professional development!
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
