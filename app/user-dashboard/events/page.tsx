"use client";

import * as React from "react";
import { Calendar, Clock, MapPin, ExternalLink, Filter, Heart, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { api } from "@/lib/api";
import { useFavorites } from "@/hooks/use-favorites";
import { Event } from "@/types/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

function formatDate(dateString: string): { day: string; month: string; fullDate: string } {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const fullDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return { day, month, fullDate };
}

export default function UserEventsPage() {
  const router = useRouter();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [pastPage, setPastPage] = React.useState(1);
  const pastPageSize = 6;
  const { favoredIds, toggle } = useFavorites("event");

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedEvents = await api.events.getEvents(undefined, 100);
        // Sort events by date (upcoming first)
        const sortedEvents = [...fetchedEvents].sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        setEvents(sortedEvents);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events. Please try again later.");
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events by category
  const filteredEvents = selectedCategory
    ? events.filter((event) => event.category?.toLowerCase() === selectedCategory.toLowerCase())
    : events;

  // Separate events into upcoming and past
  const now = new Date();
  const upcomingEvents = filteredEvents.filter((event) => new Date(event.date) >= now);
  const pastEvents = filteredEvents.filter((event) => new Date(event.date) < now);

  // Pagination for past events (clamp so deletes/filter never leave out of range)
  const totalPastPages = Math.ceil(pastEvents.length / pastPageSize) || 1;
  const safePastPage = Math.min(Math.max(pastPage, 1), totalPastPages);
  const paginatedPastEvents = pastEvents.slice(
    (safePastPage - 1) * pastPageSize,
    safePastPage * pastPageSize,
  );

  React.useEffect(() => { setPastPage(1); }, [selectedCategory]);

  // Get unique categories
  const categories = Array.from(
    new Set(events.map((event) => event.category || "Program").filter(Boolean))
  );

  const categoryColors: Record<string, string> = {
    Program: "bg-blue-100 text-blue-800 border-blue-200",
    Workshop: "bg-purple-100 text-purple-800 border-purple-200",
    Meeting: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">Events</h1>
          <p className="text-gray-700">Browse and register for upcoming BCNS events, conferences, and workshops.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">Events</h1>
          <p className="text-gray-700">Browse and register for upcoming BCNS events, conferences, and workshops.</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">Events</h1>
        <p className="text-gray-700">Browse and register for upcoming BCNS events, conferences, and workshops.</p>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="cursor-pointer"
              >
                All Events ({events.length})
              </Button>
              {categories.map((category) => {
                const count = events.filter(
                  (e) => (e.category || "Program") === category
                ).length;
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="cursor-pointer"
                  >
                    {category} ({count})
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((event) => {
              const { day, month, fullDate } = formatDate(event.date);
              const categoryColor =
                categoryColors[event.category || "Program"] || categoryColors.Program;

              return (
                <Card
                  key={event.id}
                  className="group overflow-hidden flex flex-col h-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer !p-0 !gap-0 !py-0"
                  onClick={() => router.push("/events")}
                >
                  {/* Event Image */}
                  {event.imageUrl ? (
                    <div className="relative h-56 w-full bg-gray-100">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        priority={false}
                        quality={95}
                        style={{
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-white rounded-md p-2 text-center shadow-lg z-10">
                        <div className="text-sm font-bold text-emerald-700">{day}</div>
                        <div className="text-xs font-medium text-gray-600">{month}</div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`absolute top-3 right-3 ${categoryColor} text-xs border z-10`}
                      >
                        {event.category || "Program"}
                      </Badge>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-3 right-3 h-8 w-8 p-0 z-10 bg-white/90 hover:bg-white shadow-sm"
                        onClick={(e) => { e.stopPropagation(); toggle(event.id); }}
                      >
                        <Heart className={`h-4 w-4 ${favoredIds.has(event.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative h-48 w-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                      <Calendar className="h-16 w-16 text-emerald-400" />
                      <div className="absolute top-3 left-3 bg-white rounded-md p-2 text-center shadow-lg">
                        <div className="text-sm font-bold text-emerald-700">{day}</div>
                        <div className="text-xs font-medium text-gray-600">{month}</div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`absolute top-3 right-3 ${categoryColor} text-xs border`}
                      >
                        {event.category || "Program"}
                      </Badge>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-3 right-3 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                        onClick={(e) => { e.stopPropagation(); toggle(event.id); }}
                      >
                        <Heart className={`h-4 w-4 ${favoredIds.has(event.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                      </Button>
                    </div>
                  )}

                  {/* Card Content */}
                  <CardContent className="!px-4 !py-4 flex-1 flex flex-col gap-2.5">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mt-auto pt-2">
                      <div className="flex items-center text-sm text-gray-700">
                        <Calendar className="h-4 w-4 mr-2 text-emerald-600 flex-shrink-0" />
                        <span>{fullDate}</span>
                      </div>

                      {event.time && (
                        <div className="flex items-center text-sm text-gray-700">
                          <Clock className="h-4 w-4 mr-2 text-emerald-600 flex-shrink-0" />
                          <span>{event.time}</span>
                        </div>
                      )}

                      {event.location && (
                        <div className="flex items-center text-sm text-gray-700">
                          <MapPin className="h-4 w-4 mr-2 text-emerald-600 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}

                      <div className="pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push("/events");
                          }}
                        >
                          View Details
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedPastEvents.map((event) => {
              const { day, month, fullDate } = formatDate(event.date);
              const categoryColor =
                categoryColors[event.category || "Program"] || categoryColors.Program;

              return (
                <Card
                  key={event.id}
                  className="group overflow-hidden flex flex-col h-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer opacity-75 !p-0 !gap-0 !py-0"
                  onClick={() => router.push("/events")}
                >
                  {/* Event Image */}
                  {event.imageUrl ? (
                    <div className="relative h-56 w-full bg-gray-100">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        priority={false}
                        quality={95}
                        style={{
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-white rounded-md p-2 text-center shadow-lg z-10">
                        <div className="text-sm font-bold text-gray-700">{day}</div>
                        <div className="text-xs font-medium text-gray-600">{month}</div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`absolute top-3 right-3 ${categoryColor} text-xs border z-10`}
                      >
                        {event.category || "Program"}
                      </Badge>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-3 right-3 h-8 w-8 p-0 z-10 bg-white/90 hover:bg-white shadow-sm"
                        onClick={(e) => { e.stopPropagation(); toggle(event.id); }}
                      >
                        <Heart className={`h-4 w-4 ${favoredIds.has(event.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Calendar className="h-16 w-16 text-gray-400" />
                      <div className="absolute top-3 left-3 bg-white rounded-md p-2 text-center shadow-lg">
                        <div className="text-sm font-bold text-gray-700">{day}</div>
                        <div className="text-xs font-medium text-gray-600">{month}</div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`absolute top-3 right-3 ${categoryColor} text-xs border`}
                      >
                        {event.category || "Program"}
                      </Badge>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-3 right-3 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                        onClick={(e) => { e.stopPropagation(); toggle(event.id); }}
                      >
                        <Heart className={`h-4 w-4 ${favoredIds.has(event.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                      </Button>
                    </div>
                  )}

                  {/* Card Content */}
                  <CardContent className="!px-4 !py-4 flex-1 flex flex-col gap-2.5">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mt-auto pt-2">
                      <div className="flex items-center text-sm text-gray-700">
                        <Calendar className="h-4 w-4 mr-2 text-gray-600 flex-shrink-0" />
                        <span>{fullDate}</span>
                      </div>

                      {event.time && (
                        <div className="flex items-center text-sm text-gray-700">
                          <Clock className="h-4 w-4 mr-2 text-gray-600 flex-shrink-0" />
                          <span>{event.time}</span>
                        </div>
                      )}

                      {event.location && (
                        <div className="flex items-center text-sm text-gray-700">
                          <MapPin className="h-4 w-4 mr-2 text-gray-600 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}

                      <div className="pt-2 mt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-gray-600 text-gray-600 hover:bg-gray-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push("/events");
                          }}
                        >
                          View Details
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {/* Pagination for past events */}
          {totalPastPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4 border-t mt-4">
              <span className="text-sm font-medium text-gray-600 mr-4">
                Page {safePastPage} of {totalPastPages}
              </span>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setPastPage(1)} disabled={safePastPage === 1}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setPastPage(safePastPage - 1)} disabled={safePastPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setPastPage(safePastPage + 1)} disabled={safePastPage === totalPastPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setPastPage(totalPastPages)} disabled={safePastPage === totalPastPages}>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-500">
              {selectedCategory
                ? `No ${selectedCategory} events available at the moment.`
                : "No events available at the moment. Check back later!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

