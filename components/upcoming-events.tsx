"use client";

import { Calendar } from "lucide-react";

export function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: "MOU Discussion - Scholarship Program",
      date: "September 2025",
      type: "Meeting",
      description: "We would like to inquire about your preparations regarding the Memorandum of Understanding (MOU) for the continue scholarship program and to ask if you have any suggestions or recommendations related to it.",
      status: "Upcoming",
      priority: "High"
    },
    {
      id: 2,
      title: "JICA Visit - Bangladesh Delegation",
      date: "22 September 2025",
      type: "Official Visit",
      description: "Regarding your upcoming visit to JICA on 22 September 2025, we would also like to confirm whether any representations from the Bangladesh Child Neurology Society (BCNS) should accompany you. If so, please advise how many delegates would be appropriate.",
      status: "Confirmed",
      priority: "High"
    },
    {
      id: 3,
      title: "Dietary Arrangements - International Delegates",
      date: "September 2025",
      type: "Logistics",
      description: "Additionally, we would highly appreciate it if you could share any dietary preferences or restrictions so that we may make the necessary arrangements for your meals during your stay in Bangladesh.",
      status: "Planning",
      priority: "Medium"
    }
  ];


  return (
    <section className="w-full bg-blue-600 text-white py-2 sm:py-3 relative overflow-hidden">
      {/* Upcoming Events Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 opacity-20"></div>
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {/* Desktop Label - Hidden on Mobile */}
          <div className="hidden sm:flex items-center space-x-2 bg-white text-blue-600 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide flex-shrink-0">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <span>UPCOMING EVENTS</span>
          </div>

          {/* Scrolling News - Full Width on Mobile */}
          <div className="w-full sm:flex-1 overflow-hidden">
            <div className="flex space-x-4 sm:space-x-6 animate-scroll">
              {/* Duplicate events for seamless loop */}
              {[...events, ...events].map((event, index) => (
                <div key={`${event.id}-${index}`} className="flex items-center space-x-2 sm:space-x-3 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <span className="font-semibold text-xs">{event.date}</span>
                  </div>
                  <div className="w-px h-3 bg-white/50 hidden sm:block"></div>
                  <span className="font-medium text-xs sm:text-sm truncate max-w-[200px] sm:max-w-none">{event.title}</span>
                  <div className="w-px h-3 bg-white/50 hidden md:block"></div>
                  <span className="text-xs opacity-90 hidden md:inline truncate max-w-[300px] lg:max-w-none">{event.description.substring(0, 60)}...</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for scrolling animation */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 12s linear infinite;
        }
      `}</style>
    </section>
  );
}
