"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface EventGalleryProps {
  images: string[];
  title: string;
}

export function EventGallery({ images, title }: EventGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0 || !images[0]) return null;

  const primaryImage = images[0];
  const activeImage = selectedIndex !== null ? images[selectedIndex] || primaryImage : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Featured Primary Image */}
      <div
        className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 group cursor-pointer"
        onClick={() => setSelectedIndex(0)}
      >
        <Image
          src={primaryImage}
          alt={`${title} - Primary Image`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
          <span className="text-white font-medium text-sm flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
            <Maximize2 className="w-4 h-4" /> Click to view high resolution photo
          </span>
          {images.length > 1 && (
            <span className="text-white text-xs bg-blue-600/80 px-3 py-1 rounded-full font-semibold">
              1 of {images.length} Photos
            </span>
          )}
        </div>
      </div>

      {/* Secondary Photos Gallery Grid */}
      {images.length > 1 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            Event Photo Gallery <span className="text-sm font-normal text-gray-500">({images.length} Photos)</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-300 group hover:shadow-md ${
                  idx === 0 ? "border-blue-500 ring-2 ring-blue-400/30" : "border-gray-200 hover:border-blue-400"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} photo ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    Cover
                  </span>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="w-5 h-5 text-white drop-shadow-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50 cursor-pointer"
            title="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50 cursor-pointer"
              title="Previous photo"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Active Image Container */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[75vh] max-h-[700px]">
              {activeImage && (
                <Image
                  src={activeImage}
                  alt={`${title} full photo ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              )}
            </div>
            {/* Caption / Indicator */}
            <div className="mt-4 text-center text-white/80 text-sm font-medium bg-black/40 px-4 py-1.5 rounded-full">
              Photo {selectedIndex + 1} of {images.length}
            </div>
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-8 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50 cursor-pointer"
              title="Next photo"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
