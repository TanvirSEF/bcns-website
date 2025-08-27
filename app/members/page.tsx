"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

import { 
  Users, 
  Search, 
  User, 
  Building, 
  Mail, 
  Phone,
  Award,
  Shield,
  Loader2,
  AlertCircle
} from "lucide-react";
import { getAllMembers, User as UserType } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { tokenStorage } from "@/lib/api";

const Members = () => {
  const [members, setMembers] = useState<UserType[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const token = tokenStorage.get();
        console.log("🔍 Members Page - Token:", token ? "Present" : "Missing");
        console.log("🔍 Members Page - isAuthenticated:", isAuthenticated);
        
        const response = await getAllMembers(token || undefined);
        console.log("📡 Members Page - API Response:", response);
        
        setMembers(response.members);
        setFilteredMembers(response.members);
        console.log("👥 Members Page - Set members:", response.members.length);
      } catch (err) {
        console.error('❌ Members Page - Error fetching members:', err);
        setError('Failed to load members. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      console.log("🚀 Members Page - Fetching members...");
      fetchMembers();
    } else {
      console.log("🔒 Members Page - Not authenticated, skipping fetch");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(member => 
        member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, members]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view our members directory.
            </p>
            <Button asChild className="w-full">
              <a href="/login">Login to Continue</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
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
            Meet the distinguished pediatric neurologists who are part of the Bangladesh Child Neurology Society.
            Connect with experts, share knowledge, and advance the field together.
          </p>
        </div>

        {/* Search and Stats Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members by name, email, or affiliation..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{filteredMembers.length} members</span>
              </div>
              {searchQuery && (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Filtered results</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading members...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 shadow-lg">
            <CardContent className="p-6 flex items-start space-x-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h5 className="text-lg font-semibold text-red-800 mb-2">
                  Error Loading Members
                </h5>
                <p className="text-red-700">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Members Grid */}
        {!loading && !error && (
          <>
            {filteredMembers.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchQuery ? 'No members found' : 'No members available'}
                  </h3>
                  <p className="text-gray-600">
                    {searchQuery 
                      ? 'Try adjusting your search terms or browse all members.'
                      : 'Members will appear here once they join the society.'
                    }
                  </p>
                  {searchQuery && (
                    <Button 
                      onClick={() => setSearchQuery('')} 
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Clear Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMembers.map((member) => (
                  <Card 
                    key={member.id} 
                    className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.02]"
                  >
                    <CardContent className="p-6">
                      {/* Member Photo */}
                      <div className="flex justify-center mb-4">
                        <div className="relative">
                          {(member.profilePictureUrl || member.avatar) ? (
                            <Image
                              src={member.profilePictureUrl || member.avatar || ''}
                              alt={member.name || 'Member'}
                              width={80}
                              height={80}
                              className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 group-hover:border-blue-200 transition-colors duration-300"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-4 border-blue-100 group-hover:border-blue-200 transition-colors duration-300">
                              <User className="h-8 w-8 text-white" />
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Award className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Member Info */}
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                          {member.name || 'Member Name'}
                        </h3>
                        
                        {member.address && (
                          <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-2">
                            <Building className="h-3 w-3" />
                            <span className="truncate">{member.address}</span>
                          </div>
                        )}

                        {/* Contact Info */}
                        <div className="space-y-1 text-xs text-gray-500">
                          {member.email && (
                            <div className="flex items-center justify-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{member.email}</span>
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center justify-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                        </div>

                        {/* Member Since */}
                        {member.createdAt && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              Member since {new Date(member.createdAt).getFullYear()}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Footer Stats */}
        {!loading && !error && filteredMembers.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>
                Showing {filteredMembers.length} of {members.length} members
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;