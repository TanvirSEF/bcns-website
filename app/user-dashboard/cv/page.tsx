"use client";

import * as React from "react";
import { FileText, Download, Loader2, User, Mail, Phone, MapPin, Building, GraduationCap, Calendar, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { toast } from "react-toastify";

export default function UserCVPage() {
  const { user } = useAuth();
  const [generating, setGenerating] = React.useState(false);

  const handleGenerateCV = async () => {
    try {
      setGenerating(true);
      
      // Get auth token from cookies
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];

      if (!token) {
        toast.error("Please log in to generate your CV");
        return;
      }

      // Fetch CV PDF from API
      const response = await fetch("/api/users/cv", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to generate CV" }));
        throw new Error(errorData.message || "Failed to generate CV");
      }

      // Get PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `BCNS_CV_${user?.name?.replace(/\s+/g, "_") || "Member"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("CV generated and downloaded successfully!");
    } catch (error) {
      console.error("CV generation error:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to generate CV. Please try again later.";
      toast.error(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">My CV</h1>
        <p className="text-gray-700">Generate and download your professional CV based on your registration information.</p>
      </div>

      {/* CV Preview Card */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-emerald-600" />
                Curriculum Vitae
              </CardTitle>
              <CardDescription className="mt-2">
                Your CV will be generated from your profile information
              </CardDescription>
            </div>
            <Button
              onClick={handleGenerateCV}
              disabled={generating}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Generate & Download CV
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Information Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-600" />
                  Personal Information
                </h3>
                <div className="space-y-2 text-sm">
                  {user?.name && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Name:</span>
                      <span>{user.name}</span>
                    </div>
                  )}
                  {user?.email && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Email:</span>
                      <span className="break-all">{user.email}</span>
                    </div>
                  )}
                  {user?.phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Phone:</span>
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user?.mailingAddress && (
                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <span className="font-medium">Address: </span>
                        <span>{user.mailingAddress}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building className="h-5 w-5 text-emerald-600" />
                  Professional Information
                </h3>
                <div className="space-y-2 text-sm">
                  {user?.affiliation && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Affiliation:</span>
                      <span>{user.affiliation}</span>
                    </div>
                  )}
                  {(user as any)?.designation && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Designation:</span>
                      <span>{(user as any).designation}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Education & Training Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Education */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-emerald-600" />
                  Education
                </h3>
                {user?.educationQualifications && user.educationQualifications.length > 0 ? (
                  <div className="space-y-2 text-sm">
                    {user.educationQualifications.map((edu, index) => (
                      <div key={index} className="text-gray-700">
                        <span className="font-medium">{edu.qualification}</span>
                        {edu.year && <span className="text-gray-500"> ({edu.year})</span>}
                        {edu.institution && (
                          <div className="text-gray-600 mt-1 ml-4">{edu.institution}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No education information available</p>
                )}
              </div>

              {/* Training */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Training
                </h3>
                {user?.training && user.training.length > 0 ? (
                  <div className="space-y-2 text-sm">
                    {user.training.map((train, index) => (
                      <div key={index} className="text-gray-700">
                        <span className="font-medium">{train.institute}</span>
                        {train.period && (
                          <div className="text-gray-600 mt-1 ml-4">{train.period}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No training information available</p>
                )}
              </div>
            </div>

            {/* Research Interests */}
            {(user as any)?.primaryResearchInterest || (user as any)?.secondaryResearchInterest ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                  Research Interests
                </h3>
                <div className="space-y-2 text-sm">
                  {(user as any)?.primaryResearchInterest && (
                    <div className="text-gray-700">
                      <span className="font-medium">Primary: </span>
                      <span>{(user as any).primaryResearchInterest}</span>
                    </div>
                  )}
                  {(user as any)?.secondaryResearchInterest && (
                    <div className="text-gray-700">
                      <span className="font-medium">Secondary: </span>
                      <span>{(user as any).secondaryResearchInterest}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> Your CV will be generated as a PDF document containing all the information from your profile. 
                Make sure your profile is up to date before generating your CV.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

