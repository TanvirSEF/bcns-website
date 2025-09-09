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
  ChevronRight,
  Users,
  Award,
  Shield
} from 'lucide-react';
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'President':
        return <Crown className="h-6 w-6 text-yellow-600" />;
      case 'Vice President':
        return <Award className="h-6 w-6 text-blue-600" />;
      case 'General Secretary':
        return <Shield className="h-6 w-6 text-green-600" />;
      case 'Advisor':
        return <Star className="h-6 w-6 text-purple-600" />;
      default:
        return <Users className="h-6 w-6 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'President':
        return 'from-yellow-500 to-amber-500';
      case 'Vice President':
        return 'from-blue-500 to-blue-600';
      case 'General Secretary':
        return 'from-green-500 to-green-600';
      case 'Advisor':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
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
                  <div className="flex items-center justify-center mb-4">
                    {getRoleIcon(role)}
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground ml-3">
                      {role}
                      {members.length > 1 && <span className="text-muted-foreground"> ({members.length})</span>}
                    </h2>
                  </div>
                  <div className="w-20 h-0.5 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full"></div>
                </div>

                {/* Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {members.map((member) => (
                    <Card
                      key={member.id}
                      className={`group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-primary/20 overflow-hidden ${
                        role === 'President' ? 'ring-2 ring-yellow-400/50 shadow-lg' : ''
                      }`}
                    >
                      <CardContent className="p-6">
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
                          {role === 'President' && (
                            <div className={`absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r ${getRoleColor(role)} rounded-full flex items-center justify-center shadow-lg`}>
                              <Crown className="h-5 w-5 text-white" />
                            </div>
                          )}
                          {role === 'Advisor' && (
                            <div className={`absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r ${getRoleColor(role)} rounded-full flex items-center justify-center shadow-lg`}>
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
                                <span className="truncate" title={member.institute}>{member.institute}</span>
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