"use client";

import { Calendar, MapPin } from "lucide-react";
import { useState } from "react";

export function EventsTimeline() {
  const events = [
    {
      id: 0,
      date: "21.09.2025",
      title: "CME: Insight into the Recent Innovation and Challenges of Epilepsy & Developmental Disorders",
      attendees: "International speakers and BCNS members",
      venue: "Conference Hall, NINS, Dhaka-1207",
      summary:
        "The CME on “Insight into the Recent Innovation and Challenges of Epilepsy & Developmental Disorders” was held on 21–22 September 2025 at the Conference Room, NINS, organized by the Bangladesh Child Neurology Society (BCNS). The two-day CME highlighted recent innovations in epilepsy and neurodevelopmental disorders. International experts Prof. Dr. Mitsuhiro Kato and Dr. Masaya Tachibana shared valuable insights, focusing on genetic epilepsy, behavioral challenges, and practical case management. The event fostered scientific learning, collaboration, and knowledge exchange among child neurologists, pediatricians, and allied professionals, strengthening clinical practice in Bangladesh.",
      decisions:
        "21 Sept 2025: Scientific Presentation on Genetic Epilepsy: When and How? by Prof. Dr. Mitsuhiro Kato (Japan); Live Case Management; Expert Panel Discussion. 22 Sept 2025: Scientific Presentation on Challenges of Neurodevelopmental & Behavioural Disorders by Dr. Masaya Tachibana (Japan); Live Case Management on Challenging Behaviors; Expert Panel Discussion. Time: 9:00 AM on both days.",
      registrationUrl: "https://shorturl.at/EhHm4",
      type: "program",
      time: "21–22 Sep 2025, 9:00 AM",
    },
    {
      id: 1,
      date: "26.04.2025",
      title: "Emergency meeting 26.04.2025",
      attendees: "N/A",
      venue: "Xinxian China Restaurant, Dhanmondi,Dhaka",
      summary: "This was the BCNS Committee, General Meeting, 2025. It was held to establish the first Executive Committee for 2025-2027, presided over by Prof. Dr. Md. Mizanur Rahman.",
      decisions: "The new Executive Committee was formed with Prof. Dr. Muhammad Mizanur Rahman as President and Dr. Mohammad Monir Hossain as General Secretary. Other roles included Vice Presidents, Secretaries, Treasurer, and Advisors. The meeting focused on professional development, scientific programs, and strengthening child neurology services, with a pledge to seek support from UNICEF and international partners.",
      type: "meeting"
    },
    {
      id: 2,
      date: "20.05.2025",
      title: "EC 1st meeting 20.05.2025",
      attendees: "26 participants",
      venue: "Semi conference room, NINSH, Agargaon, Dhaka",
      summary: "This was the BCNS 1st Executive Committee Meeting, 2025, held on May 20, 2025, at 2:00 PM. It was chaired by Prof. Dr. Muhammad Mizanur Rahman (President, BCNS), with Executive Committee Members attending.",
      decisions: "Previous decisions were confirmed, extending the President's tenure to two years and approving new membership regulations. Financial matters were resolved with three authorized bank signatories. Major organizational actions included a membership campaign, a new website, social media engagement, and collaboration with the Japan Society for CME, fellowship, and academic exchange. National conferences were planned biennially, with CME programs every 2-3 months.",
      type: "meeting",
      time: "2:00 PM"
    },
    {
      id: 3,
      date: "07.08.2025",
      title: "EC 2nd meeting 07.08.2025 Zoom",
      attendees: "N/A",
      venue: "Zoom (Online Platform)",
      summary: "This was the BCNS 2nd Executive Committee Meeting 2025, held online on August 7, 2025, chaired by Prof. Dr. Muhammad Mizanur Rahman (President, BCNS), with Executive Committee Members attending.",
      decisions: "Key resolutions included finalizing the Bangladesh Country Delegate to AOCN and reviewing society finances. The committee approved a standardized rehabilitation approach for Spinal Muscular Atrophy in collaboration with pediatric neurologists. Plans for joint academic programs with the Japanese Child Neurology Society were confirmed, including CME sessions on epilepsy genetics, ASD, ADHD, and tics in September 2025.",
      type: "meeting"
    },
    {
      id: 4,
      date: "20.08.2025",
      title: "3rd EC meeting 20.08.2025",
      attendees: "N/A",
      venue: "Xinxian China Restaurant, Dhanmondi, Dhaka",
      summary: "This was the BCNS 3rd Executive Committee meeting 2025, held on September 20, 2025, at Xinxian China Restaurant, Dhanmondi, Dhaka. It was chaired by Prof. Dr. Muhammad Mizanur Rahman (President, BCNS), with Executive Committee Members attending.",
      decisions: "The meeting reviewed organizational activities, discussed upcoming scientific and academic programs, financial updates, and future plans. Reports were presented by the General Secretary and Treasurer. Key points included enhancing scientific engagement, strengthening publicity, and publication initiatives. Decisions were made to improve coordination, finalize event schedules, promote collaborative projects, and outline strategies for academic, scientific, and publicity activities to strengthen organizational impact.",
      type: "meeting"
    }
  ];
  const [activeTab, setActiveTab] = useState<"meeting" | "program" | "workshop">("program");

  const filtered = events.filter((e) => e.type === activeTab);

  return (
    <section className="w-full bg-gray-50 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Stay Updated with <span className="text-blue-600">BCNS</span>
          </h2>
          <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto"></div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
          {([
            { key: "program", label: "Program" },
            { key: "workshop", label: "Workshop" },
            { key: "meeting", label: "Meeting" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
              aria-pressed={activeTab === tab.key}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Event Cards - simplified fields */}
        <div className="space-y-6">
          {filtered.length === 0 && (
            <div className="text-center text-gray-600">No items under {activeTab} right now.</div>
          )}
          {filtered.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{("time" in event && (event as any).time) ? (event as any).time : event.date}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span className="text-sm">{event.venue}</span>
                    </div>
                  </div>
                  {"registrationUrl" in event && (event as any).registrationUrl && (
                    <a
                      href={(event as any).registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                      Register Now
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
