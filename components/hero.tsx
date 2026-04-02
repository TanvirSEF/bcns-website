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
      image: "/images/bannerlast.jpeg",
      title: "Scientific Seminar on Management of Childhood Epilepsy: An Evidence Based Approach",
    },
    {
      image: "/images/banner.jpg",
      title: "BCNS – 1st Executive Committee Meeting, 2025",
    },
    {
      image: "/images/banner2.jpg",
      title: '(CME) on "Paediatric Movement Disorder" was held on 21 June 2025',
    },
    {
      image: "/images/banner3.jpg",
      title: '(CME) on "Paediatric Movement Disorder" was held on 21 June 2025',
    },
    {
      image: "/images/banner5.jpg",
      title: '(CME) on "Paediatric Movement Disorder" was held on 21 June 2025',
    },
    {
      image: "/images/banner7.jpg",
      title: '(CME) on "Paediatric Movement Disorder"',
    },
    {
      image: "/images/banner8.jpg",
      title: '(CME) on "Paediatric Movement Disorder"',
    },
    {
      image: "/images/banner9.jpg",
      title: '(CME) on "Paediatric Movement Disorder"',
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
                alt={typeof slide.title === "string" ? slide.title : "Banner Image"}
                fill
                className="object-cover"
                priority={index === 0}
                quality={85}
                sizes="100vw"
              />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-x-0 bottom-0">
                  <div className="bg-gradient-to-t from-black/80 via-black/60 to-transparent">
                    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
                      {slide.title && (
                        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md text-center sm:text-left">
                          {slide.title}
                        </h1>
                      )}
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


      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20 lg:hidden">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
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
