import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, MapPin, Users, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { eventsData, getEventBySlug } from "@/data/events";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return eventsData.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: "Event Not Found | BCNS" };
  return { title: `${event.title} | BCNS`, description: event.summary };
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
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
                <span>{event.time ? `${event.date}, ${event.time}` : event.date}</span>
              </div>
              <div className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600" />
                <span>{event.venue}</span>
              </div>
              {event.attendees && (
                <div className="inline-flex items-center gap-2"><Users className="w-4 h-4 text-blue-600" />
                  <span>{event.attendees}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="prose max-w-none">
              <h2>Summary</h2>
              <p>{event.summary}</p>
              {event.decisions && (
                <>
                  <h3>Decisions</h3>
                  <p>{event.decisions}</p>
                </>
              )}
            </div>

            {/* Registration Link */}
            {event?.registrationUrl && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <a 
                  href={event.registrationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Register Now
                </a>
              </div>
            )}
          </div>

          {/* Bottom actions */}
          <div className="flex items-center gap-3 mt-8">
            <Link href="/" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              <Home className="w-4 h-4 mr-2" /> Back to Home
            </Link>
            <Link href="/conference" className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Conference
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


