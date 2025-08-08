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
    <section className="py-10 sm:py-14 lg:py-16 bg-gradient-to-b from-blue-50/40 via-white to-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 ring-8 ring-blue-50">
            <Camera className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Glimpses of Our Events
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Highlights from conferences, workshops, and research activities.
          </p>
        </div>

        {/* Compact responsive gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[12rem] sm:auto-rows-[14rem] lg:auto-rows-[16rem] gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-12">
          {galleryImages.map((image, index) => (
            <Link
              key={image.id}
              href={image.href}
              className={`group relative flex flex-col justify-end overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-100/60 bg-white
                ${
                  // Feature the first tile only on large screens
                  index === 0 ? "lg:col-span-2 lg:row-span-2" : "col-span-1"
                }
              `}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity"></div>
              <div className="relative z-10 p-3 sm:p-4 space-y-2 transform transition-transform duration-300 ease-out translate-y-6 group-hover:translate-y-0">
                <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2">
                  {image.eventName}
                </h3>
                <div className="space-y-1.5 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex items-center text-[11px] sm:text-xs">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{image.date}</span>
                  </div>
                  <div className="flex items-center text-[11px] sm:text-xs">
                    <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{image.attendees}</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-white/95 backdrop-blur-sm text-gray-800 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-sm border border-blue-100/60">
                  {image.category}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Compact statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-blue-100/60">
            <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                25+
              </div>
              <div className="text-gray-600 text-sm">Events This Year</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-blue-100/60">
            <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                500+
              </div>
              <div className="text-gray-600 text-sm">Active Members</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-blue-100/60">
            <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                50+
              </div>
              <div className="text-gray-600 text-sm">Research Papers</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 group shadow-sm hover:shadow-md"
            asChild
          >
            <Link href="/gallery">
              View Full Gallery
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
