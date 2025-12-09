"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  Shield,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getAllMembers } from "@/lib/api";
import { User as UserType } from "@/types/api";
import { NavbarClient } from "@/components/navbarclient";
import { Footer } from "@/components/footer";

export default function MembersPage() {
  const [members, setMembers] = useState<UserType[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);

        // Only fetch members, not admins for security
        const response = await getAllMembers();

        // New API returns data directly, not wrapped in success/data
        setMembers([...(response || [])]);
        setFilteredMembers([...(response || [])]);
      } catch (err) {
        console.error("Members Page - Error fetching members:", err);
        setError("Failed to load members. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMembers();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = members;

    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (member) =>
          member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.affiliation?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMembers(filtered);
  }, [searchQuery, members]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ").filter(part => part.length > 0);
    if (parts.length >= 2) {
      const first = parts[0]?.[0];
      const last = parts[parts.length - 1]?.[0];
      if (first && last) {
        return (first + last).toUpperCase();
      }
    }
    const firstChar = name.trim().charAt(0);
    return firstChar ? firstChar.toUpperCase() : "U";
  };

  const MemberCard = ({ member }: { member: UserType }) => (
    <div className="bg-white rounded-lg shadow-md p-5 sm:p-7 hover:shadow-lg transition-shadow duration-300 w-full">
      <div className="flex flex-col items-center mb-4">
        {member.profilePictureUrl ? (
          <div className="mb-3 w-full flex justify-center">
            <div className="relative w-32 h-40 sm:w-36 sm:h-44 md:w-40 md:h-48 overflow-hidden rounded-lg border border-gray-300">
              <Image
                src={member.profilePictureUrl}
                alt={member.name || "Member"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 128px, (max-width: 768px) 144px, 160px"
              />
            </div>
          </div>
        ) : (
          <div className="mb-3 w-full flex justify-center">
            <div className="w-32 h-40 sm:w-36 sm:h-44 md:w-40 md:h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg rounded-lg border border-gray-300">
              {getInitials(member.name || "User")}
            </div>
          </div>
        )}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center leading-snug mb-2">
          {member.name || "Name not available"}
        </h3>
        {member.role && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs sm:text-sm px-3 py-1 rounded-full font-medium mb-2 mt-1">
            {member.role}
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {member.affiliation && (
          <div>
            <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Affiliation:</p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{member.affiliation}</p>
          </div>
        )}

        {member.createdAt && (
          <div>
            <p className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Joined:</p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {new Date(member.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarClient />
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Access Restricted
              </h2>
              <p className="text-gray-600 mb-6">
                You need to be logged in to view our members directory.
              </p>
              <Button asChild className="w-full">
                <a href="/login">Login to Continue</a>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarClient />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Members</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet the distinguished pediatric neurologists who are part of the
            Bangladesh Child Neurology Society.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members by name, email, or affiliation..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="pl-10 bg-white border-gray-300 w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {filteredMembers.length} {filteredMembers.length === 1 ? "Member" : "Members"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Loading members...
            </div>
          </div>
        )}

        {/* Members Grid */}
        {!loading && !error && filteredMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No members found
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search terms"
                : "No members are currently available"}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
