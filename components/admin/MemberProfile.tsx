"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User as UserIcon,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Building,
  GraduationCap,
  BookOpen,
  MapPin,
  FileText,
  IdCard,
  BadgeCheck,
  ExternalLink,
} from "lucide-react";
import type { User } from "@/types/api";

// A small labeled value that renders a dash when empty
function InfoItem({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon?: any;
  label: string;
  value?: string | null | undefined;
  className?: string;
}) {
  const display = value && value.trim() !== "" ? value : "—";
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
        <p className={`text-sm font-medium wrap-break-word ${className}`}>{display}</p>
      </div>
    </div>
  );
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function docStatusBadge(status?: string) {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/15">Approved</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    case "pending":
      return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/15">Pending</Badge>;
    default:
      return <Badge variant="secondary">Uploaded</Badge>;
  }
}

export function MemberProfile({ user }: { user: User }) {
  const documents = [
    ...(user.documents || []).map((doc) => ({
      title: doc.title || "Document",
      url: doc.fileUrl,
      status: doc.status,
      uploadedAt: doc.uploadedAt,
    })),
    ...(user.documentUrls || []).map((url, index) => ({
      title: `Document ${index + 1}`,
      url: url,
      status: "unknown" as string,
      uploadedAt: undefined,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Header / summary card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Avatar className="h-20 w-20 border-2 border-primary/10">
              <AvatarImage src={user.profilePictureUrl || user.avatar} />
              <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold truncate">{user.name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="secondary" className="capitalize">{user.role || "member"}</Badge>
                {user.membershipType && (
                  <Badge variant={user.membershipType === "lifetime" ? "default" : "secondary"} className="capitalize">
                    {user.membershipType === "general" ? "General" : "Lifetime"} Member
                  </Badge>
                )}
                <Badge
                  className={
                    user.membershipStatus === "active"
                      ? "bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/15 capitalize"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/15 capitalize"
                  }
                >
                  {user.membershipStatus || "inactive"}
                </Badge>
                {user.approvalStatus === "approved" && (
                  <Badge variant="outline" className="gap-1">
                    <BadgeCheck className="h-3 w-3" /> Approved
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3 text-sm text-muted-foreground">
                {user.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {user.email}
                  </span>
                )}
                {user.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {user.phone}
                  </span>
                )}
                {user.memberId && (
                  <span className="inline-flex items-center gap-1.5">
                    <IdCard className="h-3.5 w-3.5" /> <span className="font-mono">{user.memberId}</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  Member since {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserIcon className="h-5 w-5 text-primary" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem icon={Globe} label="Username" value={user.username} />
            <InfoItem icon={Mail} label="Email" value={user.email} />
            <InfoItem icon={Phone} label="Phone" value={user.phone} />
            <InfoItem icon={Briefcase} label="Designation" value={user.designation} />
            <InfoItem icon={Building} label="Affiliation" value={user.affiliation} />
            <InfoItem icon={IdCard} label="BM&DC No." value={user.bmdcNo} />
            <div className="sm:col-span-2">
              <InfoItem label="Bio" value={user.bio} />
            </div>
          </CardContent>
        </Card>

        {/* Membership & Admin */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BadgeCheck className="h-5 w-5 text-primary" /> Membership &amp; Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem label="Membership Type" value={user.membershipType ? (user.membershipType === "general" ? "General" : "Lifetime") : ""} />
            <InfoItem label="Membership Status" value={user.membershipStatus} className="capitalize" />
            <InfoItem label="Approval Status" value={user.approvalStatus} className="capitalize" />
            <InfoItem label="Member ID" value={user.memberId} />
            <InfoItem label="Form No." value={user.formNo} />
            <InfoItem label="Reference No." value={user.refNo} />
            <InfoItem label="Approved On" value={formatDate(user.approvedAt)} />
            <InfoItem label="Email Verified" value={user.isEmailVerified ? "Yes" : "No"} />
          </CardContent>
        </Card>

        {/* Research Interests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" /> Research &amp; Specialization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem label="Specialization" value={user.specialization} />
            <InfoItem label="Primary Research Interest" value={user.primaryResearchInterest} />
            <InfoItem label="Secondary Research Interest" value={user.secondaryResearchInterest} />
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" /> Addresses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mailing Address</p>
              <p className="text-sm whitespace-pre-wrap">{user.mailingAddress || "—"}</p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Permanent Address</p>
              <p className="text-sm whitespace-pre-wrap">{user.permanentAddress || "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Education Qualifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-primary" /> Education Qualifications
          </CardTitle>
          <CardDescription>Academic qualifications of the member</CardDescription>
        </CardHeader>
        <CardContent>
          {user.educationQualifications && user.educationQualifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {user.educationQualifications.map((edu, index) => (
                <div key={index} className="p-4 rounded-md bg-muted/40 border">
                  <p className="font-medium">{edu.qualification || "—"}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {edu.institution || "—"}{edu.year ? ` • ${edu.year}` : ""}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No education details provided.</p>
          )}
        </CardContent>
      </Card>

      {/* Training */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" /> Training
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.training && user.training.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {user.training.map((train, index) => (
                <div key={index} className="p-4 rounded-md bg-muted/40 border">
                  <p className="font-medium">{train.institute || "—"}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{train.period || "—"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No training details provided.</p>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" /> Uploaded Documents
          </CardTitle>
          <CardDescription>Documents submitted by the member</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-md border bg-card"
                >
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground uppercase">
                        {doc.url?.split(".").pop() || "file"}
                      </span>
                      {docStatusBadge(doc.status)}
                    </div>
                  </div>
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md border text-muted-foreground hover:bg-muted"
                      title="Open file"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No documents uploaded.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
