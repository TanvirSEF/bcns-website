import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Database, UserCheck, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | BCNS - Bangladesh Child Neurology Society",
  description: "Privacy policy and data protection information for BCNS website visitors and members.",
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information We Collect",
      icon: Database,
      content: [
        "Personal information you provide when registering for membership",
        "Contact information when you reach out to us",
        "Website usage data and analytics",
        "Event registration and participation information",
        "Research collaboration details"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: UserCheck,
      content: [
        "To provide membership services and benefits",
        "To communicate about events and activities",
        "To send newsletters and updates",
        "To process research collaborations",
        "To improve our website and services"
      ]
    },
    {
      title: "Data Protection",
      icon: Lock,
      content: [
        "We implement appropriate security measures",
        "Your data is encrypted and securely stored",
        "Access is limited to authorized personnel only",
        "We regularly update our security protocols",
        "We comply with data protection regulations"
      ]
    },
    {
      title: "Your Rights",
      icon: Eye,
      content: [
        "Right to access your personal data",
        "Right to correct inaccurate information",
        "Right to request data deletion",
        "Right to data portability",
        "Right to withdraw consent"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-pink-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-600 to-pink-600 rounded-full mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Privacy <span className="bg-linear-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {sections.map((section, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="p-2 bg-linear-to-r from-blue-600 to-pink-600 rounded-lg">
                        <section.icon className="w-6 h-6 text-white" />
                      </div>
                      <span>{section.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-linear-to-r from-blue-600 to-pink-600 rounded-full mt-2 shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Information */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="p-2 bg-linear-to-r from-blue-600 to-pink-600 rounded-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <span>Additional Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies</h3>
                  <p className="text-gray-700">
                    We use cookies to enhance your browsing experience and analyze website traffic. 
                    You can control cookie settings through your browser preferences.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Third-Party Services</h3>
                  <p className="text-gray-700">
                    We may use third-party services for analytics, email communication, and other 
                    functionalities. These services have their own privacy policies.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                  <p className="text-gray-700">
                    If you have any questions about this privacy policy or your data, please contact us at 
                    <a href="mailto:office@bcns.org.bd" className="text-blue-600 hover:underline ml-1">
                      office@bcns.org.bd
                    </a>
                  </p>
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
