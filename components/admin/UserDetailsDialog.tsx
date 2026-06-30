"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building,
    GraduationCap,
    BookOpen,
    FileText,
    Globe,
    Briefcase
} from "lucide-react"
import { type PendingUser } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserDetailsDialogProps {
    user: PendingUser | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UserDetailsDialog({
    user,
    open,
    onOpenChange,
}: UserDetailsDialogProps) {
    if (!user) return null

    const parseDate = (dateInfo: any) => {
        if (!dateInfo) return null
        if (typeof dateInfo === 'string') return new Date(dateInfo)
        if (typeof dateInfo === 'object' && dateInfo.$date) return new Date(dateInfo.$date)
        // Handle case where dateInfo might be a Date object already (less likely from API)
        if (dateInfo instanceof Date) return dateInfo
        return null
    }

    const formatDate = (dateInfo?: any) => {
        const date = parseDate(dateInfo)
        if (!date || isNaN(date.getTime())) return "N/A"
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    // Combine documents and documentUrls
    const documents = [
        ...(user.documents || []).map(doc => ({
            title: doc.title || "Document",
            url: doc.fileUrl,
            status: doc.status
        })),
        ...(user.documentUrls || []).map((url, index) => ({
            title: `Document ${index + 1}`,
            url: url,
            status: 'unknown'
        }))
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-0">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/10">
                            <AvatarImage src={user.profilePictureUrl || user.avatar} />
                            <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-2xl font-bold">{user.name}</DialogTitle>
                            <DialogDescription className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="capitalize">
                                    {user.role || "member"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    Registered on {formatDate(user.createdAt)}
                                </span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 p-6 pt-2 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="space-y-8">
                        {/* Basic Information */}
                        <section>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem icon={Mail} label="Email" value={user.email} />
                                <InfoItem icon={Phone} label="Phone" value={user.phone} />
                                <InfoItem icon={Globe} label="Username" value={user.username} />
                                <InfoItem icon={Briefcase} label="Designation" value={user.designation} />
                            </div>
                        </section>

                        <Separator />

                        {/* Professional Details */}
                        <section>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Building className="h-5 w-5 text-primary" />
                                Professional Details
                            </h3>
                            <div className="space-y-4">
                                <InfoItem label="Affiliation" value={user.affiliation} fullWidth />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem label="Membership Type" value={user.membershipType} className="capitalize" />
                                    <InfoItem label="Specialization" value={user.specialization} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem label="Primary Research Interest" value={user.primaryResearchInterest} fullWidth />
                                    <InfoItem label="Secondary Research Interest" value={user.secondaryResearchInterest} fullWidth />
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* Education */}
                        <section>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-primary" />
                                Education Qualifications
                            </h3>
                            {user.educationQualifications && user.educationQualifications.length > 0 ? (
                                <div className="space-y-4">
                                    {user.educationQualifications.map((edu, index) => (
                                        <div key={index} className="p-3 rounded-md bg-muted/50 border">
                                            <p className="font-medium">{edu.qualification}</p>
                                            <p className="text-sm text-muted-foreground">{edu.institution} {edu.year && `• ${edu.year}`}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No education details provided.</p>
                            )}
                        </section>

                        <Separator />

                        {/* Training */}
                        <section>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Training
                            </h3>
                            {user.training && user.training.length > 0 ? (
                                <div className="space-y-4">
                                    {user.training.map((train, index) => (
                                        <div key={index} className="p-3 rounded-md bg-muted/50 border">
                                            <p className="font-medium">{train.institute}</p>
                                            <p className="text-sm text-muted-foreground">{train.period}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No training details provided.</p>
                            )}
                        </section>

                        <Separator />

                        {/* Addresses */}
                        <section>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                Addresses
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Mailing Address</p>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{user.mailingAddress || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Permanent Address</p>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{user.permanentAddress || "N/A"}</p>
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* Documents */}
                        <section className="pb-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Uploaded Documents
                            </h3>
                            {documents.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {documents.map((doc, index) => (
                                        <a
                                            key={index}
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{doc.title}</p>
                                                <p className="text-xs text-muted-foreground uppercase">{doc.url?.split('.').pop() || 'File'} • {doc.status || 'uploaded'}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No additional documents uploaded.</p>
                            )}
                        </section>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function InfoItem({ icon: Icon, label, value, fullWidth = false, className = "" }: {
    icon?: any,
    label: string,
    value?: string | null | undefined,
    fullWidth?: boolean,
    className?: string
}) {
    return (
        <div className={`space-y-1 ${fullWidth ? "col-span-full" : ""}`}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
                <p className={`text-sm font-medium ${className}`}>{value || "N/A"}</p>
            </div>
        </div>
    )
}
