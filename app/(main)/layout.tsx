import { UpcomingEvents } from "@/components/upcoming-events";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <UpcomingEvents />
      {children}
    </div>
  );
}
