import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import conveningData from '@/data/convening-committee.json';

const ConveningCommittee = () => {
  // Get data from JSON file
  const conveningMembers = conveningData.convener;
  const memberSecretary = conveningData.memberSecretary;
  const members = conveningData.members;


  const MemberCard = ({ member }: { member: any }) => (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300 w-full">
      <div className="flex flex-col items-center mb-4">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            width={120}
            height={120}
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain mb-3"
          />
        ) : (
          <div className="mb-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg border-2 border-gray-200">
              {member.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
            </div>
          </div>
        )}
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 text-center leading-tight">{member.name}</h3>
        {member.role && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium mb-2 mt-1">
            {member.role}
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-700">Designation:</p>
          <p className="text-sm text-gray-600">{member.designation}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-700">Institute:</p>
          <p className="text-sm text-gray-600">{member.institute}</p>
        </div>
        
        <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-blue-600" />
            <a href={`tel:${member.mobile}`} className="text-sm text-blue-600 hover:underline">
              {member.mobile}
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-blue-600" />
            <a href={`mailto:${member.email}`} className="text-sm text-blue-600 hover:underline break-all">
              {member.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Convening Committee</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Bangladesh Child Neurology Society (BCNS) - 2022-2025
          </p>
        </div>

        {/* Convener Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Convener</h2>
          {conveningMembers.length === 1 ? (
            <div className="flex justify-center">
              <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                <MemberCard member={conveningMembers[0]} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {conveningMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>

        {/* Member Secretary Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Member Secretary</h2>
          {memberSecretary.length === 1 ? (
            <div className="flex justify-center">
              <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                <MemberCard member={memberSecretary[0]} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {memberSecretary.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>

        {/* Committee Members Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Committee Members</h2>
          {members.length === 1 ? (
            <div className="flex justify-center">
              <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                <MemberCard member={members[0]} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ConveningCommittee;
