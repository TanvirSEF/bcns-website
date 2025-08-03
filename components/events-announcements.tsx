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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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

  // Sample data - replace with real data
  const events: Event[] = [
    {
      id: "1",
      title: "Annual Pediatric Neurology Conference",
      description:
        "Join leading experts in pediatric neurology for our annual conference featuring cutting-edge research and clinical advances.",
      date: "2024-03-15",
      time: "09:00 AM",
      location: "Dhaka Medical College",
      category: "Conference",
      image: "/images/event1.png",
    },
    {
      id: "2",
      title: "Neurodevelopmental Disorders Workshop",
      description:
        "Comprehensive workshop on diagnosis and treatment of neurodevelopmental disorders in children.",
      date: "2024-03-22",
      time: "02:00 PM",
      location: "BCNS Training Center",
      category: "Workshop",
      image: "/images/event2.png",
    },
    {
      id: "3",
      title: "Research Methodology Webinar",
      description:
        "Learn advanced research methodologies in pediatric neurology from international experts.",
      date: "2024-03-30",
      time: "11:00 AM",
      location: "Online",
      category: "Webinar",
      image: "/images/event3.png",
    },
  ];

  const announcements: Announcement[] = [
    {
      id: "1",
      title: "New Research Grant Opportunities Available",
      date: "2024-03-10",
      link: "/announcements/research-grants",
    },
    {
      id: "2",
      title: "Updated Clinical Guidelines for Autism Spectrum Disorders",
      date: "2024-03-08",
      link: "/announcements/clinical-guidelines",
    },
    {
      id: "3",
      title: "Call for Papers: Annual Journal Publication",
      date: "2024-03-05",
      link: "/announcements/call-for-papers",
    },
    {
      id: "4",
      title: "Membership Renewal Reminder",
      date: "2024-03-03",
      link: "/announcements/membership-renewal",
    },
    {
      id: "5",
      title: "International Collaboration Opportunities",
      date: "2024-03-01",
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Stay Updated With Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover upcoming events and stay informed with our latest
            announcements
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab("events")}
              className={`px-8 py-3 rounded-md font-semibold transition-all duration-300 ${
                activeTab === "events"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`px-8 py-3 rounded-md font-semibold transition-all duration-300 ${
                activeTab === "announcements"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Latest Announcements
            </button>
          </div>
        </div>

        {/* Content with Fade Transition */}
        <div className="relative">
          <div
            className={`transition-all duration-500 ease-in-out ${
              activeTab === "events"
                ? "opacity-100"
                : "opacity-0 absolute inset-0"
            }`}
          >
            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const { day, month } = formatDate(event.date);
                return (
                  <Card
                    key={event.id}
                    className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white overflow-hidden flex flex-col h-full cursor-pointer"
                  >
                    {/* Event Image */}
                    <div className="h-48 relative overflow-hidden flex-shrink-0">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-white rounded-lg p-2 text-center shadow-lg backdrop-blur-sm">
                        <div className="text-lg font-bold text-blue-600">
                          {day}
                        </div>
                        <div className="text-xs font-medium text-gray-600">
                          {month}
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge
                          variant="secondary"
                          className="bg-white/95 text-gray-800 font-medium px-3 py-1 backdrop-blur-sm"
                        >
                          {event.category}
                        </Badge>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                        {event.description}
                      </p>

                      {/* Event Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{event.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0 flex-shrink-0">
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 border-gray-300 hover:border-blue-600 group-hover:shadow-md"
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-all duration-300" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out ${
              activeTab === "announcements"
                ? "opacity-100"
                : "opacity-0 absolute inset-0"
            }`}
          >
            {/* Announcements List */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border">
                {announcements.map((announcement, index) => (
                  <div
                    key={announcement.id}
                    className={`p-6 hover:bg-gray-50 transition-all duration-300 cursor-pointer group ${
                      index !== announcements.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {announcement.title}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center group-hover:text-gray-700 transition-colors">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            {formatAnnouncementDate(announcement.date)}
                          </span>
                        </p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-600 ml-4 flex-shrink-0 group-hover:scale-110 transition-all duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
