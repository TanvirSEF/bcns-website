"use client";

import { Calendar } from "lucide-react";

export function UpcomingEvents() {
  const event = {
    title:
      "CME on “Insight into the Recent Innovation and Challenges of Epilepsy & Developmental Disorders”.",
    date: "21 and 22 September 2025",
    time: "9:00 AM",
    venue: "Conference Hall, NINS, Dhaka-1207",
  };


  return (
    <section className="w-full bg-blue-600 text-white py-2 sm:py-3 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 opacity-20"></div>
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {/* Desktop Label - Hidden on Mobile */}
          <div className="hidden sm:flex items-center space-x-2 bg-white text-blue-600 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide flex-shrink-0">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <span>UPCOMING EVENTS</span>
          </div>

          {/* Animated marquee message (full text, no truncation) */}
          <div className="w-full sm:flex-1 overflow-hidden">
            <div className="marquee-track">
              <div className="flex items-center gap-x-3 flex-shrink-0 whitespace-nowrap pr-8">
                <Calendar className="h-4 w-4" />
                <span className="font-semibold text-xs sm:text-sm">{event.title}</span>
                <span className="hidden sm:inline">|</span>
                <span className="text-xs sm:text-sm">Date: {event.date}</span>
                <span className="hidden sm:inline">|</span>
                <span className="text-xs sm:text-sm">Time: {event.time}</span>
                <span className="hidden sm:inline">|</span>
                <span className="text-xs sm:text-sm">Venue: {event.venue}</span>
              </div>
              {/* Duplicate for seamless looping */}
              <div className="flex items-center gap-x-3 flex-shrink-0 whitespace-nowrap pr-8" aria-hidden="true">
                <Calendar className="h-4 w-4" />
                <span className="font-semibold text-xs sm:text-sm">{event.title}</span>
                <span className="hidden sm:inline">|</span>
                <span className="text-xs sm:text-sm">Date: {event.date}</span>
                <span className="hidden sm:inline">|</span>
                <span className="text-xs sm:text-sm">Time: {event.time}</span>
                <span className="hidden sm:inline">|</span>
                <span className="text-xs sm:text-sm">Venue: {event.venue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        .marquee-track {
          display: inline-flex;
          width: max-content;
          gap: 2rem;
          animation: marquee 22s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
