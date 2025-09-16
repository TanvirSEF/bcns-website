import dynamic from "next/dynamic";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LogoBanner } from "@/components/logo-banner";
import { AboutIntro } from "@/components/about-intro";
import { EventsTimeline } from "@/components/events-timeline";
import { UpcomingEvents } from "@/components/upcoming-events";

// Lazy load below-the-fold components for better performance
const CoreActivities = dynamic(
  () =>
    import("@/components/core-activities").then((mod) => ({
      default: mod.CoreActivities,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
    ),
  }
);

const MembershipBenefits = dynamic(
  () =>
    import("@/components/membership-benefits").then((mod) => ({
      default: mod.MembershipBenefits,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
    ),
  }
);

const LatestPublications = dynamic(
  () =>
    import("@/components/latest-publications").then((mod) => ({
      default: mod.LatestPublications,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
    ),
  }
);

const PhotoGalleryPreview = dynamic(
  () =>
    import("@/components/photo-gallery-preview").then((mod) => ({
      default: mod.PhotoGalleryPreview,
    })),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
    ),
  }
);

// Static generation for better performance
export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  return (
    <div className="min-h-screen">
      <LogoBanner />
      <Navbar />
      <UpcomingEvents />
      <Hero />
      <AboutIntro />
      <EventsTimeline />
      {/* <EventsAnnouncements /> */}
      <CoreActivities />
      <MembershipBenefits />
      <LatestPublications />
      <PhotoGalleryPreview />
      <Footer />
    </div>
  );
}
