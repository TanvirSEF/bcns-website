export type EventType = "meeting" | "program" | "workshop";

export interface EventItem {
  slug: string;
  type: EventType;
  title: string;
  date: string;
  time?: string;
  venue: string;
  attendees?: string;
  summary: string;
  decisions?: string;
  registrationUrl?: string;
}

export const eventsData: EventItem[] = [
  {
    slug: "cme-innovation-sept-2025",
    type: "program",
    title:
      "CME: Insight into the Recent Innovation and Challenges of Epilepsy & Developmental Disorders",
    date: "21–22 September 2025",
    time: "9:00 AM",
    venue: "Conference Hall, NINS, Dhaka-1207",
    attendees: "International speakers and BCNS members",
    summary:
      "The CME highlighted recent innovations in epilepsy and neurodevelopmental disorders with international experts Prof. Dr. Mitsuhiro Kato and Dr. Masaya Tachibana. The program focused on genetic epilepsy, behavioral challenges, and practical case management, fostering collaboration and knowledge exchange.",
    decisions:
      "Day 1: Scientific presentation on Genetic Epilepsy: When and How?; live case management; expert panel discussion. Day 2: Scientific presentation on Challenges of Neurodevelopmental & Behavioural Disorders; live case management on challenging behaviors; expert panel discussion.",
    registrationUrl: "https://shorturl.at/EhHm4",
  },
  {
    slug: "sma-workshop-2025",
    type: "workshop",
    title: "SMA Workshop 2025",
    date: "2025",
    time: "N/A",
    venue: "N/A",
    attendees: "N/A",
    summary:
      "Standardized Rehabilitation Approach for Spinal Muscular Atrophy (SMA). Details will be updated soon.",
  },
  {
    slug: "childhood-epilepsy-workshop-2025",
    type: "workshop",
    title: "Childhood epilepsy Workshop",
    date: "2025",
    time: "N/A",
    venue: "N/A",
    attendees: "N/A",
    summary:
      "Workshop focusing on practical approaches to childhood epilepsy. Details will be updated soon.",
  },
  {
    slug: "emergency-meeting-26-04-2025",
    type: "meeting",
    title: "Emergency meeting 26.04.2025",
    date: "26.04.2025",
    venue: "Xinxian China Restaurant, Dhanmondi, Dhaka",
    summary:
      "This was the BCNS Committee, General Meeting, 2025, held to establish the first Executive Committee for 2025–2027, presided over by Prof. Dr. Md. Mizanur Rahman.",
    decisions:
      "The new Executive Committee was formed with key roles including President and General Secretary. Priorities included professional development, scientific programs, strengthening services, and engagement with UNICEF and international partners.",
  },
  {
    slug: "ec-1st-meeting-20-05-2025",
    type: "meeting",
    title: "EC 1st meeting 20.05.2025",
    date: "20.05.2025",
    time: "2:00 PM",
    venue: "Semi conference room, NINSH, Agargaon, Dhaka",
    attendees: "26 participants",
    summary:
      "The 1st Executive Committee Meeting 2025 reviewed prior decisions, extended the President's tenure to two years, and approved membership regulations. Bank signatories were finalized.",
    decisions:
      "Key actions: membership campaign, new website, social media engagement, collaboration with Japan Society for CME and academic exchange. National conferences biennially; CME every 2–3 months.",
  },
  {
    slug: "ec-2nd-meeting-07-08-2025",
    type: "meeting",
    title: "EC 2nd meeting 07.08.2025 Zoom",
    date: "07.08.2025",
    venue: "Zoom (Online Platform)",
    summary:
      "The 2nd EC meeting finalized the Bangladesh Country Delegate to AOCN, reviewed finances, and approved a standardized rehabilitation approach for SMA with pediatric neurologists.",
    decisions:
      "Confirmed joint academic programs with the Japanese Child Neurology Society including CME sessions on epilepsy genetics, ASD, ADHD, and tics in September 2025.",
  },
  {
    slug: "ec-3rd-meeting-20-08-2025",
    type: "meeting",
    title: "3rd EC meeting 20.08.2025",
    date: "20.08.2025",
    venue: "Xinxian China Restaurant, Dhanmondi, Dhaka",
    summary:
      "The 3rd EC meeting reviewed activities, scientific programs, finances, and future plans under the leadership of Prof. Dr. Muhammad Mizanur Rahman.",
    decisions:
      "Outlined strategies to enhance scientific engagement, publicity, publications, coordination, and finalized schedules for upcoming events and collaborative projects.",
  },
];

export function getEventBySlug(slug: string): EventItem | undefined {
  return eventsData.find((e) => e.slug === slug);
}


