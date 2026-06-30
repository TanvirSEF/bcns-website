import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Microscope, Clock, Mail, Phone, BookOpen, Users, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Research | BCNS - Bangladesh Child Neurology Society",
  description: "Research activities, collaborations, and projects by BCNS members.",
};

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-pink-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-600 to-pink-600 rounded-full mb-6">
              <Microscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Research <span className="bg-linear-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">Activities</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Advancing child neurology through cutting-edge research, collaborations, and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="text-center">
              <CardHeader className="pb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-blue-600 to-pink-600 rounded-full mb-6 mx-auto">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Coming Soon
                </CardTitle>
                <p className="text-lg text-gray-600 mb-6">
                  We&apos;re building a comprehensive research platform to showcase our scientific contributions and collaborations.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-linear-to-r from-blue-50 to-pink-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    What&apos;s Coming:
                  </h3>
                  <ul className="space-y-3 text-left max-w-2xl mx-auto">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-linear-to-r from-blue-600 to-pink-600 rounded-full"></div>
                      <span className="text-gray-700">Ongoing Research Projects</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-linear-to-r from-blue-600 to-pink-600 rounded-full"></div>
                      <span className="text-gray-700">Clinical Trials & Studies</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-linear-to-r from-blue-600 to-pink-600 rounded-full"></div>
                      <span className="text-gray-700">Research Collaborations</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-linear-to-r from-blue-600 to-pink-600 rounded-full"></div>
                      <span className="text-gray-700">Grant Opportunities</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-linear-to-r from-blue-600 to-pink-600 rounded-full"></div>
                      <span className="text-gray-700">Research Publications</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Research Database</h4>
                    <p className="text-sm text-gray-600">Comprehensive research repository</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full mb-3">
                      <Users className="w-6 h-6 text-pink-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Collaboration Network</h4>
                    <p className="text-sm text-gray-600">Connect with researchers worldwide</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Research Awards</h4>
                    <p className="text-sm text-gray-600">Recognition for excellence</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Interested in research collaboration?
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="mailto:office@bcns.org.bd"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all duration-200"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Join Research Team</span>
                    </a>
                    <a
                      href="tel:+8801711261736"
                      className="inline-flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Call for Collaboration</span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
