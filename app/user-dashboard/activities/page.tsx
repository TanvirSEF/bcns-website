"use client";

import * as React from "react";
import {
  Heart,
  FileText,
  UserCheck,
  BadgeCheck,
  Loader2,
  Activity,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { Favorite } from "@/types/api";
import { toast } from "react-toastify";

interface TimelineItem {
  id: string;
  icon: "heart" | "file" | "user" | "badge";
  type: string;
  title: string;
  description: string;
  date: string;
}

function getIcon(name: string) {
  switch (name) {
    case "heart":
      return Heart;
    case "file":
      return FileText;
    case "user":
      return UserCheck;
    case "badge":
      return BadgeCheck;
    default:
      return Activity;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "publication":
      return "bg-blue-100 text-blue-600";
    case "event":
      return "bg-emerald-100 text-emerald-600";
    case "member":
      return "bg-purple-100 text-purple-600";
    case "document":
      return "bg-amber-100 text-amber-600";
    case "membership":
      return "bg-emerald-100 text-emerald-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function formatRelative(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UserActivitiesPage() {
  const [timeline, setTimeline] = React.useState<TimelineItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({ total: 0, favorites: 0, documents: 0, memberSince: "" });

  React.useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const [favorites, userData] = await Promise.all([
          api.favorites.getFavorites(),
          api.auth.getProfile(),
        ]);

        const items: TimelineItem[] = [];

        // Favorites
        (favorites as readonly Favorite[]).forEach((f) => {
          items.push({
            id: `fav-${f.id}`,
            icon: "heart",
            type: f.targetType,
            title: `Favorited ${f.targetType}`,
            description: f.title || "Untitled",
            date: f.createdAt,
          });
        });

        // Documents
        const userDocs = (userData as typeof userData & {
          documents?: Array<{ title?: string; uploadedAt?: string }>;
        }).documents;

        if (Array.isArray(userDocs)) {
          userDocs.forEach((doc, i) => {
            items.push({
              id: `doc-${i}`,
              icon: "file",
              type: "document",
              title: "Uploaded document",
              description: doc.title || "Untitled document",
              date: doc.uploadedAt || userData.createdAt,
            });
          });
        }

        // Membership milestones
        items.push({
          id: "joined",
          icon: "user",
          type: "membership",
          title: "Joined BCNS",
          description: "Welcome to the Bangladesh Child Neurology Society!",
          date: userData.createdAt,
        });

        const approvedAt = (userData as typeof userData & { approvedAt?: string }).approvedAt;
        if (approvedAt) {
          items.push({
            id: "approved",
            icon: "badge",
            type: "membership",
            title: "Membership Approved",
            description: "Your membership was approved by the BCNS committee.",
            date: approvedAt,
          });
        }

        // Sort newest first
        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setTimeline(items);
        setStats({
          total: items.length,
          favorites: favorites.length,
          documents: userDocs?.length || 0,
          memberSince: userData.createdAt,
        });
      } catch (err) {
        console.error("Failed to load activities:", err);
        toast.error("Failed to load activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-gray-900">My Activities</h1>
        <p className="text-gray-700">A timeline of your engagement with BCNS — favorites, documents, and membership milestones.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Activities", value: stats.total, icon: Activity, color: "text-emerald-600" },
          { label: "Favorites", value: stats.favorites, icon: Heart, color: "text-red-500" },
          { label: "Documents", value: stats.documents, icon: FileText, color: "text-amber-600" },
          { label: "Member Since", value: formatDate(stats.memberSince), icon: Calendar, color: "text-blue-600", small: true },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className={`h-7 w-7 flex-shrink-0 ${stat.color}`} />
              <div className="min-w-0">
                <p className={`font-bold ${stat.small ? "text-sm" : "text-xl"}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : timeline.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <Activity className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No activity yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Start by favoriting publications, events, or members — or upload documents to see your activity timeline here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-600" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {timeline.map((item, index) => {
                const Icon = getIcon(item.icon);
                const isLast = index === timeline.length - 1;
                return (
                  <div
                    key={item.id}
                    className={`flex gap-4 pl-2 relative ${isLast ? "" : "pb-6"}`}
                  >
                    {/* Vertical line */}
                    {!isLast && (
                      <div className="absolute left-[18px] top-8 bottom-0 w-px bg-gray-200" />
                    )}
                    {/* Icon */}
                    <div className={`relative z-10 h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ring-4 ring-white ${getTypeColor(item.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium capitalize">{item.title}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatRelative(item.date)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                      <Badge variant="secondary" className="capitalize mt-1.5 text-xs">
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
