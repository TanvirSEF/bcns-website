"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Loader2,
  Plus,
  Trash2,
  GraduationCap,
  AtSign,
  Briefcase,
  FileText,
  Check,
  Info
} from "lucide-react";
import { useRequireAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import type { UserUpdateInput } from "@/types/api";
import { useAsyncSubmit } from "@/hooks/use-async";
import { ApiError } from "@/lib/api-client";
import { ErrorBoundary } from "@/components/error-boundary";
import { toast } from "react-toastify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const USERNAME_REGEX = /^[a-z0-9_]+$/;

function ProfilePageContent() {
  const { user, isLoading, isAuthorized, updateUser, refreshUser } = useRequireAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Use ref for synchronous checking to prevent race conditions
  const isSavingRef = useRef(false);
  
  const [formData, setFormData] = useState({
    formNo: "",
    refNo: "",
    name: "",
    email: "",
    username: "",
    phone: "",
    designation: "",
    affiliation: "",
    mailingAddress: "",
    permanentAddress: "",
    bio: "",
    primaryResearchInterest: "",
    secondaryResearchInterest: "",
    educationQualifications: [] as Array<{ qualification: string; year: string; institution: string }>,
    training: [] as Array<{ period: string; institute: string }>,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [usernameAvailability, setUsernameAvailability] = useState<{
    checking: boolean;
    available: boolean | null;
  }>({ checking: false, available: null });

  // Fetch fresh user data when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      if (refreshUser) {
        try {
          setIsRefreshing(true);
          await refreshUser();
        } catch (error) {
          console.error('Failed to refresh user data:', error);
        } finally {
          setIsRefreshing(false);
        }
      } else {
        setIsRefreshing(false);
      }
    };
    
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Username availability check (debounced, skip if unchanged from current user)
  const currentUsername = (user as { username?: string })?.username?.toLowerCase();
  useEffect(() => {
    const username = formData.username?.trim().toLowerCase();
    if (!username || username.length < 3) {
      setUsernameAvailability({ checking: false, available: null });
      return;
    }
    if (!USERNAME_REGEX.test(username)) {
      setUsernameAvailability({ checking: false, available: null });
      return;
    }
    if (username === currentUsername) {
      setUsernameAvailability({ checking: false, available: true });
      return;
    }
    setUsernameAvailability({ checking: true, available: null });
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/users/check-username?username=${encodeURIComponent(username)}`,
          { headers: { "Content-Type": "application/json" } }
        );
        const data = await res.json();
        const available = data.success === true && data.available === true;
        setUsernameAvailability({ checking: false, available });
      } catch {
        setUsernameAvailability({ checking: false, available: null });
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username, currentUsername]);

  // Loading state for profile update
  const [updateLoading, setUpdateLoading] = useState(false);

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

  // Update form data when user data is loaded or updated
  useEffect(() => {
    if (user) {
      const u = user as { username?: string; designation?: string; formNo?: string; refNo?: string };
      setFormData(prev => {
        const newFormData = {
          formNo: u.formNo || "",
          refNo: u.refNo || "",
          name: user.name || "",
          email: user.email || "",
          username: u.username || "",
          phone: user.phone || "",
          designation: u.designation || "",
          affiliation: user.affiliation || "",
          mailingAddress: user.mailingAddress || "",
          permanentAddress: user.permanentAddress || "",
          bio: user.bio || "",
          primaryResearchInterest: user.primaryResearchInterest || "",
          secondaryResearchInterest: user.secondaryResearchInterest || "",
          educationQualifications: user.educationQualifications && user.educationQualifications.length > 0 
            ? user.educationQualifications.map(edu => ({
                qualification: edu.qualification || "",
                year: edu.year || "",
                institution: edu.institution || ""
              }))
            : [{ qualification: "", year: "", institution: "" }],
          training: user.training && user.training.length > 0
            ? user.training.map(t => ({
                period: t.period || "",
                institute: t.institute || ""
              }))
            : [{ period: "", institute: "" }],
          currentPassword: prev.currentPassword,
          newPassword: prev.newPassword,
          confirmPassword: prev.confirmPassword
        };
        
        const hasChanged = 
          prev.formNo !== newFormData.formNo ||
          prev.refNo !== newFormData.refNo ||
          prev.name !== newFormData.name ||
          prev.email !== newFormData.email ||
          prev.username !== newFormData.username ||
          prev.phone !== newFormData.phone ||
          prev.designation !== newFormData.designation ||
          prev.affiliation !== newFormData.affiliation ||
          prev.mailingAddress !== newFormData.mailingAddress ||
          prev.permanentAddress !== newFormData.permanentAddress ||
          prev.bio !== newFormData.bio ||
          prev.primaryResearchInterest !== newFormData.primaryResearchInterest ||
          prev.secondaryResearchInterest !== newFormData.secondaryResearchInterest ||
          JSON.stringify(prev.educationQualifications) !== JSON.stringify(newFormData.educationQualifications) ||
          JSON.stringify(prev.training) !== JSON.stringify(newFormData.training);
        
        if (hasChanged) {
          return newFormData;
        }
        
        return prev;
      });
    }
  }, [user]);

  // Show loading spinner while checking authentication or refreshing user data
  if (isLoading || isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="text-sm text-gray-600">Loading your profile...</p>
        </div>
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
    // Prevent multiple simultaneous calls using ref for synchronous check
    if (isSavingRef.current || updateLoading) {
      return;
    }

    // Set ref immediately to prevent race conditions
    isSavingRef.current = true;

    setIsSaving(true);

    // Validate username if changed
    const username = formData.username?.trim().toLowerCase();
    const currentUser = user as { username?: string };
    if (username && username !== currentUser?.username?.toLowerCase()) {
      if (username.length < 3) {
        toast.error("Username must be at least 3 characters");
        setIsSaving(false);
        isSavingRef.current = false;
        return;
      }
      if (!USERNAME_REGEX.test(username)) {
        toast.error("Username can only contain lowercase letters, numbers, and underscores");
        setIsSaving(false);
        isSavingRef.current = false;
        return;
      }
      if (usernameAvailability.checking) {
        toast.error("Please wait while we verify username availability");
        setIsSaving(false);
        isSavingRef.current = false;
        return;
      }
      if (usernameAvailability.available === false) {
        toast.error("Username is already taken. Please choose a different username.");
        setIsSaving(false);
        isSavingRef.current = false;
        return;
      }
    }
    
    const eduFiltered = formData.educationQualifications
      .filter(edu => edu.qualification.trim() !== "" && edu.institution.trim() !== "")
      .map(edu => ({ qualification: edu.qualification, year: edu.year, institution: edu.institution }));
    const trainFiltered = formData.training
      .filter(t => t.period.trim() !== "" && t.institute.trim() !== "")
      .map(t => ({ period: t.period, institute: t.institute }));

    const cleaned = {
      name: formData.name,
      ...(formData.formNo && { formNo: formData.formNo }),
      ...(formData.refNo && { refNo: formData.refNo }),
      ...(formData.email && { email: formData.email }),
      ...(formData.username?.trim() && { username: formData.username.trim() }),
      ...(formData.phone && { phone: formData.phone }),
      ...(formData.designation && { designation: formData.designation }),
      ...(formData.affiliation && { affiliation: formData.affiliation }),
      ...(formData.mailingAddress && { mailingAddress: formData.mailingAddress }),
      ...(formData.permanentAddress && { permanentAddress: formData.permanentAddress }),
      ...(formData.bio && { bio: formData.bio }),
      ...(formData.primaryResearchInterest && { primaryResearchInterest: formData.primaryResearchInterest }),
      ...(formData.secondaryResearchInterest && { secondaryResearchInterest: formData.secondaryResearchInterest }),
      ...(eduFiltered.length > 0 && { educationQualifications: eduFiltered }),
      ...(trainFiltered.length > 0 && { training: trainFiltered }),
    };

    setUpdateLoading(true);
    try {
      const updatedUser = await api.users.updateProfile(cleaned as UserUpdateInput);
      
      // Update local state with the updated user data from API response
      updateUser(updatedUser);
      
      const u = updatedUser as { formNo?: string; refNo?: string; username?: string; designation?: string };
      setFormData(prev => ({
        ...prev,
        formNo: u.formNo || "",
        refNo: u.refNo || "",
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        username: u.username || "",
        phone: updatedUser.phone || "",
        designation: u.designation || "",
        affiliation: updatedUser.affiliation || "",
        mailingAddress: updatedUser.mailingAddress || "",
        permanentAddress: updatedUser.permanentAddress || "",
        bio: updatedUser.bio || "",
        primaryResearchInterest: updatedUser.primaryResearchInterest || "",
        secondaryResearchInterest: updatedUser.secondaryResearchInterest || "",
        educationQualifications: updatedUser.educationQualifications && updatedUser.educationQualifications.length > 0 
          ? updatedUser.educationQualifications.map(edu => ({
              qualification: edu.qualification || "",
              year: edu.year || "",
              institution: edu.institution || ""
            }))
          : [{ qualification: "", year: "", institution: "" }],
        training: updatedUser.training && updatedUser.training.length > 0
          ? updatedUser.training.map(t => ({
              period: t.period || "",
              institute: t.institute || ""
            }))
          : [{ period: "", institute: "" }],
      }));
      
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('[Profile Save] API call failed:', error);
      const message = error instanceof ApiError 
        ? error.getUserFriendlyMessage()
        : error instanceof Error
        ? error.message
        : "Failed to update profile. Please try again.";
      toast.error(message);
    } finally {
      setUpdateLoading(false);
      setIsSaving(false);
      isSavingRef.current = false;
    }
  };

  // Handlers for education qualifications
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      educationQualifications: [...prev.educationQualifications, { qualification: "", year: "", institution: "" }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      educationQualifications: prev.educationQualifications.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      educationQualifications: prev.educationQualifications.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  // Handlers for training
  const addTraining = () => {
    setFormData(prev => ({
      ...prev,
      training: [...prev.training, { period: "", institute: "" }]
    }));
  };

  const removeTraining = (index: number) => {
    setFormData(prev => ({
      ...prev,
      training: prev.training.filter((_, i) => i !== index)
    }));
  };

  const updateTraining = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      training: prev.training.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      )
    }));
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

  const handleProfilePictureUpload = async (event: ChangeEvent<HTMLInputElement>) => {
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
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative group">
                  <div className="w-48 h-60 rounded-lg overflow-hidden border-4 border-primary/20 bg-slate-100 flex items-center justify-center shadow-lg relative">
                    {user?.profilePictureUrl || user?.avatar ? (
                      <Image
                        src={user.profilePictureUrl || user.avatar || "/images/logo.png"}
                        alt={user?.name || "User"}
                        fill
                        className="object-contain"
                        sizes="192px"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <User className="w-16 h-16 text-slate-400" />
                        <p className="text-xs text-slate-400 text-center px-4">Passport Size Photo</p>
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profile-picture"
                    className={`absolute bottom-2 right-2 bg-primary text-white p-2.5 rounded-lg cursor-pointer shadow-lg hover:bg-primary/90 transition-colors z-10 ${uploadLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {uploadLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5" />
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
              </div>
              <CardTitle className="mt-4">{user?.name || "User"}</CardTitle>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                Active Member
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {(user as { username?: string })?.username && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <AtSign className="h-4 w-4 flex-shrink-0" />
                  <span>@{((user as { username?: string }).username)}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>{user?.email || "user@example.com"}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">{user.phone}</span>
                </div>
              )}
              {user?.mailingAddress && (
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="break-words">{user.mailingAddress}</span>
                </div>
              )}
              {user?.affiliation && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Award className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">{user.affiliation}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : "2020"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Award className="h-4 w-4 flex-shrink-0" />
                <span className="capitalize">{user?.membershipStatus?.replace('_', ' ') || "Professional Member"}</span>
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
                disabled={updateLoading || isSaving}
                type="button"
              >
                {updateLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : isEditing ? (
                  <Save className="h-4 w-4 mr-2" />
                ) : (
                  <Edit className="h-4 w-4 mr-2" />
                )}
                {updateLoading || isSaving ? "Saving..." : isEditing ? "Save" : "Edit"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formNo">Form No</Label>
                  <Input
                    id="formNo"
                    value={formData.formNo}
                    onChange={(e) => handleInputChange("formNo", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Form number (optional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refNo">Reference No</Label>
                  <Input
                    id="refNo"
                    value={formData.refNo}
                    onChange={(e) => handleInputChange("refNo", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Reference number (optional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-1.5">
                    Username
                    <span className="text-xs text-muted-foreground">(min 3 chars, a-z, 0-9, _)</span>
                  </Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => {
                        const v = e.target.value.toLowerCase();
                        handleInputChange("username", v);
                      }}
                      disabled={!isEditing}
                      placeholder="johndoe123"
                      className={`pl-9 pr-10 ${
                        usernameAvailability.available === false ? "border-destructive" : ""
                      }`}
                    />
                    {usernameAvailability.checking && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </span>
                    )}
                    {!usernameAvailability.checking && usernameAvailability.available === true && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                    )}
                    {!usernameAvailability.checking && usernameAvailability.available === false && formData.username && (
                      <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                    )}
                  </div>
                  {usernameAvailability.available === false && formData.username && (
                    <p className="text-xs text-destructive">Username is already taken</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1.5">
                    Email Address
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Changing email will require re-verification. Your account will show as unverified until you verify the new email.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={!isEditing}
                      placeholder="you@example.com"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={!isEditing}
                      placeholder="+880..."
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="designation"
                      value={formData.designation}
                      onChange={(e) => handleInputChange("designation", e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g. Assistant Professor, Consultant"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="affiliation">Institution / Affiliation</Label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="affiliation"
                      value={formData.affiliation}
                      onChange={(e) => handleInputChange("affiliation", e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g. Dhaka Medical College Hospital"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="A brief professional bio about yourself"
                    className="pl-9"
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education Qualifications
                </CardTitle>
                <CardDescription>
                  Your academic background and qualifications.
                </CardDescription>
              </div>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEducation}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.educationQualifications.map((edu, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-gray-50 rounded-lg">
                    <div className="md:col-span-4 space-y-2">
                      <Label>Qualification</Label>
                      <Input
                        value={edu.qualification}
                        onChange={(e) => updateEducation(index, "qualification", e.target.value)}
                        disabled={!isEditing}
                        placeholder="e.g. MBBS"
                      />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <Label>Year</Label>
                      <Input
                        value={edu.year}
                        onChange={(e) => updateEducation(index, "year", e.target.value)}
                        disabled={!isEditing}
                        placeholder="YYYY"
                      />
                    </div>
                    <div className="md:col-span-4 space-y-2">
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, "institution", e.target.value)}
                        disabled={!isEditing}
                        placeholder="Institution name"
                      />
                    </div>
                    {isEditing && (
                      <div className="md:col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEducation(index)}
                          disabled={formData.educationQualifications.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Training */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Professional Training</CardTitle>
                <CardDescription>
                  Your training and professional development experience.
                </CardDescription>
              </div>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTraining}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.training.map((training, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-gray-50 rounded-lg">
                    <div className="md:col-span-5 space-y-2">
                      <Label>Period</Label>
                      <Input
                        value={training.period}
                        onChange={(e) => updateTraining(index, "period", e.target.value)}
                        disabled={!isEditing}
                        placeholder="e.g. 2020-2022"
                      />
                    </div>
                    <div className="md:col-span-6 space-y-2">
                      <Label>Institute</Label>
                      <Input
                        value={training.institute}
                        onChange={(e) => updateTraining(index, "institute", e.target.value)}
                        disabled={!isEditing}
                        placeholder="Institute name"
                      />
                    </div>
                    {isEditing && (
                      <div className="md:col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTraining(index)}
                          disabled={formData.training.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
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
