"use client";

import * as React from "react";
import { BookOpen, Calendar, Users, Heart, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";

export function UserChartInteractive() {
  const [data, setData] = React.useState<{
    publications: number;
    events: number;
    members: number;
  } | null>(null);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const favs = await api.favorites.getFavorites();
        if (!active) return;
        setData({
          publications: favs.filter((f) => f.targetType === "publication").length,
          events: favs.filter((f) => f.targetType === "event").length,
          members: favs.filter((f) => f.targetType === "member").length,
        });
      } catch {
        if (active) setData({ publications: 0, events: 0, members: 0 });
      }
    })();
    return () => { active = false; };
  }, []);

  const categories = [
    { type: "Publications", count: data?.publications ?? 0, icon: BookOpen, color: "bg-blue-500", iconBg: "bg-blue-100 text-blue-600" },
    { type: "Events", count: data?.events ?? 0, icon: Calendar, color: "bg-emerald-500", iconBg: "bg-emerald-100 text-emerald-600" },
    { type: "Members", count: data?.members ?? 0, icon: Users, color: "bg-purple-500", iconBg: "bg-purple-100 text-purple-600" },
  ];

  const total = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="h-5 w-5 text-red-500" />
          Your Favorites Breakdown
        </CardTitle>
        <CardDescription>
          How your saved items are distributed across categories.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 py-4">
        {data === null ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : total === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No favorites yet. Browse publications, events, and members to start bookmarking.
            </p>
          </div>
        ) : (
          <>
            {categories.map((cat) => {
              const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;
              return (
                <div key={cat.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${cat.iconBg}`}>
                        <cat.icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-medium">{cat.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{cat.count}</span>
                      <span className="text-xs text-muted-foreground">({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${cat.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm font-medium text-muted-foreground">Total Favorites</span>
              <span className="text-lg font-bold">{total}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
