import { ArrowRight, ExternalLink, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

interface Publication {
  id: string;
  title: string;
  author: string;
  category: string;
  abstract: string;
  date: string;
  image: string;
  link: string;
}

export function LatestPublications() {
  const featuredPublication: Publication = {
    id: "1",
    title:
      "Advanced Diagnostic Approaches in Pediatric Epilepsy: A Comprehensive Review",
    author: "Dr. Sarah Ahmed, Dr. Mohammad Rahman",
    category: "Featured Research",
    abstract:
      "This comprehensive review examines the latest diagnostic methodologies in pediatric epilepsy, including advanced imaging techniques, genetic testing protocols, and clinical assessment tools that are revolutionizing early detection and treatment planning.",
    date: "2024-03-15",
    image: "/images/journal.jpg",
    link: "/publications/pediatric-epilepsy-diagnosis",
  };

  const secondaryPublications: Publication[] = [
    {
      id: "2",
      title:
        "Neurodevelopmental Outcomes in Preterm Infants: A 5-Year Follow-up Study",
      author: "Dr. Fatima Khan",
      category: "Clinical Study",
      abstract:
        "Long-term neurodevelopmental assessment of preterm infants reveals critical insights into early intervention strategies and long-term care planning.",
      date: "2024-03-10",
      image: "/images/journal1.jpg",
      link: "/publications/preterm-neurodevelopment",
    },
    {
      id: "3",
      title: "Novel Therapeutic Approaches for Autism Spectrum Disorders",
      author: "Dr. James Wilson, Dr. Aisha Patel",
      category: "Review Article",
      abstract:
        "Exploring cutting-edge therapeutic interventions and their impact on improving quality of life for children with ASD.",
      date: "2024-03-08",
      image: "/images/journal2.jpg",
      link: "/publications/autism-therapeutics",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="py-10 sm:py-12 lg:py-14 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-block text-[11px] font-semibold tracking-widest uppercase text-blue-300/80 bg-blue-500/10 border border-blue-500/20 rounded-full px-2.5 py-0.5 mb-2.5">
            Publications
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white mb-2">
            From Our Journals
          </h2>
          <p className="text-xs sm:text-sm text-gray-300/90 max-w-xl mx-auto leading-relaxed">
            Discover research and clinical insights from leading pediatric
            neurologists.
          </p>
        </div>

        {/* Redesigned Grid Layout - Images Fully Visible */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-10">
          {/* Featured Publication - Full Width on Mobile, 2/3 on Desktop */}
          <div className="lg:col-span-2">
            <Link href={featuredPublication.link} className="group block">
              <div className="bg-slate-800/60 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                {/* Featured Image - Full Display */}
                <div className="relative w-full h-64 sm:h-80 lg:h-96">
                  <Image
                    src={featuredPublication.image}
                    alt={featuredPublication.title}
                    fill
                    className="object-contain bg-slate-100 group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-600 text-white font-medium px-3 py-1.5">
                      {featuredPublication.category}
                    </Badge>
                  </div>
                  {/* Date Badge */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
                    <div className="flex items-center text-white text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(featuredPublication.date)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    {featuredPublication.title}
                  </h3>

                  <div className="flex items-center text-gray-400 mb-4">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {featuredPublication.author}
                    </span>
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-6 text-base sm:text-lg">
                    {featuredPublication.abstract}
                  </p>

                  <div className="flex items-center text-blue-300 font-semibold text-base">
                    Read Full Paper
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Secondary Publications - Side Column */}
          <div className="lg:col-span-1 space-y-6">
            {secondaryPublications.map((publication) => (
              <Link
                key={publication.id}
                href={publication.link}
                className="group block"
              >
                <div className="bg-slate-800/60 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500/40 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300">
                  {/* Publication Image - Full Display */}
                  <div className="relative w-full h-48 sm:h-56">
                    <Image
                      src={publication.image}
                      alt={publication.title}
                      fill
                      className="object-contain bg-slate-100 group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-green-600 text-white text-xs font-medium px-2 py-1">
                        {publication.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    <h4 className="text-base sm:text-lg font-serif font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
                      {publication.title}
                    </h4>

                    <div className="flex items-center text-gray-400 mb-3">
                      <User className="h-3 w-3 mr-2" />
                      <span className="text-xs">
                        {publication.author}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {publication.abstract}
                    </p>

                    <div className="flex items-center text-blue-300 text-sm font-medium">
                      Read More
                      <ExternalLink className="ml-2 h-3 w-3 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main CTA Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            className="border-blue-500 text-blue-300 hover:bg-blue-600 hover:text-white px-5 py-2.5 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 group"
            asChild
          >
            <Link href="/publications">
              Explore All Publications
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
