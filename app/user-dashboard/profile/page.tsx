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
  Lock,
  Loader2
} from "lucide-react";
import { useRequireAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { useAsyncSubmit } from "@/hooks/use-async";
import { ApiError } from "@/lib/api-client";
import { ErrorBoundary } from "@/components/error-boundary";
import { toast } from "react-toastify";

function ProfilePageContent() {
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

  // Profile update with proper async handling
  const { loading: updateLoading, execute: executeUpdate } = useAsyncSubmit(
    async (updateData: Partial<typeof formData>) => {
      const updatedUser = await api.users.updateProfile(updateData);
      updateUser(updatedUser);
      setIsEditing(false);
      return updatedUser;
    },
    {
      onSuccess: () => {
        toast.success("Profile updated successfully!");
      },
      onError: (error) => {
        const message = error instanceof ApiError 
          ? error.getUserFriendlyMessage()
          : "Failed to update profile. Please try again.";
        toast.error(message);
      }
    }
  );

  // Password change with proper async handling
  const { loading: passwordLoading, execute: executePasswordChange } = useAsyncSubmit(
    async (passwordData: { currentPassword: string; newPassword: string }) => {
      await api.users.changePassword(passwordData);
      setShowPasswordChange(false);
      setFormData(prev => ({ 
        ...prev, 
        currentPassword: "", 
        newPassword: "", 
        confirmPassword: "" 
      }));
    },
    {
      onSuccess: () => {
        toast.success("Password changed successfully!");
      },
      onError: (error) => {
        const message = error instanceof ApiError 
          ? error.getUserFriendlyMessage()
          : "Failed to change password. Please try again.";
        toast.error(message);
      }
    }
  );

  // Profile picture upload with progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const { loading: uploadLoading, execute: executeUpload } = useAsyncSubmit(
    async (file: File) => {
      const response = await api.users.uploadProfilePicture(file, (progress) => {
        setUploadProgress(progress);
      });
      
      const newProfilePictureUrl = response.profilePictureUrl;
      if (newProfilePictureUrl) {
        updateUser({ profilePictureUrl: newProfilePictureUrl });
      }
      
      setUploadProgress(0);
      return response;
    },
    {
      onSuccess: () => {
        toast.success("Profile picture uploaded successfully!");
      },
      onError: (error) => {
        const message = error instanceof ApiError 
          ? error.getUserFriendlyMessage()
          : "Failed to upload profile picture. Please try again.";
        toast.error(message);
        setUploadProgress(0);
      }
    }
  );

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

    await executeUpdate(updateData);
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
    
    await executePasswordChange({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
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

    await executeUpload(file);
    
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
                <label htmlFor="profile-picture" className={`absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2 cursor-pointer transition-colors ${uploadLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {uploadLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureUpload}
                    disabled={uploadLoading}
                  />
                </label>
                {uploadLoading && uploadProgress > 0 && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
                    {Math.round(uploadProgress)}%
                  </div>
                )}
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
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : isEditing ? (
                  <Save className="h-4 w-4 mr-2" />
                ) : (
                  <Edit className="h-4 w-4 mr-2" />
                )}
                {updateLoading ? "Saving..." : isEditing ? "Save" : "Edit"}
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
                    <Button 
                      onClick={handlePasswordChange} 
                      className="w-full"
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
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

export default function UserProfilePage() {
  return (
    <ErrorBoundary 
      level="page"
      onError={(error, errorInfo) => {
        console.error('Profile page error:', error, errorInfo);
      }}
    >
      <ProfilePageContent />
    </ErrorBoundary>
  );
}
