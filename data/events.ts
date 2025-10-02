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
    slug: "cme-malaysia-june-2025",
    type: "program",
    title: "CME \"Paediatric Movement Disorder\"",
    date: "21.06.2025",
    time: "9:00 AM",
    venue: "NINSH, Agargaon, Dhaka",
    attendees: "200+",
    summary:
      "The Continuing Medical Education (CME) on \"Paediatric Movement Disorder\" was held on 21 June 2025 at the Conference Room, National Institute of Neurosciences & Hospital (NINS), organized by the Department of Paediatric Neurology, NINS, and Bangladesh Child Neurology Society (BCNS). Scientific Presentation by Dr. Tajul Arifin, Consultant Paediatric Neurologist & Movement Disorder Specialist, Malaysia. Dr. Tajul Arifin delivered an in-depth lecture on evolving features of paediatric movement disorders, highlighting diagnostic and therapeutic challenges. The session included interactive panel discussions and Q&A, encouraging collaborative learning among participants. The program enhanced professional knowledge, fostered international collaboration, and emphasized advancing child neurology care in Bangladesh.",
  },
  {
    slug: "childhood-epilepsy-jashore-aug-2025",
    type: "program",
    title: "Scientific Seminar \"Childhood Epilepsy: A Practical Approach\"",
    date: "26.08.2025",
    time: "9:00 AM",
    venue: "Jashore Medical College (JMCH)",
    attendees: "200+",
    summary:
      "The Scientific Seminar titled \"Childhood Epilepsy: A Practical Approach\" was organized by the Department of Paediatrics, JMC, and Bangladesh Child Neurology Society (BCNS) on 26 August 2025 at JMCH. Chief Guest Prof. Dr. Md. Abid Hossain Mollah, along with distinguished special guests, stressed the importance of early diagnosis, multidisciplinary management, and public awareness of childhood epilepsy. Key speakers presented topics including EEG interpretation, introduction to epilepsy, seizure management in children, and practical treatment pathways. The panel of experts shared updates on current practices and highlighted challenges in clinical settings. The seminar, chaired by Dr. Ahmed Ferdous Jahangir, fostered interactive discussions and Q&A sessions, encouraging knowledge exchange among pediatricians and neurologists. The event successfully emphasized collaboration, continuous professional development, and improving patient outcomes for children living with epilepsy.",
  },
  {
    slug: "cme-japan-sept-2025",
    type: "program",
    title: "CME on \"Insight into the Recent Innovation and Challenges of Epilepsy & Developmental Disorders\"",
    date: "21 and 22 September 2025",
    time: "9:00 AM",
    venue: "Conference Hall, NINS, Dhaka-1207",
    attendees: "200+",
    summary:
      "The CME on \"Insight into the Recent Innovation and Challenges of Epilepsy & Developmental Disorders\" was held on 21–22 September 2025 at the Conference Room, NINS, organized by the Bangladesh Child Neurology Society (BCNS). 21 Sept 2025: Inaugural Ceremony (09:00 AM), Introduction of Speaker, Scientific Presentation on Genetic Epilepsy: When and How? by Prof. Dr. Mitsuhiro Kato (Japan), Live Case Management, Expert Panel Discussion. 22 Sept 2025: Introduction of Speaker, Scientific Presentation on Challenges of Neurodevelopmental & Behavioural Disorders by Dr. Masaya Tachibana (Japan), Live Case Management on Challenging Behaviors, Expert Panel Discussion. The two-day CME highlighted recent innovations in epilepsy and neurodevelopmental disorders. International experts Prof. Dr. Mitsuhiro Kato and Dr. Masaya Tachibana shared valuable insights, focusing on genetic epilepsy, behavioral challenges, and practical case management. The event fostered scientific learning, collaboration, and knowledge exchange among child neurologists, pediatricians, and allied professionals, strengthening clinical practice in Bangladesh.",
    registrationUrl: "https://shorturl.at/EhHm4",
  },
  {
    slug: "sma-workshop-aug-2025",
    type: "workshop",
    title: "Workshop on \"Standardized Rehabilitation Approach for Spinal Muscular Atrophy (SMA)\"",
    date: "23-24.08.2025",
    time: "9:00 AM",
    venue: "NINSH, Agargaon, Dhaka",
    attendees: "200+",
    summary:
      "The two-day workshop on \"Standardized Rehabilitation Approach for Spinal Muscular Atrophy (SMA)\" was held on 23–24 August 2025 at the National Institute of Neurosciences & Hospital (NINS), jointly organized by NINS, Bangladesh Child Neurology Society (BCNS), CureSMA Bangladesh, and Roche Bangladesh Ltd. Chief Guest Prof. Dr. Kazi Gias Uddin Ahmed and special guest Prof. Dr. Md. Badrul Alam Mondal highlighted the importance of advanced rehabilitation for SMA patients. Sessions included expert lectures, live demonstrations, and case-based discussions led by foreign physiotherapists Casandra Beh Huan Gaik, Thashendran Navindran, and Fezia Tyebally, along with local specialists. Key topics covered were motor function assessments, electrical stimulation, spider cage therapy, dynamic movement intervention, Halliwick concept, and aquatherapy. The workshop emphasized evidence-based rehabilitation techniques to improve functional outcomes and quality of life for SMA patients. Interactive participation, parent insights, and multidisciplinary collaboration made the event impactful, fostering future directions in SMA care.",
  },
  {
    slug: "emergency-meeting-26-04-2025",
    type: "meeting",
    title: "Emergency meeting 26.04.2025",
    date: "26.04.2025",
    venue: "Xinxian China Restaurant, Dhanmondi, Dhaka",
    attendees: "N/A",
    summary:
      "BCNS – Committee, General Meeting, 2025. On 26 April 2025, the Bangladesh Child Neurology Society (BCNS) held a general meeting to establish its first Executive Committee for 2025–2027. The meeting was presided over by Prof. Dr. Md. Mizanur Rahman, convener of BCNS, with active participation from members across the country.",
    decisions:
      "The meeting unanimously formed the new Executive Committee with Prof. Dr. Muhammad Mizanur Rahman as President and Dr. Mohammad Monir Hossain as General Secretary. Other key positions included Vice Presidents, Secretaries, Treasurer, and Advisors, representing senior and young neurologists nationwide. The session emphasized professional development, organizing scientific programs, and strengthening child neurology services in Bangladesh. The newly elected committee pledged to advance academic activities and seek support from UNICEF and international partners.",
  },
  {
    slug: "ec-1st-meeting-20-05-2025",
    type: "meeting",
    title: "EC 1st meeting 20.05.2025",
    date: "20.05.2025",
    time: "2:00 PM",
    venue: "Semi conference room, NINSH, Agargaon, Dhaka",
    attendees: "26",
    summary:
      "BCNS – 1st Executive Committee Meeting, 2025. Date & Time: 20 May 2025, 2:00 PM. Venue: Conference Room, National Institute of Neurosciences & Hospital. Chair: Prof. Dr. Muhammad Mizanur Rahman (President, BCNS). Attendees: Executive Committee Members. The first Executive Committee meeting of the Bangladesh Child Neurology Society (BCNS) was held on 20 May 2025, chaired by Prof. Dr. Muhammad Mizanur Rahman. The committee confirmed previous decisions, extending the President's tenure to two years and approving new membership regulations. Financial matters were resolved with three authorized bank signatories.",
    decisions:
      "Major organizational actions include a membership campaign, a new website, and social media engagement. Collaboration with the Japan Society was endorsed for CME, fellowship, and academic exchange. It was agreed that national conferences would occur biennially, with CME programs every 2–3 months.",
  },
  {
    slug: "ec-2nd-meeting-07-08-2025",
    type: "meeting",
    title: "EC 2nd meeting 07.08.2025 Zoom",
    date: "07.08.2025",
    venue: "Zoom (Online Platform)",
    attendees: "N/A",
    summary:
      "BCNS – 2nd Executive Committee Meeting 2025. Date: 07 August 2025. Venue: Online (Zoom Platform). Chair: Prof. Dr. Muhammad Mizanur Rahman (President, BCNS). Attendees: Executive Committee Members. The 2nd Executive Committee meeting of the Bangladesh Child Neurology Society (BCNS) was held online on 7 August 2025, chaired by Prof. Dr. Muhammad Mizanur Rahman. Key resolutions included finalizing the Bangladesh Country Delegate to AOCN and reviewing society finances. The committee approved the introduction of a standardized rehabilitation approach for Spinal Muscular Atrophy in collaboration with pediatric neurologists.",
    decisions:
      "Plans for joint academic programs with the Japanese Child Neurology Society were confirmed, including CME sessions on epilepsy genetics, ASD, ADHD, and tics in September 2025.",
  },
  {
    slug: "ec-3rd-meeting-20-08-2025",
    type: "meeting",
    title: "3rd EC meeting 20.08.2025",
    date: "20.08.2025",
    venue: "Xinxian China Restaurant, Dhanmondi, Dhaka",
    attendees: "N/A",
    summary:
      "BCNS – 3rd Executive Committee meeting 2025. Date: 20 September 2025. Venue: Xinxian China Restaurant, Dhanmondi, Dhaka. Chair: Prof. Dr. Muhammad Mizanur Rahman (President, BCNS). Attendees: Executive Committee Members. The 3rd Executive Committee meeting (2025–2027) was held under the leadership of President Prof. Dr. Muhammad Mizanur Rahman. The agenda included reviewing organizational activities, discussing upcoming scientific and academic programs, financial updates, and future plans. Reports were presented by the General Secretary and Treasurer, followed by discussions from committee members.",
    decisions:
      "Key points included enhancing scientific engagement, strengthening publicity, and publication initiatives. Decisions were taken to improve coordination among members, finalize event schedules, and promote collaborative projects. The committee reviewed progress, approved financial reports, and outlined strategies for academic, scientific, and publicity activities to strengthen organizational impact.",
  },
];

export function getEventBySlug(slug: string): EventItem | undefined {
  return eventsData.find((e) => e.slug === slug);
}


