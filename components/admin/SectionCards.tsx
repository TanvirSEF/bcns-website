import { TrendingDown, TrendingUp, Users, Clock, Calendar, DollarSign } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200 hover:ring-blue-300 transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">1,247</div>
          <div className="flex items-center space-x-2 mt-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12%
            </Badge>
            <p className="text-xs text-gray-500">from last month</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200 hover:ring-orange-300 transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Pending Approvals</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <Clock className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">23</div>
          <div className="flex items-center space-x-2 mt-3">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
              <TrendingDown className="h-3 w-3 mr-1" />
              -8%
            </Badge>
            <p className="text-xs text-gray-500">from last week</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200 hover:ring-green-300 transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Active Events</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">8</div>
          <div className="flex items-center space-x-2 mt-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              +25%
            </Badge>
            <p className="text-xs text-gray-500">from last month</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200 hover:ring-purple-300 transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">৳45,000</div>
          <div className="flex items-center space-x-2 mt-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18%
            </Badge>
            <p className="text-xs text-gray-500">from last month</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
