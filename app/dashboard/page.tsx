"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  Calendar,
  BookOpen,
  Users,
  Award,
  Bell,
  Activity,
  Clock,
  ExternalLink,
  Settings,
  TrendingUp,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRequireAuth } from "@/lib/auth-context";
import { UserSectionCards } from "@/components/dashboard/UserSectionCards";
import { UserChartInteractive } from "@/components/dashboard/UserChartInteractive";

export default function DashboardPage() {
  const { user, isLoading, isAuthorized } = useRequireAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // useRequireAuth will handle redirection to login if not authenticated
  if (!isAuthorized || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-700 max-w-2xl">
          Track your professional development, connect with fellow members, and stay updated with the latest in child neurology.
        </p>
      </div>

      {/* Quick Stats */}
      <UserSectionCards />

      {/* Analytics Chart */}
      <div className="p-6 bg-card rounded-lg border shadow-sm">
        <UserChartInteractive />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activities */}
          <Card className="p-6 rounded-lg bg-white border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activities
              </h2>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-emerald-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Registered for Child Neurology Conference 2024
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Downloaded latest research paper
                  </p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-purple-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Connected with Dr. Sarah Ahmed
                  </p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Upcoming Events */}
          <Card className="p-6 rounded-lg bg-white border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Upcoming Events
              </h2>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    Annual Conference 2024
                  </h3>
                  <Badge
                    variant="outline"
                    className="bg-emerald-100 text-emerald-700 border-emerald-200"
                  >
                    Upcoming
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Join us for the biggest child neurology event of the year.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    March 15-17, 2024
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                  >
                    View Details
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    Monthly Webinar
                  </h3>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                    Next Week
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Latest advances in pediatric epilepsy treatment.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    February 28, 2024
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                  >
                    Register
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card className="p-6 rounded-lg bg-white border shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Button asChild className="w-full" variant="outline">
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/profile">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 rounded-lg bg-white border shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                asChild
                className="w-full justify-start"
                variant="ghost"
              >
                <Link href="/activities/conference">
                  <Calendar className="mr-2 h-4 w-4" />
                  Browse Events
                </Link>
              </Button>
              <Button
                asChild
                className="w-full justify-start"
                variant="ghost"
              >
                <Link href="/activities/research">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Publications
                </Link>
              </Button>
              <Button
                asChild
                className="w-full justify-start"
                variant="ghost"
              >
                <Link href="/members">
                  <Users className="mr-2 h-4 w-4" />
                  Member Directory
                </Link>
              </Button>
              <Button
                asChild
                className="w-full justify-start"
                variant="ghost"
              >
                <Link href="/contact">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6 rounded-lg bg-white border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Notifications</h3>
              <Bell className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <p className="text-sm font-medium text-gray-900">
                  New publication available
                </p>
                <p className="text-xs text-gray-600">
                  Latest research on pediatric neurology
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-gray-900">
                  Membership renewed
                </p>
                <p className="text-xs text-gray-600">
                  Your membership is active until 2025
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
