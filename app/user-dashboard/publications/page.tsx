"use client";

import { BookOpen, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function UserPublicationsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">Publications</h1>
        <p className="text-gray-700">Access research papers, articles, and publications from BCNS members.</p>
      </div>

      {/* Coming Soon Card */}
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-emerald-100 p-6">
              <BookOpen className="h-16 w-16 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Coming Soon</h2>
              <p className="text-gray-600 max-w-md">
                We're working hard to bring you a comprehensive collection of research papers, articles, and publications from BCNS members. This feature will be available soon.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
              <Clock className="h-4 w-4" />
              <span>Stay tuned for updates</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

