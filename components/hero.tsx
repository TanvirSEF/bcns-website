"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function Hero() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

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
      image: "/images/banner.jpg",
      title: "Advancing Child Neurology in Bangladesh",
      subtitle: "Leading the way in pediatric neurological care and research",
      description:
        "Join us in our mission to improve the lives of children with neurological disorders through cutting-edge research, education, and compassionate care.",
    },
    {
      image: "/images/banner2.jpg",
      title: "Excellence in Pediatric Neurology",
      subtitle: "Empowering healthcare professionals across Bangladesh",
      description:
        "Discover our comprehensive programs, conferences, and research initiatives that are shaping the future of child neurology in our region.",
    },
    {
      image: "/images/banner3.jpg",
      title: "Innovation in Child Healthcare",
      subtitle: "Pioneering advances in pediatric neurological treatment",
      description:
        "We are committed to advancing the field of child neurology through innovative research, education, and clinical excellence.",
    },
    {
      image: "/images/banner4.jpg",
      title: "Building a Better Future",
      subtitle: "Transforming lives through specialized pediatric care",
      description:
        "Our dedicated team of professionals works tirelessly to provide the highest quality care for children with neurological conditions.",
    },
    {
      image: "/images/banner5.jpg",
      title: "Community and Collaboration",
      subtitle: "Uniting healthcare professionals for better outcomes",
      description:
        "Through collaboration and knowledge sharing, we are building a stronger community of child neurology specialists across Bangladesh.",
    },
    {
      image: "/images/banner6.JPG",
      title: "Excellence in Education",
      subtitle: "Training the next generation of child neurologists",
      description:
        "We provide comprehensive education and training programs to develop skilled professionals in pediatric neurology.",
    },
  ];

  return (
    <section className="relative w-full bg-slate-900 overflow-hidden">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{ align: "start", loop: true }}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="ml-0">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative min-h-[20rem] xs:min-h-[24rem] sm:min-h-[28rem] md:min-h-[32rem] lg:min-h-[38rem] xl:min-h-[42rem] 2xl:min-h-[45rem] w-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
                <div className="absolute inset-0 flex flex-col justify-center">
                  <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl text-center md:text-left">
                      <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 sm:mb-3 md:mb-4 leading-tight tracking-tight">
                        {slide.title}
                      </h1>
                      <h2 className="text-sm xs:text-base sm:text-lg md:text-xl text-blue-200 mb-3 sm:mb-4 md:mb-6">
                        {slide.subtitle}
                      </h2>
                      <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-200 mb-4 sm:mb-6 md:mb-8 leading-relaxed">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 sm:left-4 bg-white/20 hover:bg-white/30 border-white/30 text-white hidden sm:inline-flex" />
        <CarouselNext className="right-2 sm:right-4 bg-white/20 hover:bg-white/30 border-white/30 text-white hidden sm:inline-flex" />
      </Carousel>


      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-10 lg:hidden">
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

    </section>
  );
}
