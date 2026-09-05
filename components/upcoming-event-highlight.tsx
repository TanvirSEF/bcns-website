"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import Image from "next/image";
import { api } from "@/lib/api";
import type { Event } from "@/types/api";

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

// An event stays visible until the end of its event day
function endOfEventDay(dateStr: string): number {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return 0;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
}

function daysRemaining(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function UpcomingEventHighlight() {
  const [event, setEvent] = useState<Event | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const events = await api.events.getEvents(undefined, 50);
        if (!active || !Array.isArray(events)) return;

        // Only upcoming events, nearest first
        const upcoming = events
          .filter((e) => endOfEventDay(e.date) > Date.now())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        if (active) setEvent(upcoming[0] ?? null);
      } catch (err) {
        console.error("Failed to load upcoming event:", err);
      } finally {
        if (active) setReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Nothing to promote (or past events filtered out) — section auto-removes
  if (!ready || !event) return null;

  const banner = event.eventImages?.[0] ?? event.imageUrl;
  const days = daysRemaining(event.date);

  return (
    <section className="w-full py-8 md:py-10">
      <div className="container mx-auto px-6">
        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg bg-white">
          <div className="grid md:grid-cols-[280px_1fr] items-stretch">
            {/* Event image */}
            {banner && (
              <div className="relative h-44 md:h-full min-h-[176px]">
                <Image
                  src={banner}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 280px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Details */}
            <div className="p-5 md:p-7">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Upcoming Event
                </span>
                {days > 0 ? (
                  <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {days} {days === 1 ? "day" : "days"} to go
                  </span>
                ) : (
                  <span className="inline-flex items-center bg-rose-50 text-rose-600 text-xs font-semibold px-3 py-1 rounded-full">
                    Happening Today
                  </span>
                )}
              </div>

              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-snug mb-3 text-gray-900">
                {event.title}
              </h2>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2 text-sm md:text-base text-gray-600 mb-5">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0 text-blue-600" />
                  {formatDisplayDate(event.date)}
                </span>
                {event.time && (
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-blue-600" />
                    {event.time}
                  </span>
                )}
                {event.location && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-blue-600" />
                    {event.location}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {event.registrationUrl && (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Enroll Now
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
