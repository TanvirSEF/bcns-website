import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Target,
  GraduationCap,
  HeartPulse,
  Calendar,
  Users,
  BookOpen,
  FlaskConical,
  HandHeart,
  Trophy,
  DollarSign,
  Globe,
  Shield,
  Building,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Goals | Bangladesh Child Neurology Society (BCNS)",
  description:
    "Explore the comprehensive 13-point goals of BCNS for professional development, healthcare improvement, research advancement, and community welfare in pediatric neurology.",
};

// Static generation for better performance
export const revalidate = false; // Static at build time

const goals = [
  {
    id: 1,
    icon: GraduationCap,
    title: "Professional Development",
    description: "To work for the professional development of specialists in pediatric neurology and development and related doctors working in this field in Bangladesh.",
    color: "blue"
  },
  {
    id: 2,
    icon: HeartPulse,
    title: "Better Health Services",
    description: "To ensure timely and better health service in the field of pediatric neurology & development",
    color: "green"
  },
  {
    id: 3,
    icon: Calendar,
    title: "Educational Programs",
    description: "To arrange conferences, seminars, workshops, training and other programmes at national and international levels for the members",
    color: "purple"
  },
  {
    id: 4,
    icon: Users,
    title: "Unity & Cooperation",
    description: "To establish unity, amity and fellow feelings among members and to enhance cooperation between them",
    color: "orange"
  },
  {
    id: 5,
    icon: BookOpen,
    title: "Educational Environment",
    description: "To help improving the educational environment in the departments of pediatrics",
    color: "teal"
  },
  {
    id: 6,
    icon: FlaskConical,
    title: "Research Participation",
    description: "To participate in research works at home and abroad at a regular basis",
    color: "red"
  },
  {
    id: 7,
    icon: HandHeart,
    title: "Social Welfare",
    description: "To join in different social and public welfare acts",
    color: "pink"
  },
  {
    id: 8,
    icon: BookOpen,
    title: "Publications",
    description: "To publish bulletins and journals regularly",
    color: "indigo"
  },
  {
    id: 9,
    icon: Trophy,
    title: "Cultural Activities",
    description: "To arrange sports, cultural and other activities",
    color: "yellow"
  },
  {
    id: 10,
    icon: DollarSign,
    title: "Financial Support",
    description: "To establish a separate fund for any member in need of financial help",
    color: "emerald"
  },
  {
    id: 11,
    icon: Globe,
    title: "International Aid",
    description: "To receive national or international aids systematically",
    color: "cyan"
  },
  {
    id: 12,
    icon: Shield,
    title: "Rights Protection",
    description: "To maintain and uphold the rights of pediatric neurologists",
    color: "violet"
  },
  {
    id: 13,
    icon: Building,
    title: "Professional Communication",
    description: "To communicate regularly and to represent in different national and international agencies, Secretariat, Director General Office and other organizations related to pediatric neurology",
    color: "slate"
  }
];

const getColorClasses = (color: string): { bg: string; text: string; border: string } => {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    teal: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
    red: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    pink: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    cyan: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
    violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
    slate: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
  };
  
  const defaultColor = { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
  return colorMap[color] || defaultColor;
};

export default function GoalsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-800">
        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -top-20 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-300/10 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20 text-white">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-white/20 mb-4">
              <Target className="h-3.5 w-3.5" /> Our Goals
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
              Our Comprehensive Goals
            </h1>
            <p className="text-lg sm:text-xl text-blue-100/90 max-w-3xl leading-relaxed">
              BCNS is committed to achieving 13 comprehensive goals that encompass professional development, 
              healthcare improvement, research advancement, and community welfare in pediatric neurology.
            </p>
          </div>
        </div>
      </section>

      {/* Goals Introduction */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-blue-50/40 via-white to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur border border-blue-100/70 shadow-sm rounded-2xl p-6 sm:p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Strategic Objectives</h2>
              <p className="text-gray-700 leading-relaxed">
                The Bangladesh Child Neurology Society has established a comprehensive framework of 13 strategic goals 
                that guide our mission to advance pediatric neurology in Bangladesh. These goals encompass every aspect 
                of our work, from professional development and healthcare delivery to research, education, and community engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Goals Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {goals.map((goal) => {
              const Icon = goal.icon;
              const colors = getColorClasses(goal.color);
              
              return (
                <article 
                  key={goal.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 p-6 group hover:border-blue-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600`}>
                          {goal.id}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {goal.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 sm:p-12 text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Join Us in Achieving These Goals
              </h2>
              <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
                Together, we can transform pediatric neurology in Bangladesh and provide better care for children 
                with neurological and neurodevelopmental disorders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/membership" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Become a Member
                </a>
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
