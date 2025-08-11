"use client";

import * as React from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRequireAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const { user, isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // This will redirect to login via useRequireAuth
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-200/25 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-indigo-200/25 blur-[60px]" />
      </div>

      <div className="container mx-auto px-4 py-10 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 bg-clip-text text-transparent">
              Welcome back, {user.name}!
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Here&apos;s your dashboard overview for today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border-0 shadow-lg shadow-emerald-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-200/50 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">
                  Membership Status
                </p>
                <p className="text-2xl font-bold text-emerald-900">Active</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg shadow-blue-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/50 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Events Attended
                </p>
                <p className="text-2xl font-bold text-blue-900">12</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 border-0 shadow-lg shadow-purple-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-200/50 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Publications
                </p>
                <p className="text-2xl font-bold text-purple-900">3</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border-0 shadow-lg shadow-orange-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-200/50 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">
                  Network Connections
                </p>
                <p className="text-2xl font-bold text-orange-900">47</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activities */}
            <Card className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Activities
                </h2>
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Registered for Child Neurology Conference 2024
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-green-600 rounded-full mt-2"></div>
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
            <Card className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Upcoming Events
                </h2>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-0 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      Annual Conference 2024
                    </h3>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-700"
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

                <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border-0 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      Monthly Webinar
                    </h3>
                    <Badge variant="outline" className="bg-slate-50">
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
            <Card className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-slate-200/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
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
            <Card className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-slate-200/50">
              <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="ghost"
                >
                  <Link href="/events">
                    <Calendar className="mr-2 h-4 w-4" />
                    Browse Events
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="ghost"
                >
                  <Link href="/publications">
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
            <Card className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Notifications</h3>
                <Bell className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">
                    New publication available
                  </p>
                  <p className="text-xs text-gray-600">
                    Latest research on pediatric neurology
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
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
    </div>
  );
}
