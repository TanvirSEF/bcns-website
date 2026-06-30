import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Sparkles, MapPinned, Landmark, Microscope, Users, HeartPulse, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Vision | Bangladesh Child Neurology Society (BCNS)",
  description:
    "To foster optimal care of all children with neurological and neurodevelopmental disorders and build up professionals and resources through education, training and research.",
};

// Static generation for better performance
export const revalidate = false; // Static at build time

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-700 via-indigo-700 to-blue-800">
        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -top-20 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-300/10 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20 text-white">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-white/20 mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Our Vision
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              Our Vision
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100/90 max-w-2xl">
              To foster optimal care of all children with neurological and neurodevelopmental disorders and build up professionals and resources through education, training and research.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 sm:py-12 lg:py-16 bg-linear-to-b from-blue-50/40 via-white to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm rounded-2xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Vision Statement</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                To foster optimal care of all children with neurological and neurodevelopmental disorders and build up professionals and resources through education, training and research.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Optimal Child Care
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    Ensuring every child with neurological and neurodevelopmental disorders receives the highest quality of care and support.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Professional Development
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    Building up skilled professionals through comprehensive education and continuous training programs.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Microscope className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Research Excellence
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    Advancing the field through innovative research and evidence-based practices in pediatric neurology.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Resource Building
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    Developing comprehensive resources and infrastructure to support child neurology services nationwide.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <MapPinned className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Accessible Healthcare
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    Making specialized neurological care accessible to children across all regions of Bangladesh.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Center of Excellence
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    Establishing BCNS as a recognized center of excellence in pediatric neurology and development.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
