import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Clock, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQs | BCNS - Bangladesh Child Neurology Society",
  description: "Frequently asked questions about BCNS membership, events, and services.",
};

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-pink-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-600 to-pink-600 rounded-full mb-6">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Frequently Asked <span className="bg-linear-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">Questions</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Find answers to common questions about BCNS membership, events, and services.
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
                  We&apos;re working hard to bring you a comprehensive FAQ section with answers to all your questions about BCNS.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-linear-to-r from-blue-50 to-pink-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    What you can expect:
                  </h3>
                  <ul className="space-y-3 text-left max-w-2xl mx-auto">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-linear-to-r from-blue-600 to-pink-600 rounded-full"></div>
                      <span className="text-gray-700">Membership application process</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-linear-to-r from-blue-600 to-pink-600 rounded-full"></div>
                      <span className="text-gray-700">Event registration and participation</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-linear-to-r from-blue-600 to-pink-600 rounded-full"></div>
                      <span className="text-gray-700">Research collaboration guidelines</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-linear-to-r from-blue-600 to-pink-600 rounded-full"></div>
                      <span className="text-gray-700">Benefits and services information</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-linear-to-r from-blue-600 to-pink-600 rounded-full"></div>
                      <span className="text-gray-700">Technical support and troubleshooting</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Need immediate assistance?
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="mailto:office@bcns.org.bd"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:from-blue-700 hover:to-pink-700 transition-all duration-200"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Email Us</span>
                    </a>
                    <a
                      href="tel:+8801711261736"
                      className="inline-flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Call Us</span>
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
