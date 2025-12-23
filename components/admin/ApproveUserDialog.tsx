"use client"

import { useState } from "react"
import { Loader2, UserCheck } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { type PendingUser } from "@/lib/api"

interface ApproveUserDialogProps {
    user: PendingUser | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (memberId: string, adminNotes?: string) => Promise<void>
    loading?: boolean
}

export function ApproveUserDialog({
    user,
    open,
    onOpenChange,
    onConfirm,
    loading = false,
}: ApproveUserDialogProps) {
    const [memberId, setMemberId] = useState("")
    const [adminNotes, setAdminNotes] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate Member ID
        if (!memberId.trim()) {
            setError("Member ID is required")
            return
        }

        setError("")
        await onConfirm(memberId.trim(), adminNotes.trim() || undefined)

        // Reset form
        setMemberId("")
        setAdminNotes("")
    }

    const handleClose = () => {
        if (!loading) {
            setMemberId("")
            setAdminNotes("")
            setError("")
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Approve User</DialogTitle>
                        <DialogDescription>
                            Assign a unique Member ID to approve {user?.name}. This action will grant them access to the platform.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Member ID Input */}
                        <div className="space-y-2">
                            <Label htmlFor="memberId" className="text-sm font-medium">
                                Member ID <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="memberId"
                                placeholder="e.g., BCNS-2024-001"
                                value={memberId}
                                onChange={(e) => {
                                    setMemberId(e.target.value)
                                    setError("")
                                }}
                                disabled={loading}
                                className={error ? "border-destructive" : ""}
                                autoFocus
                            />
                            {error && (
                                <p className="text-sm text-destructive">{error}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Enter a unique identifier for this member. This cannot be changed later.
                            </p>
                        </div>

                        {/* Admin Notes (Optional) */}
                        <div className="space-y-2">
                            <Label htmlFor="adminNotes" className="text-sm font-medium">
                                Admin Notes <span className="text-muted-foreground">(Optional)</span>
                            </Label>
                            <Textarea
                                id="adminNotes"
                                placeholder="Add any internal notes about this approval..."
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                disabled={loading}
                                rows={3}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                Internal notes for record keeping (not visible to the user)
                            </p>
                        </div>

                        {/* User Info Summary */}
                        <div className="rounded-lg border bg-muted/50 p-3 space-y-1">
                            <p className="text-sm font-medium">Approving User:</p>
                            <p className="text-sm text-muted-foreground">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !memberId.trim()}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Approving...
                                </>
                            ) : (
                                <>
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Approve User
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
