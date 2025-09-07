"use client";

import { TrendingUp, Users, Calendar, BookOpen, Award, Activity, Clock, Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

export function UserSectionCards() {
  const { user } = useAuth();
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200 hover:ring-emerald-300 transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Membership Status</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Award className="h-4 w-4 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {user?.membershipStatus || "Active"}
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              {user?.membershipExpiry || "Valid until 2025"}
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200 hover:ring-blue-300 transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Events Attended</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {user?.eventsAttended || 12}
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{user?.eventsThisMonth || 3} this month
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200 hover:ring-purple-300 transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Publications Read</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {user?.publicationsRead || 28}
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{user?.publicationsThisWeek || 5} this week
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm border-0 ring-1 ring-gray-200 hover:ring-orange-300 transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Network Connections</CardTitle>
          <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <Users className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {user?.networkConnections || 47}
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{user?.newConnections || 2} new
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
