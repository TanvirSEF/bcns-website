import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
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
    "Our mission is to promote education, research, and overall patient care to improve the neurological outcome of children across Bangladesh through professional excellence and collaborative care.",
};

// Static generation for better performance
export const revalidate = false; // Static at build time

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero / Title */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-700 via-indigo-700 to-blue-800">
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
              Our Mission
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100/90 max-w-2xl">
              Bangladesh Child Neurology Society (BCNS) is committed to promoting education, research, and overall patient care to improve the neurological outcome of children across the country.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-10 sm:py-12 lg:py-16 bg-linear-to-b from-blue-50/40 via-white to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                Bangladesh Child Neurology Society (BCNS) is an association of child neurologists working in different health sectors of Bangladesh. Our mission is to promote education, research, and overall patient care to improve the neurological outcome of children across the country.
              </p>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                The plan foresaw achieving this through the implementation of comprehensive strategies that encompass professional development, accessible healthcare, collaborative research, and community awareness.
              </p>
            </div>
          </div>

          {/* Mission Implementation Strategies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Professional Excellence
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    Promoting professional excellence of qualified Neurologists, students, and trainees in pediatric neurology and development in Bangladesh.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Accessible Healthcare
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    Ensuring easy, accessible and equitable health services in the field of pediatric neurology & development across Bangladesh.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Educational Programs
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    Arranging conferences, seminars, workshops, training and other programs at national and international levels for the members.
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
                    Collaborative Care
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    Promoting collaborative and multidisciplinary care approaches by bringing together child neurologists, supporting professionals and institutions.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Research Excellence
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    Supporting and encouraging research works at home and abroad regularly while creating training opportunities for young neurologists.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Social Awareness
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    Enhancing social awareness of child neurological disease while facilitating unity, amity and fellow feelings among members.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Global Communication
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    Promoting communication with other organizations at national and international level and improving expertise in child neurology.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-xl bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-yellow-50 text-yellow-700 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Knowledge Dissemination
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    Publishing bulletins and journals, and receiving national or international aid systematically to advance the field.
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
      <Footer />
    </div>
  );
}
