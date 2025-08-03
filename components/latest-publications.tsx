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
    image: "/images/publication1.jpg",
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
      image: "/images/publication2.jpg",
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
      image: "/images/publication3.jpg",
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
    <section className="py-20 bg-[#111827]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
            From Our Journals
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover cutting-edge research and clinical insights from leading
            pediatric neurologists
          </p>
        </div>

        {/* Asymmetrical Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
          {/* Left Column - Featured Publication (60%) */}
          <div className="lg:col-span-3">
            <div className="group cursor-pointer">
              <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300">
                {/* Featured Image */}
                <div className="h-64 relative overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                    <div className="text-center text-white/60">
                      <div className="text-6xl mb-4">📄</div>
                      <p className="text-lg">Publication Image</p>
                    </div>
                  </div>
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-600 text-white font-medium px-3 py-1">
                      {featuredPublication.category}
                    </Badge>
                  </div>
                  {/* Date Badge */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                    <div className="flex items-center text-white text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(featuredPublication.date)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-4 group-hover:text-blue-300 transition-colors line-clamp-2">
                    {featuredPublication.title}
                  </h3>

                  <div className="flex items-center text-gray-400 mb-4">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {featuredPublication.author}
                    </span>
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-6 line-clamp-3">
                    {featuredPublication.abstract}
                  </p>

                  <div className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                    Read Full Paper
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Secondary Publications (40%) */}
          <div className="lg:col-span-2 space-y-6">
            {secondaryPublications.map((publication) => (
              <div key={publication.id} className="group cursor-pointer">
                <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300">
                  {/* Publication Image */}
                  <div className="h-32 relative overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center">
                      <div className="text-center text-white/60">
                        <div className="text-3xl mb-2">📋</div>
                        <p className="text-sm">Publication</p>
                      </div>
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-green-600 text-white text-xs font-medium px-2 py-1">
                        {publication.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h4 className="text-lg font-serif font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
                      {publication.title}
                    </h4>

                    <div className="flex items-center text-gray-400 mb-3">
                      <User className="h-3 w-3 mr-1" />
                      <span className="text-xs">{publication.author}</span>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {publication.abstract}
                    </p>

                    <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                      Read More
                      <ExternalLink className="ml-2 h-3 w-3 group-hover:scale-110 transition-transform duration-300" />
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
            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 group"
          >
            Explore All Publications
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  );
}
