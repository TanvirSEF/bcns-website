"use client";

import * as React from "react";
import { Award, Heart, FileText, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

export function UserSectionCards() {
  const { user } = useAuth();
  const [favoritesCount, setFavoritesCount] = React.useState<number | null>(null);
  const [documentsCount, setDocumentsCount] = React.useState<number | null>(null);
  const [upcomingEvents, setUpcomingEvents] = React.useState<number | null>(null);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [favs, profile, events] = await Promise.all([
          api.favorites.getFavorites().catch(() => []),
          api.auth.getProfile().catch(() => null),
          api.events.getEvents(undefined, 100).catch(() => []),
        ]);
        if (!active) return;

        setFavoritesCount(favs.length);

        const docs = (profile as any)?.documents;
        setDocumentsCount(Array.isArray(docs) ? docs.length : 0);

        const now = new Date();
        const upcoming = (events as any[]).filter(
          (e) => new Date(e.date) >= now,
        ).length;
        setUpcomingEvents(upcoming);
      } catch {
        /* best-effort — cards show — */
      }
    })();
    return () => { active = false; };
  }, []);

  const cards = [
    {
      title: "Membership Status",
      value: user?.memberId ? user.memberId : (user?.membershipStatus ? user.membershipStatus.charAt(0).toUpperCase() + user.membershipStatus.slice(1) : "—"),
      isMono: Boolean(user?.memberId),
      badge: user?.membershipType === "lifetime" ? "Lifetime Member" : "General Member",
      icon: Award,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    {
      title: "My Favorites",
      value: favoritesCount !== null ? String(favoritesCount) : "...",
      isMono: false,
      badge: "Publications, Events & Members",
      icon: Heart,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      badgeBg: "bg-red-100 text-red-800 border-red-200",
    },
    {
      title: "My Documents",
      value: documentsCount !== null ? String(documentsCount) : "...",
      isMono: false,
      badge: "Uploaded documents",
      icon: FileText,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
    },
    {
      title: "Upcoming Events",
      value: upcomingEvents !== null ? String(upcomingEvents) : "...",
      isMono: false,
      badge: upcomingEvents && upcomingEvents > 0 ? "Join the next event" : "Check back soon",
      icon: Calendar,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      badgeBg: "bg-blue-100 text-blue-800 border-blue-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="bg-white shadow-sm border-0 ring-1 ring-gray-200 hover:ring-emerald-300 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
            <div className={`h-8 w-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold text-gray-900 ${card.isMono ? "font-mono text-emerald-700" : ""}`}>
              {card.value}
            </div>
            <div className="flex items-center space-x-2 mt-3">
              <Badge variant="secondary" className={card.badgeBg}>
                {card.badge}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
