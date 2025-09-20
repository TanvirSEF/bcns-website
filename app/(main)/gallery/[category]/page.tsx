import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { GalleryCategoryClient } from "./gallery-category-client";

// Define the event categories and their images
const eventCategories = {
  ecm2025: {
    title: "Executive Committee Meeting 2025",
    date: "April 26, 2025",
    attendees: "15+ Committee Members",
    description: "First Executive Committee Meeting of 2025",
    images: [
      "/images/ecm2025/1.jpg",
      "/images/ecm2025/2.jpg"
    ]
  },
  cme2025: {
    title: "CME on Paediatric Movement Disorder",
    date: "June 21, 2025",
    attendees: "80+ Participants",
    description: "Continuing Medical Education on Paediatric Movement Disorder",
    images: [
      "/images/cme/1.jpg",
      "/images/cme/2.jpg",
      "/images/cme/3.jpg",
      "/images/cme/4.jpg",
      "/images/cme/5.jpg",
      "/images/cme/6.jpg",
      "/images/cme/7.jpg",
      "/images/cme/8.jpg",
      "/images/cme/9.jpg",
      "/images/cme/10.jpg"
    ]
  },
  ce2025: {
    title: "Childhood Epilepsy Workshop",
    date: "August 26, 2025",
    attendees: "60+ Specialists",
    description: "Childhood Epilepsy - A Practical Approach Workshop",
    images: [
      "/images/ce/1.jpg",
      "/images/ce/2.jpg",
      "/images/ce/3.jpg",
      "/images/ce/4.jpg",
      "/images/ce/5.jpg",
      "/images/ce/6.jpg",
      "/images/ce/7.jpg",
      "/images/ce/8.jpg",
      "/images/ce/9.jpg",
      "/images/ce/10.jpg",
      "/images/ce/11.jpg",
      "/images/ce/12.jpg"
    ]
  },
  pmd2025: {
    title: "Paediatric Movement Disorder CME",
    date: "June 21, 2025",
    attendees: "80+ Participants",
    description: "CME on Paediatric Movement Disorder",
    images: [
      "/images/pmd/1.jpg",
      "/images/pmd/2.jpg",
      "/images/pmd/3.jpg",
      "/images/pmd/4.jpg",
      "/images/pmd/5.jpg",
      "/images/pmd/6.jpg",
      "/images/pmd/7.jpg",
      "/images/pmd/8.jpg",
      "/images/pmd/9.jpg",
      "/images/pmd/10.jpg"
    ]
  },
  cgm2025: {
    title: "Committee General Meeting 2025",
    date: "April 26, 2025",
    attendees: "25+ Members",
    description: "Committee General Meeting 2025",
    images: [
      "/images/cgm/1.jpg",
      "/images/cgm/2.jpg",
      "/images/cgm/3.jpg",
      "/images/cgm/4.jpg"
    ]
  },
  sma2025: {
    title: "SMA Workshop & Program",
    date: "August 23-24, 2025",
    attendees: "40+ Participants",
    description: "Workshop on Standardized Rehabilitation Approach for SMA",
    images: [
      "/images/sma/1.jpg",
      "/images/sma/2.jpg"
    ]
  },
  fyt2025: {
    title: "Featured Year Events 2025",
    date: "2025",
    attendees: "100+ Total Participants",
    description: "Featured events and highlights from 2025",
    images: [
      "/images/fyt/1.jpg",
      "/images/fyt/2.jpg",
      "/images/fyt/3.JPG",
      "/images/fyt/4.jpg",
      "/images/fyt/5.jpg",
      "/images/fyt/6.jpg"
    ]
  }
  ,
  workshop2025: {
    title: "SMA Workshop 2025",
    date: "2025",
    attendees: "Specialists",
    description: "Workshop Highlights",
    images: [
      "/images/workshop/1WORKS_1.JPG",
      "/images/workshop/2WORKS_1.JPG",
      "/images/workshop/3WORKS_1.JPG",
      "/images/workshop/4WORKS_1.JPG"
    ]
  }
};

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function GalleryCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const eventData = eventCategories[category as keyof typeof eventCategories];

  if (!eventData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-white">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/#gallery" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Link>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Camera className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {eventData.title}
                </h1>
                <p className="text-gray-600">{eventData.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                <span>{eventData.date}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-green-600" />
                <span>{eventData.attendees}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client Component for Interactive Features */}
        <GalleryCategoryClient eventData={eventData} />

        {/* Back to Home Button */}
        <div className="text-center mt-12">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            <Link href="/#gallery">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
