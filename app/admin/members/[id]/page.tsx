"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, UserX } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import type { User } from "@/types/api";
import { MemberProfile } from "@/components/admin/MemberProfile";

export default function MemberDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [member, setMember] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const all = await api.admin.getAllUsers({ approvalStatus: "approved", limit: 0 });
        const found = all.find((u) => u.id === id) ?? null;
        if (!active) return;
        if (!found) {
          setNotFound(true);
        } else {
          setMember(found);
        }
      } catch (error) {
        console.error("Failed to load member:", error);
        if (active) toast.error("Failed to load member details");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/members">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Members
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-3">
            Member Details
          </h1>
          <p className="text-muted-foreground mt-1">
            Full profile, documents, and membership information.
          </p>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading member details...
          </div>
        </div>
      ) : notFound || !member ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg">
          <UserX className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-1">Member not found</h2>
          <p className="text-sm text-muted-foreground mb-4">
            This member may not exist or is no longer approved.
          </p>
          <Button asChild variant="outline">
            <Link href="/admin/members">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Members
            </Link>
          </Button>
        </div>
      ) : (
        <MemberProfile user={member} />
      )}
    </div>
  );
}
