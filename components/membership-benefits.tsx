"use client";

import * as React from "react";
import { BookOpen, Users, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function MembershipBenefits() {
  const benefits: Benefit[] = [
    {
      id: "1",
      title: "Exclusive Access",
      description: "Access to exclusive journals and publications",
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      id: "2",
      title: "Expert Network",
      description: "Networking opportunities with leading experts",
      icon: <Users className="h-6 w-6" />,
    },
    {
      id: "3",
      title: "Special Discounts",
      description: "Discounts on all conferences and workshops",
      icon: <Calendar className="h-6 w-6" />,
    },
  ];

  return (
    <section className="py-20 bg-[#F7F7F7] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/membership.png"
                alt="BCNS Membership Benefits"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>

            {/* Floating stats card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  500+
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Active Members
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            {/* Headline */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Why Join the BCNS Community?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Connect with leading pediatric neurologists, access cutting-edge
                research, and advance your career through our comprehensive
                membership program.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="flex items-start space-x-4 group"
                >
                  {/* Icon Container */}
                  <div className="flex-shrink-0 p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                    <div className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                      {benefit.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Become a Member
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>

              {/* Additional info */}
              <p className="text-sm text-gray-500 mt-4">
                Join thousands of healthcare professionals advancing pediatric
                neurology
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
