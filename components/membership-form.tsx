"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  Lock,
  ArrowRight,
  CreditCard,
  CheckCircle,
  Eye,
  EyeOff,
  AtSign,
  Check,
  X,
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
  document: z.instanceof(File).optional(),
});

const trainingSchema = z.object({
  period: z.string().optional().or(z.literal("")),
  institute: z.string().optional().or(z.literal("")),
  document: z.instanceof(File).optional(),
});

// Username validation regex: lowercase, numbers, underscores only
const usernameRegex = /^[a-z0-9_]+$/;

// Password validation: minimum 6 characters with number, letter, and special character
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .refine(
    (password) => {
      // Must contain at least one number (0-9)
      return /\d/.test(password);
    },
    {
      message: "Password must contain at least one number (0-9)",
    }
  )
  .refine(
    (password) => {
      // Must contain at least one letter (a-z, A-Z)
      return /[a-zA-Z]/.test(password);
    },
    {
      message: "Password must contain at least one letter (a-z, A-Z)",
    }
  )
  .refine(
    (password) => {
      // Must contain at least one special character
      return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    },
    {
      message: "Password must contain at least one special character (!@#$%^&* etc.)",
    }
  );

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
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(usernameRegex, "Username can only contain lowercase letters, numbers, and underscores"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: passwordSchema,
  affiliation: z.string().min(2, "Affiliation is required"),
  designation: z.string().min(2, "Designation is required"),
  membershipType: z.enum(["general", "lifetime"]),
  mailingAddress: z.string().min(5, "Mailing address is required"),
  permanentAddress: z.string().min(5, "Permanent address is required"),
  educationQualifications: z.array(educationSchema),
  training: z.array(trainingSchema),
  researchInterest1: z.string().optional(),
  researchInterest2: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms and Conditions to continue",
  }),
});

// OTP verification schema - REMOVED (OTP disabled)

type RegistrationFormValues = z.infer<typeof registrationSchema>;

type Step = 1 | 2 | 3 | 4;

