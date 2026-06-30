"use client";

import * as React from "react";
import { FileText, Download, Calendar, CheckCircle, Clock, XCircle, ExternalLink, Upload, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { DocumentStatus } from "@/types/api";
import { toast } from "react-toastify";

interface Document {
  _id?: string;
  id?: string;
  title: string;
  fileUrl: string;
  status: DocumentStatus | string;
  uploadedAt?: string;
  createdAt?: string;
}

export default function UserDocumentsPage() {
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [uploadFile, setUploadFile] = React.useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  const fetchDocuments = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = await api.auth.getProfile();
      const userWithDocs = userData as typeof userData & { documents?: unknown[] };
      const userDocs = Array.isArray(userWithDocs.documents) ? userWithDocs.documents : [];

      const formattedDocs: Document[] = userDocs.map((doc: unknown) => {
        const docData = doc as {
          _id?: string;
          id?: string;
          title?: string;
          fileUrl?: string;
          status?: string;
          uploadedAt?: string;
          createdAt?: string;
        };
        const uploadedAt = docData.uploadedAt || docData.createdAt;
        return {
          id: docData._id || docData.id || "",
          title: docData.title || "Untitled Document",
          fileUrl: docData.fileUrl || "",
          status: docData.status || DocumentStatus.PENDING,
          ...(uploadedAt && { uploadedAt }),
        };
      });

      setDocuments(formattedDocs);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      const errorMessage = err instanceof Error
        ? err.message
        : "Failed to load documents. Please try again later.";
      setError(errorMessage);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUpload = async () => {
    if (!uploadFile) return;
    if (uploadFile.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(uploadFile.type)) {
      toast.error("Only PDF, PNG, JPEG files are allowed");
      return;
    }
    try {
      setUploading(true);
      await api.users.uploadDocument(uploadFile, uploadTitle.trim() || undefined);
      toast.success("Document uploaded successfully");
      setUploadFile(null);
      setUploadTitle("");
      const fileInput = document.getElementById("doc-file") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
      await fetchDocuments();
    } catch (error) {
      console.error("Failed to upload document:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="p-6 bg-linear-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">My Documents</h1>
          <p className="text-gray-700">View and manage your uploaded documents.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="p-6 bg-linear-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">My Documents</h1>
          <p className="text-gray-700">View and manage your uploaded documents.</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 bg-linear-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">My Documents</h1>
        <p className="text-gray-700">View and manage your uploaded documents.</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5 text-emerald-600" />
            Upload New Document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doc-title">Document Title (optional)</Label>
              <Input
                id="doc-title"
                placeholder="e.g. BMDC Certificate"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-file">Select File</Label>
              <Input
                id="doc-file"
                type="file"
                accept=".pdf,.png,.jpeg,.jpg"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Accepted: PDF, PNG, JPEG, JPG (max 10MB). Documents start as "pending" and require admin approval.
          </p>
          <Button
            onClick={handleUpload}
            disabled={!uploadFile || uploading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Card
              key={doc.id || doc._id}
              className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="shrink-0 rounded-lg bg-emerald-100 p-3">
                      <FileText className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {doc.title}
                      </CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  {getStatusBadge(doc.status)}
                </div>

                {doc.uploadedAt && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-emerald-600 shrink-0" />
                    <span>Uploaded: {formatDate(doc.uploadedAt)}</span>
                  </div>
                )}

                {doc.fileUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    onClick={() => {
                      window.open(doc.fileUrl, "_blank");
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Documents Found</h3>
            <p className="text-gray-500">
              You haven't uploaded any documents yet. Documents will appear here once uploaded.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
