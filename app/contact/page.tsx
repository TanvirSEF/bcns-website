import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us | BCNS - Bangladesh Child Neurology Society",
  description:
    "Get in touch with BCNS. Contact us for membership, events, research collaboration, or general inquiries. We're here to help the child neurology community.",
};

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  description?: string;
  href?: string;
}

export default function ContactPage() {
  const contactInfo: ContactInfo[] = [
    {
      icon: Phone,
      title: "Phone",
      value: "+880 1711261736",
      description: "Call us during business hours",
      href: "tel:+8801711261736",
    },
    {
      icon: Mail,
      title: "Email",
      value: "office@bcns.org.bd",
      description: "Send us an email anytime",
      href: "mailto:office@bcns.org.bd",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "Dhaka Medical College",
      description: "Dhaka, Bangladesh",
    },
    {
      icon: Clock,
      title: "Working Hours",
      value: "Monday - Friday",
      description: "9:00 AM - 5:00 PM",
    },
  ];

  const departments = [
    {
      name: "General Inquiries",
      email: "info@bcns.org.bd",
      description: "For general questions and information",
    },
    {
      name: "Membership",
      email: "membership@bcns.org.bd",
      description: "Membership applications and benefits",
    },
    {
      name: "Research",
      email: "research@bcns.org.bd",
      description: "Research collaborations and grants",
    },
    {
      name: "Events",
      email: "events@bcns.org.bd",
      description: "Conference and event information",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white mb-4 sm:mb-6">
              Contact Us
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto">
              Have questions about our services, membership, or upcoming events?
              We&apos;re here to help you connect with the BCNS community.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-4 sm:mb-6">
                    <info.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="text-blue-600 hover:text-blue-700 font-medium text-base sm:text-lg transition-colors duration-200"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-700 font-medium text-base sm:text-lg">
                      {info.value}
                    </p>
                  )}
                  {info.description && (
                    <p className="text-gray-500 text-sm sm:text-base mt-2">
                      {info.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Send us a Message
                </h2>
                <p className="text-gray-600 text-lg">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </p>
              </div>

              <ContactForm />
            </div>

            {/* Department Contacts & Map */}
            <div className="space-y-8">
              {/* Department Contacts */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  Contact by Department
                </h3>
                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <Card
                      key={index}
                      className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Mail className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                              {dept.name}
                            </h4>
                            <p className="text-gray-600 text-sm mb-2">
                              {dept.description}
                            </p>
                            <a
                              href={`mailto:${dept.email}`}
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                            >
                              {dept.email}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Location Map */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  Our Location
                </h3>
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 font-medium">
                          Interactive Map
                        </p>
                        <p className="text-sm text-gray-400">
                          Dhaka Medical College, Dhaka, Bangladesh
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">
                        <MapPin className="inline h-4 w-4 mr-2 text-blue-600" />
                        Dhaka Medical College
                      </p>
                      <p className="text-gray-600 text-sm">Dhaka, Bangladesh</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Find quick answers to common questions about contacting BCNS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  How long does it take to get a response?
                </h4>
                <p className="text-gray-600">
                  We typically respond to all inquiries within 24-48 hours
                  during business days.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Can I visit your office?
                </h4>
                <p className="text-gray-600">
                  Yes, we welcome visitors by appointment. Please contact us to
                  schedule a meeting.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  How do I become a member?
                </h4>
                <p className="text-gray-600">
                  Visit our membership page or contact our membership department
                  for detailed information.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Do you offer emergency support?
                </h4>
                <p className="text-gray-600">
                  For medical emergencies, please contact your nearest hospital
                  or emergency services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
