import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { eventsData } from "@/data/events";

export const metadata: Metadata = {
  title: "Events | BCNS - Bangladesh Child Neurology Society",
  description: "Upcoming events, conferences, and workshops organized by BCNS.",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full mb-6">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Events & <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">Conferences</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join us for upcoming conferences, workshops, and educational events in child neurology.
            </p>
          </div>
        </div>
      </section>

      {/* Events Listing */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">All Events</h2>
            <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto"></div>
          </div>

          {([
            { key: "program", title: "Programs" },
            { key: "workshop", title: "Workshops" },
            { key: "meeting", title: "Meetings" },
          ] as const).map((section) => {
            const items = eventsData.filter((e) => e.type === section.key);
            if (items.length === 0) return null;
            return (
              <div key={section.key} className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((event) => (
                    <Card key={event.slug} className="p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                      <div className="flex flex-col flex-1 gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 leading-tight">{event.title}</h4>
                          <div className="flex flex-col gap-2 text-gray-700 text-sm">
                            <span className="inline-flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              <span>{event.time ? `${event.date}, ${event.time}` : event.date}</span>
                            </span>
                            <span className="inline-flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{event.venue}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100">
                          <Link
                            href={`/events/${event.slug}`}
                            className="inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-sm font-semibold transition-colors cursor-pointer"
                          >
                            View Summary
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
