"use client";

import React from "react";
import { Calendar, Heart, Users, Sparkles } from "lucide-react";
// import { eventsData } from "@/data/events";

export function UpcomingEvents() {
  // Temporarily disable events to show welcome message
  // const currentDate = new Date();
  // const upcomingEvents = eventsData.filter(event => {
  //   // Parse event date more accurately
  //   const eventDateStr = event.date;
  //   
  //   // Handle different date formats
  //   if (eventDateStr.includes("–") || eventDateStr.includes("-")) {
  //     // For date ranges like "21–22 September 2025", take the start date
  //     const startDate = eventDateStr.split(/[–-]/)[0].trim();
  //     const fullDateStr = startDate + " " + eventDateStr.split(" ").slice(-1)[0]; // Add year
  //     const eventDate = new Date(fullDateStr);
  //     return eventDate > currentDate;
  //   } else if (eventDateStr.includes(".")) {
  //     // For dates like "26.04.2025"
  //     const parts = eventDateStr.split(".");
  //     if (parts.length === 3) {
  //       const eventDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  //       return eventDate > currentDate;
  //     }
  //   }
  //   
  //   // For simple year dates like "2025", consider them future if year is greater than current
  //   const eventYear = parseInt(eventDateStr.match(/\d{4}/)?.[0] || "0");
  //   return eventYear > currentDate.getFullYear();
  // }).slice(0, 1); // Show only the first upcoming event
  
  // Force show welcome message by setting empty events array
  const upcomingEvents: any[] = [];

  const hasUpcomingEvents = upcomingEvents.length > 0;
  const currentEvent = upcomingEvents[0];

  return (
    <section className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white py-2 sm:py-3 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-blue-700/20 to-blue-600/20"></div>
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {/* Label */}
          <div className="hidden sm:flex items-center space-x-2 bg-white/95 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide flex-shrink-0 shadow-sm">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
            <span>{hasUpcomingEvents ? "UPCOMING EVENT" : "WELCOME"}</span>
          </div>

          {/* Content */}
          <div className="w-full sm:flex-1 overflow-hidden">
            {hasUpcomingEvents && currentEvent ? (
              // Show upcoming event with animation
              <div className="marquee-track">
                <div className="flex items-center gap-x-3 flex-shrink-0 whitespace-nowrap pr-8">
                  <Calendar className="h-4 w-4 text-yellow-300" />
                  <span className="font-semibold text-xs sm:text-sm">{currentEvent.title}</span>
                  <span className="hidden sm:inline text-white/70">|</span>
                  <span className="text-xs sm:text-sm">📅 {currentEvent.date}</span>
                  {currentEvent.time && (
                    <React.Fragment>
                      <span className="hidden sm:inline text-white/70">|</span>
                      <span className="text-xs sm:text-sm">🕘 {currentEvent.time}</span>
                    </React.Fragment>
                  )}
                  <span className="hidden sm:inline text-white/70">|</span>
                  <span className="text-xs sm:text-sm">📍 {currentEvent.venue}</span>
                  {currentEvent.registrationUrl && (
                    <React.Fragment>
                      <span className="hidden sm:inline text-white/70">|</span>
                      <span className="text-xs sm:text-sm bg-yellow-400 text-blue-900 px-2 py-0.5 rounded-full font-medium">
                        🎯 Register Now
                      </span>
                    </React.Fragment>
                  )}
                </div>
                {/* Duplicate for seamless looping */}
                <div className="flex items-center gap-x-3 flex-shrink-0 whitespace-nowrap pr-8" aria-hidden="true">
                  <Calendar className="h-4 w-4 text-yellow-300" />
                  <span className="font-semibold text-xs sm:text-sm">{currentEvent.title}</span>
                  <span className="hidden sm:inline text-white/70">|</span>
                  <span className="text-xs sm:text-sm">📅 {currentEvent.date}</span>
                  {currentEvent.time && (
                    <React.Fragment>
                      <span className="hidden sm:inline text-white/70">|</span>
                      <span className="text-xs sm:text-sm">🕘 {currentEvent.time}</span>
                    </React.Fragment>
                  )}
                  <span className="hidden sm:inline text-white/70">|</span>
                  <span className="text-xs sm:text-sm">📍 {currentEvent.venue}</span>
                  {currentEvent.registrationUrl && (
                    <React.Fragment>
                      <span className="hidden sm:inline text-white/70">|</span>
                      <span className="text-xs sm:text-sm bg-yellow-400 text-blue-900 px-2 py-0.5 rounded-full font-medium">
                        🎯 Register Now
                      </span>
                    </React.Fragment>
                  )}
                </div>
              </div>
            ) : (
              // Show welcome message when no events
              <div className="marquee-track">
                <div className="flex items-center gap-x-3 flex-shrink-0 whitespace-nowrap pr-8">
                  <Heart className="h-4 w-4 text-pink-300 animate-pulse" />
                  <span className="font-semibold text-xs sm:text-sm">
                    Welcome to Bangladesh Child Neurology Society (BCNS)
                  </span>
                  <span className="hidden sm:inline text-white/70">|</span>
                  <Users className="h-4 w-4 text-green-300" />
                  <span className="text-xs sm:text-sm">
                    Advancing Child Neurology in Bangladesh
                  </span>
                  <span className="hidden sm:inline text-white/70">|</span>
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  <span className="text-xs sm:text-sm">
                    Professional Development • Research • Collaboration
                  </span>
                  <span className="hidden sm:inline text-white/70">|</span>
                  <span className="text-xs sm:text-sm bg-gradient-to-r from-pink-400 to-purple-400 text-white px-2 py-0.5 rounded-full font-medium">
                    ✨ Join Our Community
                  </span>
                </div>
                {/* Duplicate for seamless looping */}
                <div className="flex items-center gap-x-3 flex-shrink-0 whitespace-nowrap pr-8" aria-hidden="true">
                  <Heart className="h-4 w-4 text-pink-300 animate-pulse" />
                  <span className="font-semibold text-xs sm:text-sm">
                    Welcome to Bangladesh Child Neurology Society (BCNS)
                  </span>
                  <span className="hidden sm:inline text-white/70">|</span>
                  <Users className="h-4 w-4 text-green-300" />
                  <span className="text-xs sm:text-sm">
                    Advancing Child Neurology in Bangladesh
                  </span>
                  <span className="hidden sm:inline text-white/70">|</span>
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  <span className="text-xs sm:text-sm">
                    Professional Development • Research • Collaboration
                  </span>
                  <span className="hidden sm:inline text-white/70">|</span>
                  <span className="text-xs sm:text-sm bg-gradient-to-r from-pink-400 to-purple-400 text-white px-2 py-0.5 rounded-full font-medium">
                    ✨ Join Our Community
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        .marquee-track {
          display: inline-flex;
          width: max-content;
          gap: 2rem;
          animation: marquee 25s linear infinite;
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