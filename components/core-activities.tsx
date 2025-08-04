"use client";

import * as React from "react";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Microscope,
  GraduationCap,
} from "lucide-react";

interface CoreActivity {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

export function CoreActivities() {
  const coreActivities: CoreActivity[] = [
    {
      id: "1",
      title: "Guidelines",
      description:
        "Evidence-based clinical guidelines for pediatric neurology practice",
      icon: <FileText className="h-8 w-8" />,
      link: "/guidelines",
    },
    {
      id: "2",
      title: "Journals",
      description: "Peer-reviewed publications and research articles",
      icon: <BookOpen className="h-8 w-8" />,
      link: "/journals",
    },
    {
      id: "3",
      title: "Research",
      description: "Cutting-edge research initiatives and clinical studies",
      icon: <Microscope className="h-8 w-8" />,
      link: "/research",
    },
    {
      id: "4",
      title: "Education",
      description: "Continuing medical education and training programs",
      icon: <GraduationCap className="h-8 w-8" />,
      link: "/education",
    },
  ];

  return (
    <section className="relative py-10 lg:py-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/child_neurology.png')",
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Core Pillars
          </h2>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Advancing pediatric neurology through comprehensive guidelines,
            research, education, and peer-reviewed publications
          </p>
        </div>

        {/* Glassmorphism Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {coreActivities.map((activity) => (
            <div key={activity.id} className="group relative">
              {/* Glassmorphism Panel */}
              <div className="relative h-full p-5 md:p-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md transition-all duration-500 hover:bg-white/20 hover:border-white/40 hover:scale-105">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="p-3 md:p-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                    <div className="text-white">{activity.icon}</div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-3">
                  {activity.title}
                </h3>

                {/* Description */}
                <p className="text-base text-gray-200 text-center mb-5 leading-relaxed">
                  {activity.description}
                </p>

                {/* Explore Link */}
                <div className="flex justify-center">
                  <a
                    href={activity.link}
                    className="inline-flex items-center text-white font-semibold hover:text-blue-200 transition-colors duration-300 group/link"
                  >
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>

                {/* Subtle Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10 md:mt-16">
          <p className="text-base md:text-lg text-gray-300 mb-4">
            Discover how we&apos;re shaping the future of pediatric neurology 
          </p>
          <a
            href="/about"
            className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 text-sm sm:text-base bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-semibold hover:bg-white/30 hover:border-white/50 transition-all duration-300 group"
          >
            Learn More About Our Mission
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
}
