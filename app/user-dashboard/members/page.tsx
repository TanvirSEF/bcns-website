"use client";

import * as React from "react";
import { Search, Mail, Phone, MapPin, Calendar, User, Building2, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllMembers } from "@/lib/api";
import { useFavorites } from "@/hooks/use-favorites";
import { User as UserType } from "@/types/api";
import { toast } from "react-toastify";

export default function UserMembersPage() {
  const [members, setMembers] = React.useState<UserType[]>([]);
  const [filteredMembers, setFilteredMembers] = React.useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { favoredIds, toggle } = useFavorites("member");

  React.useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllMembers();
        setMembers([...(response || [])]);
        setFilteredMembers([...(response || [])]);
      } catch (err) {
        console.error("Failed to fetch members:", err);
        setError("Failed to load members. Please try again later.");
        toast.error("Failed to load members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMembers(members);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = members.filter((member) => {
      const name = member.name?.toLowerCase() || "";
      const email = member.email?.toLowerCase() || "";
      const phone = member.phone?.toLowerCase() || "";
      const affiliation = member.affiliation?.toLowerCase() || "";
      const address = member.address?.toLowerCase() || "";
      
      return (
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        affiliation.includes(query) ||
        address.includes(query)
      );
    });
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

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="p-6 bg-linear-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">Members</h1>
          <p className="text-gray-700">Connect with fellow BCNS members and pediatric neurologists.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="p-6 bg-linear-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">Members</h1>
          <p className="text-gray-700">Connect with fellow BCNS members and pediatric neurologists.</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 bg-linear-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">Members</h1>
        <p className="text-gray-700">Connect with fellow BCNS members and pediatric neurologists.</p>
      </div>

      {/* Search Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search members by name, email, phone, or affiliation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary" className="text-sm">
              {filteredMembers.length} {filteredMembers.length === 1 ? "Member" : "Members"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Members Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12 border-2 border-emerald-100">
                    <AvatarImage src={member.profilePictureUrl} alt={member.name} />
                    <AvatarFallback className="bg-linear-to-br from-emerald-500 to-green-600 text-white font-semibold">
                      {getInitials(member.name || "User")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {member.name || "Name not available"}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 shrink-0"
                        onClick={() => toggle(member.id)}
                      >
                        <Heart className={`h-4 w-4 ${favoredIds.has(member.id) ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </div>
                    {member.affiliation && (
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Building2 className="h-3 w-3 mr-1.5 shrink-0" />
                        <span className="truncate">{member.affiliation}</span>
                      </div>
                    )}

                    <div className="space-y-2 mb-4">
                      {member.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2 text-emerald-600 shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}

                      {member.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-emerald-600 shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      )}

                      {member.address && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-emerald-600 shrink-0" />
                          <span className="truncate">{member.address}</span>
                        </div>
                      )}
                    </div>

                    {member.createdAt && (
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          Joined {new Date(member.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {member.email && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                        onClick={() => {
                          window.location.href = `mailto:${member.email}`;
                        }}
                      >
                        <Mail className="h-3 w-3 mr-2" />
                        Contact
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No members found</h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try adjusting your search terms"
                : "No members are currently available"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

