"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Camera, 
  Edit, 
  Save,
  X,
  Eye,
  EyeOff,
  Lock
} from "lucide-react";
import { useRequireAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

export default function UserProfilePage() {
  const { user, isLoading, isAuthorized, updateUser } = useRequireAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+880 1234 567890",
    address: "Dhaka, Bangladesh",
    specialization: "Pediatric Neurology",
    institution: "Dhaka Medical College Hospital",
    bio: "Dedicated pediatric neurologist with 10+ years of experience in child neurology and developmental disorders.",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Update form data when user data is loaded
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "+880 1234 567890",
        address: user.address || "Dhaka, Bangladesh",
        specialization: user.specialization || "Pediatric Neurology",
        institution: user.institution || "Dhaka Medical College Hospital",
        bio: user.bio || "Dedicated pediatric neurologist with 10+ years of experience in child neurology and developmental disorders.",
      }));
    }
  }, [user]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // useRequireAuth will handle redirection to login if not authenticated
  if (!isAuthorized || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // Prepare data for API call
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        specialization: formData.specialization,
        institution: formData.institution,
        bio: formData.bio,
      };

      // Call API to update profile
      const updatedUser = await api.updateProfile(updateData);
      
      // Update user data in context
      updateUser(updatedUser);
      
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    if (formData.newPassword.length < 6) {
      alert("New password must be at least 6 characters long!");
      return;
    }
    try {
      // Call API to change password
      await api.changePassword(formData.currentPassword, formData.newPassword);
      
      setShowPasswordChange(false);
      setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to change password. Please try again.";
      alert(errorMessage);
    }
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }
      try {
        // Call API to upload profile picture
        const response = await api.uploadProfileImage(file);
        
        // Update user data with new profile picture
        if (response.data && response.data.profilePictureUrl) {
          updateUser({ profilePictureUrl: response.data.profilePictureUrl });
        }
        
        alert("Profile picture uploaded successfully!");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to upload profile picture. Please try again.";
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">My Profile</h1>
        <p className="text-gray-700">Manage your personal information and professional details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="h-32 w-32 mx-auto">
                  <AvatarImage src={user?.profilePictureUrl || "/images/logo.png"} alt={user?.name || "User"} />
                  <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : "U"}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2 cursor-pointer transition-colors">
                  <Camera className="h-4 w-4" />
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureUpload}
                  />
                </label>
              </div>
              <CardTitle className="mt-4">{user?.name || "User"}</CardTitle>
              <CardDescription>{formData.specialization}</CardDescription>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                Active Member
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{user?.email || "user@example.com"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{formData.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{formData.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Member since 2020</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Award className="h-4 w-4" />
                <span>Professional Member</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Events Attended</span>
                <span className="font-medium">12</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Publications Read</span>
                <span className="font-medium">28</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Network Connections</span>
                <span className="font-medium">47</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">CPD Points</span>
                <span className="font-medium">85</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and contact information.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>
                Your professional background and specialization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange("specialization", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => handleInputChange("institution", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showPasswordChange ? (
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordChange(true)}
                >
                  Change Password
                </Button>
              ) : (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Change Password</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPasswordChange(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={(e) => handleInputChange("newPassword", e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button onClick={handlePasswordChange} className="w-full">
                      Update Password
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
