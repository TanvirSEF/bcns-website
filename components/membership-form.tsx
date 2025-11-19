"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OTPInput } from "@/components/ui/otp-input";
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
  Plus,
  Trash2,
  Camera,
  CheckCircle2,
  Loader2,
  Send,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// --- Zod Schema ---

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const educationSchema = z.object({
  qualification: z.string().min(1, "Qualification is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be 4 digits"),
  institution: z.string().min(1, "Institution is required"),
});

const trainingSchema = z.object({
  period: z.string().min(1, "Period is required"),
  institute: z.string().min(1, "Institute is required"),
});

const formSchema = z.object({
  profilePicture: z
    .custom<File>((v) => v instanceof File, "Profile picture is required")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  affiliation: z.string().min(2, "Affiliation is required"),
  formNo: z.string().optional(),
  refNo: z.string().optional(),
  mailingAddress: z.string().min(5, "Mailing address is required"),
  permanentAddress: z.string().min(5, "Permanent address is required"),
  educationQualifications: z.array(educationSchema),
  training: z.array(trainingSchema),
  researchInterest1: z.string().optional(),
  researchInterest2: z.string().optional(),
  otp: z.string().length(6, "OTP must be 6 digits"),
  documents: z
    .array(z.instanceof(File))
    .min(1, "At least one document is required")
    .optional(), // Optional in schema because we handle it specially, but verified in submit
});

type FormValues = z.infer<typeof formSchema>;

