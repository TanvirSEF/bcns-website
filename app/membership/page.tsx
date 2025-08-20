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
  Award,
  Users,
  BookOpen,
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

const Membership = () => {
  const [formData, setFormData] = useState<MembershipFormData>(
    DEFAULT_MEMBERSHIP_FORM_DATA
  );
  const [validation, setValidation] = useState<FormValidationState>({
    isValid: false,
    errors: {},
    touched: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmissionStatus>("idle");

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

    // Validate form before submission
    const formValidation = validateForm(formData);
    setValidation(formValidation);

    if (!formValidation.isValid) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("submitting");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitStatus("success");

      // Reset form after successful submission
      setFormData(DEFAULT_MEMBERSHIP_FORM_DATA);
      setValidation({
        isValid: false,
        errors: {},
        touched: {},
      });
    } catch {
      setSubmitStatus("error");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-200/30 blur-[60px] transform translate-x-1/2 translate-y-1/2 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-purple-200/20 blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />

      <div className="relative max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600/90 text-white mb-6">
            <Award className="h-4 w-4 mr-2" />
            Join BCNS Community
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Membership Application
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join the leading community of pediatric neurologists in Bangladesh.
            Connect with experts, access exclusive resources, and advance your
            career.
          </p>
        </div>

        {/* Benefits Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Expert Network
              </h3>
              <p className="text-gray-600 text-sm">
                Connect with leading pediatric neurologists
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Exclusive Access
              </h3>
              <p className="text-gray-600 text-sm">
                Access to premium journals and publications
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Special Events
              </h3>
              <p className="text-gray-600 text-sm">
                Priority access to conferences and workshops
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Form Title */}
        <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0 shadow-xl mb-8">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold">
              APPLICATION FORM FOR MEMBERSHIP
            </h2>
            <p className="text-red-100 mt-2">
              Complete all required fields to submit your application
            </p>
          </CardContent>
        </Card>

        {/* Enhanced Main Form */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Form Numbers Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Form Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Form No.
                    </label>
                    <input
                      type="text"
                      name="formNo"
                      value={formData.formNo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="Enter form number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ref. No.
                    </label>
                    <input
                      type="text"
                      name="refNo"
                      value={formData.refNo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="Enter reference number"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                              getFieldError("name") && isFieldTouched("name")
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter your full name"
                          />
                        </div>
                        {getFieldError("name") && isFieldTouched("name") && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {getFieldError("name")}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Affiliation *
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            name="affiliation"
                            value={formData.affiliation}
                            onChange={handleInputChange}
                            required
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                              getFieldError("affiliation") &&
                              isFieldTouched("affiliation")
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Your institution/hospital"
                          />
                        </div>
                        {getFieldError("affiliation") &&
                          isFieldTouched("affiliation") && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {getFieldError("affiliation")}
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                              getFieldError("phone") && isFieldTouched("phone")
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter phone number"
                          />
                        </div>
                        {getFieldError("phone") && isFieldTouched("phone") && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {getFieldError("phone")}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                              getFieldError("email") && isFieldTouched("email")
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter email address"
                          />
                        </div>
                        {getFieldError("email") && isFieldTouched("email") && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {getFieldError("email")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mailing Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <textarea
                          name="mailingAddress"
                          value={formData.mailingAddress}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                            getFieldError("mailingAddress") &&
                            isFieldTouched("mailingAddress")
                              ? "border-red-300 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your mailing address"
                        />
                      </div>
                      {getFieldError("mailingAddress") &&
                        isFieldTouched("mailingAddress") && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {getFieldError("mailingAddress")}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Permanent Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <textarea
                          name="permanentAddress"
                          value={formData.permanentAddress}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                            getFieldError("permanentAddress") &&
                            isFieldTouched("permanentAddress")
                              ? "border-red-300 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your permanent address"
                        />
                      </div>
                      {getFieldError("permanentAddress") &&
                        isFieldTouched("permanentAddress") && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {getFieldError("permanentAddress")}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Enhanced Photo Upload Section */}
                  <div className="lg:col-span-1">
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 bg-white/60 backdrop-blur-sm hover:bg-white/80 ${
                        getFieldError("photo")
                          ? "border-red-300 bg-red-50/80"
                          : "border-gray-300 hover:border-green-400"
                      }`}
                    >
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="h-8 w-8 text-blue-600" />
                      </div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Passport Size Colour Photograph
                      </h5>
                      <p className="text-xs text-gray-500 mb-4">
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
                        className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                      >
                        Choose File
                      </label>
                      {formData.photo && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-xs text-green-700 flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {formData.photo.name}
                          </p>
                        </div>
                      )}
                      {getFieldError("photo") && (
                        <p className="text-xs text-red-600 mt-2 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {getFieldError("photo")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Qualification Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
                  Education Qualification
                </h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/60 backdrop-blur-sm rounded-lg p-4">
                    <div className="font-semibold text-gray-700">
                      Qualification
                    </div>
                    <div className="font-semibold text-gray-700">Year</div>
                    <div className="font-semibold text-gray-700">
                      College/Institution
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white/40 backdrop-blur-sm rounded-lg p-4">
                    <div className="font-medium text-gray-600">MBBS</div>
                    <input
                      type="text"
                      name="mbbsYear"
                      value={formData.mbbsYear}
                      onChange={handleInputChange}
                      className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm ${
                        getFieldError("mbbsYear")
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Year (YYYY)"
                    />
                    <input
                      type="text"
                      name="mbbsInstitution"
                      value={formData.mbbsInstitution}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                      placeholder="Institution"
                    />
                  </div>
                  {getFieldError("mbbsYear") && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Please enter a valid 4-digit year
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white/40 backdrop-blur-sm rounded-lg p-4">
                    <div className="font-medium text-gray-600">FCPS / MD</div>
                    <input
                      type="text"
                      name="fcpsMdYear"
                      value={formData.fcpsMdYear}
                      onChange={handleInputChange}
                      className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm ${
                        getFieldError("fcpsMdYear")
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Year (YYYY)"
                    />
                    <input
                      type="text"
                      name="fcpsMdInstitution"
                      value={formData.fcpsMdInstitution}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                      placeholder="Institution"
                    />
                  </div>
                  {getFieldError("fcpsMdYear") && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Please enter a valid 4-digit year
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white/40 backdrop-blur-sm rounded-lg p-4">
                    <div className="font-medium text-gray-600">MD / FCPS</div>
                    <input
                      type="text"
                      name="mdFcpsYear"
                      value={formData.mdFcpsYear}
                      onChange={handleInputChange}
                      className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm ${
                        getFieldError("mdFcpsYear")
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Year (YYYY)"
                    />
                    <input
                      type="text"
                      name="mdFcpsInstitution"
                      value={formData.mdFcpsInstitution}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                      placeholder="Institution"
                    />
                  </div>
                  {getFieldError("mdFcpsYear") && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Please enter a valid 4-digit year
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white/40 backdrop-blur-sm rounded-lg p-4">
                    <div className="font-medium text-gray-600">
                      Additional Degree
                    </div>
                    <input
                      type="text"
                      name="additionalYear"
                      value={formData.additionalYear}
                      onChange={handleInputChange}
                      className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm ${
                        getFieldError("additionalYear")
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Year (YYYY)"
                    />
                    <input
                      type="text"
                      name="additionalInstitution"
                      value={formData.additionalInstitution}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                      placeholder="Institution"
                    />
                  </div>
                  {getFieldError("additionalYear") && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Please enter a valid 4-digit year
                    </p>
                  )}
                </div>
              </div>

              {/* Training Section */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                  Training
                </h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/60 backdrop-blur-sm rounded-lg p-4">
                    <div className="font-semibold text-gray-700">Sl. No.</div>
                    <div className="font-semibold text-gray-700">Period</div>
                    <div className="font-semibold text-gray-700">Institute</div>
                  </div>

                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white/40 backdrop-blur-sm rounded-lg p-4"
                    >
                      <div className="font-medium text-gray-600">{num}.</div>
                      <input
                        type="text"
                        name={`training${num}Period`}
                        value={
                          formData[
                            `training${num}Period` as keyof MembershipFormData
                          ] as string
                        }
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
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
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                        placeholder="Training institute"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Interests Section */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-teal-600" />
                  Topic Interest (Field of Interest – Research)
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Research Interest 1
                    </label>
                    <textarea
                      name="researchInterest1"
                      value={formData.researchInterest1}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="Describe your primary research interest"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Research Interest 2
                    </label>
                    <textarea
                      name="researchInterest2"
                      value={formData.researchInterest2}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="Describe your secondary research interest (optional)"
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Submit Status Messages */}
              {submitStatus === "success" && (
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
                  <CardContent className="p-6 flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-green-800 mb-2">
                        Application Submitted Successfully!
                      </h5>
                      <p className="text-green-700">
                        Thank you for your membership application. We will
                        review your information and contact you soon with next
                        steps.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {submitStatus === "error" && (
                <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 shadow-lg">
                  <CardContent className="p-6 flex items-start space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-red-800 mb-2">
                        Submission Failed
                      </h5>
                      <p className="text-red-700">
                        {validation.isValid
                          ? "There was an error submitting your application. Please try again or contact us for assistance."
                          : "Please fix the validation errors above before submitting."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Submit Button */}
              <div className="border-t border-gray-200 pt-8">
                <Button
                  type="submit"
                  disabled={isSubmitting || !validation.isValid}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Submit Membership Application</span>
                    </>
                  )}
                </Button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  By submitting this form, you agree to our membership terms and
                  conditions.
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
