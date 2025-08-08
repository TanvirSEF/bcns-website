import type { Metadata } from "next";
import { Sparkles, MapPinned, Landmark, Microscope, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Vision for Child Neurology in Bangladesh | BCNS",
  description:
    "Explore the vision of BCNS. We envision a future where every child in Bangladesh has access to expert neurological care and where our society is a global leader in pediatric neurology research.",
};

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-800">
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
              A Future of Neurological Well‑being for Every Child
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100/90 max-w-2xl">
              Our vision at the Bangladesh Child Neurology Society (BCNS) is to
              build a future where every child in Bangladesh, regardless of
              their location or circumstances, has access to world‑class
              neurological care.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 sm:py-12 lg:py-16 bg-gradient-to-b from-blue-50/40 via-white to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              We aspire to eradicate disparities in healthcare and ensure that
              neurodevelopmental disorders are diagnosed early and managed
              effectively.
            </p>
          </div>

          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <MapPinned className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Expert Care is Accessible to All
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    A robust network of highly skilled child neurologists and
                    developmental pediatricians serves every corner of the
                    country, from urban centers to rural communities.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    BCNS is a Center of Excellence
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    Recognized nationally and internationally as the leading
                    authority for pediatric neurology in Bangladesh — a hub for
                    clinical guidelines, knowledge, and professional
                    development.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Microscope className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Research Creates Impact
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    Bangladeshi researchers, under BCNS, lead global studies on
                    neurodevelopmental disorders, contributing unique insights
                    and making a tangible impact on child health worldwide.
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
                    A Collaborative Community Thrives
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    A strong, supportive, and innovative community of young
                    professionals and seasoned experts works together, driving
                    the future of child neurology forward with passion and
                    dedication.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
