import Link from "next/link";
import Image from "next/image";
import { Camera, Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const eventCategories = [
  {
    id: "ecm2025",
    title: "Executive Committee Meeting 2025",
    date: "April 26, 2025",
    attendees: "15+ Committee Members",
    coverImage: "/images/ecm2025/1.jpg",
    imageCount: 2,
    description: "First Executive Committee Meeting of 2025"
  },
  {
    id: "cme2025",
    title: "CME on Paediatric Movement Disorder",
    date: "June 21, 2025",
    attendees: "80+ Participants",
    coverImage: "/images/cme/1.jpg",
    imageCount: 10,
    description: "Continuing Medical Education on Paediatric Movement Disorder"
  },
  {
    id: "ce2025",
    title: "Childhood Epilepsy Workshop",
    date: "August 26, 2025",
    attendees: "60+ Specialists",
    coverImage: "/images/ce/1.jpg",
    imageCount: 12,
    description: "Childhood Epilepsy - A Practical Approach Workshop"
  },
  {
    id: "cgm2025",
    title: "Committee General Meeting 2025",
    date: "April 26, 2025",
    attendees: "25+ Members",
    coverImage: "/images/cgm/1.jpg",
    imageCount: 4,
    description: "Committee General Meeting 2025"
  },
  {
    id: "sma2025",
    title: "SMA Workshop & Program",
    date: "August 23-24, 2025",
    attendees: "40+ Participants",
    coverImage: "/images/sma/1.jpg",
    imageCount: 2,
    description: "Workshop on Standardized Rehabilitation Approach for SMA"
  },
  {
    id: "fyt2025",
    title: "Featured Year Events 2025",
    date: "2025",
    attendees: "100+ Total Participants",
    coverImage: "/images/fyt/1.jpg",
    imageCount: 6,
    description: "Featured events and highlights from 2025"
  }
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-white">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 ring-8 ring-blue-50">
            <Camera className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Event Gallery
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our collection of events, workshops, and meetings from 2025. 
            Click on any event to view all photos from that occasion.
          </p>
        </div>

        {/* Event Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {eventCategories.map((event) => (
            <Link
              key={event.id}
              href={`/gallery/${event.id}`}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Cover Image */}
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Image Count Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-semibold text-gray-800">
                  {event.imageCount} photos
                </div>
                
                {/* Event Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-white/90 mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Action */}
              <div className="p-6">
                <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-700">
                  View All Photos
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Gallery Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                {eventCategories.length}
              </div>
              <div className="text-gray-600">Event Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                {eventCategories.reduce((total, event) => total + event.imageCount, 0)}
              </div>
              <div className="text-gray-600">Total Photos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">
                2025
              </div>
              <div className="text-gray-600">Year</div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Button
            asChild
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3"
          >
            <Link href="/">
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}