"use client";

import Image from "next/image";
import { ExternalLink, GraduationCap, ArrowRight } from "lucide-react";

interface FellowshipBannerProps {
  formUrl?: string;
}

export function FellowshipBanner({
  formUrl = "https://docs.google.com/forms/d/1oxpBjXxsP_vDmwkaVnK1ALJrKIEWYUfRdyOpHs9jm5s/viewform",
}: FellowshipBannerProps) {
  return (
    <section className="w-full py-5 sm:py-8 bg-slate-50/60 border-b border-gray-100">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Tag & Link */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5 sm:mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80 text-xs sm:text-sm font-semibold">
              <GraduationCap className="w-4 h-4 text-blue-700 shrink-0" />
              <span>JSCN Scholarship & Training Opportunity</span>
            </div>
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline inline-flex items-center gap-1"
            >
              <span>Application Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Clickable Banner Card */}
          <a
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Click to apply for Japan Fellowship (JSCN Scholarship)"
            className="group relative block overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:border-blue-400 focus:outline-hidden focus:ring-4 focus:ring-blue-500/20"
          >
            {/* Aspect ratio 1024 / 508 matches the banner precisely */}
            <div className="relative w-full aspect-[1024/508] bg-white">
              <Image
                src="/images/japan-fellowship-banner.png"
                alt="Japan Fellowship - Apply Now (Bangladesh Child Neurology Society & JSCN)"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 896px"
                className="object-contain object-center transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </div>
          </a>

          {/* Mobile-friendly Action Button */}
          <div className="mt-3 sm:hidden">
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm shadow-sm"
            >
              <span>Apply for Japan Fellowship</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