export function MembershipForm() {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      affiliation: "",
      mailingAddress: "",
      permanentAddress: "",
      educationQualifications: [
        { qualification: "MBBS", year: "", institution: "" },
      ],
      training: [{ period: "", institute: "" }],
      researchInterest1: "",
      researchInterest2: "",
      otp: "",
    },
  });

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control: form.control,
    name: "educationQualifications",
  });

  const {
    fields: trainingFields,
    append: appendTraining,
    remove: removeTraining,
  } = useFieldArray({
    control: form.control,
    name: "training",
  });

  // --- Handlers ---

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("profilePicture", file, { shouldValidate: true });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setDocumentFiles((prev) => [...prev, ...newFiles]);
      // Update form value for validation if needed, though we handle appending manually
      form.setValue("documents", [...documentFiles, ...newFiles]); 
    }
  };

  const removeDocument = (index: number) => {
    const newFiles = documentFiles.filter((_, i) => i !== index);
    setDocumentFiles(newFiles);
    form.setValue("documents", newFiles);
  };

  const handleSendOTP = async () => {
    const email = form.getValues("email");
    const emailError = form.getFieldState("email").error;

    if (!email || emailError) {
      form.setError("email", {
        type: "manual",
        message: "Please enter a valid email first",
      });
      return;
    }

    setIsSendingOTP(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        toast.success("OTP sent successfully to your email!");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (documentFiles.length === 0) {
      toast.error("Please upload at least one document");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Text Fields
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("password", data.password);
      formData.append("affiliation", data.affiliation);
      if (data.formNo) formData.append("formNo", data.formNo);
      if (data.refNo) formData.append("refNo", data.refNo);
      formData.append("mailingAddress", data.mailingAddress);
      formData.append("permanentAddress", data.permanentAddress);
      if (data.researchInterest1)
        formData.append("researchInterest1", data.researchInterest1);
      if (data.researchInterest2)
        formData.append("researchInterest2", data.researchInterest2);
      formData.append("otp", data.otp);

      // JSON Stringify Arrays
      formData.append(
        "educationQualifications",
        JSON.stringify(data.educationQualifications)
      );
      formData.append("training", JSON.stringify(data.training));

      // Files
      if (data.profilePicture instanceof File) {
        formData.append("profilePicture", data.profilePicture);
      }

      documentFiles.forEach((file) => {
        formData.append("documents", file);
      });

      const response = await fetch("/api/auth/verify-registration", {
        method: "POST",
        body: formData,
        // Do NOT set Content-Type header for FormData
      });

      const result = await response.json();

      if (result.success || response.ok) {
        toast.success("Registration submitted successfully!");
        // Redirect or show success state
        router.push("/login");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent p-8">
        <CardTitle className="text-2xl font-bold text-primary">
          Member Registration
        </CardTitle>
        <CardDescription>
          Join our community of professionals. Please fill out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          
          {/* 1. Profile Picture Section */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-slate-100 flex items-center justify-center shadow-lg">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-slate-400" />
                )}
              </div>
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
              >
                <Camera className="w-5 h-5" />
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </label>
            </div>
            <div className="text-center">
              <Label className="text-lg font-semibold">Profile Picture</Label>
              {form.formState.errors.profilePicture && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.profilePicture.message as string}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Click camera icon to upload. Max 5MB.
              </p>
            </div>
          </div>

          {/* 2. Personal Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-primary">
              <User className="w-5 h-5" /> Personal Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Dr. John Doe"
                    {...form.register("name")}
                    className={`pl-9 ${form.formState.errors.name ? "border-destructive" : ""}`}
                  />
                </div>
                {form.formState.errors.name && (
                  <p className="text-destructive text-xs">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="+880..."
                    {...form.register("phone")}
                    className={`pl-9 ${form.formState.errors.phone ? "border-destructive" : ""}`}
                  />
                </div>
                {form.formState.errors.phone && (
                  <p className="text-destructive text-xs">{form.formState.errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...form.register("email")}
                    className={`pl-9 ${form.formState.errors.email ? "border-destructive" : ""}`}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-destructive text-xs">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    {...form.register("password")}
                    className={`pl-9 ${form.formState.errors.password ? "border-destructive" : ""}`}
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="text-destructive text-xs">{form.formState.errors.password.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* 3. Professional Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-primary">
              <Building className="w-5 h-5" /> Professional Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="affiliation">Affiliation / Hospital</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="affiliation"
                    placeholder="Dhaka Medical College Hospital"
                    {...form.register("affiliation")}
                    className={`pl-9 ${form.formState.errors.affiliation ? "border-destructive" : ""}`}
                  />
                </div>
                {form.formState.errors.affiliation && (
                  <p className="text-destructive text-xs">{form.formState.errors.affiliation.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="formNo">Form No. (Optional)</Label>
                <Input
                  id="formNo"
                  placeholder="12345"
                  {...form.register("formNo")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refNo">Ref No. (Optional)</Label>
                <Input
                  id="refNo"
                  placeholder="REF-001"
                  {...form.register("refNo")}
                />
              </div>
            </div>
          </section>

          {/* 4. Address Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-primary">
              <MapPin className="w-5 h-5" /> Address Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mailingAddress">Mailing Address</Label>
                <Textarea
                  id="mailingAddress"
                  placeholder="Full mailing address..."
                  {...form.register("mailingAddress")}
                  className={form.formState.errors.mailingAddress ? "border-destructive" : ""}
                />
                {form.formState.errors.mailingAddress && (
                  <p className="text-destructive text-xs">{form.formState.errors.mailingAddress.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="permanentAddress">Permanent Address</Label>
                <Textarea
                  id="permanentAddress"
                  placeholder="Permanent home address..."
                  {...form.register("permanentAddress")}
                  className={form.formState.errors.permanentAddress ? "border-destructive" : ""}
                />
                {form.formState.errors.permanentAddress && (
                  <p className="text-destructive text-xs">{form.formState.errors.permanentAddress.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* 5. Education Qualifications (Dynamic Array) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2 text-lg font-semibold text-primary">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" /> Education Qualifications
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendEdu({ qualification: "", year: "", institution: "" })}
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-4">
              {eduFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div className="md:col-span-3 space-y-2">
                    <Label>Qualification</Label>
                    <Input
                      {...form.register(`educationQualifications.${index}.qualification`)}
                      placeholder="e.g. MBBS"
                      className={form.formState.errors.educationQualifications?.[index]?.qualification ? "border-destructive" : ""}
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <Label>Year</Label>
                    <Input
                      {...form.register(`educationQualifications.${index}.year`)}
                      placeholder="YYYY"
                      className={form.formState.errors.educationQualifications?.[index]?.year ? "border-destructive" : ""}
                    />
                  </div>
                  <div className="md:col-span-5 space-y-2">
                    <Label>Institution</Label>
                    <Input
                      {...form.register(`educationQualifications.${index}.institution`)}
                      placeholder="Institution Name"
                      className={form.formState.errors.educationQualifications?.[index]?.institution ? "border-destructive" : ""}
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-center">
                    {eduFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => removeEdu(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Training (Dynamic Array) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2 text-lg font-semibold text-primary">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Professional Training
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendTraining({ period: "", institute: "" })}
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-4">
              {trainingFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div className="md:col-span-5 space-y-2">
                    <Label>Period</Label>
                    <Input
                      {...form.register(`training.${index}.period`)}
                      placeholder="e.g. Jan 2020 - Dec 2021"
                      className={form.formState.errors.training?.[index]?.period ? "border-destructive" : ""}
                    />
                  </div>
                  <div className="md:col-span-6 space-y-2">
                    <Label>Institute</Label>
                    <Input
                      {...form.register(`training.${index}.institute`)}
                      placeholder="Training Institute"
                      className={form.formState.errors.training?.[index]?.institute ? "border-destructive" : ""}
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-center">
                     {trainingFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => removeTraining(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 7. Research Interests */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-primary">
              <FileText className="w-5 h-5" /> Research Interests
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="researchInterest1">Primary Research Interest</Label>
                <Textarea
                  id="researchInterest1"
                  {...form.register("researchInterest1")}
                  placeholder="Describe your primary research interests..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="researchInterest2">Secondary Research Interest (Optional)</Label>
                <Textarea
                  id="researchInterest2"
                  {...form.register("researchInterest2")}
                  placeholder="Describe your secondary research interests..."
                />
              </div>
            </div>
          </section>

          {/* 8. OTP Verification */}
          <section className="space-y-6 bg-slate-50 dark:bg-slate-900/30 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-primary">
              <CheckCircle2 className="w-5 h-5" /> Verification
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please verify your email address to continue. Click &quot;Send OTP&quot; to receive a code.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                 <div className="flex-1 space-y-2 w-full">
                  <Label>Enter OTP Code</Label>
                  <Controller
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <OTPInput
                        value={field.value}
                        onChange={field.onChange}
                        length={6}
                        className="justify-start"
                        disabled={!otpSent}
                      />
                    )}
                  />
                  {form.formState.errors.otp && (
                    <p className="text-destructive text-xs">{form.formState.errors.otp.message}</p>
                  )}
                </div>
                
                <Button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isSendingOTP || otpSent}
                  className="min-w-[120px]"
                >
                  {isSendingOTP ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : otpSent ? (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isSendingOTP ? "Sending..." : otpSent ? "Sent!" : "Send OTP"}
                </Button>
              </div>
              {otpSent && (
                <p className="text-sm text-green-600 flex items-center mt-2">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> OTP sent to {form.getValues("email")}
                </p>
              )}
            </div>
          </section>

          {/* 9. Documents Upload */}
          <section className="space-y-6">
             <div className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-primary">
              <Upload className="w-5 h-5" /> Required Documents
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer relative">
                 <input
                  type="file"
                  multiple
                  onChange={handleDocumentsChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Click to upload documents</h4>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Upload scanned copies of your degrees, certificates, and other relevant documents. (PDF, JPG, PNG)
                  </p>
                </div>
              </div>

              {documentFiles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {documentFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(0)}kb)</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => removeDocument(idx)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full py-6 text-lg font-bold shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Submitting Application...
                </>
              ) : (
                "Submit Registration"
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              By clicking Submit, you agree to our Terms and Conditions and Privacy Policy.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
