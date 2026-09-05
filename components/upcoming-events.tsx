"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
interface TickerEvent {
  title: string;
  date: string;
  time?: string | undefined;
  location?: string | undefined;
  registrationUrl?: string | undefined;
  slug?: string | undefined;
}

const DEFAULT_EVENT: TickerEvent = {
  title: "CME on Paediatric Neurology Advances: Genetic Epilepsy, Neuro-immunology & Epilepsy Surgery",
  date: "2026-09-21T09:00:00.000Z",
  time: "09.00 AM",
  location: "Room no. 507, Lecturer Hall, Super Specialized Hospital, BMU, Dhaka-1100",
  registrationUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdVEQme-8NpsdmL0RPPPeEqXPth3KTZ8O1niuegdd5mgPkVgA/viewform",
  slug: "cme-on-paediatric-neurology-advances-genetic-epilepsy-neuro-",
};

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export function UpcomingEvents() {
  const [event, setEvent] = useState<TickerEvent>(DEFAULT_EVENT);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const events = await api.events.getEvents(undefined, 5);
        if (active && Array.isArray(events) && events.length > 0) {
          const newest = events[0];
          if (newest) {
            setEvent({
              title: newest.title,
              date: newest.date,
              time: newest.time ?? undefined,
              location: newest.location ?? undefined,
              registrationUrl: newest.registrationUrl || DEFAULT_EVENT.registrationUrl,
              slug: newest.slug || DEFAULT_EVENT.slug,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load upcoming event:", err);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const marqueeItem = (
    <div className="flex items-center gap-x-3 sm:gap-x-4 shrink-0 whitespace-nowrap pr-8 sm:pr-10">
      {/* Event tag */}
      <span className="bg-amber-400 text-gray-950 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider px-2 py-0.5 rounded-sm shrink-0">
        Upcoming CME
      </span>

      {/* Title */}
      <span className="font-bold text-xs sm:text-sm text-white">
        {event.title}
      </span>

      <span className="text-white/60">•</span>

      {/* Date & Time */}
      <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-100 font-medium">
        <Calendar className="h-3.5 w-3.5 text-amber-300 shrink-0" />
        <span>{formatDisplayDate(event.date)}{event.time ? `, ${event.time}` : ""}</span>
      </span>

      <span className="text-white/60">•</span>

      {/* Venue */}
      {event.location && (
        <>
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-100">
            <MapPin className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
            <span>{event.location}</span>
          </span>
          <span className="text-white/60">•</span>
        </>
      )}

      {/* Register CTA */}
      {event.registrationUrl && (
        <>
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs sm:text-sm bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-3 py-0.5 rounded-full font-bold shadow-sm transition-transform hover:scale-105 cursor-pointer"
          >
            <span>Enroll Now</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <span className="text-white/60">•</span>
        </>
      )}

      {/* Details Link */}
      {event.slug && (
        <>
          <Link
            href={`/events/${event.slug}`}
            className="text-xs sm:text-sm text-white/90 hover:text-white underline underline-offset-2 font-medium"
          >
            View Details
          </Link>
          <span className="text-white/60">•</span>
        </>
      )}

      {/* Welcome & Organization Mission */}
      <span className="font-medium text-xs sm:text-sm text-blue-100">
        Welcome to Bangladesh Child Neurology Society (BCNS)
      </span>

      <span className="text-white/60">•</span>

      <span className="text-xs sm:text-sm text-blue-100">
        Advancing Child Neurology in Bangladesh
      </span>

      <span className="text-white/60">•</span>

      <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-blue-100">
        <Sparkles className="h-3.5 w-3.5 text-yellow-300 shrink-0" />
        <span>Professional Development • Research • Collaboration</span>
      </span>
    </div>
  );

  return (
    <section className="w-full bg-linear-to-r from-blue-700 via-blue-800 to-blue-700 text-white py-2 sm:py-2.5 relative overflow-hidden border-b border-blue-600/40">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 via-blue-700/20 to-blue-600/20 pointer-events-none"></div>
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Label */}
          <div className="hidden sm:flex items-center space-x-2 bg-white/95 backdrop-blur-sm text-blue-800 px-3 py-1 rounded-full font-extrabold text-xs uppercase tracking-wide shrink-0 shadow-sm">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
            <span>UPCOMING</span>
          </div>

          {/* Marquee Content */}
          <div className="w-full sm:flex-1 overflow-hidden">
            <div className="marquee-track">
              {marqueeItem}
              {/* Duplicate for smooth infinite loop */}
              <div aria-hidden="true">
                {marqueeItem}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Animation */}
      <style jsx>{`
        .marquee-track {
          display: inline-flex;
          width: max-content;
          gap: 2rem;
          animation: marquee 40s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}