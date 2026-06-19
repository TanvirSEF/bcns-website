"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  BookOpen,
  Calendar,
  Users,
  Trash2,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import type { Favorite } from "@/types/api";

function getTypeIcon(type: string) {
  switch (type) {
    case "publication":
      return BookOpen;
    case "event":
      return Calendar;
    case "member":
      return Users;
    default:
      return Heart;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "publication":
      return "bg-blue-100 text-blue-800";
    case "event":
      return "bg-emerald-100 text-emerald-800";
    case "member":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function UserFavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await api.favorites.getFavorites();
      setFavorites([...data]);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (fav: Favorite) => {
    try {
      setRemovingId(fav.id);
      await api.favorites.removeFavorite(fav.targetType, fav.targetId);
      toast.success("Removed from favorites");
      setFavorites((prev) => prev.filter((f) => f.id !== fav.id));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      toast.error(error instanceof Error ? error.message : "Failed to remove");
    } finally {
      setRemovingId(null);
    }
  };

  const counts = {
    total: favorites.length,
    publications: favorites.filter((f) => f.targetType === "publication").length,
    events: favorites.filter((f) => f.targetType === "event").length,
    members: favorites.filter((f) => f.targetType === "member").length,
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">My Favorites</h1>
        <p className="text-gray-700">Publications, events, and members you&apos;ve bookmarked.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: counts.total, icon: Heart, color: "text-red-600" },
          { label: "Publications", value: counts.publications, icon: BookOpen, color: "text-blue-600" },
          { label: "Events", value: counts.events, icon: Calendar, color: "text-emerald-600" },
          { label: "Members", value: counts.members, icon: Users, color: "text-purple-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : favorites.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <Heart className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No favorites yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Browse publications, events, and members — tap the heart icon to save them here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((fav) => {
            const Icon = getTypeIcon(fav.targetType);
            return (
              <Card key={fav.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(fav.targetType)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold leading-snug">{fav.title || "Untitled"}</h3>
                        <Badge variant="secondary" className="capitalize whitespace-nowrap flex-shrink-0">
                          {fav.targetType}
                        </Badge>
                      </div>
                      {fav.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{fav.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-2 text-xs text-muted-foreground">
                        {fav.category && <span className="capitalize">{fav.category}</span>}
                        {fav.author && <span>{fav.author}</span>}
                        {fav.date && <span>{formatDate(fav.date)}</span>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(fav)}
                      disabled={removingId === fav.id}
                      className="text-destructive hover:text-destructive flex-shrink-0"
                    >
                      {removingId === fav.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
