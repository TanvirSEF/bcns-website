import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Heart,
  BookOpen,
  Award,
  ArrowRight,
  Calendar,
  Stethoscope,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About BCNS | Bangladesh Child Neurology Society",
  description:
    "Learn about the Bangladesh Child Neurology Society (BCNS), an association of child neurologists working to improve pediatric neurological care across Bangladesh since 2022.",
};

// Static generation for better performance
export const revalidate = false;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-700 via-indigo-700 to-blue-800">
        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -top-20 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-300/10 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20 text-white">
          <div className="max-w-4xl">
            <p className="inline-block text-[11px] sm:text-xs font-semibold tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-white/20 mb-4">
              About BCNS
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
              Bangladesh Child Neurology Society
            </h1>
            <p className="text-lg sm:text-xl text-blue-100/90 max-w-3xl leading-relaxed">
              An association of child neurologists working at different health sectors of Bangladesh, 
              dedicated to advancing pediatric neurological care and building a brighter future for children.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-b from-blue-50/40 via-white to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Our Story & Foundation
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bangladesh Child Neurology Society (BCNS) is an association of child neurologists working at different health sectors of Bangladesh. Being one of the most densely populated countries in the world, Bangladesh is also known for its scenic beauty, rich cultural heritage and a glorious history of bravery, war & revolution.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  With a population of about 170 million people, approximately 31.4% of the residents are aged under 18 years. Among different child health issues, neurodevelopmental disorders comprise a major portion necessitating an escalation of services in this field to meet the upcoming MDG challenges.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Until recently, Bangladesh wasn&apos;t offering any post graduate degree in Child Neurology. A group of highly dedicated Pediatricians started serving in this field and created the platform for the future generation to carry on the torch as Child Neurologists in Bangladesh.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/child_neurology.png"
                  alt="Child Neurology Care"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-blue-900/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey & Achievements */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Our Journey & Achievements
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to becoming a leading force in pediatric neurology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">2022</div>
              <div className="text-sm text-gray-600">BCNS Founded</div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">90+</div>
              <div className="text-sm text-gray-600">Active Members</div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">2025</div>
              <div className="text-sm text-gray-600">1st Executive Committee</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Since 2016 till date about 60 efficient doctors passed FCPS & MD degrees in Pediatric Neurology & Development and are continuing to serve at different parts of Bangladesh. Considering the huge burden of neurodevelopmental disorders in Bangladesh, the existing and promising new professionals need a strong association for future guidance and improvisation.
              </p>
              <p className="text-gray-700 leading-relaxed">
                With this view, child neurologists in Bangladesh, led by one of the pioneers <strong>Prof. Dr. Md. Mizanur Rahman</strong> dreamt up BCNS which started its journey in 2022. On April 26, 2025, the 1st executive committee was formed for next 2 years. BCNS, with about 70 members till date, most of whom being highly enthusiastic young professionals, has started working relentlessly to meet the country&apos;s need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links to Other Pages */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Learn More About BCNS
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our mission, vision, and goals in detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/about/mission" className="group">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group-hover:border-blue-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Our Mission
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Discover our commitment to promoting education, research, and overall patient care to improve neurological outcomes for children.
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                  Learn More <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/about/vision" className="group">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group-hover:border-blue-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Stethoscope className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Our Vision
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Learn about our vision to foster optimal care for all children with neurological and neurodevelopmental disorders.
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                  Learn More <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/about/goals" className="group">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group-hover:border-blue-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Our Goals
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Explore our comprehensive 13-point goals for professional development and healthcare improvement.
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                  Learn More <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
