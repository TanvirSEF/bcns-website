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
  ArrowRight,
  ArrowLeft,
  CreditCard,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// --- Zod Schemas (Split for multi-step workflow) ---

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const educationSchema = z.object({
  qualification: z.string().min(1, "Qualification is required"),
  year: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || val === "" || /^\d{4}$/.test(val), {
      message: "Year must be 4 digits",
    }),
  institution: z.string().min(1, "Institution is required"),
});

const trainingSchema = z.object({
  period: z.string().optional().or(z.literal("")),
  institute: z.string().optional().or(z.literal("")),
});

// Step 1: Registration form schema (without OTP)
// Note: profilePicture, documents, and some fields are optional initially
// but will be validated in the submit handler to provide better UX
const registrationSchema = z.object({
  profilePicture: z
    .custom<File | undefined>((v) => !v || v instanceof File, {
      message: "Profile picture is required",
    })
    .optional(),
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
  documents: z.array(z.instanceof(File)).optional(),
});

// Step 2: OTP verification schema
const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

type Step = 1 | 2 | 3 | 4;

export function MembershipForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationFormValues | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Main form for registration data
  const registrationForm = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
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
      documents: [],
    },
  });

  // Separate form for OTP
  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control: registrationForm.control,
    name: "educationQualifications",
  });

  const {
    fields: trainingFields,
    append: appendTraining,
    remove: removeTraining,
  } = useFieldArray({
    control: registrationForm.control,
    name: "training",
  });

  // --- Handlers ---

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      registrationForm.setValue("profilePicture", file, { shouldValidate: true });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...documentFiles, ...newFiles];
      setDocumentFiles(updatedFiles);
      registrationForm.setValue("documents", updatedFiles, { shouldValidate: true });
    }
  };

  const removeDocument = (index: number) => {
    const newFiles = documentFiles.filter((_, i) => i !== index);
    setDocumentFiles(newFiles);
    registrationForm.setValue("documents", newFiles, { shouldValidate: true });
  };

  // Step 1: Handle registration form submission
  const onRegistrationSubmit = async (data: RegistrationFormValues) => {
    // Validate required fields that are optional in schema
    if (!data.profilePicture) {
      toast.error("Profile picture is required");
      registrationForm.setError("profilePicture", { message: "Profile picture is required" });
      return;
    }

    // Validate profile picture file size and type
    if (data.profilePicture.size > MAX_FILE_SIZE) {
      toast.error("Profile picture size must be less than 5MB");
      registrationForm.setError("profilePicture", { message: "Max file size is 5MB" });
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(data.profilePicture.type)) {
      toast.error("Only .jpg, .jpeg, .png and .webp formats are supported");
      registrationForm.setError("profilePicture", {
        message: "Only .jpg, .jpeg, .png and .webp formats are supported",
      });
      return;
    }

    if (documentFiles.length === 0) {
      toast.error("Please upload at least one document");
      registrationForm.setError("documents", { message: "At least one document is required" });
      return;
    }

    // Validate education qualifications
    // Year is optional/empty per schema, but if provided must be 4 digits
    for (let i = 0; i < data.educationQualifications.length; i++) {
      const edu = data.educationQualifications[i];
      if (!edu) {
        toast.error(`Education qualification ${i + 1}: Invalid entry`);
        return;
      }
      // If year is provided (not empty/undefined), it must be 4 digits
      if (edu.year && edu.year.trim() !== "" && !/^\d{4}$/.test(edu.year)) {
        toast.error(`Education qualification ${i + 1}: Year must be 4 digits`);
        registrationForm.setError(`educationQualifications.${i}.year`, {
          message: "Year must be 4 digits",
        });
        return;
      }
    }

    // Validate training entries - filter out empty ones
    const validTraining = data.training.filter(
      (t) => t.period && t.period.trim() !== "" && t.institute && t.institute.trim() !== ""
    );
    // Only reject if user attempted to add training but left fields incomplete
    // Allow empty training array (training is optional)
    // Check if any training entry has partial data (one field filled but not both)
    const hasPartialTraining = data.training.some(
      (t) => (t.period && t.period.trim() !== "") !== (t.institute && t.institute.trim() !== "")
    );
    if (hasPartialTraining) {
      toast.error("Please fill in all training fields or remove incomplete entries");
      return;
    }

    // Store registration data with filtered training entries and move to OTP step
    setRegistrationData({
      ...data,
      training: validTraining, // Store only validated training entries
    });
    
    // Send OTP automatically when moving to step 2
    const email = data.email;
    setIsSendingOTP(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const otpData = await response.json();

      if (otpData.success) {
        setOtpSent(true);
        setCurrentStep(2);
        toast.success("OTP sent successfully to your email!");
      } else {
        toast.error(otpData.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  // Step 2: Handle OTP verification and registration submission
  const onOTPSubmit = async (data: OTPFormValues) => {
    if (!registrationData) {
      toast.error("Registration data is missing. Please start over.");
      setCurrentStep(1);
      return;
    }

    setIsVerifyingOTP(true);
    setIsSubmitting(false); // Ensure isSubmitting starts as false
    try {
      // First verify OTP
      const verifyResponse = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registrationData.email,
          otp: data.otp,
        }),
      });

      const verifyResult = await verifyResponse.json();

      if (!verifyResult.success || !verifyResult.data?.otpValid) {
        toast.error("Invalid OTP. Please try again.");
        // Don't return early - let finally block handle state cleanup
        return;
      }

      // OTP verified, now submit registration
      setIsVerifyingOTP(false); // OTP verification complete
      setIsSubmitting(true);
      const formData = new FormData();

      // Text Fields
      formData.append("name", registrationData.name);
      formData.append("email", registrationData.email);
      formData.append("phone", registrationData.phone);
      formData.append("password", registrationData.password);
      formData.append("affiliation", registrationData.affiliation);
      if (registrationData.formNo) formData.append("formNo", registrationData.formNo);
      if (registrationData.refNo) formData.append("refNo", registrationData.refNo);
      formData.append("mailingAddress", registrationData.mailingAddress);
      formData.append("permanentAddress", registrationData.permanentAddress);
      if (registrationData.researchInterest1)
        formData.append("researchInterest1", registrationData.researchInterest1);
      if (registrationData.researchInterest2)
        formData.append("researchInterest2", registrationData.researchInterest2);
      formData.append("otp", data.otp);

      // JSON Stringify Arrays
      formData.append(
        "educationQualifications",
        JSON.stringify(registrationData.educationQualifications)
      );
      formData.append("training", JSON.stringify(registrationData.training));

      // Files
      if (registrationData.profilePicture instanceof File) {
        formData.append("profilePicture", registrationData.profilePicture);
      }

      if (registrationData.documents) {
        registrationData.documents.forEach((file) => {
          formData.append("documents", file);
        });
      }

      const response = await fetch("/api/auth/verify-registration", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success && response.ok) {
        toast.success("Registration submitted successfully!");
        setCurrentStep(3); // Move to payment step
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsVerifyingOTP(false);
      setIsSubmitting(false);
    }
  };

  // Step 3: Handle payment confirmation
  const handlePaymentConfirm = () => {
    setCurrentStep(4);
    // Redirect to login after a brief delay
    setTimeout(() => {
      router.push("/login?registered=true");
    }, 2000);
  };

  // Resend OTP handler
  const handleResendOTP = async () => {
    if (!registrationData?.email) return;

    setIsSendingOTP(true);
    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registrationData.email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("OTP resent successfully!");
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  // Step indicator component
  const StepIndicator = () => {
    const steps = [
      { number: 1, label: "Registration", icon: User },
      { number: 2, label: "Verification", icon: CheckCircle2 },
      { number: 3, label: "Payment", icon: CreditCard },
      { number: 4, label: "Complete", icon: CheckCircle },
    ];

    return (
      <div className="flex items-center justify-center mb-4 sm:mb-6 md:mb-8 mt-4 sm:mt-6 w-full">
        <div className="flex items-center justify-between w-full max-w-full px-1">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : isCompleted
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-slate-200 text-slate-500 border-slate-300"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    ) : (
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    )}
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] md:text-xs mt-1 sm:mt-1.5 md:mt-2 font-medium text-center leading-tight px-0.5 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-2 sm:w-4 md:w-8 lg:w-12 h-0.5 flex-shrink-0 mx-0.5 sm:mx-1 ${
                      isCompleted ? "bg-green-500" : "bg-slate-300"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent p-4 sm:p-6 md:p-8">
        <CardTitle className="text-xl sm:text-2xl font-bold text-primary">
          Member Registration
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm leading-relaxed break-words">
          Join our community of professionals. Please complete the steps below.
        </CardDescription>
        <StepIndicator />
      </CardHeader>
      <CardContent className="p-4 sm:p-6 md:p-8">
        {/* Step 1: Registration Form */}
        {currentStep === 1 && (
          <form onSubmit={registrationForm.handleSubmit(onRegistrationSubmit)} className="space-y-10">
          
          {/* 1. Profile Picture Section */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative group">
              <div className="w-48 h-60 rounded-lg overflow-hidden border-4 border-primary/20 bg-slate-100 flex items-center justify-center shadow-lg">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <User className="w-16 h-16 text-slate-400" />
                    <p className="text-xs text-slate-400 text-center px-4">Passport Size Photo</p>
                  </div>
                )}
              </div>
              <label
                htmlFor="profile-upload"
                className="absolute bottom-2 right-2 bg-primary text-white p-2.5 rounded-lg cursor-pointer shadow-lg hover:bg-primary/90 transition-colors z-10"
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
              <Label className="text-lg font-semibold">Profile Picture (Passport Size)</Label>
              {registrationForm.formState.errors.profilePicture && (
                <p className="text-destructive text-sm mt-1">
                  {registrationForm.formState.errors.profilePicture.message as string}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Upload passport size photo (2x2 inch). Click camera icon to upload. Max 5MB.
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
                    {...registrationForm.register("name")}
                    className={`pl-9 ${registrationForm.formState.errors.name ? "border-destructive" : ""}`}
                  />
                </div>
                {registrationForm.formState.errors.name && (
                  <p className="text-destructive text-xs">{registrationForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="+880..."
                    {...registrationForm.register("phone")}
                    className={`pl-9 ${registrationForm.formState.errors.phone ? "border-destructive" : ""}`}
                  />
                </div>
                {registrationForm.formState.errors.phone && (
                  <p className="text-destructive text-xs">{registrationForm.formState.errors.phone.message}</p>
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
                    {...registrationForm.register("email")}
                    className={`pl-9 ${registrationForm.formState.errors.email ? "border-destructive" : ""}`}
                  />
                </div>
                {registrationForm.formState.errors.email && (
                  <p className="text-destructive text-xs">{registrationForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    {...registrationForm.register("password")}
                    className={`pl-9 pr-10 ${registrationForm.formState.errors.password ? "border-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {registrationForm.formState.errors.password && (
                  <p className="text-destructive text-xs">{registrationForm.formState.errors.password.message}</p>
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
                    {...registrationForm.register("affiliation")}
                    className={`pl-9 ${registrationForm.formState.errors.affiliation ? "border-destructive" : ""}`}
                  />
                </div>
                {registrationForm.formState.errors.affiliation && (
                  <p className="text-destructive text-xs">{registrationForm.formState.errors.affiliation.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="formNo">Form No. (Optional)</Label>
                <Input
                  id="formNo"
                  placeholder="12345"
                  {...registrationForm.register("formNo")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refNo">Ref No. (Optional)</Label>
                <Input
                  id="refNo"
                  placeholder="REF-001"
                  {...registrationForm.register("refNo")}
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
                  {...registrationForm.register("mailingAddress")}
                  className={registrationForm.formState.errors.mailingAddress ? "border-destructive" : ""}
                />
                {registrationForm.formState.errors.mailingAddress && (
                  <p className="text-destructive text-xs">{registrationForm.formState.errors.mailingAddress.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="permanentAddress">Permanent Address</Label>
                <Textarea
                  id="permanentAddress"
                  placeholder="Permanent home address..."
                  {...registrationForm.register("permanentAddress")}
                  className={registrationForm.formState.errors.permanentAddress ? "border-destructive" : ""}
                />
                {registrationForm.formState.errors.permanentAddress && (
                  <p className="text-destructive text-xs">{registrationForm.formState.errors.permanentAddress.message}</p>
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
                      {...registrationForm.register(`educationQualifications.${index}.qualification`)}
                      placeholder="e.g. MBBS"
                      className={registrationForm.formState.errors.educationQualifications?.[index]?.qualification ? "border-destructive" : ""}
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <Label>Year</Label>
                    <Input
                      {...registrationForm.register(`educationQualifications.${index}.year`)}
                      placeholder="YYYY"
                      className={registrationForm.formState.errors.educationQualifications?.[index]?.year ? "border-destructive" : ""}
                    />
                  </div>
                  <div className="md:col-span-5 space-y-2">
                    <Label>Institution</Label>
                    <Input
                      {...registrationForm.register(`educationQualifications.${index}.institution`)}
                      placeholder="Institution Name"
                      className={registrationForm.formState.errors.educationQualifications?.[index]?.institution ? "border-destructive" : ""}
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
                      {...registrationForm.register(`training.${index}.period`)}
                      placeholder="e.g. Jan 2020 - Dec 2021"
                      className={registrationForm.formState.errors.training?.[index]?.period ? "border-destructive" : ""}
                    />
                  </div>
                  <div className="md:col-span-6 space-y-2">
                    <Label>Institute</Label>
                    <Input
                      {...registrationForm.register(`training.${index}.institute`)}
                      placeholder="Training Institute"
                      className={registrationForm.formState.errors.training?.[index]?.institute ? "border-destructive" : ""}
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
                  {...registrationForm.register("researchInterest1")}
                  placeholder="Describe your primary research interests..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="researchInterest2">Secondary Research Interest (Optional)</Label>
                <Textarea
                  id="researchInterest2"
                  {...registrationForm.register("researchInterest2")}
                  placeholder="Describe your secondary research interests..."
                />
              </div>
            </div>
          </section>

          {/* 8. Documents Upload */}
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

          {/* Next Button */}
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full py-6 text-lg font-bold shadow-lg"
              disabled={isSendingOTP}
            >
              {isSendingOTP ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Sending OTP...
                </>
              ) : (
                <>
                Verify Email
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              By clicking Next, you agree to our Terms and Conditions and Privacy Policy.
            </p>
          </div>
        </form>
        )}

        {/* Step 2: OTP Verification */}
        {currentStep === 2 && (
          <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4 sm:space-y-6">
            <section className="space-y-4 sm:space-y-6 bg-slate-50 dark:bg-slate-900/30 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 border-b pb-2 text-base sm:text-lg font-semibold text-primary">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> Email Verification
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground break-words">
                  We&apos;ve sent a 6-digit OTP to <strong className="break-all">{registrationData?.email}</strong>. Please enter it below to verify your email address.
                </p>
                
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="space-y-2 w-full">
                    <Label className="text-sm sm:text-base">Enter OTP Code</Label>
                    <div className="flex justify-center sm:justify-start overflow-x-auto pb-2 -mx-2 px-2">
                      <Controller
                        control={otpForm.control}
                        name="otp"
                        render={({ field }) => (
                          <OTPInput
                            value={field.value}
                            onChange={field.onChange}
                            length={6}
                            className="justify-center sm:justify-start"
                            disabled={!otpSent}
                          />
                        )}
                      />
                    </div>
                    {otpForm.formState.errors.otp && (
                      <p className="text-destructive text-xs text-center sm:text-left">{otpForm.formState.errors.otp.message}</p>
                    )}
                  </div>
                  
                  <Button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isSendingOTP}
                    variant="outline"
                    className="w-full sm:w-auto sm:min-w-[140px] self-center sm:self-start"
                  >
                    {isSendingOTP ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {isSendingOTP ? "Sending..." : "Resend OTP"}
                  </Button>
                </div>
                {otpSent && (
                  <p className="text-xs sm:text-sm text-green-600 flex items-center mt-2 flex-wrap gap-1">
                    <CheckCircle2 className="w-3 h-3 flex-shrink-0" /> 
                    <span>OTP sent to <span className="break-all">{registrationData?.email}</span></span>
                  </p>
                )}
              </div>
            </section>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="flex-1 w-full sm:w-auto order-2 sm:order-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 w-full sm:w-auto order-1 sm:order-2"
                disabled={isVerifyingOTP || isSubmitting}
              >
                {isVerifyingOTP || isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
                    {isVerifyingOTP ? "Verifying..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    Verify & Submit
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div className="space-y-4 sm:space-y-6">
            <section className="space-y-4 sm:space-y-6 bg-slate-50 dark:bg-slate-900/30 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 border-b pb-2 text-base sm:text-lg font-semibold text-primary">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" /> Payment Information
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Your registration has been submitted successfully! Please complete the payment to finalize your membership.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                  <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      bKash
                    </h3>
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm text-muted-foreground">Account Number</p>
                      <p className="text-lg sm:text-xl font-mono font-bold break-all">017XXXXXXXX</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">Send money to this number</p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      Nagad
                    </h3>
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm text-muted-foreground">Account Number</p>
                      <p className="text-lg sm:text-xl font-mono font-bold break-all">017XXXXXXXX</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">Send money to this number</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                    <strong>Note:</strong> After making the payment, please click &quot;Confirm Payment&quot; below. 
                    Our team will verify your payment and activate your membership within 24-48 hours.
                  </p>
                </div>
              </div>
            </section>

            <div className="pt-4 sm:pt-6">
              <Button
                type="button"
                onClick={handlePaymentConfirm}
                className="w-full py-4 sm:py-5 md:py-6 text-base sm:text-lg font-bold shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Confirm Payment
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Completion */}
        {currentStep === 4 && (
          <div className="space-y-4 sm:space-y-6 text-center py-8 sm:py-10 md:py-12 px-2">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary px-2">Registration Complete!</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed px-2 max-w-md mx-auto">
              Your membership application has been submitted successfully. 
              You will be redirected to the login page shortly.
            </p>
            <div className="pt-3 sm:pt-4">
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mx-auto text-primary" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
