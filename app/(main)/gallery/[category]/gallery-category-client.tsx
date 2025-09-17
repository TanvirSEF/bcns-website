"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { Lightbox } from "@/components/ui/lightbox";

interface EventData {
  title: string;
  date: string;
  attendees: string;
  description: string;
  images: string[];
}

interface GalleryCategoryClientProps {
  eventData: EventData;
}

export function GalleryCategoryClient({ eventData }: GalleryCategoryClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === eventData.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? eventData.images.length - 1 : prev - 1
    );
  };

  return (
    <>
      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {eventData.images.map((imageSrc, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="aspect-square relative">
              <Image
                src={imageSrc}
                alt={`${eventData.title} - Image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {index + 1}
              </div>
              {/* Zoom Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                  <Camera className="h-6 w-6 text-gray-800" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        images={eventData.images}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrevious={previousImage}
        title={eventData.title}
      />
    </>
  );
}
