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
import { toast } from "react-toastify";

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
    phone: "",
    affiliation: "",
    mailingAddress: "",
    permanentAddress: "",
    specialization: "",
    institution: "",
    bio: "",
    primaryResearchInterest: "",
    secondaryResearchInterest: "",
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
        phone: user.phone || "",
        affiliation: user.affiliation || "",
        mailingAddress: user.mailingAddress || "",
        permanentAddress: user.permanentAddress || "",
        specialization: user.specialization || "",
        institution: user.institution || "",
        bio: user.bio || "",
        primaryResearchInterest: user.primaryResearchInterest || "",
        secondaryResearchInterest: user.secondaryResearchInterest || "",
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
        affiliation: formData.affiliation,
        mailingAddress: formData.mailingAddress,
        permanentAddress: formData.permanentAddress,
        specialization: formData.specialization,
        institution: formData.institution,
        bio: formData.bio,
        primaryResearchInterest: formData.primaryResearchInterest,
        secondaryResearchInterest: formData.secondaryResearchInterest,
      };

      // Call API to update profile
      const updatedUser = await api.updateProfile(updateData);
      
      // Update user data in context
      updateUser(updatedUser);
      
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long!");
      return;
    }
    
    try {
      // Call API to change password
      await api.changePassword(formData.currentPassword, formData.newPassword);
      
      setShowPasswordChange(false);
      setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      toast.success("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to change password. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("File size must be less than 5MB");
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Show loading toast
    const toastId = toast.loading("Uploading profile picture...");
    
    try {
      // Call API to upload profile picture
      const response = await api.uploadProfileImage(file);
      
      // Update user data with new profile picture
      const newProfilePictureUrl = response.data?.profilePictureUrl || response.data?.imageUrl;
      
      if (newProfilePictureUrl) {
        // Update user context with new profile picture
        updateUser({ profilePictureUrl: newProfilePictureUrl });
        toast.update(toastId, { 
          render: "Profile picture uploaded successfully!", 
          type: "success", 
          isLoading: false,
          autoClose: 3000
        });
        
        // Force refresh user data to ensure sidebar updates
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error("No profile picture URL returned from server");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload profile picture. Please try again.";
      toast.update(toastId, { 
        render: errorMessage, 
        type: "error", 
        isLoading: false,
        autoClose: 5000
      });
    }
    
    // Clear the input so the same file can be uploaded again if needed
    event.target.value = '';
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
                  <AvatarImage 
                    src={user?.profilePictureUrl || user?.avatar || "/images/logo.png"} 
                    alt={user?.name || "User"}
                  />
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
                <span>{formData.phone || "Not provided"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{formData.mailingAddress || "Not provided"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : "2020"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Award className="h-4 w-4" />
                <span>{user?.membershipStatus || "Professional Member"}</span>
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
                <span className="font-medium">{user?.eventsAttended || 0}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Publications Read</span>
                <span className="font-medium">{user?.publicationsRead || 0}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Network Connections</span>
                <span className="font-medium">{user?.networkConnections || 0}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Training Programs</span>
                <span className="font-medium">{user?.training?.length || 0}</span>
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
                  <Label htmlFor="affiliation">Institution/Affiliation</Label>
                  <Input
                    id="affiliation"
                    value={formData.affiliation}
                    onChange={(e) => handleInputChange("affiliation", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="mailingAddress">Mailing Address</Label>
                  <Textarea
                    id="mailingAddress"
                    value={formData.mailingAddress}
                    onChange={(e) => handleInputChange("mailingAddress", e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="permanentAddress">Permanent Address</Label>
                  <Textarea
                    id="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={(e) => handleInputChange("permanentAddress", e.target.value)}
                    disabled={!isEditing}
                    rows={3}
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

          {/* Research Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Research Interests</CardTitle>
              <CardDescription>
                Your areas of research focus and interests.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primaryResearchInterest">Primary Research Interest</Label>
                <Textarea
                  id="primaryResearchInterest"
                  value={formData.primaryResearchInterest}
                  onChange={(e) => handleInputChange("primaryResearchInterest", e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Describe your primary research interest"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryResearchInterest">Secondary Research Interest</Label>
                <Textarea
                  id="secondaryResearchInterest"
                  value={formData.secondaryResearchInterest}
                  onChange={(e) => handleInputChange("secondaryResearchInterest", e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Describe your secondary research interest (optional)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Education & Training */}
          {user?.educationQualifications && user.educationQualifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Education Qualifications</CardTitle>
                <CardDescription>
                  Your academic background and qualifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.educationQualifications.map((edu, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{edu.qualification}</span>
                        <span className="text-gray-600 ml-2">({edu.year})</span>
                      </div>
                      <span className="text-sm text-gray-600">{edu.institution}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Training */}
          {user?.training && user.training.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Professional Training</CardTitle>
                <CardDescription>
                  Your training and professional development experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.training.map((training, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{training.period}</span>
                      <span className="text-sm text-gray-600">{training.institute}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
