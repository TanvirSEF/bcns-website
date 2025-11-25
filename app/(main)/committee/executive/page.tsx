import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import committeeData from '@/data/committee-members.json';

interface CommitteeMember {
  id: number;
  name: string;
  designation: string;
  institute: string;
  mobile: string;
  email: string;
  image: string;
  role: string;
  priority: number;
}

const Executive = () => {
  const committeeMembers: CommitteeMember[] = committeeData.committeeMembers;

  // Group members by role
  const groupedMembers = committeeMembers.reduce((acc, member) => {
    if (!acc[member.role]) {
      acc[member.role] = [];
    }
    acc[member.role]!.push(member);
    return acc;
  }, {} as Record<string, CommitteeMember[]>);

  // Sort roles by priority
  const roleOrder = [
    'President',
    'Vice President',
    'General Secretary',
    'Joint Secretary',
    'Treasurer',
    'Organizing Secretary',
    'Office Secretary',
    'Science Secretary',
    'Publicity and Public Relations Secretary',
    'Publications and Cultural Secretary',
    'Member',
    'Advisor'
  ];


  const MemberCard = ({ member }: { member: CommitteeMember }) => (
    <div className="bg-white rounded-lg shadow-md p-5 sm:p-7 hover:shadow-lg transition-shadow duration-300 w-full">
      <div className="flex flex-col items-center mb-4">
        {member.image ? (
          <div className="mb-3 w-full flex justify-center">
            <div className="relative w-32 h-40 sm:w-36 sm:h-44 md:w-40 md:h-48 overflow-hidden rounded-lg border border-gray-300">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 128px, (max-width: 768px) 144px, 160px"
              />
            </div>
          </div>
        ) : (
          <div className="mb-3 w-full flex justify-center">
            <div className="w-32 h-40 sm:w-36 sm:h-44 md:w-40 md:h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg rounded-lg border border-gray-300">
              {member.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
            </div>
          </div>
        )}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center leading-snug mb-2">{member.name}</h3>
        {member.role && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs sm:text-sm px-3 py-1 rounded-full font-medium mb-2 mt-1">
            {member.role}
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Designation:</p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{member.designation}</p>
        </div>
        
        <div>
          <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Institute:</p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{member.institute}</p>
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Executive Committee</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Bangladesh Child Neurology Society (BCNS) - 2025-2027
          </p>
        </div>

        {/* Committee Members by Role */}
        <div className="space-y-12">
          {roleOrder.map((role) => {
            const members = groupedMembers[role];
            if (!members || members.length === 0) return null;
            const isSingle = members.length === 1;
            const singleMember: CommitteeMember | null = isSingle ? (members[0] ?? null) : null;

            return (
              <div key={role} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">{role}</h2>
                
                {/* Grid layout for all members with consistent width */}
                {isSingle && singleMember ? (
                  <div className="flex justify-center">
                    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                      <MemberCard member={singleMember} />
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
            );
          })}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Executive;