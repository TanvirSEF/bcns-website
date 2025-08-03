"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export function Hero() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const heroSlides = [
    {
      image: "/images/banner.webp",
      title: "Advancing Child Neurology in Bangladesh",
      subtitle: "Leading the way in pediatric neurological care and research",
      description:
        "Join us in our mission to improve the lives of children with neurological disorders through cutting-edge research, education, and compassionate care.",
      ctaText: "Learn More",
      ctaLink: "/about",
      badge: "Featured",
    },
    {
      image: "/images/banner1.webp",
      title: "Excellence in Pediatric Neurology",
      subtitle: "Empowering healthcare professionals across Bangladesh",
      description:
        "Discover our comprehensive programs, conferences, and research initiatives that are shaping the future of child neurology in our region.",
      ctaText: "Join Us",
      ctaLink: "/membership",
      badge: "New",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Hero Carousel */}
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-0">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative h-[600px] lg:h-[700px] w-full">
                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

                {/* Content Container */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                      {/* Badge */}
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white mb-6">
                        {slide.badge}
                      </div>

                      {/* Title */}
                      <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                        {slide.title}
                      </h1>

                      {/* Subtitle */}
                      <h2 className="text-xl lg:text-2xl font-medium text-blue-200 mb-6">
                        {slide.subtitle}
                      </h2>

                      {/* Description */}
                      <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-xl">
                        {slide.description}
                      </p>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          size="lg"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          {slide.ctaText}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>

                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setIsVideoModalOpen(true)}
                          className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 group bg-white/10 backdrop-blur-sm"
                        >
                          <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                          Watch Video
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom Navigation Buttons */}
        <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/30 border-white/30 text-white" />
        <CarouselNext className="right-4 bg-white/20 hover:bg-white/30 border-white/30 text-white" />
      </Carousel>

      {/* Carousel Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index + 1
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>

      {/* Floating Stats Card */}
      <div className="absolute bottom-8 right-8 hidden lg:block">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-600">Research Papers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">25+</div>
                <div className="text-sm text-gray-600">Years</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
            >
              <X className="h-6 w-6" />
            </button>
            <iframe
              src="https://www.youtube.com/embed/your-video-id?autoplay=1"
              title="BCNS Introduction Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
