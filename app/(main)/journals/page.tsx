import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Calendar, Users, TrendingUp, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Journals | BCNS - Bangladesh Child Neurology Society",
  description: "Peer-reviewed publications and research articles in pediatric neurology",
};

export default function JournalsPage() {
  const journals = [
    {
      id: "1",
      title: "Pediatric Neurology Today",
      description: "Quarterly publication featuring latest research, case studies, and clinical updates",
      publisher: "BCNS Publications",
      frequency: "Quarterly",
      impactFactor: "2.5",
      articles: 45,
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      id: "2",
      title: "Child Neurology Research",
      description: "Open-access journal focusing on innovative research in pediatric neurology",
      publisher: "BCNS Research Division",
      frequency: "Bi-annual",
      impactFactor: "3.2",
      articles: 32,
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      id: "3",
      title: "Clinical Practice Updates",
      description: "Practical guidelines and case-based learning for practicing neurologists",
      publisher: "BCNS Education",
      frequency: "Monthly",
      impactFactor: "1.8",
      articles: 120,
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      id: "4",
      title: "Neurodevelopmental Perspectives",
      description: "Specialized journal on neurodevelopmental disorders and interventions",
      publisher: "BCNS Special Interest Group",
      frequency: "Quarterly",
      impactFactor: "2.1",
      articles: 28,
      icon: <BookOpen className="h-6 w-6" />,
    },
  ];

  const recentArticles = [
    {
      id: "1",
      title: "Advances in Epilepsy Management in Children",
      authors: "Dr. M. Rahman, et al.",
      date: "2024",
      category: "Epilepsy",
    },
    {
      id: "2",
      title: "Neurodevelopmental Assessment Tools",
      authors: "Dr. S. Alam, et al.",
      date: "2024",
      category: "Development",
    },
    {
      id: "3",
      title: "Pediatric Headache: Diagnostic Approaches",
      authors: "Dr. Y. Chowdhury, et al.",
      date: "2023",
      category: "Headache",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-[url('/images/child_neurology.png')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Peer-Reviewed Journals
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Access the latest research articles, publications, and scientific contributions in pediatric neurology
            </p>
          </div>
        </div>
      </section>

      {/* Journals Grid */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {journals.map((journal) => (
              <Card key={journal.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-indigo-200">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                      <div className="text-indigo-600">{journal.icon}</div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full">
                      <TrendingUp className="h-3 w-3" />
                      <span>IF: {journal.impactFactor}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl mb-2 group-hover:text-indigo-600 transition-colors">
                    {journal.title}
                  </CardTitle>
                  <CardDescription className="text-base mb-3">
                    {journal.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{journal.publisher}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{journal.frequency}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">
                      {journal.articles} articles published
                    </span>
                  </div>
                  <Button className="w-full group/btn" variant="outline">
                    <span>Browse Journal</span>
                    <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Recent Publications
              </h2>
              <p className="text-lg text-gray-600">
                Latest research articles from our journals
              </p>
            </div>
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-600">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
                        <CardDescription className="mb-2">{article.authors}</CardDescription>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded">
                            {article.category}
                          </span>
                          <span>{article.date}</span>
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
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                View All Publications
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

