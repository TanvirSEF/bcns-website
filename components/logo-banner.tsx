"use client";

import Image from "next/image";

export function LogoBanner() {
  return (
    <section className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-2 md:py-3 shadow-lg border-b border-blue-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          {/* Extra Wide Logo */}
          <Image
            src="/images/BCNS LOGO.png"
            alt="BCNS - Bangladesh Child Neurology Society"
            width={800}
            height={160}
            priority
            className="drop-shadow-xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}
