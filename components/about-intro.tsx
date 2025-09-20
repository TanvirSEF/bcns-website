"use client";

import Image from "next/image";
import { useState } from "react";
import { LeadershipProfile } from "./leadership-profile";

export function AboutIntro() {
  const [selectedLeader, setSelectedLeader] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const leadershipData = {
    mizanur: {
      id: "mizanur",
      name: "Prof. Dr. Muhammad Mizanur Rahman",
      position: "President",
      designation: "Ex-chairman",
      institute: "Former chairman, Paediatric Neurology, Bangladesh Medical University (BMU)",
      mobile: "01714035439",
      email: "mizanur_rahman_1955@yahoo.com",
      image: "/images/president.jpg",
      message: `At the Bangladesh Child Neurology Society (BCNS), we envision a nation where every child—regardless of who they are or where they live—has access to timely, quality neurological care and the opportunity to lead a healthy, fulfilling life.

Neurological and developmental disorders among children are often overlooked in our healthcare system, yet they have a profound and lasting impact on individuals, families, and communities. As a national organization, BCNS is committed to addressing this gap through advocacy, education, research, and service delivery.

We believe that child brain health must be a national priority—integrated into our public health agenda and aligned with the Sustainable Development Goals. Achieving this vision requires a BCNS that is inclusive, professionally governed, and fully focused on transparency, efficiency, and results.

We strive to build strong partnerships with clinicians, policymakers, educators, and families to raise awareness, build capacity, and implement innovative solutions for early diagnosis, intervention, and rehabilitation.

Our goal is simple but powerful: no child should suffer from a preventable or treatable neurological condition due to lack of awareness, access, or support.

Together, let us build a future where every child's brain has the opportunity to thrive. Brain health is not a privilege—it is a right.`
    },
    monir: {
      id: "monir",
      name: "Dr. Mohammad Monir Hossain",
      position: "General Secretary",
      designation: "Assistant Professor",
      institute: "Assistant Professor, Paediatric Neurology, National Institute of Neurosciences & Hospital (NINS&H)",
      mobile: "01711261736",
      email: "monir91@gmail.com",
      image: "/images/monir.jpg",
      message: `Welcome to the official website of the Bangladesh Child Neurology Society (BCNS).

It is an honour to serve as the General Secretary of BCNS, an organization devoted to the advancement of child neurology in Bangladesh. Our mission is to enhance neurological care for children by promoting clinical excellence, encouraging research, and fostering collaboration among healthcare professionals.

This website serves as a central platform for sharing knowledge, updates, and initiatives in the field of pediatric neurology. Whether you are a clinician, researcher, parent, or advocate, we hope you find this site informative and inspiring.

BCNS is committed to raising awareness about neurological disorders affecting children, supporting early diagnosis and appropriate intervention, and addressing the unique challenges faced by families. We are also dedicated to capacity building through academic programs, workshops, and national conferences designed to strengthen expertise and foster innovation in this field.

We are proud to work in close coordination with national and international partners to ensure that child brain health is prioritized as a public health issue.

I invite you to engage with us, participate in our initiatives, and contribute to the journey of transforming pediatric neurological care across the nation.

Together, let us strive to ensure a brighter, healthier future for every child.`
    }
  };

  

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    setSelectedLeader(null);
  };
  return (
    <section className="w-full bg-white py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start lg:items-start">
          {/* Left Side - Text Content */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-1">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                About <span className="text-blue-600">BCNS</span>
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-blue-600 rounded-full"></div>
            </div>
            
            <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-gray-700 leading-relaxed space-y-3 sm:space-y-4">
              <p>
                <strong>Bangladesh Child Neurology Society (BCNS)</strong> is an association of child neurologists working at different health sectors of Bangladesh. Being one of the most densely populated countries in the world, Bangladesh is also known for its scenic beauty, rich cultural heritage and a glorious history of bravery, war & revolution.
              </p>
              
              <p>
                With a population of about <strong>170 million people</strong>, approximately <strong>31.4%</strong> of the residents are aged under 18 years. Among different child health issues, neurodevelopmental disorders comprise a major portion necessitating an escalation of services in this field to meet the upcoming MDG challenges.
              </p>
              
              <p>
                Until recently, Bangladesh wasn&apos;t offering any post graduate degree in Child Neurology. A group of highly dedicated Pediatricians started serving in this field and created the platform for the future generation to carry on the torch as Child Neurologists in Bangladesh.
              </p>
              
              <p>
                Since <strong>2016 till date about 60 efficient doctors</strong> passed FCPS & MD degrees in Pediatric Neurology & Development and are continuing to serve at different parts of Bangladesh. Considering the huge burden of neurodevelopmental disorders in Bangladesh, the existing and promising new professionals need a strong association for future guidance and improvisation.
              </p>
              
              <p>
                With this view, child neurologists in Bangladesh, led by one of the pioneers <strong>Prof. Dr. Md. Mizanur Rahman</strong> dreamt up BCNS which started its journey in <strong>2022</strong>. On <strong>April 26, 2025</strong>, the 1st executive committee was formed for next 2 years. BCNS, with about <strong>70 members</strong> till date, most of whom being highly enthusiastic young professionals, has started working relentlessly to meet the country&apos;s need.
              </p>
            </div>
          </div>

          {/* Right Side - Leadership Cards with Messages (no click needed) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl mx-auto lg:mx-0 order-2 lg:order-2">
             {/* President Card */}
             <div
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 h-full"
              >
               {/* Header */}
               <div className="bg-gray-700 px-3 sm:px-4 py-2 sm:py-3">
                 <h3 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide text-center">President</h3>
               </div>

              {/* Image and Name */}
               <div className="p-3 sm:p-4 text-center">
                 <div className="relative w-24 h-32 sm:w-28 sm:h-36 mx-auto mb-2 sm:mb-3">
                   <Image
                     src="/images/president.jpg"
                     alt="President - Prof. Dr. Md. Mizanur Rahman"
                     width={112}
                     height={144}
                     className="w-24 h-32 sm:w-28 sm:h-36 object-cover border border-gray-300"
                   />
                 </div>
                 <p className="text-gray-800 font-semibold text-xs sm:text-sm leading-tight">
                   Prof. Dr. Md. Mizanur Rahman
                 </p>
              </div>

              {/* Message Content */}
              <div className="px-3 sm:px-4 pb-4 border-t border-gray-100">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">President&apos;s Message</h4>
                <div className="text-left max-h-64 sm:max-h-80 overflow-y-auto pr-1 sm:pr-2">
                  <div className="prose prose-[0.9rem] sm:prose-sm max-w-none text-gray-700 leading-relaxed">
                    {leadershipData.mizanur.message.split('\n\n').map((para: string, idx: number) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                </div>
               </div>
            </div>

             {/* General Secretary Card */}
             <div
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 h-full"
            >
               {/* Header */}
               <div className="bg-gray-700 px-3 sm:px-4 py-2 sm:py-3">
                 <h3 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide text-center">General Secretary</h3>
               </div>

              {/* Image and Name */}
               <div className="p-3 sm:p-4 text-center">
                 <div className="relative w-24 h-32 sm:w-28 sm:h-36 mx-auto mb-2 sm:mb-3">
                   <Image
                     src="/images/monir.jpg"
                     alt="General Secretary - Dr. Mohammad Monir Hossain"
                     width={112}
                     height={144}
                     className="w-24 h-32 sm:w-28 sm:h-36 object-cover border border-gray-300"
                   />
                 </div>
                 <p className="text-gray-800 font-semibold text-xs sm:text-sm leading-tight">
                   Dr. Mohammad Monir Hossain
                 </p>
              </div>

              {/* Message Content */}
              <div className="px-3 sm:px-4 pb-4 border-t border-gray-100">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">General Secretary&apos;s Message</h4>
                <div className="text-left max-h-64 sm:max-h-80 overflow-y-auto pr-1 sm:pr-2">
                  <div className="prose prose-[0.9rem] sm:prose-sm max-w-none text-gray-700 leading-relaxed">
                    {leadershipData.monir.message.split('\n\n').map((para: string, idx: number) => (
                      <p key={idx}>{para}</p>
                    ))}
              </div>
               </div>
             </div>
             </div>
            </div>
        </div>
      </div>

      {/* Leadership Profile Modal */}
      <LeadershipProfile
        isOpen={isProfileOpen}
        onClose={handleCloseProfile}
        leader={selectedLeader}
      />
    </section>
  );
}
