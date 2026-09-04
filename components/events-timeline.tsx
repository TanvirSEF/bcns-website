"use client";

import { Calendar, MapPin, Loader2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import type { Event } from "@/types/api";

// Format an ISO date as e.g. "June 17, 2026"
function formatEventDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function EventsTimeline() {
  const [activeTab, setActiveTab] = useState<"meeting" | "program" | "workshop">("program");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api.events.getEvents(undefined, 100);
        if (active) setEvents([...data]);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Filter by category, then show newest events first
  const filtered = events
    .filter((e) => e.category === activeTab)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="w-full bg-gray-50 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Stay Updated with <span className="text-blue-600">BCNS</span>
          </h2>
          <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto"></div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
          {([
            { key: "program", label: "Program" },
            { key: "workshop", label: "Workshop" },
            { key: "meeting", label: "Meeting" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${activeTab === tab.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              aria-pressed={activeTab === tab.key}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-gray-600">No items under {activeTab} right now.</div>
          ) : (
            filtered.map((event) => {
              const stableKey = event.slug || event.id || `${event.title}`;

              return (
                <div key={stableKey} className="flex bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                  {/* Event image (or brand-colored placeholder when none) */}
                  <div className="relative w-24 sm:w-40 shrink-0 bg-linear-to-br from-blue-500 to-blue-700">
                    {event.imageUrl ? (
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white/70" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">
                            {event.time
                              ? `${formatEventDate(event.date)}, ${event.time}`
                              : formatEventDate(event.date)}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-start gap-2 text-gray-700">
                            <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {event.description && event.slug && (
                          <Link
                            href={`/events/${event.slug}`}
                            className="inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-semibold cursor-pointer"
                          >
                            View Summary
                          </Link>
                        )}
                        {event.registrationUrl && (
                          <a
                            href={event.registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold cursor-pointer"
                          >
                            <span>Register</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