export function MembershipForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Files are now stored in each education/training entry, not separately
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationFormValues | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameAvailability, setUsernameAvailability] = useState<{
    checking: boolean;
    available: boolean | null;
  }>({ checking: false, available: null });
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasNumber: false,
    hasLetter: false,
    hasSpecialChar: false,
  });
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "handCash" | "bankTransfer" | null>(null);
  const [paymentDocuments, setPaymentDocuments] = useState<File[]>([]);
  // OTP verification disabled - removed verifiedOtp, isSendingOTP, otpSent, isVerifyingOTP states
  const [nidDocument, setNidDocument] = useState<File | null>(null);
  const [nidPreview, setNidPreview] = useState<string | null>(null);

  // Main form for registration data
  const registrationForm = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      affiliation: "",
      designation: "",
      membershipType: "general" as "general" | "lifetime",
      mailingAddress: "",
      permanentAddress: "",
      educationQualifications: [
        { qualification: "MBBS", year: "", institution: "", document: undefined },
      ],
      training: [{ period: "", institute: "", document: undefined }],
      researchInterest1: "",
      researchInterest2: "",
      termsAccepted: false,
    },
  });

  // Watch username and password for real-time validation
  const watchedUsername = registrationForm.watch("username");
  const watchedPassword = registrationForm.watch("password");

  // Debounced username availability check with real-time validation
  useEffect(() => {
    const username = watchedUsername?.trim().toLowerCase();

    // Reset availability state if username is empty or too short
    if (!username || username.length < 3) {
      setUsernameAvailability({ checking: false, available: null });
      registrationForm.clearErrors("username");
      return;
    }

    // Validate format first (lowercase, numbers, underscores only)
    if (!usernameRegex.test(username)) {
      setUsernameAvailability({ checking: false, available: null });
      // Format validation error is handled by zod schema
      return;
    }

    // Set checking state
    setUsernameAvailability({ checking: true, available: null });
    registrationForm.clearErrors("username"); // Clear previous errors while checking

    // Debounce the API call (500ms after user stops typing)
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/users/check-username?username=${encodeURIComponent(username)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          // If API fails, don't block user - backend will validate during registration
          console.warn("Username check API failed:", response.status);
          setUsernameAvailability({ checking: false, available: null });
          registrationForm.clearErrors("username");
          return;
        }

        const data = await response.json();

        // Backend returns: { success: true, available: boolean, message?: string }
        const isAvailable = data.success === true && data.available === true;

        setUsernameAvailability({ checking: false, available: isAvailable });

        // Set validation error if username is not available
        if (!isAvailable) {
          registrationForm.setError("username", {
            type: "manual",
            message: data.message || "Username is already taken",
          });
        } else {
          registrationForm.clearErrors("username");
        }
      } catch (error) {
        console.error("Error checking username availability:", error);
        // On error, don't block user - backend will validate during registration
        setUsernameAvailability({ checking: false, available: null });
        registrationForm.clearErrors("username");
      }
    }, 500); // 500ms debounce - wait for user to stop typing

    return () => clearTimeout(timeoutId);
  }, [watchedUsername, registrationForm]);

  // Update password requirements validation in real-time
  useEffect(() => {
    if (watchedPassword) {
      setPasswordRequirements({
        minLength: watchedPassword.length >= 6,
        hasNumber: /\d/.test(watchedPassword),
        hasLetter: /[a-zA-Z]/.test(watchedPassword),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(watchedPassword),
      });
    } else {
      setPasswordRequirements({
        minLength: false,
        hasNumber: false,
        hasLetter: false,
        hasSpecialChar: false,
      });
    }
  }, [watchedPassword]);

  // OTP form - REMOVED (OTP disabled)


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

  // Handle file upload for education qualifications
  const handleEducationDocumentChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      registrationForm.setValue(`educationQualifications.${index}.document`, file, { shouldValidate: true });
    }
  };

  // Handle file upload for training
  const handleTrainingDocumentChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      registrationForm.setValue(`training.${index}.document`, file, { shouldValidate: true });
    }
  };

  // Remove document from education qualification
  const removeEducationDocument = (index: number) => {
    registrationForm.setValue(`educationQualifications.${index}.document`, undefined, { shouldValidate: true });
  };

  // Remove document from training
  const removeTrainingDocument = (index: number) => {
    registrationForm.setValue(`training.${index}.document`, undefined, { shouldValidate: true });
  };

  // Step 1: Handle registration form submission
  const onRegistrationSubmit = async (data: RegistrationFormValues) => {
    // Final username availability check before submission
    const username = data.username?.trim().toLowerCase();

    // Validate username format
    if (!username || username.length < 3 || !usernameRegex.test(username)) {
      toast.error("Please enter a valid username");
      registrationForm.setError("username", { message: "Please enter a valid username" });
      return;
    }

    // If username is currently being checked, wait a moment
    if (usernameAvailability.checking) {
      toast.error("Please wait while we verify username availability");
      return;
    }

    // If username is not available, block submission
    if (usernameAvailability.available === false) {
      toast.error("Username is already taken. Please choose a different username.");
      registrationForm.setError("username", { message: "Username is already taken" });
      return;
    }

    // If availability hasn't been checked yet, do a final check
    if (usernameAvailability.available === null) {
      try {
        const response = await fetch(
          `/api/users/check-username?username=${encodeURIComponent(username)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          // If check fails, allow submission - backend will validate
          console.warn("Final username check failed, proceeding with submission");
        } else {
          const checkData = await response.json();

          // Backend returns: { success: true, available: boolean }
          if (checkData.success === true && checkData.available === true) {
            // Username is available, proceed
            setUsernameAvailability({ checking: false, available: true });
            registrationForm.clearErrors("username");
          } else {
            // Username is not available
            toast.error("Username is already taken. Please choose a different username.");
            registrationForm.setError("username", { message: "Username is already taken" });
            setUsernameAvailability({ checking: false, available: false });
            return;
          }
        }
      } catch (error) {
        console.error("Error checking username availability:", error);
        // On error, allow submission - backend will validate
      }
    }

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

    // Documents are now validated separately in education/training sections

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

    // Store registration data with filtered training entries and skip to payment step
    setRegistrationData({
      ...data,
      training: validTraining, // Store only validated training entries
    });

    // Skip OTP verification - go directly to payment step
    toast.success("Registration details saved! Please proceed with payment.");
    setCurrentStep(3); // Skip step 2 (OTP) and go directly to step 3 (Payment)
  };

  // Step 2: OTP verification handler - REMOVED (OTP disabled)
  // Registration now goes directly from step 1 to step 3 (payment)


  // Handle payment document upload
  const handlePaymentDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPaymentDocuments(files);
  };

  // Step 3: Handle payment confirmation and registration submission
  const handlePaymentConfirm = async () => {
    if (!registrationData) {
      toast.error("Registration data is missing. Please start over.");
      setCurrentStep(1);
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    // All payment methods require receipt/screenshot upload
    if (paymentDocuments.length === 0) {
      toast.error("Please upload your payment receipt/screenshot");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Text Fields
      formData.append("name", registrationData.name);
      formData.append("username", registrationData.username);
      formData.append("email", registrationData.email);
      formData.append("phone", registrationData.phone);
      formData.append("password", registrationData.password);
      formData.append("affiliation", registrationData.affiliation);
      formData.append("designation", registrationData.designation);
      formData.append("membershipType", registrationData.membershipType);
      formData.append("mailingAddress", registrationData.mailingAddress);
      formData.append("permanentAddress", registrationData.permanentAddress);
      if (registrationData.researchInterest1)
        formData.append("researchInterest1", registrationData.researchInterest1);
      if (registrationData.researchInterest2)
        formData.append("researchInterest2", registrationData.researchInterest2);

      // Send dummy OTP to satisfy backend validation (OTP verification disabled on frontend)
      formData.append("otp", "000000");

      // JSON Stringify Arrays (without document files - they'll be sent separately)
      const educationWithoutFiles = registrationData.educationQualifications.map(({ document, ...rest }) => rest);
      const trainingWithoutFiles = registrationData.training.map(({ document, ...rest }) => rest);

      formData.append(
        "educationQualifications",
        JSON.stringify(educationWithoutFiles)
      );
      formData.append("training", JSON.stringify(trainingWithoutFiles));

      // Files
      if (registrationData.profilePicture instanceof File) {
        formData.append("profilePicture", registrationData.profilePicture);
      }

      // Add all documents (education + training + payment) to single 'documents' array
      // Backend expects: documents[] (all documents together, not separated)
      registrationData.educationQualifications.forEach((edu) => {
        if (edu.document instanceof File) {
          formData.append("documents", edu.document);
        }
      });

      registrationData.training.forEach((train) => {
        if (train.document instanceof File) {
          formData.append("documents", train.document);
        }
      });

      // Add payment documents (receipts) if uploaded
      paymentDocuments.forEach((doc) => {
        formData.append("documents", doc);
      });

      // Add NID document if uploaded (will go to documents array like others)
      if (nidDocument) {
        formData.append("documents", nidDocument);
      }

      const response = await fetch("/api/auth/verify-registration", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success && response.ok) {
        toast.success("Registration submitted successfully!");
        setCurrentStep(4);
        // Redirect to login after a brief delay
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 2000);
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

  // Resend OTP handler - REMOVED (OTP disabled)


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
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-colors flex-shrink-0 ${isActive
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
                    className={`text-[9px] sm:text-[10px] md:text-xs mt-1 sm:mt-1.5 md:mt-2 font-medium text-center leading-tight px-0.5 ${isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-2 sm:w-4 md:w-8 lg:w-12 h-0.5 flex-shrink-0 mx-0.5 sm:mx-1 ${isCompleted ? "bg-green-500" : "bg-slate-300"
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

            {/* 1.5. Membership Type */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-primary">
                <CreditCard className="w-5 h-5" /> Membership Type
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${registrationForm.watch("membershipType") === "general"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-slate-300 dark:border-slate-700 hover:border-primary/50"
                    }`}
                >
                  <input
                    type="radio"
                    value="general"
                    {...registrationForm.register("membershipType")}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-base">General Member</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Regular membership</p>
                  </div>
                  {registrationForm.watch("membershipType") === "general" && (
                    <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-primary" />
                  )}
                </label>
                <label
                  className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${registrationForm.watch("membershipType") === "lifetime"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-slate-300 dark:border-slate-700 hover:border-primary/50"
                    }`}
                >
                  <input
                    type="radio"
                    value="lifetime"
                    {...registrationForm.register("membershipType")}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-base">Lifetime Member</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Lifetime membership</p>
                  </div>
                  {registrationForm.watch("membershipType") === "lifetime" && (
                    <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-primary" />
                  )}
                </label>
              </div>
              {registrationForm.formState.errors.membershipType && (
                <p className="text-destructive text-xs">{registrationForm.formState.errors.membershipType.message}</p>
              )}
            </section>

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
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="johndoe123"
                      {...registrationForm.register("username", {
                        onChange: (e) => {
                          // Convert to lowercase as user types
                          const lowerValue = e.target.value.toLowerCase();
                          if (e.target.value !== lowerValue) {
                            e.target.value = lowerValue;
                            registrationForm.setValue("username", lowerValue, { shouldValidate: true });
                          }
                        },
                      })}
                      className={`pl-9 pr-9 transition-colors ${registrationForm.formState.errors.username || usernameAvailability.available === false
                        ? "border-destructive focus-visible:ring-destructive"
                        : usernameAvailability.available === true
                          ? "border-green-500 focus-visible:ring-green-500"
                          : ""
                        }`}
                    />
                    {/* Real-time checking indicator */}
                    {usernameAvailability.checking && (
                      <div className="absolute right-3 top-2.5 flex items-center gap-1.5">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground hidden sm:inline">Checking...</span>
                      </div>
                    )}
                    {/* Available indicator */}
                    {!usernameAvailability.checking && usernameAvailability.available === true && (
                      <div className="absolute right-3 top-2.5 flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600 dark:text-green-400 hidden sm:inline">Available</span>
                      </div>
                    )}
                    {/* Not available indicator */}
                    {!usernameAvailability.checking && usernameAvailability.available === false && (
                      <div className="absolute right-3 top-2.5 flex items-center gap-1.5">
                        <X className="h-4 w-4 text-destructive" />
                        <span className="text-xs text-destructive hidden sm:inline">Taken</span>
                      </div>
                    )}
                  </div>
                  {/* Error message */}
                  {registrationForm.formState.errors.username && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {registrationForm.formState.errors.username.message}
                    </p>
                  )}
                  {/* Success message */}
                  {!registrationForm.formState.errors.username &&
                    usernameAvailability.available === true &&
                    watchedUsername &&
                    watchedUsername.length >= 3 && (
                      <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Username is available
                      </p>
                    )}
                  {/* Helper text */}
                  {watchedUsername &&
                    watchedUsername.length >= 3 &&
                    !registrationForm.formState.errors.username &&
                    usernameAvailability.available !== true && (
                      <p className="text-xs text-muted-foreground">
                        Only lowercase letters, numbers, and underscores allowed
                      </p>
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
                  {registrationForm.formState.errors.password ? (
                    <p className="text-destructive text-xs mt-1">
                      {registrationForm.formState.errors.password.message}
                    </p>
                  ) : (
                    <div className="space-y-1.5 mt-2">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Password Requirements:</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          {passwordRequirements.minLength ? (
                            <Check className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          )}
                          <span className={passwordRequirements.minLength ? "text-green-600" : "text-muted-foreground"}>
                            Minimum 6 characters
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          {passwordRequirements.hasNumber ? (
                            <Check className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          )}
                          <span className={passwordRequirements.hasNumber ? "text-green-600" : "text-muted-foreground"}>
                            At least one number (0-9)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          {passwordRequirements.hasLetter ? (
                            <Check className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          )}
                          <span className={passwordRequirements.hasLetter ? "text-green-600" : "text-muted-foreground"}>
                            At least one letter (a-z, A-Z)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          {passwordRequirements.hasSpecialChar ? (
                            <Check className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          )}
                          <span className={passwordRequirements.hasSpecialChar ? "text-green-600" : "text-muted-foreground"}>
                            At least one special character (!@#$%^&* etc.)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 3. Professional Info */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-primary">
                <Building className="w-5 h-5" /> Professional Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
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
                  <Label htmlFor="designation">Designation</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="designation"
                      placeholder="e.g., Assistant Professor, Consultant"
                      {...registrationForm.register("designation")}
                      className={`pl-9 ${registrationForm.formState.errors.designation ? "border-destructive" : ""}`}
                    />
                  </div>
                  {registrationForm.formState.errors.designation && (
                    <p className="text-destructive text-xs">{registrationForm.formState.errors.designation.message}</p>
                  )}
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
                  onClick={() => appendEdu({ qualification: "", year: "", institution: "", document: undefined })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-4">
                {eduFields.map((field, index) => {
                  const documentFile = registrationForm.watch(`educationQualifications.${index}.document`);
                  return (
                    <div key={field.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
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
                      {/* Document Upload for this Education Entry */}
                      <div className="space-y-2">
                        <Label className="text-sm">Document (Certificate/Degree)</Label>
                        {!documentFile ? (
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleEducationDocumentChange(index, e)}
                              className="hidden"
                              id={`edu-doc-${index}`}
                            />
                            <label
                              htmlFor={`edu-doc-${index}`}
                              className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Upload className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Upload Document</span>
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-sm truncate max-w-[250px]">{documentFile.name}</span>
                              <span className="text-xs text-muted-foreground">({(documentFile.size / 1024).toFixed(0)}kb)</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => removeEducationDocument(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
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
                  onClick={() => appendTraining({ period: "", institute: "", document: undefined })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-4">
                {trainingFields.map((field, index) => {
                  const documentFile = registrationForm.watch(`training.${index}.document`);
                  return (
                    <div key={field.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
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
                      {/* Document Upload for this Training Entry */}
                      <div className="space-y-2">
                        <Label className="text-sm">Document (Certificate)</Label>
                        {!documentFile ? (
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleTrainingDocumentChange(index, e)}
                              className="hidden"
                              id={`training-doc-${index}`}
                            />
                            <label
                              htmlFor={`training-doc-${index}`}
                              className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Upload className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Upload Document</span>
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-sm truncate max-w-[250px]">{documentFile.name}</span>
                              <span className="text-xs text-muted-foreground">({(documentFile.size / 1024).toFixed(0)}kb)</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => removeTrainingDocument(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
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

            {/* 8. NID Document Upload */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2 text-lg font-semibold text-primary">
                <FileText className="w-5 h-5" /> NID Document
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nidDocument">Upload NID Document</Label>
                  <p className="text-sm text-muted-foreground">
                    Please upload a clear copy of your National ID Card (NID). Accepted formats: PDF, JPG, JPEG, PNG. Max file size: 5MB.
                  </p>
                  {!nidDocument ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > MAX_FILE_SIZE) {
                              toast.error("File size must be less than 5MB");
                              return;
                            }
                            setNidDocument(file);

                            // Create preview for images
                            if (file.type.startsWith("image/")) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNidPreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setNidPreview(null);
                            }
                          }
                        }}
                        className="hidden"
                        id="nid-document"
                      />
                      <label
                        htmlFor="nid-document"
                        className="flex flex-col items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <div className="text-center">
                          <span className="text-sm font-medium text-foreground">Click to upload NID Document</span>
                          <p className="text-xs text-muted-foreground mt-1">PDF, JPG, JPEG, PNG (Max 5MB)</p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          {nidPreview ? (
                            <div className="relative w-16 h-16 rounded border border-slate-300 dark:border-slate-700 overflow-hidden">
                              <Image
                                src={nidPreview}
                                alt="NID Preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium truncate max-w-[300px]">{nidDocument.name}</span>
                            <span className="text-xs text-muted-foreground">{(nidDocument.size / 1024).toFixed(2)} KB</span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            setNidDocument(null);
                            setNidPreview(null);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {nidPreview && (
                        <div className="relative w-full max-w-md mx-auto rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden">
                          <Image
                            src={nidPreview}
                            alt="NID Document Preview"
                            width={400}
                            height={300}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Terms and Conditions */}
            <section className="space-y-4 pt-4">
              <div className="flex items-start space-x-3 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-800">
                <Checkbox
                  id="terms"
                  checked={registrationForm.watch("termsAccepted")}
                  onCheckedChange={(checked) => {
                    registrationForm.setValue("termsAccepted", checked === true, { shouldValidate: true });
                  }}
                  className="mt-0.5"
                />
                <div className="flex-1 space-y-1">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Do you agree to comply with all the terms and conditions applicable to BCNS membership?
                  </label>
                  {registrationForm.formState.errors.termsAccepted && (
                    <p className="text-destructive text-xs mt-1">
                      {registrationForm.formState.errors.termsAccepted.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Next Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full py-6 text-lg font-bold shadow-lg"
                disabled={!registrationForm.watch("termsAccepted")}
              >
                Continue to Payment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </form >
        )
        }

        {/* Step 2: OTP Verification - REMOVED (OTP disabled) */}


        {/* Step 3: Payment */}
        {
          currentStep === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <section className="space-y-4 sm:space-y-6 bg-slate-50 dark:bg-slate-900/30 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 border-b pb-2 text-base sm:text-lg font-semibold text-primary">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" /> Payment Information
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Please select a payment method and complete the payment to finalize your membership.
                  </p>

                  {/* Payment Method Tabs */}
                  <div className="border-b border-slate-200 dark:border-slate-700">
                    <div className="flex gap-2 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod("bkash");
                          setPaymentDocuments([]);
                        }}
                        className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors ${paymentMethod === "bkash"
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Image src="/images/bkash.png" alt="bKash" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
                          <span>bKash</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod("handCash");
                          setPaymentDocuments([]);
                        }}
                        className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors ${paymentMethod === "handCash"
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Hand Cash</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod("bankTransfer");
                          setPaymentDocuments([]);
                        }}
                        className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors ${paymentMethod === "bankTransfer"
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Building className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Bank Transfer</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Payment Method Content */}
                  <div className="mt-4 sm:mt-6">
                    {paymentMethod === "bkash" && (
                      <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
                        <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                          <Image src="/images/bkash.png" alt="bKash" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                          bKash Payment
                        </h3>
                        <div className="space-y-2 mb-4">
                          <p className="text-xs sm:text-sm text-muted-foreground">Account Number</p>
                          <p className="text-lg sm:text-xl font-mono font-bold break-all">01879235494</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">Send money to this number</p>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="bkashScreenshot" className="text-sm font-medium">
                            Upload Payment Screenshot
                          </Label>
                          <Input
                            id="bkashScreenshot"
                            type="file"
                            accept="image/*,.pdf"
                            multiple
                            onChange={handlePaymentDocumentChange}
                            className="cursor-pointer"
                          />
                          {paymentDocuments.length > 0 && (
                            <p className="text-xs text-green-600 dark:text-green-400">
                              {paymentDocuments.length} file(s) selected
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Please upload a screenshot of your bKash payment transaction
                          </p>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "handCash" && (
                      <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
                        <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                          Hand Cash Payment
                        </h3>
                        <div className="space-y-3">
                          <Label htmlFor="handCashReceipt" className="text-sm font-medium">
                            Upload Your Receipt
                          </Label>
                          <Input
                            id="handCashReceipt"
                            type="file"
                            accept="image/*,.pdf"
                            multiple
                            onChange={handlePaymentDocumentChange}
                            className="cursor-pointer"
                          />
                          {paymentDocuments.length > 0 && (
                            <p className="text-xs text-green-600 dark:text-green-400">
                              {paymentDocuments.length} file(s) selected
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Please upload a clear photo or scan of your payment receipt
                          </p>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "bankTransfer" && (
                      <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
                        <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                          <Building className="w-5 h-5 sm:w-6 sm:h-6" />
                          Bank Transfer Payment
                        </h3>
                        <div className="space-y-2 mb-4">
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Bank</p>
                            <p className="text-sm sm:text-base font-semibold">Bank Asia PLC</p>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Account Number</p>
                            <p className="text-base sm:text-lg font-mono font-bold break-all">08536000112</p>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Account Name</p>
                            <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">Bangladesh Child Neurology Society (BCNS)</p>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Branch</p>
                            <p className="text-xs sm:text-sm">BSMMU</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="bankReceipt" className="text-sm font-medium">
                            Upload Payment Screenshot
                          </Label>
                          <Input
                            id="bankReceipt"
                            type="file"
                            accept="image/*,.pdf"
                            multiple
                            onChange={handlePaymentDocumentChange}
                            className="cursor-pointer"
                          />
                          {paymentDocuments.length > 0 && (
                            <p className="text-xs text-green-600 dark:text-green-400">
                              {paymentDocuments.length} file(s) selected
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Please upload a screenshot or scan of your bank transfer receipt
                          </p>
                        </div>
                      </div>
                    )}
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
                  disabled={isSubmitting}
                  className="w-full py-4 sm:py-5 md:py-6 text-base sm:text-lg font-bold shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Confirm Payment
                    </>
                  )}
                </Button>
              </div>
            </div>
          )
        }

        {/* Step 4: Completion */}
        {
          currentStep === 4 && (
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
          )
        }
      </CardContent >
    </Card >
  );
}
