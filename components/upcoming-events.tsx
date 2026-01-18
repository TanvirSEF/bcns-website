"use client";

import { Heart, Users, Sparkles } from "lucide-react";

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
            <span>WELCOME</span>
          </div>

          {/* Content */}
          <div className="w-full sm:flex-1 overflow-hidden">
            {/* Show welcome message */}
            <div className="marquee-track">
              <div className="flex items-center gap-x-3 flex-shrink-0 whitespace-nowrap pr-8">
                <Heart className="h-4 w-4 text-pink-300 animate-pulse flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-sm">
                  Welcome to Bangladesh Child Neurology Society (BCNS)
                </span>
                <span className="hidden sm:inline text-white/70">|</span>
                <Users className="h-4 w-4 text-green-300 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  Advancing Child Neurology in Bangladesh
                </span>
                <span className="hidden sm:inline text-white/70">|</span>
                <Sparkles className="h-4 w-4 text-yellow-300 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  Professional Development • Research • Collaboration
                </span>
                <span className="hidden sm:inline text-white/70">|</span>
                <span className="text-xs sm:text-sm bg-gradient-to-r from-pink-400 to-purple-400 text-white px-2 py-0.5 rounded-full font-medium">
                  Join Our Community
                </span>
              </div>
              {/* Duplicate for seamless looping */}
              <div className="flex items-center gap-x-3 flex-shrink-0 whitespace-nowrap pr-8" aria-hidden="true">
                <Heart className="h-4 w-4 text-pink-300 animate-pulse flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-sm">
                  Welcome to Bangladesh Child Neurology Society (BCNS)
                </span>
                <span className="hidden sm:inline text-white/70">|</span>
                <Users className="h-4 w-4 text-green-300 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  Advancing Child Neurology in Bangladesh
                </span>
                <span className="hidden sm:inline text-white/70">|</span>
                <Sparkles className="h-4 w-4 text-yellow-300 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  Professional Development • Research • Collaboration
                </span>
                <span className="hidden sm:inline text-white/70">|</span>
                <span className="text-xs sm:text-sm bg-gradient-to-r from-pink-400 to-purple-400 text-white px-2 py-0.5 rounded-full font-medium">
                  Join Our Community
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