import type { Metadata } from "next";
import {
  Calendar,
  HeartPulse,
  Users,
  FlaskConical,
  GraduationCap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Mission | Bangladesh Child Neurology Society (BCNS)",
  description:
    "Discover the mission of the Bangladesh Child Neurology Society (BCNS). We are dedicated to uniting professionals, enhancing clinical care, and advancing research in child neurology across Bangladesh.",
};

// Static generation for better performance
export const revalidate = false; // Static at build time

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero / Title */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-800">
        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -top-20 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-300/10 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20 text-white">
          <div className="max-w-3xl">
            <p className="inline-block text-[11px] sm:text-xs font-semibold tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-white/20 mb-3">
              About BCNS
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              Uniting Professionals, Advancing Care
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100/90 max-w-2xl">
              The core mission of the Bangladesh Child Neurology Society (BCNS)
              is to create a unified, dynamic platform for all child
              neurologists and pediatricians dedicated to this field in
              Bangladesh.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-10 sm:py-12 lg:py-16 bg-gradient-to-b from-blue-50/40 via-white to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              We are committed to improving the neurological health and
              well-being of children across the nation by addressing the
              significant challenges posed by neurodevelopmental disorders.
            </p>
          </div>

          {/* Pillars */}
          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Enhance Clinical Services
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    To elevate the standard of pediatric neurological care
                    available throughout Bangladesh. We aim to equip our
                    healthcare facilities and professionals to meet the
                    country’s needs and the sustainable development goals (SDGs)
                    related to child health by providing expert guidance and
                    support.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Foster Professional Collaboration
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    To build a strong, collaborative association for the growing
                    number of dedicated professionals in pediatric neurology.
                    BCNS provides a platform for shared learning, guidance, and
                    collective action, ensuring that both existing and promising
                    new child neurologists have the support they need to excel.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Promote Research and Innovation
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    To spearhead and support crucial research on
                    neurodevelopmental disorders within Bangladesh. We actively
                    seek national and international collaborations to contribute
                    to the global understanding of child neurology and to
                    develop innovative, locally-relevant solutions.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Champion Education and Training
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    To carry the torch for the next generation of specialists.
                    We are dedicated to guiding and mentoring the highly
                    enthusiastic young professionals who have recently earned
                    their FCPS & MD degrees in Pediatric Neurology, ensuring a
                    continuous legacy of excellence.
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* Footer note */}
          <div className="mt-10 sm:mt-12 text-xs sm:text-sm text-gray-500 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              BCNS — Working together to advance child neurological care in
              Bangladesh.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
