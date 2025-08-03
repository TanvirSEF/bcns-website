import { Hero } from "@/components/hero";
import { EventsAnnouncements } from "@/components/events-announcements";
import { CoreActivities } from "@/components/core-activities";
import { MembershipBenefits } from "@/components/membership-benefits";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <EventsAnnouncements />
      <CoreActivities />
      <MembershipBenefits />
    </div>
  );
}
