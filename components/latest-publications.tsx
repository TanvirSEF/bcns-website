"use client";

import * as React from "react";
import { ArrowRight, ExternalLink, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Publication {
  id: string;
  title: string;
  author: string;
  category: string;
  abstract: string;
  date: string;
  image: string;
  link: string;
}

export function LatestPublications() {
  const featuredPublication: Publication = {
    id: "1",
    title:
      "Advanced Diagnostic Approaches in Pediatric Epilepsy: A Comprehensive Review",
    author: "Dr. Sarah Ahmed, Dr. Mohammad Rahman",
    category: "Featured Research",
    abstract:
      "This comprehensive review examines the latest diagnostic methodologies in pediatric epilepsy, including advanced imaging techniques, genetic testing protocols, and clinical assessment tools that are revolutionizing early detection and treatment planning.",
    date: "2024-03-15",
    image: "/images/publication1.png",
    link: "/publications/pediatric-epilepsy-diagnosis",
  };

  const secondaryPublications: Publication[] = [
    {
      id: "2",
      title:
        "Neurodevelopmental Outcomes in Preterm Infants: A 5-Year Follow-up Study",
      author: "Dr. Fatima Khan",
      category: "Clinical Study",
      abstract:
        "Long-term neurodevelopmental assessment of preterm infants reveals critical insights into early intervention strategies and long-term care planning.",
      date: "2024-03-10",
      image: "/images/publication2.png",
      link: "/publications/preterm-neurodevelopment",
    },
    {
      id: "3",
      title: "Novel Therapeutic Approaches for Autism Spectrum Disorders",
      author: "Dr. James Wilson, Dr. Aisha Patel",
      category: "Review Article",
      abstract:
        "Exploring cutting-edge therapeutic interventions and their impact on improving quality of life for children with ASD.",
      date: "2024-03-08",
      image: "/images/publication3.png",
      link: "/publications/autism-therapeutics",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#111827] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 sm:mb-6">
            From Our Journals
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Discover cutting-edge research and clinical insights from leading
            pediatric neurologists
          </p>
        </div>

        {/* Asymmetrical Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {/* Left Column - Featured Publication (60%) */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="group cursor-pointer">
              <div className="bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300">
                {/* Featured Image */}
                <div className="h-48 sm:h-64 relative overflow-hidden">
                  <Image
                    src={featuredPublication.image}
                    alt={featuredPublication.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <Badge className="bg-blue-600 text-white font-medium px-2 py-1 sm:px-3">
                      {featuredPublication.category}
                    </Badge>
                  </div>
                  {/* Date Badge */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3">
                    <div className="flex items-center text-white text-xs sm:text-sm">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      {formatDate(featuredPublication.date)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-serif font-bold text-white mb-2 sm:mb-3 lg:mb-4 group-hover:text-blue-300 transition-colors line-clamp-2">
                    {featuredPublication.title}
                  </h3>

                  <div className="flex items-center text-gray-400 mb-2 sm:mb-3 lg:mb-4">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">
                      {featuredPublication.author}
                    </span>
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-3 sm:mb-4 lg:mb-6 line-clamp-3 text-sm lg:text-base">
                    {featuredPublication.abstract}
                  </p>

                  <div className="flex items-center text-blue-400 font-semibold text-sm sm:text-base group-hover:text-blue-300 transition-colors">
                    Read Full Paper
                    <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Secondary Publications (40%) */}
          <div className="md:col-span-2 lg:col-span-2 space-y-4 lg:space-y-6">
            {secondaryPublications.map((publication) => (
              <div key={publication.id} className="group cursor-pointer">
                <div className="bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300">
                  {/* Publication Image */}
                  <div className="h-28 sm:h-32 relative overflow-hidden">
                    <Image
                      src={publication.image}
                      alt={publication.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                      <Badge className="bg-green-600 text-white text-xs font-medium px-2 py-1">
                        {publication.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <h4 className="text-base sm:text-lg font-serif font-semibold text-white mb-2 sm:mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
                      {publication.title}
                    </h4>

                    <div className="flex items-center text-gray-400 mb-2 sm:mb-3">
                      <User className="h-3 w-3 mr-1" />
                      <span className="text-xs">{publication.author}</span>
                    </div>

                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                      {publication.abstract}
                    </p>

                    <div className="flex items-center text-blue-400 text-xs sm:text-sm font-medium group-hover:text-blue-300 transition-colors">
                      Read More
                      <ExternalLink className="ml-1 sm:ml-2 h-3 w-3 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 group"
          >
            Explore All Publications
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
}
