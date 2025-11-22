import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BookOpen, CheckCircle2, ArrowRight, Clock, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Guidelines | BCNS - Bangladesh Child Neurology Society",
  description: "Evidence-based clinical guidelines for pediatric neurology practice",
};

export default function GuidelinesPage() {
  const guidelines = [
    {
      id: "1",
      title: "Pediatric Epilepsy Management",
      description: "Comprehensive guidelines for diagnosis, treatment, and management of epilepsy in children",
      category: "Epilepsy",
      lastUpdated: "2024",
      downloads: 1250,
      icon: <FileText className="h-6 w-6" />,
    },
    {
      id: "2",
      title: "Neurodevelopmental Disorders",
      description: "Evidence-based approaches for assessment and intervention in neurodevelopmental conditions",
      category: "Development",
      lastUpdated: "2024",
      downloads: 980,
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      id: "3",
      title: "Headache Management in Children",
      description: "Clinical guidelines for evaluation and treatment of pediatric headaches",
      category: "Headache",
      lastUpdated: "2023",
      downloads: 750,
      icon: <FileText className="h-6 w-6" />,
    },
    {
      id: "4",
      title: "Neuromuscular Disorders",
      description: "Diagnostic and therapeutic guidelines for pediatric neuromuscular conditions",
      category: "Neuromuscular",
      lastUpdated: "2024",
      downloads: 650,
      icon: <FileText className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-[url('/images/child_neurology.png')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Clinical Guidelines
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Evidence-based clinical guidelines for pediatric neurology practice, developed by leading experts in the field.
            </p>
          </div>
        </div>
      </section>

      {/* Guidelines Grid */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {guidelines.map((guideline) => (
              <Card key={guideline.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <div className="text-blue-600">{guideline.icon}</div>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                      {guideline.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl mb-2 group-hover:text-blue-600 transition-colors">
                    {guideline.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {guideline.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Updated {guideline.lastUpdated}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{guideline.downloads}+ downloads</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full group/btn" variant="outline">
                    <span>View Guidelines</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Our Guidelines Matter
              </h2>
              <p className="text-lg text-gray-600">
                Developed by experts, backed by evidence, trusted by practitioners
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center border-2">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 mx-auto">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Evidence-Based</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    All guidelines are based on the latest scientific evidence and clinical research
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center border-2">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 mx-auto">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Expert Reviewed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Developed and reviewed by leading pediatric neurologists and specialists
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center border-2">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 mx-auto">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Regularly Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Guidelines are regularly reviewed and updated to reflect current best practices
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

