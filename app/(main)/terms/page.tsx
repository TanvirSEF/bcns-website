import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, FileText, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | BCNS - Bangladesh Child Neurology Society",
  description: "Terms and conditions for using BCNS website and services.",
};

export default function TermsPage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: CheckCircle,
      content: [
        "By accessing and using this website, you accept and agree to be bound by these terms",
        "If you do not agree to these terms, please do not use our website",
        "We reserve the right to modify these terms at any time",
        "Continued use after changes constitutes acceptance of new terms"
      ]
    },
    {
      title: "Use of Website",
      icon: FileText,
      content: [
        "Use the website for lawful purposes only",
        "Do not attempt to gain unauthorized access to any part of the website",
        "Do not use the website in any way that could damage or impair the website",
        "Respect intellectual property rights of BCNS and third parties"
      ]
    },
    {
      title: "Membership Terms",
      icon: Scale,
      content: [
        "Membership is subject to approval by BCNS",
        "Members must maintain current contact information",
        "Membership benefits are non-transferable",
        "BCNS reserves the right to suspend or terminate membership"
      ]
    },
    {
      title: "Prohibited Activities",
      icon: XCircle,
      content: [
        "Posting false, misleading, or defamatory content",
        "Violating any applicable laws or regulations",
        "Infringing on intellectual property rights",
        "Spamming or sending unsolicited communications"
      ]
    },
    {
      title: "Limitation of Liability",
      icon: AlertTriangle,
      content: [
        "BCNS is not liable for any indirect, incidental, or consequential damages",
        "We do not guarantee the accuracy of all information on the website",
        "Use of the website is at your own risk",
        "We are not responsible for third-party content or links"
      ]
    },
    {
      title: "Intellectual Property",
      icon: FileText,
      content: [
        "All content on this website is owned by BCNS or used with permission",
        "You may not reproduce, distribute, or modify content without permission",
        "BCNS logo and branding are protected trademarks",
        "Unauthorized use of intellectual property is prohibited"
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
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Terms of <span className="bg-linear-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">Service</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Please read these terms carefully before using our website and services.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
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
                  <span>Additional Terms</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Governing Law</h3>
                  <p className="text-gray-700">
                    These terms are governed by the laws of Bangladesh. Any disputes will be resolved 
                    in the courts of Bangladesh.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Severability</h3>
                  <p className="text-gray-700">
                    If any provision of these terms is found to be unenforceable, the remaining 
                    provisions will continue to be valid and enforceable.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <p className="text-gray-700">
                    For questions about these terms, please contact us at 
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
