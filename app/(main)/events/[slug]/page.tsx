import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, MapPin, Users, ArrowLeft, Home, ExternalLink } from "lucide-react";
import Link from "next/link";
import config from "@/lib/config";
import { EventGallery } from "@/components/EventGallery";

// Public detail pages are ISR-rendered (events change infrequently)
export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

type EventDetail = {
  title: string;
  date: string;
  time?: string;
  location?: string;
  attendees?: string;
  description?: string;
  decisions?: string;
  registrationUrl?: string;
  eventImage?: string;
  eventImages?: string[];
};

function formatEventDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  try {
    const res = await fetch(
      `${config.backendUrl}/api/events/slug/${encodeURIComponent(slug)}`,
      { headers: { "Content-Type": "application/json" }, next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const event = await res.json();
    // Backend returns the event document directly (optionally with a wrapper)
    return (event?.data ?? event) as EventDetail;
  } catch (err) {
    console.error("Failed to load event by slug:", err);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found | BCNS" };
  return { title: `${event.title} | BCNS`, description: event.description };
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return notFound();

  const galleryImages = (Array.isArray(event.eventImages) && event.eventImages.length > 0)
    ? event.eventImages
    : (event.eventImage ? [event.eventImage] : []);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-pink-50">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs and Back links */}
          <div className="flex items-center justify-start mb-6">
            <div className="text-sm text-gray-600">
              <Link href="/" className="inline-flex items-center hover:underline">
                <Home className="w-4 h-4 mr-1" /> Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/conference" className="inline-flex items-center hover:underline">
                Conference
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800 font-medium">Summary</span>
            </div>
          </div>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-700">
              <div className="inline-flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-600" />
                <span>{event.time ? `${formatEventDate(event.date)}, ${event.time}` : formatEventDate(event.date)}</span>
              </div>
              {event.location && (
                <div className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.attendees && (
                <div className="inline-flex items-center gap-2"><Users className="w-4 h-4 text-blue-600" />
                  <span>{event.attendees}</span>
                </div>
              )}
            </div>
          </div>

          {/* Event Gallery */}
          <EventGallery images={galleryImages} title={event.title} />

          {/* Content */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
            <div className="prose max-w-none">
              <h2>Summary</h2>
              <p>{event.description}</p>
              {event.decisions && (
                <>
                  <h3>Decisions</h3>
                  <p>{event.decisions}</p>
                </>
              )}
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex items-center gap-3 mt-8 flex-wrap">
            <Link href="/" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              <Home className="w-4 h-4 mr-2" /> Back to Home
            </Link>
            <Link href="/conference" className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Conference
            </Link>
            {event.registrationUrl && (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Register <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
