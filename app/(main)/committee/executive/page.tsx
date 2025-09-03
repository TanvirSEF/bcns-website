import React from 'react';
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Crown,
  Mail,
  Phone,
  Building,
  Star,
  ChevronRight
} from 'lucide-react';

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

const committeeMembers: CommitteeMember[] = [
  // President
  {
    id: 1,
    name: "Prof. Dr. Muhammad Mizanur Rahman",
    designation: "Ex-chairman",
    institute: "BSMMU",
    mobile: "01714035439",
    email: "mizanur_rahman_1955@yahoo.com",
    image: "/images/president.jpg",
    role: "President",
    priority: 1
  },

  // Vice Presidents
  {
    id: 2,
    name: "Prof. Dr. Syeda Tabassum Alam",
    designation: "Prof. & Director",
    institute: "IPNA, BSMMU",
    mobile: "01712033536",
    email: "dr.tabassum.0171@gmail.com",
    image: "/images/Vice President1.jpg",
    role: "Vice President",
    priority: 2
  },
  {
    id: 3,
    name: "Dr Yeamin Shahariar Chowdhury",
    designation: "Associate Professor",
    institute: "NINS",
    mobile: "01711438602",
    email: "yamindr@yahoo.com",
    image: "/images/Vice President2.jpg",
    role: "Vice President",
    priority: 2
  },
  {
    id: 4,
    name: "Dr. Kazi Ashraful Islam",
    designation: "Assistant Professor",
    institute: "IPNA, BSMMU",
    mobile: "01912178024",
    email: "ashrafrmc@gmail.com",
    image: "/images/Vice President3.jpg",
    role: "Vice President",
    priority: 2
  },
  {
    id: 5,
    name: "Dr. ARM Shakhawat Hossain",
    designation: "Junior Consultant",
    institute: "Infectious Disease Hospital",
    mobile: "01745267516",
    email: "armsakhawathk@gmail.com",
    image: "/images/Members1.jpg",
    role: "Vice President",
    priority: 2
  },

  // General Secretary
  {
    id: 6,
    name: "Dr. Mohammad Monir Hossain",
    designation: "Assistant Professor",
    institute: "NINS&H",
    mobile: "01711261736",
    email: "monir91@gmail.com",
    image: "/images/generalsecretary.jpg",
    role: "General Secretary",
    priority: 3
  },

  // Joint Secretaries
  {
    id: 7,
    name: "Dr. Masuma Akhter",
    designation: "Senior Consultant",
    institute: "OSD, DGHS",
    mobile: "01728818549",
    email: "masumasbmc27@gmail.com",
    image: "/images/joinsecratary.jpg",
    role: "Joint Secretary",
    priority: 4
  },
  {
    id: 8,
    name: "Dr. Sheikh Masiur Rahman",
    designation: "Junior Consultant",
    institute: "Khulna Medical College",
    mobile: "01713463996",
    email: "masiur40cmc@gmail.com",
    image: "/images/joinsecratary2.jpg",
    role: "Joint Secretary",
    priority: 4
  },

  // Treasurer
  {
    id: 9,
    name: "Dr. A. B. M. Mukib",
    designation: "Junior Consultant",
    institute: "NINS&H",
    mobile: "01780190959",
    email: "mukib56@gmail.com",
    image: "/images/Treasurer.jpg",
    role: "Treasurer",
    priority: 5
  },

  // Organizing Secretary
  {
    id: 10,
    name: "Dr. Mushtab Shira Mow",
    designation: "Junior Consultant",
    institute: "UHC, Nawabganj",
    mobile: "01711024427",
    email: "mushtabshira@gmail.com",
    image: "/images/organizingsecretary.jpg",
    role: "Organizing Secretary",
    priority: 6
  },

  // Office Secretary
  {
    id: 11,
    name: "Dr. Noor-A-Sabah Liza",
    designation: "Junior Consultant",
    institute: "SSMC",
    mobile: "01911418558",
    email: "dr.sabah10@gmail.com",
    image: "/images/officesecretary.jpg",
    role: "Office Secretary",
    priority: 7
  },

  // Science Secretary
  {
    id: 12,
    name: "Dr. Tania Saad",
    designation: "Assistant Professor",
    institute: "DMC&H",
    mobile: "01712036316",
    email: "taniasaad24@gmail.com",
    image: "/images/sciencesecretary.jpg",
    role: "Science Secretary",
    priority: 8
  },

  // Publicity and Public Relations Secretary
  {
    id: 13,
    name: "Dr. Laila Areju Man Banu",
    designation: "Assistant Professor",
    institute: "Shmc",
    mobile: "01711451867",
    email: "drlailak54dmc@gmail.com",
    image: "/images/publicrelationssecretary.jpg",
    role: "Publicity and Public Relations Secretary",
    priority: 9
  },

  // Publications and Cultural Secretary
  {
    id: 14,
    name: "Dr. Humaira Rafika Quadri",
    designation: "Associate",
    institute: "BSH",
    mobile: "01732-202931",
    email: "dr.humaira@gmail.com",
    image: "/images/culturalsecretary.jpg",
    role: "Publications and Cultural Secretary",
    priority: 10
  },

  // Members
  {
    id: 15,
    name: "Prof. Dr. Shaheen Akter",
    designation: "Ex Director",
    institute: "IPNA, BSMMU",
    mobile: "01713011759",
    email: "shaheenk33@gmail.com",
    image: "/images/Members2.jpg",
    role: "Member",
    priority: 11
  },
  {
    id: 16,
    name: "Prof. Dr. Ariful Islam",
    designation: "Professor",
    institute: "NINS&H",
    mobile: "01819162856",
    email: "arifulislam865@gmail.com",
    image: "/images/Members3.jpg",
    role: "Member",
    priority: 11
  },
  {
    id: 17,
    name: "Brig. Gen. Anjuman Ara Beauty",
    designation: "Professor (Btd)",
    institute: "CMH",
    mobile: "01769014632",
    email: "anjuman_beauty@yahoo.com",
    image: "/images/Members4.jpg",
    role: "Member",
    priority: 11
  },
  {
    id: 18,
    name: "Prof. Dr. Kaniz Fatema",
    designation: "Chairman & Professor",
    institute: "IPNA, BSMMU",
    mobile: "01713097751",
    email: "mailmonami@gmail.com",
    image: "/images/Members5.jpg",
    role: "Member",
    priority: 11
  },
  {
    id: 19,
    name: "Dr. Mohammad Zahir Uddin",
    designation: "Assistant Professor",
    institute: "Mymansigh Medical College",
    mobile: "01712236364",
    email: "zahir4263@gmail.com",
    image: "/images/Members6.jpg",
    role: "Member",
    priority: 11
  },
  {
    id: 20,
    name: "Dr. Shameem Ara Begum",
    designation: "Assistant Professor",
    institute: "NINS&H",
    mobile: "01816348843",
    email: "bshameemara@yahoo.com",
    image: "/images/Members7.jpg",
    role: "Member",
    priority: 11
  },

  // Advisor
  {
    id: 21,
    name: "Prof. Dr. Ahmed Murtaza Choudhury",
    designation: "Professor",
    institute: "",
    mobile: "0171147186",
    email: "murtazabd@gmail.com",
    image: "/images/advisor.jpg",
    role: "Advisor",
    priority: 12
  }
];

