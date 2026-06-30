import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar, Clock, Users, Award, Video, BookOpen, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Education | BCNS - Bangladesh Child Neurology Society",
  description: "Continuing medical education and training programs in pediatric neurology",
};

export default function EducationPage() {
  const programs = [
    {
      id: "1",
      title: "Pediatric Neurology Fellowship",
      description: "Comprehensive 2-year fellowship program for advanced training in pediatric neurology",
      duration: "24 months",
      format: "Full-time",
      seats: 10,
      icon: <GraduationCap className="h-6 w-6" />,
      type: "Fellowship",
    },
    {
      id: "2",
      title: "CME Workshops",
      description: "Regular continuing medical education workshops on latest developments",
      duration: "1-2 days",
      format: "In-person/Online",
      seats: 50,
      icon: <Users className="h-6 w-6" />,
      type: "Workshop",
    },
    {
      id: "3",
      title: "Online Learning Modules",
      description: "Self-paced online courses covering various topics in pediatric neurology",
      duration: "Self-paced",
      format: "Online",
      seats: "Unlimited",
      icon: <Video className="h-6 w-6" />,
      type: "Online",
    },
    {
      id: "4",
      title: "Clinical Observership",
      description: "Hands-on clinical training opportunities at leading pediatric neurology centers",
      duration: "1-3 months",
      format: "In-person",
      seats: 5,
      icon: <BookOpen className="h-6 w-6" />,
      type: "Training",
    },
  ];

  const upcomingEvents = [
    {
      id: "1",
      title: "Epilepsy Management Workshop",
      date: "March 15, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "NINS, Dhaka",
      type: "Workshop",
    },
    {
      id: "2",
      title: "Neurodevelopmental Disorders Seminar",
      date: "April 10, 2025",
      time: "2:00 PM - 6:00 PM",
      location: "Online",
      type: "Seminar",
    },
    {
      id: "3",
      title: "Pediatric Headache Management Course",
      date: "May 5, 2025",
      time: "Full Day",
      location: "BMU, Dhaka",
      type: "Course",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 bg-linear-to-br from-purple-600 via-pink-600 to-rose-600">
        <div className="absolute inset-0 bg-[url('/images/child_neurology.png')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Education & Training
            </h1>
            <p className="text-lg sm:text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Continuing medical education and training programs to advance your expertise in pediatric neurology
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {programs.map((program) => (
              <Card key={program.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <div className="text-purple-600">{program.icon}</div>
                    </div>
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-semibold rounded-full">
                      {program.type}
                    </span>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl mb-2 group-hover:text-purple-600 transition-colors">
                    {program.title}
                  </CardTitle>
                  <CardDescription className="text-base mb-3">
                    {program.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      <span>{program.format}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{program.seats} seats</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full group/btn" variant="outline">
                    <span>Learn More</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Upcoming Educational Events
              </h2>
              <p className="text-lg text-gray-600">
                Join our upcoming workshops, seminars, and training programs
              </p>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-600">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs font-semibold rounded">
                            {event.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                View All Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-linear-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our Programs
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center border-2">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 mx-auto">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Expert Faculty</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Learn from leading pediatric neurologists and specialists
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center border-2">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 mx-auto">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Practical Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Hands-on training with real-world case studies and scenarios
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center border-2">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 mx-auto">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Networking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Connect with peers and build professional relationships
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

