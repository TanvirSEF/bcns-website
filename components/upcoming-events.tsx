"use client";

import { Sparkles, Calendar, Clock, MapPin } from "lucide-react";

export function UpcomingEvents() {
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
            <span>UPCOMING EVENT</span>
          </div>

          {/* Content */}
          <div className="w-full sm:flex-1 overflow-hidden">
            {/* Show welcome message */}
            <div className="marquee-track">
              <div className="flex items-center gap-x-4 flex-shrink-0 whitespace-nowrap pr-12">
                <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse flex-shrink-0" />
                <span className="font-bold text-xs sm:text-sm text-white">
                  Scientific Seminar on "Management of Childhood Epilepsy: An Evidence Based Approach"
                </span>
                
                <span className="hidden sm:inline text-white/50">•</span>
                <Calendar className="h-4 w-4 text-green-300 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-blue-50">
                  Date: 17th June 2026, Wednesday
                </span>

                <span className="hidden sm:inline text-white/50">•</span>
                <Clock className="h-4 w-4 text-pink-300 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-blue-50">
                  Time: 10:00 AM
                </span>

                <span className="hidden sm:inline text-white/50">•</span>
                <MapPin className="h-4 w-4 text-red-300 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-blue-50">
                  Venue: Seminar Room, Department of Paediatrics, Rangpur Medical College Hospital
                </span>
              </div>
              {/* Duplicate for seamless looping */}
              <div className="flex items-center gap-x-4 flex-shrink-0 whitespace-nowrap pr-12" aria-hidden="true">
                <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse flex-shrink-0" />
                <span className="font-bold text-xs sm:text-sm text-white">
                  Scientific Seminar on "Management of Childhood Epilepsy: An Evidence Based Approach"
                </span>
                
                <span className="hidden sm:inline text-white/50">•</span>
                <Calendar className="h-4 w-4 text-green-300 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-blue-50">
                  Date: 17th June 2026, Wednesday
                </span>

                <span className="hidden sm:inline text-white/50">•</span>
                <Clock className="h-4 w-4 text-pink-300 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-blue-50">
                  Time: 10:00 AM
                </span>

                <span className="hidden sm:inline text-white/50">•</span>
                <MapPin className="h-4 w-4 text-red-300 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-blue-50">
                  Venue: Seminar Room, Department of Paediatrics, Rangpur Medical College Hospital
                </span>
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
          animation: marquee 35s linear infinite;
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