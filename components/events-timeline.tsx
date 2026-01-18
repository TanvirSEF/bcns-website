"use client";

import { Calendar, MapPin } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { eventsData } from "@/data/events";

export function EventsTimeline() {
  const [activeTab, setActiveTab] = useState<"meeting" | "program" | "workshop">("program");

  const filtered = eventsData.filter((e) => e.type === activeTab);

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
          {filtered.length === 0 && (
            <div className="text-center text-gray-600">No items under {activeTab} right now.</div>
          )}
          {filtered.map((event) => {
            // Use slug as primary key, fallback to title+date combination for stability
            const stableKey = ('slug' in event && event.slug)
              ? event.slug
              : `${event.title}-${event.date}`.replace(/[^a-zA-Z0-9-]/g, '-');

            return (
              <div key={stableKey} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">
                          {'time' in event ? (event.time ? `${event.date}, ${event.time}` : event.date) : event.date}
                        </span>
                      </div>
                      {'venue' in event && (
                        <div className="flex items-start gap-2 text-gray-700">
                          <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-sm">{event.venue}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Hide View Summary only for the new event */}
                      {'slug' in event && event.slug !== "brain-malformation-congenital-myopathy-neuroinfection-jan-2026" && (
                        <Link
                          href={`/events/${event.slug}`}
                          className="inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-semibold cursor-pointer"
                        >
                          View Summary
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
