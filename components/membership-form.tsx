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
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  MembershipFormData,
  SubmissionStatus,
  FormValidationState,
  DEFAULT_MEMBERSHIP_FORM_DATA,
  validateForm,
} from "@/types/membership";
import { useRouter } from "next/navigation";

export function MembershipForm() {
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

  // Simple data transformation - organize the form data for backend API
  const createUserData = (data: MembershipFormData) => {
    // Ensure we have at least one education qualification
    const educationQualifications = [
      data.mbbsYear && { qualification: "MBBS", year: data.mbbsYear, institution: data.mbbsInstitution || "Not specified" },
      data.fcpsMdYear && { qualification: "FCPS/MD", year: data.fcpsMdYear, institution: data.fcpsMdInstitution || "Not specified" },
      data.mdFcpsYear && { qualification: "MD/FCPS", year: data.mdFcpsYear, institution: data.mdFcpsInstitution || "Not specified" },
      data.additionalYear && { qualification: data.additionalDegree || "Additional", year: data.additionalYear, institution: data.additionalInstitution || "Not specified" }
    ].filter(Boolean);

    // Ensure we have at least one training entry
    const training = [
      data.training1Period && { period: data.training1Period, institute: data.training1Institute || "Not specified" },
      data.training2Period && { period: data.training2Period, institute: data.training2Institute || "Not specified" },
      data.training3Period && { period: data.training3Period, institute: data.training3Institute || "Not specified" }
    ].filter(Boolean);

    return {
      // Basic info - all required fields
      name: data.name || "",
      email: data.email || "",
      password: data.password || "",
      phone: data.phone || "",
      affiliation: data.affiliation || "",
      mailingAddress: data.mailingAddress || "",
      permanentAddress: data.permanentAddress || "",
      
      // Education (structured) - ensure at least empty array
      educationQualifications: educationQualifications.length > 0 ? educationQualifications : [
        { qualification: "MBBS", year: "Not specified", institution: "Not specified" }
      ],
      
      // Training (structured) - ensure at least empty array  
      training: training.length > 0 ? training : [
        { period: "Not specified", institute: "Not specified" }
      ],
      
      // Research interests - required field
      primaryResearchInterest: data.researchInterest1 || "General pediatric neurology",
      secondaryResearchInterest: data.researchInterest2 || "",
    };
  };

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
      // Register the user
      const userData = createUserData(formData);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      
      if (result.success) {
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
    } catch (error: unknown) {
      setSubmitStatus("error");
      
      // More detailed error message
      let errorMessage = "Registration failed. Please try again.";
      if (error instanceof Error && error.message) {
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
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
      <CardContent className="p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-xl p-6 lg:p-8 border border-primary/20">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-4">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
                <p className="text-sm text-muted-foreground">Tell us about yourself</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background/50 backdrop-blur-sm ${
                        getFieldError("name") && isFieldTouched("name")
                          ? "border-destructive focus:ring-destructive"
                          : "border-border hover:border-primary/50"
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
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background/50 backdrop-blur-sm ${
                        getFieldError("email") && isFieldTouched("email")
                          ? "border-destructive focus:ring-destructive"
                          : "border-border hover:border-primary/50"
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

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background/50 backdrop-blur-sm ${
                        getFieldError("phone") && isFieldTouched("phone")
                          ? "border-destructive focus:ring-destructive"
                          : "border-border hover:border-primary/50"
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
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Institution/Affiliation *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="affiliation"
                      value={formData.affiliation}
                      onChange={handleInputChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background/50 backdrop-blur-sm ${
                        getFieldError("affiliation") && isFieldTouched("affiliation")
                          ? "border-destructive focus:ring-destructive"
                          : "border-border hover:border-primary/50"
                      }`}
                      placeholder="Your institution/hospital"
                    />
                  </div>
                  {getFieldError("affiliation") && isFieldTouched("affiliation") && (
                    <p className="text-destructive text-sm mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {getFieldError("affiliation")}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background/50 backdrop-blur-sm ${
                      getFieldError("password") && isFieldTouched("password")
                        ? "border-destructive focus:ring-destructive"
                        : "border-border hover:border-primary/50"
                    }`}
                    placeholder="Create a password (min 6 characters)"
                  />
                  {getFieldError("password") && isFieldTouched("password") && (
                    <p className="text-destructive text-sm mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {getFieldError("password")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background/50 backdrop-blur-sm ${
                      getFieldError("mailingAddress") && isFieldTouched("mailingAddress")
                        ? "border-destructive focus:ring-destructive"
                        : "border-border hover:border-primary/50"
                    }`}
                    placeholder="Enter your mailing address"
                  />
                </div>
                {getFieldError("mailingAddress") && isFieldTouched("mailingAddress") && (
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-background/50 backdrop-blur-sm ${
                      getFieldError("permanentAddress") && isFieldTouched("permanentAddress")
                        ? "border-destructive focus:ring-destructive"
                        : "border-border hover:border-primary/50"
                    }`}
                    placeholder="Enter your permanent address"
                  />
                </div>
                {getFieldError("permanentAddress") && isFieldTouched("permanentAddress") && (
                  <p className="text-destructive text-sm mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {getFieldError("permanentAddress")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Education Qualification Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 lg:p-8 border border-blue-200/50 dark:border-blue-800/30">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Education Qualifications</h3>
                <p className="text-sm text-muted-foreground">Your academic background</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/50 dark:bg-slate-700/50 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
                <div className="font-semibold text-foreground">Qualification</div>
                <div className="font-semibold text-foreground">Year</div>
                <div className="font-semibold text-foreground">Institution</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white/50 dark:bg-slate-700/50 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
                <div className="font-medium text-blue-600 dark:text-blue-400">MBBS</div>
                <input
                  type="text"
                  name="mbbsYear"
                  value={formData.mbbsYear}
                  onChange={handleInputChange}
                  className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background/50 backdrop-blur-sm ${
                    getFieldError("mbbsYear")
                      ? "border-destructive"
                      : "border-border hover:border-blue-300"
                  }`}
                  placeholder="YYYY"
                />
                <input
                  type="text"
                  name="mbbsInstitution"
                  value={formData.mbbsInstitution}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background/50 backdrop-blur-sm hover:border-blue-300"
                  placeholder="Institution name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white/50 dark:bg-slate-700/50 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
                <div className="font-medium text-blue-600 dark:text-blue-400">FCPS / MD</div>
                <input
                  type="text"
                  name="fcpsMdYear"
                  value={formData.fcpsMdYear}
                  onChange={handleInputChange}
                  className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background/50 backdrop-blur-sm ${
                    getFieldError("fcpsMdYear")
                      ? "border-destructive"
                      : "border-border hover:border-blue-300"
                  }`}
                  placeholder="YYYY"
                />
                <input
                  type="text"
                  name="fcpsMdInstitution"
                  value={formData.fcpsMdInstitution}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background/50 backdrop-blur-sm hover:border-blue-300"
                  placeholder="Institution name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white/50 dark:bg-slate-700/50 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
                <div className="font-medium text-blue-600 dark:text-blue-400">MD / FCPS</div>
                <input
                  type="text"
                  name="mdFcpsYear"
                  value={formData.mdFcpsYear}
                  onChange={handleInputChange}
                  className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background/50 backdrop-blur-sm ${
                    getFieldError("mdFcpsYear")
                      ? "border-destructive"
                      : "border-border hover:border-blue-300"
                  }`}
                  placeholder="YYYY"
                />
                <input
                  type="text"
                  name="mdFcpsInstitution"
                  value={formData.mdFcpsInstitution}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background/50 backdrop-blur-sm hover:border-blue-300"
                  placeholder="Institution name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white/50 dark:bg-slate-700/50 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
                <div className="font-medium text-blue-600 dark:text-blue-400">Additional Degree</div>
                <input
                  type="text"
                  name="additionalYear"
                  value={formData.additionalYear}
                  onChange={handleInputChange}
                  className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background/50 backdrop-blur-sm ${
                    getFieldError("additionalYear")
                      ? "border-destructive"
                      : "border-border hover:border-blue-300"
                  }`}
                  placeholder="YYYY"
                />
                <input
                  type="text"
                  name="additionalInstitution"
                  value={formData.additionalInstitution}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background/50 backdrop-blur-sm hover:border-blue-300"
                  placeholder="Institution name"
                />
              </div>
            </div>
          </div>

          {/* Training Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6 lg:p-8 border border-green-200/50 dark:border-green-800/30">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Professional Training</h3>
                <p className="text-sm text-muted-foreground">Your training experience</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/50 dark:bg-slate-700/50 rounded-lg p-4 border border-green-100 dark:border-green-800/30">
                <div className="font-semibold text-foreground">Training #</div>
                <div className="font-semibold text-foreground">Period</div>
                <div className="font-semibold text-foreground">Institute</div>
              </div>

              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white/50 dark:bg-slate-700/50 rounded-lg p-4 border border-green-100 dark:border-green-800/30"
                >
                  <div className="font-medium text-green-600 dark:text-green-400">{num}.</div>
                  <input
                    type="text"
                    name={`training${num}Period`}
                    value={
                      formData[
                        `training${num}Period` as keyof MembershipFormData
                      ] as string
                    }
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background/50 backdrop-blur-sm hover:border-green-300"
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
                    className="px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background/50 backdrop-blur-sm hover:border-green-300"
                    placeholder="Training institute"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Research Interests Section */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-xl p-6 lg:p-8 border border-purple-200/50 dark:border-purple-800/30">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Research Interests</h3>
                <p className="text-sm text-muted-foreground">Your areas of research focus</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Primary Research Interest
                </label>
                <textarea
                  name="researchInterest1"
                  value={formData.researchInterest1}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-background/50 backdrop-blur-sm hover:border-purple-300"
                  placeholder="Describe your primary research interest"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Secondary Research Interest
                </label>
                <textarea
                  name="researchInterest2"
                  value={formData.researchInterest2}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-background/50 backdrop-blur-sm hover:border-purple-300"
                  placeholder="Describe your secondary research interest (optional)"
                />
              </div>
            </div>
          </div>

          {/* Submit Status Messages */}
          {submitStatus === "success" && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800/30">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h5 className="text-lg font-semibold text-foreground mb-2">
                    Account Created Successfully! 🎉
                  </h5>
                  <p className="text-muted-foreground mb-3">
                    Your membership account has been created. You can now login with your credentials.
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-sm">
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Password:</strong> Your chosen password</p>
                  </div>
                  <p className="text-muted-foreground text-sm mt-3">
                    Redirecting to login page...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {submitStatus === "error" && (
            <Card className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border border-red-200 dark:border-red-800/30">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h5 className="text-lg font-semibold text-foreground mb-2">
                    Submission Failed
                  </h5>
                  <p className="text-muted-foreground">
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
          <div className="border-t border-border pt-8">
            <Button
              type="submit"
              disabled={isSubmitting || !validation.isValid}
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary disabled:from-muted disabled:to-muted disabled:text-muted-foreground text-primary-foreground py-4 px-8 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                  <span>Creating Your Account...</span>
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
  );
}
