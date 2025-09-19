"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertTriangle } from "lucide-react";

interface FallbackImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  quality?: number;
  sizes?: string;
  priority?: boolean;
  onError?: () => void;
  onLoad?: () => void;
}

export function FallbackImage({
  src,
  alt,
  fill = false,
  className = "",
  quality = 85,
  sizes,
  priority = false,
  onError,
  onLoad,
}: FallbackImageProps) {
  const [useFallback, setUseFallback] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [currentQuality, setCurrentQuality] = useState(quality);

  const handleNextImageError = () => {
    console.log(`Next.js Image failed for ${src} (attempt ${retryCount + 1})`);
    
    if (retryCount < 2) {
      // Try different Next.js Image configurations
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      
      if (retryCount === 0) {
        // First retry: try with lower quality
        setCurrentQuality(75);
      } else if (retryCount === 1) {
        // Second retry: try with even lower quality
        setCurrentQuality(50);
      }
    } else {
      // Final fallback: use HTML img tag
      console.log(`All Next.js Image attempts failed for ${src}, using HTML fallback`);
      setUseFallback(true);
      setIsLoading(true);
    }
  };

  const handleFallbackError = () => {
    console.error(`HTML fallback image also failed for ${src}`);
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    console.log(`Successfully loaded image: ${src} (${useFallback ? 'HTML fallback' : `Next.js quality ${currentQuality}`})`);
    setIsLoading(false);
    onLoad?.();
  };

  if (hasError) {
    return (
      <div className={`${fill ? 'absolute inset-0' : 'w-full h-full'} bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
          <p className="text-sm">Image failed to load</p>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
              setUseFallback(false);
              setRetryCount(0);
              setCurrentQuality(quality);
            }}
            className="text-xs text-blue-600 hover:text-blue-700 mt-1"
          >
            Retry with Next.js
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`${fill ? 'absolute inset-0' : 'w-full h-full'} bg-gray-100 flex items-center justify-center ${className}`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {useFallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {}}
          onError={handleFallbackError}
          onLoad={handleLoad}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          quality={currentQuality}
          sizes={sizes}
          priority={priority}
          onError={handleNextImageError}
          onLoad={handleLoad}
        />
      )}
    </>
  );
}
