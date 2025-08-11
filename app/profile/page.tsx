"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Award,
  Briefcase,
  GraduationCap,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRequireAuth } from "@/lib/auth-context";
import { changeMyPassword, updateMe, uploadProfileImage } from "@/lib/api";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { user, isLoading, updateUser } = useRequireAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [pwdSaving, setPwdSaving] = React.useState(false);

  const [pwd, setPwd] = React.useState({
    currentPassword: "",
    newPassword: "",
  });
  const [editData, setEditData] = React.useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    specialization: "",
    experience: "",
    institution: "",
    profilePictureUrl: "",
  });

  React.useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.address || "",
        bio: user.bio || "",
        specialization: "",
        experience: "",
        institution: "",
        profilePictureUrl: user.profilePictureUrl || "",
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // This will redirect to login via useRequireAuth
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateMe({
        name: editData.name || undefined,
        phone: editData.phone || undefined,
        address: editData.location || undefined,
        bio: editData.bio || undefined,
        profilePictureUrl: editData.profilePictureUrl || undefined,
      });
      updateUser(updated);
      // Re-sync local form with saved values
      setEditData({
        name: updated.name || "",
        email: updated.email || "",
        phone: (updated as { phone?: string }).phone || "",
        location: (updated as { address?: string }).address || "",
        bio: (updated as { bio?: string }).bio || "",
        specialization: editData.specialization,
        experience: editData.experience,
        institution: editData.institution,
        profilePictureUrl:
          (updated as { profilePictureUrl?: string }).profilePictureUrl || "",
      });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (e) {
      const err = e as Error;
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditData({
        name: user.name || "",
        email: user.email || "",
        phone: "",
        location: "",
        bio: "",
        specialization: "",
        experience: "",
        institution: "",
        profilePictureUrl: "",
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-200/25 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-indigo-200/25 blur-[60px]" />
      </div>

      <div className="container mx-auto px-4 py-10 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 bg-clip-text text-transparent">
                  Profile
                </span>
              </h1>
              <p className="text-gray-600">
                Manage your personal information and preferences
              </p>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    disabled={saving}
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-60 rounded-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="rounded-full"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 rounded-full"
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-slate-200/50">
              <div className="text-center">
                {/* Profile Picture */}
                <div className="relative mx-auto mb-4">
                  <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto ring-4 ring-white/50 shadow-2xl">
                    {editData.profilePictureUrl || user.profilePictureUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          editData.profilePictureUrl ||
                          (user.profilePictureUrl as string)
                        }
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-14 w-14 text-blue-600" />
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-1 right-1 h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white hover:from-blue-600 hover:to-indigo-700 cursor-pointer shadow-xl transition-all duration-200">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            toast.info("Uploading image...");
                            const { url } = await uploadProfileImage(file);
                            setEditData({
                              ...editData,
                              profilePictureUrl: url,
                            });
                            // Persist immediately so refresh keeps it
                            const saved = await updateMe({
                              profilePictureUrl: url,
                            });
                            updateUser(saved);
                            toast.success("Profile picture updated");
                          } catch (e) {
                            const err = e as { message?: string };
                            toast.error(err?.message || "Image upload failed");
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* Name and Email */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user.name}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>

                {/* Membership Status */}
                <div className="mb-4">
                  <Badge className="bg-green-100 text-green-800 rounded-full">
                    <Shield className="mr-1 h-3 w-3" />
                    Active Member
                  </Badge>
                </div>

                {/* Member Since */}
                <div className="text-sm text-gray-500">
                  <Clock className="inline mr-1 h-4 w-4" />
                  Member since{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).getFullYear()
                    : "2024"}
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 mt-6 rounded-2xl bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-slate-200/50">
              <h3 className="font-semibold text-gray-900 mb-4">
                Profile Completion
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Basic Info</span>
                  <span className="text-sm font-medium text-green-600">
                    100%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-full"></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Professional Info
                  </span>
                  <span className="text-sm font-medium text-yellow-600">
                    60%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full w-3/5"></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-slate-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  ) : (
                    <p className="text-gray-900">{user.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-gray-400" />
                      {user.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) =>
                        setEditData({ ...editData, phone: e.target.value })
                      }
                      placeholder="Enter phone number"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-gray-400" />
                      {user.phone || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) =>
                        setEditData({ ...editData, location: e.target.value })
                      }
                      placeholder="City, Country"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                      {user.address || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Professional Information */}
            <Card className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-slate-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Professional Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution/Hospital
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.institution}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          institution: e.target.value,
                        })
                      }
                      placeholder="Enter institution name"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-gray-400" />
                      {editData.institution || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.specialization}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          specialization: e.target.value,
                        })
                      }
                      placeholder="e.g., Pediatric Epilepsy, Neurodevelopmental Disorders"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4 text-gray-400" />
                      {editData.specialization || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  {isEditing ? (
                    <select
                      value={editData.experience}
                      onChange={(e) =>
                        setEditData({ ...editData, experience: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    >
                      <option value="">Select experience</option>
                      <option value="0-2">0-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="11-15">11-15 years</option>
                      <option value="16+">16+ years</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <Award className="mr-2 h-4 w-4 text-gray-400" />
                      {editData.experience || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editData.bio}
                      onChange={(e) =>
                        setEditData({ ...editData, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself and your professional background..."
                      rows={4}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {user.bio || "No bio provided"}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-slate-200/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 shadow-sm border-0">
                  <h4 className="font-medium mb-2">Change Password</h4>
                  <div className="space-y-2">
                    <input
                      type="password"
                      placeholder="Current password"
                      value={pwd.currentPassword}
                      onChange={(e) =>
                        setPwd({ ...pwd, currentPassword: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={pwd.newPassword}
                      onChange={(e) =>
                        setPwd({ ...pwd, newPassword: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                    <Button
                      disabled={pwdSaving}
                      onClick={async () => {
                        setPwdSaving(true);
                        try {
                          const res = await changeMyPassword(pwd);
                          toast.success(res.message || "Password changed");
                          setPwd({ currentPassword: "", newPassword: "" });
                        } catch (e) {
                          const err = e as { message?: string };
                          toast.error(
                            err?.message || "Failed to change password"
                          );
                        } finally {
                          setPwdSaving(false);
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                    >
                      {pwdSaving ? "Working..." : "Update Password"}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 rounded-2xl"
                >
                  <Link
                    href="/dashboard"
                    className="flex flex-col items-center text-center"
                  >
                    <Award className="h-6 w-6 mb-2 text-blue-600" />
                    <span className="font-medium">Dashboard</span>
                    <span className="text-xs text-gray-500">View overview</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 rounded-2xl"
                >
                  <Link
                    href="/events"
                    className="flex flex-col items-center text-center"
                  >
                    <Calendar className="h-6 w-6 mb-2 text-green-600" />
                    <span className="font-medium">Events</span>
                    <span className="text-xs text-gray-500">Browse events</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 rounded-2xl"
                >
                  <Link
                    href="/members"
                    className="flex flex-col items-center text-center"
                  >
                    <User className="h-6 w-6 mb-2 text-purple-600" />
                    <span className="font-medium">Network</span>
                    <span className="text-xs text-gray-500">
                      Connect with members
                    </span>
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
