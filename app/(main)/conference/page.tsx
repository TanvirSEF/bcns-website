import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import config from "@/lib/config";

export const metadata: Metadata = {
  title: "Conference | BCNS - Bangladesh Child Neurology Society",
  description: "Annual conferences, symposiums, and scientific meetings organized by BCNS.",
};

export const revalidate = 3600;

type ApiEvent = {
  id?: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  category?: string;
  slug?: string;
};

function formatEventDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

async function getEvents(): Promise<ApiEvent[]> {
  try {
    const res = await fetch(`${config.backendUrl}/api/events?limit=100`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data = json.data;
    return Array.isArray(data) ? (data as ApiEvent[]) : [];
  } catch (err) {
    console.error("Failed to load events for conference:", err);
    return [];
  }
}

export default async function ConferencePage() {
  const events = await getEvents();
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
              Annual <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">Conference</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join us for the premier child neurology conference featuring world-class speakers and cutting-edge research.
            </p>
          </div>
        </div>
      </section>

      {/* Events Listing within Conference */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Conference Events & Programs</h2>
            <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto"></div>
          </div>

          {events.length === 0 ? (
            <div className="text-center text-gray-600 py-12">No events available right now.</div>
          ) : (
            ([
              { key: "program", title: "Programs", badge: "bg-blue-100 text-blue-700" },
              { key: "workshop", title: "Workshops", badge: "bg-amber-100 text-amber-700" },
              { key: "meeting", title: "Meetings", badge: "bg-slate-100 text-slate-700" },
            ] as const).map((section) => {
              const items = events.filter((e) => e.category === section.key);
              if (items.length === 0) return null;
              return (
                <div key={section.key} className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((event) => (
                      <Card key={event.id ?? event.slug} className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <span className={`absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full ${section.badge}`}>{section.title}</span>
                        <div className="flex flex-col gap-3">
                          <h4 className="text-xl font-semibold text-gray-900">{event.title}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-gray-700">
                            <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-600" /> {event.time ? `${formatEventDate(event.date)}, ${event.time}` : formatEventDate(event.date)}</span>
                            {event.location && (
                              <>
                                <span className="hidden sm:inline">•</span>
                                <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600" /> {event.location}</span>
                              </>
                            )}
                          </div>
                          {event.slug && (
                            <div className="flex items-center gap-2 mt-2">
                              <Link href={`/events/${event.slug}`} className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-sm font-semibold">View Summary</Link>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
