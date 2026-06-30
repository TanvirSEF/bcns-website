import { TrendingUp } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SimpleChart() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Member Growth</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total members and events for the last 10 months
          </span>
          <span className="@[540px]/card:hidden">Last 10 months</span>
        </CardDescription>
        <CardAction>
          <Select defaultValue="10m">
            <SelectTrigger
              className="flex w-40"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 10 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="10m" className="rounded-lg">
                Last 10 months
              </SelectItem>
              <SelectItem value="6m" className="rounded-lg">
                Last 6 months
              </SelectItem>
              <SelectItem value="3m" className="rounded-lg">
                Last 3 months
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="aspect-auto min-h-56 w-full bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-2" />
            <p className="text-gray-600">Chart visualization would go here</p>
            <p className="text-sm text-gray-500">Member growth over time</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
