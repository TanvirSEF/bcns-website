"use client";

import Image from "next/image";

export function LogoBanner() {
  return (
    <section className="w-full bg-linear-to-r from-blue-50 to-blue-100 py-1 xs:py-2 sm:py-3 md:py-4 lg:py-5 shadow-lg border-b border-blue-200">
      <div className="container mx-auto px-1 xs:px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          {/* Fully Responsive Logo */}
          <Image
            src="/images/BCNS LOGO.png"
            alt="BCNS - Bangladesh Child Neurology Society"
            width={800}
            height={160}
            priority
            className="w-full h-auto max-w-[360px] xs:max-w-[400px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[700px] drop-shadow-xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}
