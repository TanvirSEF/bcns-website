"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BadgeCheck,
  BookOpen,
  Briefcase,
  Camera,
  ExternalLink,
  FileText,
  GraduationCap,
  IdCard,
  Loader2,
  Mail,
  MapPin,
  Plus,
  Save,
  ScrollText,
  ShieldCheck,
  Trash2,
  Upload,
  User as UserIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/api-client";
import type { AdminUserUpdateInput, User, UserDocument } from "@/types/api";

const USERNAME_REGEX = /^[a-z0-9_]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const educationSchema = z.object({
  qualification: z.string().optional().or(z.literal("")),
  year: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^\d{4}$/.test(v), "Year must be 4 digits"),
  institution: z.string().optional().or(z.literal("")),
});

const trainingSchema = z.object({
  period: z.string().optional().or(z.literal("")),
  institute: z.string().optional().or(z.literal("")),
});

const editSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || (v.length >= 3 && USERNAME_REGEX.test(v)),
      "Min 3 chars: lowercase letters, numbers, underscore",
    ),
  email: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || EMAIL_REGEX.test(v), "Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  designation: z.string().optional().or(z.literal("")),
  affiliation: z.string().optional().or(z.literal("")),
  bmdcNo: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  role: z.enum(["admin", "member", "moderator"]),
  membershipType: z.enum(["general", "lifetime"]),
  membershipStatus: z.enum(["active", "inactive"]),
  approvalStatus: z.enum(["pending", "approved"]),
  memberId: z.string().optional().or(z.literal("")),
  formNo: z.string().optional().or(z.literal("")),
  refNo: z.string().optional().or(z.literal("")),
  isEmailVerified: z.boolean(),
  mailingAddress: z.string().optional().or(z.literal("")),
  permanentAddress: z.string().optional().or(z.literal("")),
  specialization: z.string().optional().or(z.literal("")),
  primaryResearchInterest: z.string().optional().or(z.literal("")),
  secondaryResearchInterest: z.string().optional().or(z.literal("")),
  educationQualifications: z.array(educationSchema),
  training: z.array(trainingSchema),
});

type EditFormValues = z.infer<typeof editSchema>;

function buildDefaults(u: User): EditFormValues {
  const role = (u.role as string) || "member";
  const membershipStatus = (u.membershipStatus as string) || "inactive";
  return {
    name: u.name ?? "",
    username: u.username ?? "",
    email: u.email ?? "",
    phone: u.phone ?? "",
    designation: u.designation ?? "",
    affiliation: u.affiliation ?? "",
    bmdcNo: u.bmdcNo ?? "",
    bio: u.bio ?? "",
    role: (["admin", "member", "moderator"].includes(role) ? role : "member") as
      | "admin"
      | "member"
      | "moderator",
    membershipType: (u.membershipType === "lifetime" ? "lifetime" : "general") as
      | "general"
      | "lifetime",
    membershipStatus: (["active", "inactive"].includes(membershipStatus)
      ? membershipStatus
      : "inactive") as "active" | "inactive",
    approvalStatus: (u.approvalStatus === "approved" ? "approved" : "pending") as
      | "pending"
      | "approved",
    memberId: u.memberId ?? "",
    formNo: u.formNo ?? "",
    refNo: u.refNo ?? "",
    isEmailVerified: !!u.isEmailVerified,
    mailingAddress: u.mailingAddress ?? "",
    permanentAddress: u.permanentAddress ?? "",
    specialization: u.specialization ?? "",
    primaryResearchInterest: u.primaryResearchInterest ?? "",
    secondaryResearchInterest: u.secondaryResearchInterest ?? "",
    educationQualifications:
      u.educationQualifications && u.educationQualifications.length > 0
        ? u.educationQualifications.map((e) => ({
            qualification: e.qualification ?? "",
            year: e.year ?? "",
            institution: e.institution ?? "",
          }))
        : [],
    training:
      u.training && u.training.length > 0
        ? u.training.map((t) => ({
            period: t.period ?? "",
            institute: t.institute ?? "",
          }))
        : [],
  };
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0];
  const second = parts[1]?.[0];
  if (!first) return "?";
  return (first + (second ?? "")).toUpperCase();
}

