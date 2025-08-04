"use client";

import * as React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
}

interface Announcement {
  id: string;
  title: string;
  date: string;
  link: string;
}

export function EventsAnnouncements() {
  const [activeTab, setActiveTab] = React.useState<"events" | "announcements">(
    "events"
  );

  // Sample data - replace with your actual data from a CMS or API
  const events: Event[] = [
    {
      id: "1",
      title: "Annual Pediatric Neurology Conference",
      description:
        "Join leading experts for our annual conference on cutting-edge research and clinical advances in pediatric neurology.",
      date: "2025-09-15",
      time: "09:00 AM",
      location: "Dhaka Medical College",
      category: "Conference",
      image: "/images/event1.png", // Replace with your image path
    },
    {
      id: "2",
      title: "Neurodevelopmental Disorders Workshop",
      description:
        "A comprehensive workshop on the diagnosis and management of neurodevelopmental disorders in children.",
      date: "2025-10-22",
      time: "02:00 PM",
      location: "BCNS Training Center",
      category: "Workshop",
      image: "/images/event2.png", // Replace with your image path
    },
    {
      id: "3",
      title: "Advanced Research Methodology Webinar",
      description:
        "Learn advanced research methodologies from international experts in this exclusive online webinar.",
      date: "2025-11-10",
      time: "11:00 AM",
      location: "Online",
      category: "Webinar",
      image: "/images/event3.png", // Replace with your image path
    },
    {
      id: "4",
      title: "Epilepsy Management Seminar",
      description:
        "A focused seminar on the latest treatment strategies and breakthroughs in pediatric epilepsy.",
      date: "2025-11-28",
      time: "10:00 AM",
      location: "BSMMU, Dhaka",
      category: "Seminar",
      image: "/images/event1.png", // Replace with your image path
    },
  ];

  const announcements: Announcement[] = [
    {
      id: "1",
      title: "New Research Grant Opportunities Available for 2026",
      date: "2025-08-01",
      link: "/announcements/research-grants",
    },
    {
      id: "2",
      title: "Updated Clinical Guidelines for Autism Spectrum Disorders",
      date: "2025-07-25",
      link: "/announcements/clinical-guidelines",
    },
    {
      id: "3",
      title: "Call for Papers: Annual Journal of Pediatric Neurology",
      date: "2025-07-18",
      link: "/announcements/call-for-papers",
    },
    {
      id: "4",
      title: "Membership Renewal for 2026 is Now Open",
      date: "2025-07-10",
      link: "/announcements/membership-renewal",
    },
    {
      id: "5",
      title: "International Collaboration with Global Neurologists",
      date: "2025-07-02",
      link: "/announcements/collaboration-opportunities",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return { day, month };
  };

  const formatAnnouncementDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
            Stay Updated With Us
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover upcoming events and stay informed with our latest
            announcements.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-12">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab("events")}
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-md font-semibold transition-all duration-300 text-xs sm:text-sm md:text-base ${
                activeTab === "events"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-md font-semibold transition-all duration-300 text-xs sm:text-sm md:text-base ${
                activeTab === "announcements"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Latest Announcements
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative">
          {/* Events View */}
          <div
            className={`transition-opacity duration-500 ease-in-out ${
              activeTab === "events"
                ? "opacity-100"
                : "opacity-0 absolute inset-0 pointer-events-none"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {events.map((event) => {
                const { day, month } = formatDate(event.date);
                return (
                  <Card
                    key={event.id}
                    className="group bg-white overflow-hidden flex flex-col h-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer p-0"
                  >
                    {/* Event Image - No padding, image fills the top */}
                    <div className="relative h-32 sm:h-40 md:h-44 w-full">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white rounded-md p-1.5 sm:p-2 text-center shadow-lg">
                        <div className="text-xs sm:text-sm font-bold text-blue-600">
                          {day}
                        </div>
                        <div className="text-xs font-medium text-gray-600">
                          {month}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 text-gray-800 text-xs"
                      >
                        {event.category}
                      </Badge>
                    </div>

                    {/* Card Content */}
                    <div className="p-3 sm:p-4 flex flex-col flex-grow">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 transition-colors group-hover:text-blue-600">
                        {event.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-3 flex-grow">
                        {event.description}
                      </p>
                      <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                          <span className="truncate">{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-auto transition-all duration-300 border-gray-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 text-xs sm:text-sm"
                      >
                        View Details
                        <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Announcements View */}
          <div
            className={`transition-opacity duration-500 ease-in-out ${
              activeTab === "announcements"
                ? "opacity-100"
                : "opacity-0 absolute inset-0 pointer-events-none"
            }`}
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border">
                {announcements.map((announcement, index) => (
                  <a
                    key={announcement.id}
                    href={announcement.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block p-3 sm:p-4 md:p-5 transition-colors duration-300 group hover:bg-gray-50 ${
                      index !== announcements.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600">
                          {announcement.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                          <span>
                            {formatAnnouncementDate(announcement.date)}
                          </span>
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-110" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
