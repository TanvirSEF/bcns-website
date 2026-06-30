import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { generalMembers, type GeneralMember } from "../../../../data/general-members";
import Image from "next/image";

const MemberCard = ({ member }: { member: GeneralMember }) => (
  <div className="bg-white rounded-lg shadow-md p-5 sm:p-7 hover:shadow-lg transition-shadow duration-300 w-full cursor-pointer">
    <div className="flex flex-col items-center mb-4">
      <div className="mb-3 w-full flex justify-center">
        {member.image ? (
          <div className="relative w-32 h-40 sm:w-36 sm:h-44 md:w-40 md:h-48 overflow-hidden rounded-lg border border-gray-300">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 128px, (max-width: 768px) 144px, 160px"
              priority
            />
          </div>
        ) : (
          <div className="w-32 h-40 sm:w-36 sm:h-44 md:w-40 md:h-48 bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg rounded-lg border border-gray-300">
            {member.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}
          </div>
        )}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center leading-snug mb-2">
        {member.name}
      </h3>
    </div>

    <div className="space-y-3">
      {member.designation && (
        <div>
          <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Designation:</p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{member.designation}</p>
        </div>
      )}

      {member.institute && (
        <div>
          <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Institute:</p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{member.institute}</p>
        </div>
      )}
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