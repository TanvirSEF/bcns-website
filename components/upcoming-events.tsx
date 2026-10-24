"use client";

import { Heart, Users, Award } from "lucide-react";
import Link from "next/link";

export function UpcomingEvents() {
  const marqueeContent = (
    <div className="flex items-center gap-x-3 shrink-0 whitespace-nowrap pr-8">
      {/* Japan Fellowship Highlight (Temporarily hidden as requested by client)
      <span className="inline-flex items-center gap-1.5 bg-rose-600 text-white font-bold text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-xs">
        JAPAN FELLOWSHIP
      </span>
      <span className="font-semibold text-xs sm:text-sm text-amber-200">
        JSCN Scholarship Application Open!
      </span>
      <a
        href="https://docs.google.com/forms/d/1oxpBjXxsP_vDmwkaVnK1ALJrKIEWYUfRdyOpHs9jm5s/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs sm:text-sm bg-linear-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold px-2.5 py-0.5 rounded-full shadow-xs transition-transform hover:scale-105 cursor-pointer inline-flex items-center gap-1"
      >
        <span>Apply Now</span>
        <ExternalLink className="h-3 w-3" />
      </a>
      <span className="hidden sm:inline text-white/70">•</span>
      */}

      {/* BCNS Welcome Info */}
      <Heart className="h-4 w-4 text-pink-300 animate-pulse shrink-0" />
      <span className="font-semibold text-xs sm:text-sm text-white">
        Welcome to Bangladesh Child Neurology Society (BCNS)
      </span>
      <span className="hidden sm:inline text-white/70">•</span>
      <Users className="h-4 w-4 text-green-300 shrink-0" />
      <span className="text-xs sm:text-sm text-blue-50">
        Advancing Child Neurology in Bangladesh
      </span>
      <span className="hidden sm:inline text-white/70">•</span>
      <Award className="h-4 w-4 text-yellow-300 shrink-0" />
      <span className="text-xs sm:text-sm text-blue-50">
        Professional Development • Research • Collaboration
      </span>
      <span className="hidden sm:inline text-white/70">•</span>
      <Link
        href="/membership"
        className="text-xs sm:text-sm bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-2.5 py-0.5 rounded-full font-medium shadow-xs transition-transform hover:scale-105 cursor-pointer"
      >
        Join Our Community
      </Link>
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
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span>WELCOME</span>
          </div>

          {/* Marquee Content */}
          <div className="w-full sm:flex-1 overflow-hidden">
            <div className="marquee-track">
              {marqueeContent}
              {/* Duplicate for seamless looping */}
              <div aria-hidden="true">
                {marqueeContent}
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
          animation: marquee 35s linear infinite;
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
