"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";

const StatsCard = () => (
  <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl rounded-2xl">
    <CardContent className="p-5 sm:p-6">
      <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
        <div>
          <div className="text-2xl lg:text-3xl font-bold text-blue-600">500+</div>
          <div className="text-sm text-gray-600 font-medium">Members</div>
        </div>
        <div>
          <div className="text-2xl lg:text-3xl font-bold text-blue-600">50+</div>
          <div className="text-sm text-gray-600 font-medium">Research</div>
        </div>
        <div>
          <div className="text-2xl lg:text-3xl font-bold text-blue-600">25+</div>
          <div className="text-sm text-gray-600 font-medium">Years</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function Hero() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  React.useEffect(() => {
    if (!api) return;

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
    <section className="relative w-full bg-slate-900">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-0">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative h-[560px] sm:h-[600px] md:h-[650px] lg:h-[720px] w-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
                <div className="absolute inset-0 flex flex-col justify-center">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-xl text-center md:text-left">
                      <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-600/90 text-white mb-4">
                        {slide.badge}
                      </div>
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                        {slide.title}
                      </h1>
                      <h2 className="text-lg sm:text-xl text-blue-200 mb-6">
                        {slide.subtitle}
                      </h2>
                      <p className="text-base sm:text-lg text-gray-200 mb-8 leading-relaxed">
                        {slide.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button
                          size="lg"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          {slide.ctaText}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setIsVideoModalOpen(true)}
                          className="border-white/80 text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-base font-semibold rounded-lg transition-all duration-300 group bg-white/20 backdrop-blur-sm"
                        >
                          <Play className="mr-2 h-5 w-5 fill-current group-hover:scale-110 transition-transform duration-300" />
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
        <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/30 border-white/30 text-white hidden sm:inline-flex" />
        <CarouselNext className="right-4 bg-white/20 hover:bg-white/30 border-white/30 text-white hidden sm:inline-flex" />
      </Carousel>

      {/* --- FIXED: Stats Card is now hidden on mobile and tablet --- */}
      <div className="hidden lg:block absolute bottom-12 right-8 z-10">
        <StatsCard />
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-10 lg:hidden">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              current === index + 1
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-2 right-2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
              aria-label="Close video player"
            >
              <X className="h-6 w-6" />
            </button>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
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