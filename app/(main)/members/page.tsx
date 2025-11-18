"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
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
          member.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMembers(filtered);
  }, [searchQuery, members]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <NavbarClient />
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <NavbarClient />
      {/* Enhanced Background decorative elements */}
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-200/30 blur-[60px] transform translate-x-1/2 translate-y-1/2 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-purple-200/20 blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />

      <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600/90 text-white mb-6">
            <Users className="h-4 w-4 mr-2" />
            BCNS Community
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Our Members
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet the distinguished pediatric neurologists who are part of the
            Bangladesh Child Neurology Society. Connect with experts, share
            knowledge, and advance the field together.
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
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-300 w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {filteredMembers.length} Members
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
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card
                key={member.id}
                className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-200 hover:border-blue-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {member.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {member.name || "Name not available"}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {member.role || "Member"}
                      </p>

                      <div className="space-y-2">
                        {member.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        )}

                        {member.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{member.phone}</span>
                          </div>
                        )}

                        {member.address && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="truncate">{member.address}</span>
                          </div>
                        )}
                      </div>

                      {member.bio && (
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                          {member.bio}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            Joined{" "}
                            {member.createdAt
                              ? new Date(member.createdAt).toLocaleDateString()
                              : "Recently"}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            // Handle member contact
                            if (member.email) {
                              window.location.href = `mailto:${member.email}`;
                            }
                          }}
                        >
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