const Executive = () => {
  // Group members by role
  const groupedMembers = committeeMembers.reduce((acc, member) => {
    if (!acc[member.role]) {
      acc[member.role] = [];
    }
    acc[member.role].push(member);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 lg:py-12">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary to-primary/80 rounded-full mb-8 shadow-xl">
            <Crown className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Executive Council
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            2025-2027 Member List
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full"></div>
        </div>

        {/* Committee Members */}
        <div className="space-y-16">
          {roleOrder.map((role) => {
            const members = groupedMembers[role];
            if (!members || members.length === 0) return null;

            return (
              <div key={role} className="space-y-8">
                {/* Role Header */}
                <div className="text-center">
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                    {role}
                    {members.length > 1 && <span className="text-muted-foreground"> ({members.length})</span>}
                  </h2>
                  <div className="w-20 h-0.5 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full"></div>
                </div>

                {/* Members Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ${role === 'President' ? 'justify-items-center' : ''
                  }`}>
                  {role === 'President' && (
                    <div className="col-span-full flex justify-center">
                      <div className="w-full max-w-md">
                        {members.map((member) => (
                          <Card
                            key={member.id}
                            className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-primary/20 overflow-hidden ring-2 ring-primary/30"
                          >
                            <CardContent className="p-8">
                              {/* Profile Image */}
                              <div className="relative mb-6">
                                <div className="mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:border-primary/40 transition-all duration-300 w-32 h-32">
                                  <Image
                                    src={member.image}
                                    alt={member.name}
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                                  <Crown className="h-5 w-5 text-white" />
                                </div>
                              </div>

                              {/* Member Info */}
                              <div className="text-center space-y-4">
                                <div>
                                  <h3 className="font-bold text-foreground text-lg leading-tight mb-2">
                                    {member.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground font-medium">
                                    {member.designation}
                                  </p>
                                </div>

                                <div className="space-y-3">
                                  {member.institute && (
                                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                                      <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                                      <span className="truncate">{member.institute}</span>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <a
                                      href={`tel:${member.mobile}`}
                                      className="hover:text-primary transition-colors font-medium"
                                    >
                                      {member.mobile}
                                    </a>
                                  </div>

                                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <a
                                      href={`mailto:${member.email}`}
                                      className="hover:text-primary transition-colors truncate font-medium"
                                      title={member.email}
                                    >
                                      {member.email}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {role !== 'President' && members.map((member) => (
                    <Card
                      key={member.id}
                      className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-primary/20 overflow-hidden"
                    >
                      <CardContent className="p-8">
                        {/* Profile Image */}
                        <div className="relative mb-6">
                          <div className="mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:border-primary/40 transition-all duration-300 w-28 h-28">
                            <Image
                              src={member.image}
                              alt={member.name}
                              width={112}
                              height={112}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {role === 'Advisor' && (
                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                              <Star className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Member Info */}
                        <div className="text-center space-y-4">
                          <div>
                            <h3 className="font-bold text-foreground text-lg leading-tight mb-2">
                              {member.name}
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium">
                              {member.designation}
                            </p>
                          </div>

                          <div className="space-y-3">
                            {member.institute && (
                              <div className="flex items-center justify-center text-sm text-muted-foreground">
                                <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="truncate">{member.institute}</span>
                              </div>
                            )}

                            <div className="flex items-center justify-center text-sm text-muted-foreground">
                              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                              <a
                                href={`tel:${member.mobile}`}
                                className="hover:text-primary transition-colors font-medium"
                              >
                                {member.mobile}
                              </a>
                            </div>

                            <div className="flex items-center justify-center text-sm text-muted-foreground">
                              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                              <a
                                href={`mailto:${member.email}`}
                                className="hover:text-primary transition-colors truncate font-medium"
                                title={member.email}
                              >
                                {member.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <ChevronRight className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-foreground">Leadership Excellence</h3>
                <ChevronRight className="h-6 w-6 text-primary ml-2" />
              </div>
              <p className="text-muted-foreground text-lg">
                The Executive Council leads BCNS in advancing pediatric neurology care and research across Bangladesh.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Executive;
