"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertTriangle } from "lucide-react";

interface RobustImageProps {
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

export function RobustImage({
  src,
  alt,
  fill = false,
  className = "",
  quality = 85,
  sizes,
  priority = false,
  onError,
  onLoad,
}: RobustImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    console.error(`Failed to load image: ${currentSrc} (attempt ${retryCount + 1})`);
    
    if (retryCount < 2) {
      // Try different approaches on retry
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      
      if (retryCount === 0) {
        // First retry: try with unoptimized
        setCurrentSrc(`${src}?unoptimized=true`);
      } else if (retryCount === 1) {
        // Second retry: try direct path
        setCurrentSrc(src.replace('/images/', '/images/'));
      }
    } else {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    }
  };

  const handleLoad = () => {
    console.log(`Successfully loaded image: ${currentSrc}`);
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
              setRetryCount(0);
              setCurrentSrc(src);
            }}
            className="text-xs text-blue-600 hover:text-blue-700 mt-1"
          >
            Retry
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
      <Image
        src={currentSrc}
        alt={alt}
        fill={fill}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        quality={quality}
        sizes={sizes}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
      />
    </>
  );
}
