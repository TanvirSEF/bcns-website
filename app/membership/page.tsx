"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  Calendar,
  FileText,
  Upload,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  MembershipFormData,
  SubmissionStatus,
  FormValidationState,
  DEFAULT_MEMBERSHIP_FORM_DATA,
  MEMBERSHIP_FILE_CONFIG,
  validateForm,
  validateFile,
} from "@/types/membership";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

const Membership = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<MembershipFormData>(
    DEFAULT_MEMBERSHIP_FORM_DATA
  );
  const [validation, setValidation] = useState<FormValidationState>({
    isValid: false,
    errors: {},
    touched: {},
  });
  const [formError, setFormError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmissionStatus>("idle");

  // Simple data transformation - just organize the form data for backend
  const createUserData = (data: MembershipFormData) => ({
    // Basic info
    name: data.name,
    email: data.email,
    password: data.password,
    phone: data.phone,
    affiliation: data.affiliation,
    mailingAddress: data.mailingAddress,
    permanentAddress: data.permanentAddress,
    
    // Education (structured)
    educationQualifications: [
      data.mbbsYear && { qualification: "MBBS", year: data.mbbsYear, institution: data.mbbsInstitution },
      data.fcpsMdYear && { qualification: "FCPS/MD", year: data.fcpsMdYear, institution: data.fcpsMdInstitution },
      data.mdFcpsYear && { qualification: "MD/FCPS", year: data.mdFcpsYear, institution: data.mdFcpsInstitution },
      data.additionalYear && { qualification: data.additionalDegree || "Additional", year: data.additionalYear, institution: data.additionalInstitution }
    ].filter(Boolean),
    
    // Training (structured)
    training: [
      data.training1Period && { period: data.training1Period, institute: data.training1Institute },
      data.training2Period && { period: data.training2Period, institute: data.training2Institute },
      data.training3Period && { period: data.training3Period, institute: data.training3Institute }
    ].filter(Boolean),
    
    // Research interests
    primaryResearchInterest: data.researchInterest1,
    secondaryResearchInterest: data.researchInterest2,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update validation on input change
    const updatedData = { ...formData, [name]: value };
    const newValidation = validateForm(updatedData);
    setValidation(newValidation);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, photo: file }));

    // Validate file if selected
    if (file) {
      const fileValidation = validateFile(file, MEMBERSHIP_FILE_CONFIG);
      if (!fileValidation.isValid) {
        setValidation((prev) => ({
          ...prev,
          errors: { ...prev.errors, photo: fileValidation.error! },
        }));
      } else {
        setValidation((prev) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { photo, ...otherErrors } = prev.errors;
          return { ...prev, errors: otherErrors };
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const formValidation = validateForm(formData);
    setValidation(formValidation);

    if (!formValidation.isValid) {
      setSubmitStatus("error");
      setFormError(`Please fix the validation errors: ${Object.values(formValidation.errors).join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("submitting");
    setFormError("");

    try {
      // Create user data from form
      const userData = createUserData(formData);
      
      // Register the user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      
      if (result.success) {
        // If there's a profile picture, upload it
        if (formData.photo) {
          try {
            // Login to get token for profile picture upload
            const loginResponse = await api.login(formData.email, formData.password);
            if (loginResponse.success && loginResponse.data.token) {
              localStorage.setItem("auth_token", loginResponse.data.token);
              await api.uploadProfileImage(formData.photo);
              localStorage.removeItem("auth_token");
            }
          } catch (error) {
            console.warn("Profile picture upload failed:", error);
          }
        }
        
        setSubmitStatus("success");
        
        // Reset form
        setFormData(DEFAULT_MEMBERSHIP_FORM_DATA);
        setValidation({ isValid: false, errors: {}, touched: {} });
        setFormError("");

        // Redirect to login page
        setTimeout(() => {
          router.push('/login?message=registration-success');
        }, 3000);
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setSubmitStatus("error");
      
      // More detailed error message
      let errorMessage = "Registration failed. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (
    fieldName: keyof MembershipFormData
  ): string | undefined => {
    return validation.errors[fieldName];
  };

  const isFieldTouched = (fieldName: keyof MembershipFormData): boolean => {
    return validation.touched[fieldName] || false;
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Form Title */}
        <Card className="bg-primary text-primary-foreground border-0 shadow-lg mb-8">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              MEMBERSHIP APPLICATION FORM
            </h1>
            <p className="text-primary-foreground/80">
              Complete all required fields to submit your application
            </p>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card className="bg-card border shadow-lg">
          <CardContent className="p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background ${
                              getFieldError("name") && isFieldTouched("name")
                                ? "border-destructive focus:ring-destructive"
                                : "border-border"
                            }`}
                            placeholder="Enter your full name"
                          />
                        </div>
                        {getFieldError("name") && isFieldTouched("name") && (
                          <p className="text-destructive text-sm mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {getFieldError("name")}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Affiliation *
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            name="affiliation"
                            value={formData.affiliation}
                            onChange={handleInputChange}
                            required
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background ${
                              getFieldError("affiliation") &&
                              isFieldTouched("affiliation")
                                ? "border-destructive focus:ring-destructive"
                                : "border-border"
                            }`}
                            placeholder="Your institution/hospital"
                          />
                        </div>
                        {getFieldError("affiliation") &&
                          isFieldTouched("affiliation") && (
                            <p className="text-destructive text-sm mt-1 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {getFieldError("affiliation")}
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background ${
                              getFieldError("phone") && isFieldTouched("phone")
                                ? "border-destructive focus:ring-destructive"
                                : "border-border"
                            }`}
                            placeholder="Enter phone number"
                          />
                        </div>
                        {getFieldError("phone") && isFieldTouched("phone") && (
                          <p className="text-destructive text-sm mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {getFieldError("phone")}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background ${
                              getFieldError("email") && isFieldTouched("email")
                                ? "border-destructive focus:ring-destructive"
                                : "border-border"
                            }`}
                            placeholder="Enter email address"
                          />
                        </div>
                        {getFieldError("email") && isFieldTouched("email") && (
                          <p className="text-destructive text-sm mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {getFieldError("email")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background ${
                            getFieldError("password") && isFieldTouched("password")
                              ? "border-destructive focus:ring-destructive"
                              : "border-border"
                          }`}
                          placeholder="Create a password (min 6 characters)"
                        />
                      </div>
                      {getFieldError("password") && isFieldTouched("password") && (
                        <p className="text-destructive text-sm mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {getFieldError("password")}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Mailing Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <textarea
                          name="mailingAddress"
                          value={formData.mailingAddress}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background ${
                            getFieldError("mailingAddress") &&
                            isFieldTouched("mailingAddress")
                              ? "border-destructive focus:ring-destructive"
                              : "border-border"
                          }`}
                          placeholder="Enter your mailing address"
                        />
                      </div>
                      {getFieldError("mailingAddress") &&
                        isFieldTouched("mailingAddress") && (
                          <p className="text-destructive text-sm mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {getFieldError("mailingAddress")}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Permanent Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <textarea
                          name="permanentAddress"
                          value={formData.permanentAddress}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background ${
                            getFieldError("permanentAddress") &&
                            isFieldTouched("permanentAddress")
                              ? "border-destructive focus:ring-destructive"
                              : "border-border"
                          }`}
                          placeholder="Enter your permanent address"
                        />
                      </div>
                      {getFieldError("permanentAddress") &&
                        isFieldTouched("permanentAddress") && (
                          <p className="text-destructive text-sm mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {getFieldError("permanentAddress")}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Photo Upload Section */}
                  <div className="lg:col-span-1">
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-300 bg-background hover:bg-muted/50 ${
                        getFieldError("photo")
                          ? "border-destructive bg-destructive/10"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h5 className="text-sm font-medium text-foreground mb-2">
                        Passport Size Photo
                      </h5>
                      <p className="text-xs text-muted-foreground mb-3">
                        Upload a recent passport size photo (Max: 5MB)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all duration-200"
                      >
                        Choose File
                      </label>
                      {formData.photo && (
                        <div className="mt-3 p-2 bg-muted rounded border">
                          <p className="text-xs text-foreground flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {formData.photo.name}
                          </p>
                        </div>
                      )}
                      {getFieldError("photo") && (
                        <p className="text-xs text-destructive mt-2 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {getFieldError("photo")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Qualification Section */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                    <GraduationCap className="h-4 w-4 text-primary-foreground" />
                  </div>
                  Education Qualification
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-background rounded-lg p-3">
                    <div className="font-semibold text-foreground">Qualification</div>
                    <div className="font-semibold text-foreground">Year</div>
                    <div className="font-semibold text-foreground">College/Institution</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-background rounded-lg p-3">
                    <div className="font-medium text-muted-foreground">MBBS</div>
                    <input
                      type="text"
                      name="mbbsYear"
                      value={formData.mbbsYear}
                      onChange={handleInputChange}
                      className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background ${
                        getFieldError("mbbsYear")
                          ? "border-destructive"
                          : "border-border"
                      }`}
                      placeholder="Year (YYYY)"
                    />
                    <input
                      type="text"
                      name="mbbsInstitution"
                      value={formData.mbbsInstitution}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                      placeholder="Institution"
                    />
                  </div>
                  {getFieldError("mbbsYear") && (
                    <p className="text-destructive text-sm flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Please enter a valid 4-digit year
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-background rounded-lg p-3">
                    <div className="font-medium text-muted-foreground">FCPS / MD</div>
                    <input
                      type="text"
                      name="fcpsMdYear"
                      value={formData.fcpsMdYear}
                      onChange={handleInputChange}
                      className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background ${
                        getFieldError("fcpsMdYear")
                          ? "border-destructive"
                          : "border-border"
                      }`}
                      placeholder="Year (YYYY)"
                    />
                    <input
                      type="text"
                      name="fcpsMdInstitution"
                      value={formData.fcpsMdInstitution}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                      placeholder="Institution"
                    />
                  </div>
                  {getFieldError("fcpsMdYear") && (
                    <p className="text-destructive text-sm flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Please enter a valid 4-digit year
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-background rounded-lg p-3">
                    <div className="font-medium text-muted-foreground">MD / FCPS</div>
                    <input
                      type="text"
                      name="mdFcpsYear"
                      value={formData.mdFcpsYear}
                      onChange={handleInputChange}
                      className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background ${
                        getFieldError("mdFcpsYear")
                          ? "border-destructive"
                          : "border-border"
                      }`}
                      placeholder="Year (YYYY)"
                    />
                    <input
                      type="text"
                      name="mdFcpsInstitution"
                      value={formData.mdFcpsInstitution}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                      placeholder="Institution"
                    />
                  </div>
                  {getFieldError("mdFcpsYear") && (
                    <p className="text-destructive text-sm flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Please enter a valid 4-digit year
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-background rounded-lg p-3">
                    <div className="font-medium text-muted-foreground">Additional Degree</div>
                    <input
                      type="text"
                      name="additionalYear"
                      value={formData.additionalYear}
                      onChange={handleInputChange}
                      className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background ${
                        getFieldError("additionalYear")
                          ? "border-destructive"
                          : "border-border"
                      }`}
                      placeholder="Year (YYYY)"
                    />
                    <input
                      type="text"
                      name="additionalInstitution"
                      value={formData.additionalInstitution}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                      placeholder="Institution"
                    />
                  </div>
                  {getFieldError("additionalYear") && (
                    <p className="text-destructive text-sm flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Please enter a valid 4-digit year
                    </p>
                  )}
                </div>
              </div>

              {/* Training Section */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="h-4 w-4 text-primary-foreground" />
                  </div>
                  Training
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-background rounded-lg p-3">
                    <div className="font-semibold text-foreground">Sl. No.</div>
                    <div className="font-semibold text-foreground">Period</div>
                    <div className="font-semibold text-foreground">Institute</div>
                  </div>

                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-background rounded-lg p-3"
                    >
                      <div className="font-medium text-muted-foreground">{num}.</div>
                      <input
                        type="text"
                        name={`training${num}Period`}
                        value={
                          formData[
                            `training${num}Period` as keyof MembershipFormData
                          ] as string
                        }
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                        placeholder="Training period"
                      />
                      <input
                        type="text"
                        name={`training${num}Institute`}
                        value={
                          formData[
                            `training${num}Institute` as keyof MembershipFormData
                          ] as string
                        }
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                        placeholder="Training institute"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Interests Section */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                    <FileText className="h-4 w-4 text-primary-foreground" />
                  </div>
                  Topic Interest (Field of Interest – Research)
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Research Interest 1
                    </label>
                    <textarea
                      name="researchInterest1"
                      value={formData.researchInterest1}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background"
                      placeholder="Describe your primary research interest"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Research Interest 2
                    </label>
                    <textarea
                      name="researchInterest2"
                      value={formData.researchInterest2}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background"
                      placeholder="Describe your secondary research interest (optional)"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Status Messages */}
              {submitStatus === "success" && (
                <Card className="bg-muted/50 border border-green-200">
                  <CardContent className="p-4 flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h5 className="text-base font-semibold text-foreground mb-1">
                        Account Created Successfully!
                      </h5>
                      <p className="text-muted-foreground text-sm mb-2">
                        Your membership account has been created. You can now login with:
                      </p>
                      <div className="bg-green-50 p-2 rounded text-sm">
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Password:</strong> Your chosen password</p>
                      </div>
                      <p className="text-muted-foreground text-xs mt-2">
                        Redirecting to login page...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {submitStatus === "error" && (
                <Card className="bg-muted/50 border border-destructive/20">
                  <CardContent className="p-4 flex items-start space-x-3">
                    <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    </div>
                    <div>
                      <h5 className="text-base font-semibold text-foreground mb-1">
                        Submission Failed
                      </h5>
                      <p className="text-muted-foreground text-sm">
                        {formError 
                          ? formError
                          : validation.isValid
                          ? "There was an error submitting your application. Please try again."
                          : "Please fix the validation errors above before submitting."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              <div className="border-t border-border pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || !validation.isValid}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Submit Membership Application</span>
                    </>
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  By submitting this form, you agree to our membership terms and conditions.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Membership;
