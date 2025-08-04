"use client";

import * as React from "react";
import { ArrowRight, Camera, Users, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  eventName: string;
  date: string;
  attendees: string;
  category: string;
  href: string;
}

export function PhotoGalleryPreview() {
  const galleryImages: GalleryImage[] = [
    {
      id: "1",
      src: "/images/event1.png",
      alt: "Annual Conference 2024",
      eventName: "Annual Conference 2024",
      date: "March 15, 2024",
      attendees: "150+ Attendees",
      category: "Conference",
      href: "/gallery/conference-2024",
    },
    {
      id: "2",
      src: "/images/event2.png",
      alt: "Workshop Session",
      eventName: "Advanced Neurology Workshop",
      date: "February 28, 2024",
      attendees: "45 Participants",
      category: "Workshop",
      href: "/gallery/workshop-2024",
    },
    {
      id: "3",
      src: "/images/event3.png",
      alt: "Research Symposium",
      eventName: "Research Symposium",
      date: "January 20, 2024",
      attendees: "80 Researchers",
      category: "Symposium",
      href: "/gallery/symposium-2024",
    },
    {
      id: "4",
      src: "/images/child_neurology.png",
      alt: "Child Neurology Seminar",
      eventName: "Child Neurology Seminar",
      date: "December 10, 2023",
      attendees: "60 Specialists",
      category: "Seminar",
      href: "/gallery/seminar-2023",
    },
    {
      id: "5",
      src: "/images/membership.png",
      alt: "Membership Meeting",
      eventName: "Annual Membership Meeting",
      date: "November 25, 2023",
      attendees: "120 Members",
      category: "Meeting",
      href: "/gallery/meeting-2023",
    },
    {
      id: "6",
      src: "/images/event1.png",
      alt: "Training Program",
      eventName: "Pediatric Neurology Training",
      date: "October 15, 2023",
      attendees: "35 Trainees",
      category: "Training",
      href: "/gallery/training-2023",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 ring-8 ring-blue-50">
            <Camera className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold text-gray-900 mb-4 tracking-tight">
            Glimpses of Our Events
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Capturing the moments that shape the future of pediatric neurology
            through collaboration, research, and learning.
          </p>
        </div>

        {/* --- FIXED GALLERY GRID FOR MOBILE --- */}
        {/* Changed to responsive row height to fix mobile view */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[18rem] sm:auto-rows-[20rem] gap-4 sm:gap-6 mb-12 sm:mb-16">
          {galleryImages.map((image, index) => (
            <Link
              key={image.id}
              href={image.href}
              className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-500
                ${
                  // Changed to responsive spanning to fix mobile view
                  index === 0
                    ? "sm:col-span-2 lg:col-span-2 sm:row-span-2"
                    : "col-span-1"
                }
              `}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-all duration-500"></div>
              <div className="relative z-10 p-4 sm:p-6 space-y-3 transform transition-transform duration-500 ease-in-out translate-y-8 group-hover:translate-y-0">
                <h3 className="text-lg sm:text-xl font-sans font-bold text-white line-clamp-2">
                  {image.eventName}
                </h3>
                <div className="space-y-2 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                  <div className="flex items-center text-xs sm:text-sm">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{image.date}</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm">
                    <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{image.attendees}</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                  {image.category}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* --- ENHANCED STATISTICS SECTION --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="flex items-center space-x-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <Calendar className="h-7 w-7" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                25+
              </div>
              <div className="text-gray-600 font-medium">Events This Year</div>
            </div>
          </div>
          <div className="flex items-center space-x-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                500+
              </div>
              <div className="text-gray-600 font-medium">Active Members</div>
            </div>
          </div>
          <div className="flex items-center space-x-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                50+
              </div>
              <div className="text-gray-600 font-medium">Research Papers</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:scale-105"
            asChild
          >
            <Link href="/gallery">
              Explore The Full Gallery
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}