"use client";

import { Calendar, MapPin, Bell } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { eventsData } from "@/data/events";

export function EventsTimeline() {
  const [activeTab, setActiveTab] = useState<"notice" | "meeting" | "program" | "workshop">("notice");

  // Notice board data
  const noticeData = [
    {
      id: "1",
      title: "BCNS Annual Conference 2025 Registration Open",
      type: "announcement",
      priority: "high",
      date: "2024-12-15",
      isNew: true,
      link: "/conference"
    },
    {
      id: "2",
      title: "CME Program: Pediatric Movement Disorders",
      type: "event",
      priority: "medium",
      date: "2024-12-10",
      link: "/events/cme-malaysia-june-2025"
    },
    {
      id: "3",
      title: "Member Directory Update Required",
      type: "urgent",
      priority: "high",
      date: "2024-12-08"
    },
    {
      id: "4",
      title: "Research Grant Applications Open",
      type: "announcement",
      priority: "medium",
      date: "2024-12-05",
      link: "/research/grants"
    },
    {
      id: "5",
      title: "New Publication: Pediatric Neurology Guidelines",
      type: "update",
      priority: "low",
      date: "2024-12-01",
      link: "/publications"
    },
    {
      id: "6",
      title: "Workshop: SMA Rehabilitation Approach",
      type: "workshop",
      priority: "medium",
      date: "2024-11-28",
      link: "/events/sma-workshop-aug-2025"
    },
    {
      id: "7",
      title: "Website Maintenance Scheduled",
      type: "update",
      priority: "low",
      date: "2024-12-20"
    }
  ];

  const filtered = activeTab === "notice" ? noticeData : eventsData.filter((e) => e.type === activeTab);

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
            { key: "notice", label: "Notice Board" },
            { key: "program", label: "Program" },
            { key: "workshop", label: "Workshop" },
            { key: "meeting", label: "Meeting" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${
                activeTab === tab.key
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
          {activeTab === "notice" ? (
            /* Notice Board with Auto-Scroll */
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">BCNS Notice Board</h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="relative h-96 overflow-hidden">
                  <div className="animate-scroll-up">
                    {/* Create multiple sets for seamless infinite scroll */}
                    {[...noticeData, ...noticeData, ...noticeData].map((notice, index) => (
                      <div key={`${notice.id}-${index}`} className="mb-4 p-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-white transition-all duration-300 hover:shadow-md">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg flex-shrink-0 bg-blue-100">
                            <Bell className="h-4 w-4 text-blue-600" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className="text-base font-semibold text-gray-900 leading-tight">
                                {notice.title}
                              </h4>
                              {notice.isNew && (
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium flex-shrink-0">
                                  New
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                                {notice.type === 'urgent' ? 'Urgent' :
                                 notice.type === 'announcement' ? 'Announcement' :
                                 notice.type === 'event' ? 'Event' :
                                 notice.type === 'workshop' ? 'Workshop' : 'Update'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(notice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                              {notice.link && (
                                <span className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer">
                                  View Details →
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
          ) : (
            /* Event Cards */
            <>
              {filtered.length === 0 && (
                <div className="text-center text-gray-600">No items under {activeTab} right now.</div>
              )}
              {filtered.map((event) => (
                <div key={'slug' in event ? event.slug : event.id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
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
                      <div className="flex items-center gap-2">
                        {'slug' in event && (
                          <Link
                            href={`/events/${event.slug}`}
                            className="inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-semibold"
                          >
                            View Summary
                          </Link>
                        )}
                        {/* Registration temporarily disabled */}
                        {'registrationUrl' in event && false && (
                          <a
                            href={('registrationUrl' in event ? (event as any).registrationUrl : '') || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors text-sm font-semibold"
                          >
                            Register Now
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
