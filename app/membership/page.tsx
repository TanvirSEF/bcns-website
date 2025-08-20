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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-blue-200/25 blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-200/25 blur-[60px] transform translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 text-white p-3 rounded-lg mr-4">
              <Building className="h-8 w-8" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                বাংলাদেশ চাইল্ড নিউরোলজি সোসাইটি (বিসিএনএস)
              </h1>
              <h2 className="text-xl font-semibold text-gray-700">
                Bangladesh Child Neurology Society (BCNS)
              </h2>
            </div>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              যোগাযোগ: রুম নং-৭০৩, ব্লক-এফ, ৭ম তলা, ইপনা, বিএমইউ, শাহবাগ, ঢাকা
            </p>
            <p>
              Contact: Room No-703, Block-F, 7th Floor, IPNA, BMU, Shahbag,
              Dhaka
            </p>
            <div className="flex justify-center space-x-6 mt-2">
              <span>Website: www.bcns.org.bd</span>
              <span>E-mail: office@bcns.org.bd</span>
            </div>
          </div>
        </div>

        {/* Form Title */}
        <div className="bg-red-600 text-white text-center py-3 rounded-lg mb-8">
          <h3 className="text-xl font-bold">APPLICATION FORM FOR MEMBERSHIP</h3>
        </div>

        {/* Main Form */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form Numbers */}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter reference number"
                  />
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="border-t pt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Personal Information
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                              getFieldError("name") && isFieldTouched("name")
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter your full name"
                          />
                        </div>
                        {getFieldError("name") && isFieldTouched("name") && (
                          <p className="text-red-500 text-sm mt-1">
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
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
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
                            <p className="text-red-500 text-sm mt-1">
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
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                              getFieldError("phone") && isFieldTouched("phone")
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter phone number"
                          />
                        </div>
                        {getFieldError("phone") && isFieldTouched("phone") && (
                          <p className="text-red-500 text-sm mt-1">
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
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                              getFieldError("email") && isFieldTouched("email")
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter email address"
                          />
                        </div>
                        {getFieldError("email") && isFieldTouched("email") && (
                          <p className="text-red-500 text-sm mt-1">
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
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
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
                          <p className="text-red-500 text-sm mt-1">
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
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
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
                          <p className="text-red-500 text-sm mt-1">
                            {getFieldError("permanentAddress")}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Photo Upload Section */}
                  <div className="lg:col-span-1">
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                        getFieldError("photo")
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                        className="cursor-pointer bg-blue-50 text-blue-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
                      >
                        Choose File
                      </label>
                      {formData.photo && (
                        <p className="text-xs text-green-600 mt-2">
                          ✓ {formData.photo.name}
                        </p>
                      )}
                      {getFieldError("photo") && (
                        <p className="text-xs text-red-600 mt-2">
                          {getFieldError("photo")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Qualification Section */}
              <div className="border-t pt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                  Education Qualification
                </h4>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="font-medium text-gray-700">
                      Qualification
                    </div>
                    <div className="font-medium text-gray-700">Year</div>
                    <div className="font-medium text-gray-700">
                      College/Institution
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="font-medium text-gray-600">MBBS</div>
                    <input
                      type="text"
                      name="mbbsYear"
                      value={formData.mbbsYear}
                      onChange={handleInputChange}
                      className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Institution"
                    />
                  </div>
                  {getFieldError("mbbsYear") && (
                    <p className="text-red-500 text-sm">
                      Please enter a valid 4-digit year
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="font-medium text-gray-600">FCPS / MD</div>
                    <input
                      type="text"
                      name="fcpsMdYear"
                      value={formData.fcpsMdYear}
                      onChange={handleInputChange}
                      className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Institution"
                    />
                  </div>
                  {getFieldError("fcpsMdYear") && (
                    <p className="text-red-500 text-sm">
                      Please enter a valid 4-digit year
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="font-medium text-gray-600">MD / FCPS</div>
                    <input
                      type="text"
                      name="mdFcpsYear"
                      value={formData.mdFcpsYear}
                      onChange={handleInputChange}
                      className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Institution"
                    />
                  </div>
                  {getFieldError("mdFcpsYear") && (
                    <p className="text-red-500 text-sm">
                      Please enter a valid 4-digit year
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="font-medium text-gray-600">
                      Additional Degree
                    </div>
                    <input
                      type="text"
                      name="additionalYear"
                      value={formData.additionalYear}
                      onChange={handleInputChange}
                      className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Institution"
                    />
                  </div>
                  {getFieldError("additionalYear") && (
                    <p className="text-red-500 text-sm">
                      Please enter a valid 4-digit year
                    </p>
                  )}
                </div>
              </div>

              {/* Training Section */}
              <div className="border-t pt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Training
                </h4>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="font-medium text-gray-700">Sl. No.</div>
                    <div className="font-medium text-gray-700">Period</div>
                    <div className="font-medium text-gray-700">Institute</div>
                  </div>

                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
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
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Training institute"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Interests Section */}
              <div className="border-t pt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Topic Interest (Field of Interest – Research)
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Research Interest 1
                    </label>
                    <textarea
                      name="researchInterest1"
                      value={formData.researchInterest1}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Describe your secondary research interest (optional)"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Status Messages */}
              {submitStatus === "success" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="text-sm font-medium text-green-800">
                      Application Submitted Successfully!
                    </h5>
                    <p className="text-sm text-green-700 mt-1">
                      Thank you for your membership application. We will review
                      your information and contact you soon.
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="text-sm font-medium text-red-800">
                      Submission Failed
                    </h5>
                    <p className="text-sm text-red-700 mt-1">
                      {validation.isValid
                        ? "There was an error submitting your application. Please try again or contact us for assistance."
                        : "Please fix the validation errors above before submitting."}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="border-t pt-8">
                <Button
                  type="submit"
                  disabled={isSubmitting || !validation.isValid}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Membership Application</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Membership;