function DocStatusBadge({ status }: { status?: string }) {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/15">Approved</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    case "pending":
      return <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/15">Pending</Badge>;
    default:
      return <Badge variant="secondary">Uploaded</Badge>;
  }
}

/** A labeled, icon-led section card. */
function Section({
  icon: Icon,
  title,
  description,
  children,
  accent = false,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold tracking-tight">{title}</h4>
      </div>
      {description && <p className="text-xs text-muted-foreground -mt-1">{description}</p>}
      <div
        className={`rounded-lg border p-4 ${
          accent ? "border-primary/20 bg-primary/4" : "bg-card"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

/** A consistent labeled field with optional required marker, hint, and error. */
function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function EditMemberDialog({
  user,
  open,
  onOpenChange,
  onSaved,
}: {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (updated: User) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(user.profilePictureUrl || user.avatar || "");
  const [docs, setDocs] = useState<readonly UserDocument[]>(user.documents ?? []);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EditFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editSchema) as any,
    defaultValues: buildDefaults(user),
  });

  // Re-seed the form + local upload state ONLY when the dialog opens. We must
  // NOT re-run on every `user` change, because uploads notify the parent
  // (updating `user`) mid-edit — resetting then would wipe unsaved form fields.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      form.reset(buildDefaults(user));
      setPhotoUrl(user.profilePictureUrl || user.avatar || "");
      setDocs(user.documents ?? []);
      setDocTitle("");
    }
    wasOpenRef.current = open;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({ control: form.control, name: "educationQualifications" });

  const {
    fields: trainFields,
    append: appendTrain,
    remove: removeTrain,
  } = useFieldArray({ control: form.control, name: "training" });

  const errors = form.formState.errors;
  const watchedRole = form.watch("role");
  const watchedStatus = form.watch("membershipStatus");
  const watchedVerified = form.watch("isEmailVerified");

  const onSubmit = async (values: EditFormValues) => {
    setSaving(true);
    try {
      const educationQualifications = values.educationQualifications
        .filter(
          (e) =>
            e.qualification?.trim() || e.institution?.trim() || e.year?.trim(),
        )
        .map((e) => ({
          qualification: e.qualification || "",
          year: e.year || "",
          institution: e.institution || "",
        }));
      const training = values.training
        .filter((t) => t.period?.trim() || t.institute?.trim())
        .map((t) => ({ period: t.period || "", institute: t.institute || "" }));

      const payload: AdminUserUpdateInput = {
        name: values.name,
        phone: values.phone,
        designation: values.designation,
        affiliation: values.affiliation,
        bmdcNo: values.bmdcNo,
        bio: values.bio,
        role: values.role,
        membershipType: values.membershipType,
        membershipStatus: values.membershipStatus,
        approvalStatus: values.approvalStatus,
        memberId: values.memberId,
        formNo: values.formNo,
        refNo: values.refNo,
        isEmailVerified: values.isEmailVerified,
        mailingAddress: values.mailingAddress,
        permanentAddress: values.permanentAddress,
        specialization: values.specialization,
        primaryResearchInterest: values.primaryResearchInterest,
        secondaryResearchInterest: values.secondaryResearchInterest,
        educationQualifications,
        training,
        // Only send email/username when non-empty (backend format validators
        // reject empty strings).
        ...(values.email ? { email: values.email } : {}),
        ...(values.username ? { username: values.username } : {}),
      };

      const updated = await api.admin.updateUser(user.id, payload);
      toast.success("Member updated successfully");
      onSaved(updated);
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.getUserFriendlyMessage()
          : error instanceof Error
            ? error.message
            : "Failed to update member";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const onUploadPhoto = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    setUploadingPhoto(true);
    try {
      const res = await api.admin.uploadProfilePicture(user.id, file);
      setPhotoUrl(res.profilePictureUrl);
      onSaved({ ...user, profilePictureUrl: res.profilePictureUrl });
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.getUserFriendlyMessage()
          : "Failed to upload picture",
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  const onUploadDoc = async (file: File) => {
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type)) {
      toast.error("Only PDF, PNG, or JPG files are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be less than 10MB");
      return;
    }
    setUploadingDoc(true);
    try {
      const doc = await api.admin.uploadDocument(
        user.id,
        file,
        docTitle.trim() || undefined,
      );
      setDocs((prev) => [...prev, doc]);
      setDocTitle("");
      onSaved({ ...user, documents: [...(user.documents ?? []), doc] });
      toast.success("Document uploaded (pending approval)");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.getUserFriendlyMessage()
          : "Failed to upload document",
      );
    } finally {
      setUploadingDoc(false);
    }
  };

  const onRemovePhoto = async () => {
    setRemovingPhoto(true);
    try {
      await api.admin.deleteProfilePicture(user.id);
      setPhotoUrl("");
      onSaved({ ...user, profilePictureUrl: "" });
      toast.success("Profile picture removed");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.getUserFriendlyMessage()
          : "Failed to remove picture",
      );
    } finally {
      setRemovingPhoto(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col gap-0">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Header: who you're editing */}
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-14 w-14 border border-primary/10">
                  {photoUrl ? <AvatarImage src={photoUrl} /> : null}
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onUploadPhoto(f);
                    e.target.value = "";
                  }}
                />
                {uploadingPhoto ? (
                  <div className="absolute inset-0 rounded-full grid place-items-center bg-black/40">
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-primary text-primary-foreground grid place-items-center border-2 border-background shadow-sm hover:bg-primary/90"
                    title="Change photo"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg truncate">{user.name}</DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </span>
                  {user.memberId && (
                    <span className="inline-flex items-center gap-1 font-mono">
                      <IdCard className="h-3 w-3" />
                      {user.memberId}
                    </span>
                  )}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                {photoUrl ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    disabled={removingPhoto}
                    onClick={onRemovePhoto}
                  >
                    {removingPhoto ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-1" />
                    )}
                    Remove
                  </Button>
                ) : null}
                <Badge variant="secondary" className="capitalize hidden sm:inline-flex">
                  {watchedRole}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {/* Body: tabbed sections */}
          <div className="flex-1 overflow-y-auto p-6">
            <Tabs defaultValue="personal">
              <TabsList className="mb-5">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="membership">Membership &amp; Admin</TabsTrigger>
                <TabsTrigger value="edu">Education &amp; Training</TabsTrigger>
                <TabsTrigger value="extra">Addresses &amp; Research</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              {/* ── Personal ── */}
              <TabsContent value="personal" className="space-y-6">
                <Section icon={UserIcon} title="Identity" description="Core identity and login details.">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Full Name" htmlFor="name" required error={errors.name?.message as string}>
                      <Input id="name" {...form.register("name")} />
                    </Field>
                    <Field label="Username" htmlFor="username" hint="a-z, 0-9, _" error={errors.username?.message as string}>
                      <Input id="username" {...form.register("username")} />
                    </Field>
                    <Field label="Email" htmlFor="email" error={errors.email?.message as string}>
                      <Input id="email" type="email" {...form.register("email")} />
                    </Field>
                    <Field label="Phone" htmlFor="phone">
                      <Input id="phone" {...form.register("phone")} />
                    </Field>
                  </div>
                </Section>

                <Section icon={Briefcase} title="Profession" description="Role, workplace, and registration.">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Designation" htmlFor="designation">
                      <Input id="designation" {...form.register("designation")} />
                    </Field>
                    <Field label="Affiliation / Hospital" htmlFor="affiliation">
                      <Input id="affiliation" {...form.register("affiliation")} />
                    </Field>
                    <Field label="BM&DC No." htmlFor="bmdcNo">
                      <Input id="bmdcNo" {...form.register("bmdcNo")} />
                    </Field>
                  </div>
                </Section>

                <Section icon={BookOpen} title="About">
                  <Field label="Bio" htmlFor="bio">
                    <Textarea id="bio" rows={3} {...form.register("bio")} />
                  </Field>
                </Section>
              </TabsContent>

              {/* ── Membership & Admin ── */}
              <TabsContent value="membership" className="space-y-6">
                <Section
                  icon={ShieldCheck}
                  title="Account Controls"
                  description="Admin-only access and membership status."
                  accent
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Role">
                      <Select
                        value={watchedRole}
                        onValueChange={(v) => form.setValue("role", v as "admin" | "member" | "moderator")}
                      >
                        <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Membership Type">
                      <Select
                        value={form.watch("membershipType")}
                        onValueChange={(v) => form.setValue("membershipType", v as "general" | "lifetime")}
                      >
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="lifetime">Lifetime</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Membership Status">
                      <Select
                        value={watchedStatus}
                        onValueChange={(v) => form.setValue("membershipStatus", v as "active" | "inactive")}
                      >
                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Approval Status">
                      <Select
                        value={form.watch("approvalStatus")}
                        onValueChange={(v) => form.setValue("approvalStatus", v as "pending" | "approved")}
                      >
                        <SelectTrigger><SelectValue placeholder="Select approval" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-3 mt-3 border-t">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Email verified</Label>
                      <p className="text-xs text-muted-foreground">
                        Mark whether this member&apos;s email is verified.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          watchedVerified
                            ? "border-green-200 bg-green-500/10 text-green-700"
                            : "border-amber-200 bg-amber-500/10 text-amber-700"
                        }
                      >
                        {watchedVerified ? "Verified" : "Unverified"}
                      </Badge>
                      <Switch
                        checked={watchedVerified}
                        onCheckedChange={(c) => form.setValue("isEmailVerified", c)}
                      />
                    </div>
                  </div>
                </Section>

                <Section icon={BadgeCheck} title="Identifiers" description="Reference numbers assigned to this member.">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Member ID" htmlFor="memberId">
                      <Input id="memberId" {...form.register("memberId")} />
                    </Field>
                    <Field label="Form No." htmlFor="formNo">
                      <Input id="formNo" {...form.register("formNo")} />
                    </Field>
                    <Field label="Reference No." htmlFor="refNo">
                      <Input id="refNo" {...form.register("refNo")} />
                    </Field>
                  </div>
                </Section>
              </TabsContent>

              {/* ── Education & Training ── */}
              <TabsContent value="edu" className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-semibold tracking-tight">Education Qualifications</h4>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendEdu({ qualification: "", year: "", institution: "" })}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  {eduFields.length > 0 ? (
                    <div className="space-y-3">
                      {eduFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-3 rounded-lg border bg-card"
                        >
                          <div className="md:col-span-4">
                            <Field label="Qualification">
                              <Input
                                {...form.register(`educationQualifications.${index}.qualification`)}
                                placeholder="e.g. MBBS"
                              />
                            </Field>
                          </div>
                          <div className="md:col-span-3">
                            <Field label="Year" error={errors.educationQualifications?.[index]?.year?.message as string}>
                              <Input
                                {...form.register(`educationQualifications.${index}.year`)}
                                placeholder="YYYY"
                              />
                            </Field>
                          </div>
                          <div className="md:col-span-4">
                            <Field label="Institution">
                              <Input
                                {...form.register(`educationQualifications.${index}.institution`)}
                                placeholder="Institution"
                              />
                            </Field>
                          </div>
                          <div className="md:col-span-1 flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => removeEdu(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed p-6 text-center">
                      <GraduationCap className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No education entries. Click “Add” to create one.</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-semibold tracking-tight">Training</h4>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendTrain({ period: "", institute: "" })}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  {trainFields.length > 0 ? (
                    <div className="space-y-3">
                      {trainFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-3 rounded-lg border bg-card"
                        >
                          <div className="md:col-span-5">
                            <Field label="Period">
                              <Input {...form.register(`training.${index}.period`)} placeholder="e.g. 2020-2022" />
                            </Field>
                          </div>
                          <div className="md:col-span-6">
                            <Field label="Institute">
                              <Input {...form.register(`training.${index}.institute`)} placeholder="Institute" />
                            </Field>
                          </div>
                          <div className="md:col-span-1 flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => removeTrain(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed p-6 text-center">
                      <BookOpen className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No training entries. Click “Add” to create one.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ── Addresses & Research ── */}
              <TabsContent value="extra" className="space-y-6">
                <Section icon={MapPin} title="Addresses">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Mailing Address" htmlFor="mailingAddress">
                      <Textarea id="mailingAddress" rows={3} {...form.register("mailingAddress")} />
                    </Field>
                    <Field label="Permanent Address" htmlFor="permanentAddress">
                      <Textarea id="permanentAddress" rows={3} {...form.register("permanentAddress")} />
                    </Field>
                  </div>
                </Section>

                <Section icon={BookOpen} title="Research & Specialization">
                  <div className="grid grid-cols-1 gap-4">
                    <Field label="Specialization" htmlFor="specialization">
                      <Input id="specialization" {...form.register("specialization")} />
                    </Field>
                    <Field label="Primary Research Interest" htmlFor="primaryResearchInterest">
                      <Textarea id="primaryResearchInterest" rows={2} {...form.register("primaryResearchInterest")} />
                    </Field>
                    <Field label="Secondary Research Interest" htmlFor="secondaryResearchInterest">
                      <Textarea id="secondaryResearchInterest" rows={2} {...form.register("secondaryResearchInterest")} />
                    </Field>
                  </div>
                </Section>
              </TabsContent>

              {/* ── Documents ── */}
              <TabsContent value="documents" className="space-y-6">
                <Section
                  icon={FileText}
                  title="Uploaded Documents"
                  description="Upload documents on behalf of this member. New uploads start as pending."
                >
                  {docs.length > 0 ? (
                    <div className="space-y-2">
                      {docs.map((d, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-md border bg-card">
                          <div className="h-9 w-9 rounded bg-primary/10 grid place-items-center shrink-0">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{d.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] uppercase text-muted-foreground">
                                {d.fileUrl?.split(".").pop() || "file"}
                              </span>
                              <DocStatusBadge status={d.status} />
                            </div>
                          </div>
                          {d.fileUrl && (
                            <a
                              href={d.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-8 w-8 rounded-md border grid place-items-center text-muted-foreground hover:bg-muted"
                              title="Open file"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed p-6 text-center">
                      <FileText className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No documents yet.</p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
                    <Field label="Document title (optional)">
                      <Input
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        placeholder="e.g. BMDC Certificate"
                      />
                    </Field>
                    <input
                      ref={docInputRef}
                      type="file"
                      accept=".pdf,.png,.jpeg,.jpg"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) onUploadDoc(f);
                        e.target.value = "";
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploadingDoc}
                      onClick={() => docInputRef.current?.click()}
                    >
                      {uploadingDoc ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {uploadingDoc ? "Uploading..." : "Upload Document"}
                    </Button>
                  </div>
                </Section>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <DialogFooter className="p-4 border-t sm:justify-between">
            <p className="text-xs text-muted-foreground hidden md:inline-flex items-center gap-1.5">
              <ScrollText className="h-3.5 w-3.5" />
              Changes are recorded in the activity log
            </p>
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                type="button"
                variant="outline"
                className="flex-1 md:flex-none"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="flex-1 md:flex-none">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
