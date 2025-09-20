import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Mail, Phone } from "lucide-react";
import { generalMembers, type GeneralMember } from "../../../../data/general-members";
import Image from "next/image";

const MemberCard = ({ member }: { member: GeneralMember }) => (
  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300 w-full">
    <div className="flex flex-col items-center mb-4">
      <div className="mb-3">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            width={160}
            height={200}
            className="w-24 h-28 sm:w-28 sm:h-32 md:w-32 md:h-40 object-contain bg-white"
            priority
          />
        ) : (
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg">
            {member.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}
          </div>
        )}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 text-center leading-tight">
        {member.name}
      </h3>
    </div>

    <div className="space-y-3">
      {member.designation && (
        <div>
          <p className="text-sm font-medium text-gray-700">Designation:</p>
          <p className="text-sm text-gray-600">{member.designation}</p>
        </div>
      )}

      {member.institute && (
        <div>
          <p className="text-sm font-medium text-gray-700">Institute:</p>
          <p className="text-sm text-gray-600">{member.institute}</p>
        </div>
      )}

      <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
        {member.mobile && (
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-blue-600" />
            <a href={`tel:${member.mobile}`} className="text-sm text-blue-600 hover:underline">
              {member.mobile}
            </a>
          </div>
        )}
        {member.email && (
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-blue-600" />
            <a href={`mailto:${member.email}`} className="text-sm text-blue-600 hover:underline break-all">
              {member.email}
            </a>
          </div>
        )}
      </div>
    </div>
  </div>
);

const Members = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">BCNS General Members</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Distinguished professionals contributing to pediatric neurology across Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {generalMembers.map((m: GeneralMember) => (
            <MemberCard key={`${m.name}-${m.mobile ?? m.email ?? Math.random()}`} member={m} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Members;