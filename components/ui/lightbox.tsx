"use client";

import * as React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FallbackImage } from "@/components/ui/fallback-image";

interface LightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  title?: string;
}

export function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  title
}: LightboxProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  if (!isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
            disabled={currentIndex === images.length - 1}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      {/* Image Container */}
      <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center p-8">
        <div className="relative w-full h-full">
          <FallbackImage
            src={currentImage}
            alt={title || `Gallery image ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
            quality={90}
            sizes="90vw"
          />
        </div>
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Image Title */}
      {title && (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg text-sm max-w-md">
          {title}
        </div>
      )}
    </div>
  );
}
