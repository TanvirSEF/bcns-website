import { Hero } from "@/components/hero";
import { EventsAnnouncements } from "@/components/events-announcements";
import { CoreActivities } from "@/components/core-activities";
import { MembershipBenefits } from "@/components/membership-benefits";
import { LatestPublications } from "@/components/latest-publications";
import { PhotoGalleryPreview } from "@/components/photo-gallery-preview";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <EventsAnnouncements />
      <CoreActivities />
      <MembershipBenefits />
      <LatestPublications />
      <PhotoGalleryPreview />
    </div>
  );
}
